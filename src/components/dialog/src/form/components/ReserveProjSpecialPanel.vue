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
				<el-button @click="handleTempSave">暂存</el-button>
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

<script setup name="ReserveProjSpecialPanel">
import XEUtils from 'xe-utils';
import RkUtils from '@/utils/rk-utils.js';
import { ElMessage, ElLoading } from 'element-plus';
import { RkFormRender } from '@/components/designer';
import { FillingProps } from '../cfg/common-props';
import { getProjectInfo } from '../cfg/common-func';
import { useProjectApi } from '@/api';
import { FILL_FORM_TYPE_CONFIG } from '@/components/designer/cfg/rk-form-conf.js';

const { saveSpecialProject } = useProjectApi();

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
	if (config.buttonCode === FILL_FORM_TYPE_CONFIG.ADD.value) {
		config.proId = '';
		config.applyId = '';
	}
	if (!config.proId) config.proId = RkUtils.getGuid();
	submitParams.value = config;
	echoFormData.value = config;
	loading.value = true;
	openLoading.value = ElLoading.service({ fullscreen: true, text: '加载中......' });
	if (config.buttonCode !== FILL_FORM_TYPE_CONFIG.ADD.value) {
		const projectInfo = await getProjectInfo(config).catch((err) => {
			openLoading.value.close();
			loading.value = false;
		});
		if (projectInfo) {
			echoFormData.value = { ...echoFormData.value, ...projectInfo };
			// 对单位名称赋值
			echoFormData.value['agName'] = projectInfo['AGENCY_NAME'] || config['agName'];
		}
	} else {
		// 基本信息-支出项目类别
		echoFormData.value['PRO_PAY_TYPE'] = '003002';
		// 基本信息-主管部门
		echoFormData.value['DEPTARTMENT_ID'] = config['agParentId'];
		echoFormData.value['DEPT_NAME'] = config['agParentName'];
		// 基本信息-预算单位
		echoFormData.value['AGENCY_CODE'] = config['agCode'];
		echoFormData.value['AGENCY_NAME'] = config['agName'];
		// 前期准备-项目的资产登记管理单位
		echoFormData.value['PROMANAGER_AG_CODE'] = config['agCode'];
		echoFormData.value['ASSET_AGENCY_NAME'] = config['agName'];
	}
};
const handleClose = () => {
	emitClose();
};
const handleTempSave = async () => {
	const { validateField } = rkFormRenderRef.value;
	const proNamevalid = await validateField('PRO_NAME');
	if (!proNamevalid) {
		ElMessage.error('基本信息：请填写项目名称！');
		return;
	}
	const setupYearValid = await validateField('SETUP_YEAR');
	if (!setupYearValid) {
		ElMessage.error('前期准备：请填写立项年度！');
		return;
	}
	if (proNamevalid && setupYearValid) {
		handleSave(1, () => {
			emitSave();
		});
	}
};
const handleConfirm = async () => {
	const { validateFormData } = rkFormRenderRef.value;
	const valid = await validateFormData();
	if (valid) {
		handleSave(2, () => {
			emitConfirm();
		});
	}
};
const handleSave = async (isTemp = 1, callback) => {
	const { getRenderFormData, validateField } = rkFormRenderRef.value;
	getRenderFormData().then((params) => {
		const { dataArray, slotsData } = params;
		const result = {
			isTemp,
			data: dataArray,
			...submitParams.value,
			...slotsData,
		};
		const saveLoading = ElLoading.service({ fullscreen: true, text: '信息正在保存中......' });
		saveSpecialProject(result)
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

loadData(XEUtils.clone(props, true));
</script>

<style lang="scss" scoped></style>
