<!--
 * @Author: lisong
 * @Date: 2023-04-13 16:10:48
 * @LastEditors: ZHM zhuimin111@163.com
 * @LastEditTime: 2023-04-26 09:51:33
 * @Description: 表单添加渲染弹窗
-->
<template>
	<div class="common-proj-filling-wrapper">
		<div class="common-proj-filling-header">
			<div class="header-item left">
				<div class="left-item">
					<div class="left-item-label">单位名称</div>
					<el-input class="left-item-content" disabled :value="echoFormData.agName || '暂无'" />
				</div>
			</div>
			<div class="header-item right">
				<!-- <el-button @click="handleTempSave">暂存</el-button> -->
				<el-button type="primary" @click="handleConfirm">确定</el-button>
				<el-button type="danger" @click="handleClose">取消</el-button>
			</div>
		</div>
		<div class="common-proj-filling-body">
			<div class="filling-body-center">
				<RkFormRender ref="rkFormRenderRef" :="$attrs" v-bind="props" :formData="echoFormData" @loaded="renderBusiFormLoaded" />
			</div>
		</div>
	</div>
</template>

<script setup name="StandbyProjPanel">
import XEUtils from 'xe-utils';
import { RKUtils } from '@/utils';

import { ElMessage, ElLoading } from 'element-plus';
import { FillingProps } from '../cfg/common-props';
import { getProjectInfo } from '../cfg/common-func';
import { FILL_FORM_TYPE_CONFIG, FILL_PROJ_FORM_CONFIG } from '@/components/designer/cfg/rk-form-conf.js';
import { RkFormRender } from '@/components/designer';
import { useProjectApi } from '@/api';
const { saveStandByProject } = useProjectApi();

const emits = defineEmits(['save', 'close', 'loaded', 'confirm']);

const props = defineProps({
	...FillingProps,
});

// 是否加载中
const loading = ref(false);
// 提交的参数-也是传递的参数
const submitParams = ref({});
// 表单回显数据
const echoFormData = ref({});
// 打开加载中
const openLoading = ref({});
// 表单渲染模板引用对象
const rkFormRenderRef = ref();

/**
 * 加载数据
 * @param {Object} config 配置参数
 */
const loadData = async (config) => {
	if (!config.proId) config.proId = RkUtils.getGuid();
	submitParams.value = config;
	echoFormData.value = config;
	loading.value = true;
	openLoading.value = ElLoading.service({ fullscreen: true, text: '加载中......' });
	// 区分formCode
	const formCode = config.buttonCode === FILL_FORM_TYPE_CONFIG.ADD.value ? FILL_PROJ_FORM_CONFIG[config.proType].formCode : config.formCode;
	// 获取项目信息
	const projectInfo = await getProjectInfo({ ...config, formCode }).catch((err) => {
		openLoading.value.close();
		loading.value = false;
	});
	if (projectInfo) {
		echoFormData.value = { ...echoFormData.value, ...projectInfo };
		// 对单位名称赋值
		echoFormData.value['agName'] = projectInfo['AGENCY_NAME'] || config['agName'];
		echoFormData.value['BOND_TYPE_CODE'] = projectInfo['BOND_TYPE_CODE'] || config['bondTypeCode'];
		if (config.buttonCode === FILL_FORM_TYPE_CONFIG.ADD.value) {
			echoFormData.value['SOURCE_APPLY_ID'] = projectInfo['SOURCE_APPLY_ID'] || config['applyId'];
		}
	}
};
const handleClose = () => {
	emitClose();
};
const handleTempSave = () => {
	handleSave(() => {
		emitSave();
	});
};
const handleConfirm = async () => {
	const { validateFormData } = rkFormRenderRef.value;
	const valid = await validateFormData();
	if (valid) {
		handleSave(() => {
			emitConfirm();
		});
	}
};
const handleSave = async (callback) => {
	const { getRenderFormData } = rkFormRenderRef.value;
	getRenderFormData().then((params) => {
		const { dataArray, slotsData } = params;
		const { isBgtAg } = props;
		const result = {
			data: dataArray,
			...submitParams.value,
			...slotsData,
		};
		// 封装数据
		result['AGENCY_ID'] = isBgtAg === '1' ? result.agId : '';
		result['AGENCY_CODE'] = isBgtAg === '1' ? result.agCode : '';
		result['AGENCY_NAME'] = isBgtAg === '1' ? result.agName : '';
		result['NON_AGENCY_ID'] = result.agId;
		result['NON_AGENCY_CODE'] = result.agCode;
		result['NON_AGENCY_NAME'] = result.agName;
		const saveLoading = ElLoading.service({ fullscreen: true, text: '信息正在保存中......' });
		saveStandByProject(result)
			.then((res) => {
				const { code, data, msg } = res;
				if (code === 200) {
					callback();
					ElMessage.success('保存成功！');
				} else {
					ElMessage.error(msg);
				}
			})
			.finally(() => {
				saveLoading.close();
			});
	});
};

// ----- 表单渲染相关内容
const renderBusiFormLoaded = () => {
	openLoading.value.close();
	loading.value = false;
	emitLoaded();
};

// ----- emits相关调用
const emitSave = () => {
	emits('save');
};
const emitClose = () => {
	emits('close');
};
const emitLoaded = () => {
	emits('loaded');
};
const emitConfirm = () => {
	emits('confirm');
};

onBeforeMount(async () => {
	await loadData(XEUtils.clone(props, true));
});
</script>

<style lang="scss" scoped></style>
