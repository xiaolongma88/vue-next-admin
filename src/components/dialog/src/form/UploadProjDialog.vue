<!--
 * @Author: lisong
 * @Date: 2023-04-13 16:10:48
 * @LastEditors: g05047
 * @LastEditTime: 2023-05-25 20:13:50
 * @Description: 表单添加渲染弹窗
-->
<template>
	<vxe-modal
		class-name="rk-modal rk-busi-modal"
		resize
		transfer
		show-zoom
		fullscreen
		destroyOnClose
		v-model="visible"
		width="1000"
		height="600"
		:z-index="1002"
		min-width="460"
		min-height="320"
		@close="handleClose"
	>
		<template #title>
			{{ UPLOAD_TYPE_CONS[type].title || title }}
		</template>
		<template #default>
			<UploadProjPanel :="$attrs" v-bind="params"> </UploadProjPanel>
		</template>
	</vxe-modal>
</template>

<script setup name="UploadProjDialog">
import { defineAsyncComponent } from 'vue';
import XEUtils from 'xe-utils';
import { FILL_FORM_TYPE_CONFIG } from '@/components/designer/cfg/rk-form-conf.js';

const UploadProjPanel = defineAsyncComponent(() => import('./components/UploadProjPanel.vue'));

const UPLOAD_TYPE_CONS = {
	finance: {
		title: '财评报告上传',
		formConfig: {
			formType: FILL_FORM_TYPE_CONFIG.FINANCE.value,
			// formCode: FILL_PROJ_FORM_CONFIG.FD.formCode
		},
	},
	atty: {
		title: '法律意见书上传',
		formConfig: {
			formType: FILL_FORM_TYPE_CONFIG.ATTY.value,
			// formCode: FILL_PROJ_FORM_CONFIG.AT.formCode
		},
	},
};

const emits = defineEmits(['refresh']);

const props = defineProps({
	// 弹窗类型
	type: { type: String, default: 'finance' },
	// 弹窗标题
	title: { type: String, default: '财评报告上传' },
	// 表单编码
	formCode: {
		type: String,
		required: false,
		validator(value) {
			return value ? true : false;
		},
	},
	// 是否预算单位: 1 是 2 否
	isBgtAg: { type: String, default: '1' },
	// 项目来源 1：基础库 2：储备库 3:需求库 4：历史项目 5、一体化同步项目 6、存量债务无项目生成项目
	proSource: { type: String, default: '2' },
	// 流程标识
	processKey: { type: String, default: '' },
});

// ----- 弹窗相关操作
// 传递数据
const params = ref(props);
// 是否展示弹窗
const visible = ref(false);
// 是否加载中
const loading = ref(false);

const handleOpen = (config = {}) => {
	if (XEUtils.isEmpty(config) && !XEUtils.isObject(config)) {
		console.error('config参数只能不能为空，且需为对象类型！');
		return;
	}
	const formConfig = UPLOAD_TYPE_CONS[props.type].formConfig;
	params.value = { ...params.value, ...config, ...formConfig };
	visible.value = true;
};

/** 关闭弹窗 */
const handleClose = () => {
	visible.value = false;
	loading.value = false;
};
/** 重置数据 */
const handleReset = () => {
	visible.value = false;
	loading.value = false;
};
/** 确定事件 */
const handleConfirm = () => {
	emitRefresh();
	handleReset();
};
// ----- emits相关调用
const emitRefresh = () => {
	emits('refresh');
};

// 对外暴露方法
defineExpose({
	handleOpen,
});
</script>

<style lang="scss">
@use '@/styles/mixins/function.scss' as *;

@include b('busi-modal') {
	&-skeleton {
		padding: 15px;
	}
	.vxe-modal--box,
	.vxe-modal--header {
		border-radius: unset;
	}
	&.type--modal {
		.vxe-modal--body {
			// overflow: unset;
			.vxe-modal--content {
				// overflow: unset;
				padding: 0;
			}
		}
	}
}
</style>
