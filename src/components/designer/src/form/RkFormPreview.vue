<!--
 * @Author: lisong
 * @Date: 2023-04-13 16:10:48
 * @LastEditors: lisong
 * @LastEditTime: 2023-04-13 19:02:32
 * @Description: 表单设计预览抽屉
-->
<template>
	<el-drawer
		v-if="visible"
		v-model="visible"
		class="rk-form-drawer rk-form-preview-drawer"
		size="100%"
		append-to-body
		:show-close="false"
		:with-header="false"
	>
		<div class="rk-form-drawer-container">
			<div class="form-design-drawer-header" flex>
				<div class="design-drawer-header-title">
					<span class="title-info" :title="echoFormData.baseForm.name">{{ echoFormData.baseForm.name }}</span>
				</div>
				<div class="design-drawer-header-steps" flex-col></div>
				<div class="design-drawer-header-tools" flex-col>
					<el-button type="danger" @click="handleClose">关闭</el-button>
				</div>
			</div>
			<div class="form-design-drawer-body">
				<FormRenderPanel ref="rkFormRenderRef" v-bind="formOptions" @loaded="renderBusiFormLoaded" />
			</div>
		</div>
	</el-drawer>
</template>

<script setup name="RkFormPreview">
import { ref, reactive, defineAsyncComponent } from 'vue';
import { ElLoading } from 'element-plus';

const FormRenderPanel = defineAsyncComponent(() => import('@/components/designer/src/form/components/FormRenderPanel.vue'));

const props = defineProps({});
const visible = ref(false);
// 表单配置信息
const formOptions = reactive({
	// 预览状态
	preview: false,
	// 附件类型
	busiType: 'ET001',
	// 表单Id
	formId: '',
	// 表单编码
	formCode: '',
	// 表单类型
	formType: 'view',
	// 表单数据
	formData: {
		proId: 'preview',
	},
});
const openLoading = ref();
// ----- Drawer相关操作
function handleOpen(config) {
	visible.value = true;
	openLoading.value = ElLoading.service({
		fullscreen: true,
		customClass: 'form-preview-loading',
		target: '.rk-form-preview-drawer',
		text: '加载中......',
	});
	formOptions.formId = config.formId;
	formOptions.formCode = config.code;
}
function handleClose() {
	handleReset();
}
function handleReset() {
	visible.value = false;
	clearPrdFormInfo();
}

// 表单回显数据
const echoFormData = reactive({
	baseForm: {},
});

// ----- 表单设计器相关操作
const renderBusiFormLoaded = (formInfo) => {
	echoFormData.baseForm['name'] = formInfo.name;
	openLoading.value.close();
};
const clearPrdFormInfo = () => {
	echoFormData.baseForm = {};
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
	display: flex;
	flex-direction: column;
}
.form-design-drawer-header {
	display: flex;
	width: 100%;
	height: 52px;
	line-height: 52px;
	border-bottom: 1px solid #e8e8e8;
	background-color: #fff;
	.design-drawer-header-title {
		flex-direction: column;
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
		// width: 330px;
		padding-right: 20px;
	}
}
.form-design-drawer-body {
	height: calc(100% - 52px);
	padding: 8px;
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
.form-preview-loading {
	z-index: 9999 !important;
}
</style>
