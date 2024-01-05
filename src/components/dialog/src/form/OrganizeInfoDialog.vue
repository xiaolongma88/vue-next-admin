<!--
 * @Author: ljc
 * @Date: 2023-06-01 17:40:02
 * @LastEditors: g05047
 * @LastEditTime: 2023-06-15 15:37:44
 * @Description: 专家,律师事务,会计事务弹框
-->
<template>
	<vxe-modal
		v-if="visible"
		class-name="rk-modal rk-busi-modal"
		:title="title"
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
import XEUtils from 'xe-utils';
import OrgainzationInforPanel from './panels/OrgainzationInforPanel.vue';
import { FILL_FORM_TYPE_CONFIG } from '@/components/designer/cfg/rk-form-conf.js';
import { ref, defineAsyncComponent } from 'vue';

const TYPE_CONS = {
	organization: {
		title: '机构信息修改',
		component: OrgainzationInforPanel,
	},
	finRepo: {
		title: '会计事务所信息修改',
		component: OrgainzationInforPanel,
	},
	legalOpinion: {
		title: '律师事务所信息修改',
		component: OrgainzationInforPanel,
	},
};

const emits = defineEmits(['refresh']);

const props = defineProps({
	formCode: { type: String, required: true },
	// 弹窗类型
	type: { type: String, default: 'organization' },
	// 弹窗标题
	title: { type: String, default: '机构信息修改' },
});

// ----- 弹窗相关操作
// 传递数据
let params = ref({});
// 是否展示弹窗
const visible = ref(false);
// 是否加载中
const loading = ref(false);

/**
 * 打开填报弹窗
 */
const handleAdd = (config = {}) => {
	let { organizationType } = config;
	if (XEUtils.isEmpty(config) && !XEUtils.isObject(config)) {
		console.warn('config参数只能不能为空，且需为对象类型！');
		return;
	}
	// 设置模式为添加模式
	config['buttonCode'] = FILL_FORM_TYPE_CONFIG.ADD.value;
	config['organizationType'] = organizationType;
	handleOpen(config);
};
/**
 * 打开修改弹窗
 * @param {Object} config 参数配置
 */
const handleEdit = (config = {}) => {
	let { agencyId, organizationType } = config;
	if (XEUtils.isEmpty(config) && !XEUtils.isObject(config)) {
		console.error('config参数只能不能为空，且需为对象类型！');
		return;
	}
	// 设置模式为添加模式
	config['buttonCode'] = FILL_FORM_TYPE_CONFIG.EDIT.value;
	config['organizationType'] = organizationType;
	config['agencyId'] = agencyId;
	config = {
		...config,
		agencyId,
	};
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
