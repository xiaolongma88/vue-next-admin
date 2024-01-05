/** * 会所律所项目一户式预览页面 @author LiSong */
<template>
	<div class="project-upload-wrapper" v-show="!loading">
		<div class="project-upload-header">
			<div class="header-item">
				<span>项目名称：{{ echoFormData.PRO_NAME }}</span>
			</div>
			<div class="header-item">
				<span>单位名称：{{ echoFormData.AGENCY_NAME }}</span>
			</div>
			<div class="header-item">
				<span>单位：万元</span>
			</div>
		</div>
		<div class="project-upload-body">
			<div class="yhs-body-center">
				<RkFormRender
					ref="rkFormRenderRef"
					busiType="ET001"
					:="$attrs"
					v-bind="props"
					:preview="true"
					:formData="echoFormData"
					@loaded="renderBusiFormLoaded"
				/>
			</div>
		</div>
	</div>
</template>

<script setup name="UploadProjPanel">
import { ElLoading } from 'element-plus';
import { UploadeProps } from '../cfg/common-props';
import { getProjectInfo } from '../cfg/common-func';
import { RkFormRender } from '@/components/designer';

const props = defineProps({
	...UploadeProps,
});

// ----- 加载表单数据信息
// 加载中
const loading = ref(false);
// 加载中遮罩
const openLoading = ref();
// 回显数据
const echoFormData = ref({});
/**
 * 加载表单信息
 * @param {Object} config 参数配置
 */
const loadData = async (config) => {
	if (!validateConfig(config)) return;
	echoFormData.value = config;
	loading.value = true;
	openLoading.value = ElLoading.service({ fullscreen: true, text: '加载中......' });
	const projectInfo = await getProjectInfo(config).catch((err) => {
		openLoading.value.close();
		loading.value = false;
	});
	if (projectInfo) {
		echoFormData.value = { ...echoFormData.value, ...projectInfo };
		// 对单位名称赋值
		echoFormData.value['agName'] = projectInfo['AGENCY_NAME'];
	}
};
/**
 * 校验参数配置
 * @param {Object} config 参数配置
 */
const validateConfig = (config) => {
	if (typeof config === 'object' || config instanceof Object) {
		if (config.hasOwnProperty('proId')) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

/**
 * 表单渲染结束
 */
const renderBusiFormLoaded = () => {
	openLoading.value.close();
	loading.value = false;
};

// 执行加载数据方法
loadData(props);
</script>

<style lang="scss" scoped>
.project-upload-wrapper {
	height: 100%;
	width: 100%;
}
.project-upload-header {
	display: flex;
	height: 35px;
	.header-item {
		display: flex;
		flex: 1;
		height: 100%;
		text-align: center;
		justify-content: center;
		align-items: center;
		font-size: 16px;
	}
}
.project-upload-body {
	height: calc(100% - 35px);
	flex: 1;
	display: flex;
	flex-direction: column;
	.yhs-body-center {
		height: 100%;
	}
}
</style>
