<!--
 * @Author: lisong
 * @Date: 2023-04-13 16:10:48
 * @LastEditors: lisong
 * @LastEditTime: 2023-04-13 19:02:32
 * @Description: 表单设计器抽屉
-->
<template>
	<el-drawer v-if="visible" v-model="visible" class="rk-form-drawer" size="100%" append-to-body :show-close="false" :with-header="false">
		<div class="rk-form-drawer-container">
			<div class="form-design-drawer-header" flex>
				<div class="design-drawer-header-title">
					<span class="title-info" :title="echoFormData.baseForm.name">{{ echoFormData.baseForm.name }}</span>
				</div>
				<div class="design-drawer-header-steps" flex-col>
					<el-steps :active="stepActive" finish-status="success" simple>
						<el-step title="基本配置" />
						<el-step title="表单设计" />
						<el-step title="表单预览" />
					</el-steps>
				</div>
				<div class="design-drawer-header-tools" flex-col>
					<el-button @click="prevStep" :disabled="stepActive <= 0">上一步</el-button>
					<el-button @click="nextStep" :disabled="stepActive >= 2">下一步</el-button>
					<el-button @click="saveData" :disabled="saveDisable" type="primary">保存</el-button>
					<el-button type="danger" @click="handleClose">关闭</el-button>
				</div>
			</div>
			<div class="form-design-drawer-body">
				<FormBasePanel v-if="stepActive === 0" ref="rkFormBaseRef" :formData="echoFormData.baseForm"> </FormBasePanel>
				<FormDesignPanel v-if="stepActive === 1" ref="rkFormDesignerRef" :formJson="echoFormData.formJson"> </FormDesignPanel>
				<FormRenderPanel v-if="stepActive === 2" ref="rkFormRenderRef" :form-json="echoFormData.formJson" :slot-json="echoFormData.slotJson" />
			</div>
		</div>
	</el-drawer>
</template>

<script setup name="RkFormDesign">
import XEUtils from 'xe-utils';

import FormUtils from '@/components/designer/cfg/rk-form-utils.js';
import FormBasePanel from './components/FormBasePanel.vue';
import FormDesignPanel from './components/FormDesignPanel.vue';
import FormRenderPanel from './components/FormRenderPanel.vue';

import { RkConfirmBox } from '@/components/message-box';
import { ElMessage, ElLoading } from 'element-plus';
import { useFormDesignerApi } from '@/api';
import { FormBaseConfigPojo } from '@/components/designer/cfg/rk-form-pojo.js';

const { addPrdFormInfo, getPrdFormInfoByFormId } = useFormDesignerApi();

const emit = defineEmits(['save']);

const props = defineProps({});
const visible = ref(false);
// ----- Drawer相关操作
function handleOpen(value) {
	visible.value = true;
	stepActive.value = 0;
	let params = { formId: '' };
	if (value) {
		if (value instanceof String) {
			params.formId = value;
		} else {
			params = { ...params, ...value };
		}
	}
	FormUtils.clearVFormDesigerCache();
	loadFormData(params);
}
function handleClose() {
	RkConfirmBox({
		title: '提示',
		content: '关闭后所有未保存的数据将会清空，请谨慎操作！',
		onSubmit: function () {
			handleReset();
		},
		onCancel: function () {},
	});
}
function handleReset() {
	visible.value = false;
	stepActive.value = 0;
	saveDisable.value = true;
	FormUtils.clearVFormDesigerCache();
}

// ----- 步进相关操作
const stepActive = ref(0);
const saveDisable = ref(true);
const echoFormData = reactive({
	baseForm: {},
	formJson: {},
	slotJson: {},
	formFileds: [],
});

const rkFormBaseRef = ref();
const rkFormDesignerRef = ref();
function prevStep() {
	if (stepActive.value-- < 0) stepActive.value = 0;
	saveDisable.value = !(stepActive.value >= 1);
}
async function nextStep() {
	let nextValid = false;
	switch (stepActive.value) {
		case 0:
			const baseForm = await rkFormBaseRef.value.getFormData();
			if (baseForm) {
				echoFormData.baseForm = baseForm;
				nextValid = true;
			}
			break;
		case 1:
			const designerForm = rkFormDesignerRef.value.getFormData();
			if (designerForm) {
				echoFormData.formJson = designerForm.formJson;
				echoFormData.slotJson = designerForm.slotJson;
				echoFormData.formFileds = designerForm.formFileds;
				nextValid = true;
			}
			break;
		case 2:
			break;
		default:
			break;
	}
	if (!nextValid) return;
	if (stepActive.value++ > 2) stepActive.value = 0;
	saveDisable.value = !(stepActive.value >= 1);
}
function saveData() {
	const loading = ElLoading.service({ fullscreen: true, text: '信息正在保存中......' });
	if (stepActive.value === 1) {
		const designerForm = rkFormDesignerRef.value.getFormData();
		if (designerForm) {
			echoFormData.formJson = designerForm.formJson;
			echoFormData.slotJson = designerForm.slotJson;
			echoFormData.formFileds = designerForm.formFileds;
		}
	}
	let prdFormContent = {
		slotJson: JSON.stringify(echoFormData.slotJson),
		submitURL: '',
		structureJson: JSON.stringify(echoFormData.formJson),
		validateContent: echoFormData.baseForm.validateContent,
	};
	let prdFormFieldBo = toRaw(echoFormData.formFileds);
	let submitData = {
		...echoFormData.baseForm,
		prdFormContent,
		prdFormFieldBo,
	};
	addPrdFormInfo(submitData)
		.then((res) => {
			const { code, data, msg } = res;
			if (code == 200) {
				if (stepActive.value !== 1) {
					handleReset();
				}
				ElMessage.success('保存成功！');
				emit('save', submitData);
			} else {
				ElMessage.error(msg);
			}
		})
		.catch((error) => {
			console.error(error);
		})
		.finally(() => {
			loading.close();
		});
}

// ----- 表单设计器相关操作
const loadFormData = async ({ formId }) => {
	if (formId) {
		const fromData = await getPrdFormInfo(formId);
		setPrdFormInfo(fromData);
	} else {
		clearPrdFormInfo();
	}
};
const getPrdFormInfo = (formId) => {
	return new Promise((resolve) => {
		getPrdFormInfoByFormId(formId)
			.then((res) => {
				const { code, data, msg } = res;
				if (code === 200) {
					resolve(data);
				} else {
					console.error(msg);
					resolve({});
				}
			})
			.catch((error) => {
				console.error(error);
				resolve({});
			});
	});
};
const setPrdFormInfo = (formData) => {
	XEUtils.objectEach(FormBaseConfigPojo, (item, key) => {
		echoFormData.baseForm[key] = formData[key] || formData.prdFormContent[key] || item;
	});
	echoFormData.formJson = JSON.parse(formData.prdFormContent.structureJson);
};
const clearPrdFormInfo = () => {
	echoFormData.baseForm = {};
	echoFormData.formJson = {};
	echoFormData.slotJson = {};
	echoFormData.formFileds = [];
};

// 对外暴露方法
defineExpose({
	handleOpen,
});
</script>

<style lang="scss" scoped>
.rk-form-drawer-container {
	height: 100%;
	background-color: #f0f2f5;
}
.form-design-drawer-header {
	display: flex;
	width: 100%;
	height: 52px;
	line-height: 52px;
	border-bottom: 1px solid #e8e8e8;
	background-color: #fff;
	.design-drawer-header-title {
		width: 300px;
		padding-left: 20px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		.title-info {
			font-size: 16px;
		}
	}
	.design-drawer-header-steps {
		flex-direction: column;
		flex: 1;
		line-height: 1;
		padding: 15px 120px 15px 30px;
		.el-steps {
			padding: 0;
			background-color: #fff;
		}
	}
	.design-drawer-header-tools {
		flex-direction: column;
		width: 330px;
		padding-right: 20px;
	}
}
.form-design-drawer-body {
	height: calc(100vh - 52px);
	// padding: 10px;
	background-color: #fff;
	.main-container {
		padding: 0 !important;
		margin-left: 0 !important;
	}
}
</style>

<style lang="scss">
.rk-form-drawer {
	.el-drawer__body {
		padding: 0;
	}
	.el-step__title.is-process {
		font-weight: 500;
	}
}
</style>
