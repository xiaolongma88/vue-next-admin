<!--
 * @Author: lisong
 * @Date: 2023-04-13 16:10:48
 * @LastEditors: ZHM zhuimin111@163.com
 * @LastEditTime: 2023-04-26 09:51:33
 * @Description: 表单添加渲染弹窗
-->
<template>
	<vxe-modal
		v-if="visible"
		class-name="rk-modal rk-busi-modal"
		:title="TYPE_CONS[type].title"
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
		<!-- <template #title>
      {{ TYPE_CONS[type].title || title }}
    </template> -->
		<template #default>
			<template v-if="TYPE_CONS[type]">
				<component
					:is="TYPE_CONS[type].component"
					:="$attrs"
					v-bind="params"
					@save="handleConfirm"
					@close="handleClose"
					@confirm="handleConfirm"
				></component>
			</template>
		</template>
	</vxe-modal>
</template>

<script setup name="ReserveProjDialog">
import { defineAsyncComponent } from 'vue';

import XEUtils from 'xe-utils';
import { FILL_FORM_TYPE_CONFIG } from '@/components/designer/cfg/rk-form-conf.js';

const StandbyProjPanel = defineAsyncComponent(() => import('./components/StandbyProjPanel.vue'));
const ReserveProjSpecialPanel = defineAsyncComponent(() => import('./components/ReserveProjSpecialPanel.vue'));
const ReserveProjGenericPanel = defineAsyncComponent(() => import('./components/ReserveProjGenericPanel.vue'));

const TYPE_CONS = {
	generic: {
		title: '一般债券储备申报',
		component: ReserveProjGenericPanel,
	},
	special: {
		title: '专项债券储备申报',
		component: ReserveProjSpecialPanel,
	},
	standby: {
		title: '备选项目申报',
		component: StandbyProjPanel,
	},
};

const emits = defineEmits(['refresh']);

const props = defineProps({
	// 弹窗类型
	type: { type: String, default: 'generic' },
	// 弹窗标题
	title: { type: String },
	// 表单编码
	formCode: {
		type: String,
		required: true,
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

/**
 * 打开填报弹窗
 */
const handleAdd = (config = {}) => {
	if (XEUtils.isEmpty(config) && !XEUtils.isObject(config)) {
		console.warn('config参数只能不能为空，且需为对象类型！');
		return;
	}
	// 设置模式为添加模式
	config['buttonCode'] = FILL_FORM_TYPE_CONFIG.ADD.value;
	config['formType'] = props.type === 'standby' ? FILL_FORM_TYPE_CONFIG.STANDBY.value : FILL_FORM_TYPE_CONFIG.ADD.value;
	handleOpen(config);
};
/**
 * 打开修改弹窗
 * @param {Object} config 参数配置
 */
const handleEdit = (config = {}) => {
	if (XEUtils.isEmpty(config) && !XEUtils.isObject(config)) {
		console.error('config参数只能不能为空，且需为对象类型！');
		return;
	}
	// 设置模式为添加模式
	config['buttonCode'] = FILL_FORM_TYPE_CONFIG.EDIT.value;
	config['formType'] = props.type === 'standby' ? FILL_FORM_TYPE_CONFIG.STANDBY.value : FILL_FORM_TYPE_CONFIG.EDIT.value;
	// 打开弹窗
	handleOpen(config);
};

/**
 * 打开弹窗
 * @param {Object} config 配置信息
 */
const handleOpen = async (config) => {
	params.value = { ...props, ...config };
	visible.value = true;
};
/** 关闭弹窗 */
const handleClose = () => {
	handleReset();
};
/** 重置数据 */
const handleReset = () => {
	visible.value = false;
	loading.value = false;
	params.value = {};
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
	handleAdd,
	handleEdit,
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

.common-proj-filling-wrapper {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.common-proj-filling-header {
	display: flex;
	height: 60px;
	.header-item {
		flex: 1;
		display: flex;
		height: 100%;
		align-items: center;
		box-sizing: border-box;
		padding: 0 15px;
		&.left {
			justify-content: left;
			.left-item {
				display: flex;
				align-items: center;
				width: 50%;
				.left-item-label {
					width: 80px;
				}
				.left-item-content {
					flex: 1;
				}
			}
		}
		&.right {
			justify-content: right;
		}
	}
}
.common-proj-filling-body {
	height: calc(100% - 60px);
	flex: 1;
	display: flex;
	flex-direction: column;
	.filling-body-center {
		height: 100%;
	}
}
</style>
