<template>
	<div class="rk-menu-tree-wrapper">
		<div class="rk-menu-tree-item">
			<div class="tree-item-search">
				<div class="item-search-title" v-show="showTitle">
					<span>菜单树</span>
				</div>
				<div class="item-search-content">
					<el-input v-model="filterText" :placeholder="placeholder" :prefix-icon="Search" clearable />
				</div>
			</div>
			<div class="tree-item-content" v-loading="loading">
				<div class="tree-item-content-center">
					<el-tree
						ref="roleTreeRef"
						highlight-current
						:data="sTreeData"
						:props="defaultProps"
						:node-key="defaultProps.value"
						:filter-node-method="filterMethod"
						:default-expand-all="false"
						:default-expanded-keys="defaultExpandedKeys"
						@node-click="handleNodeClick"
						@current-change="handleNodeChange"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import XEUtils from 'xe-utils';
import { Search } from '@element-plus/icons-vue';
import { roleTreeDefaultProps } from '@/components/tree/cfg/tree-config.js';

import { useRoleApi } from '@/api/role';

const { getRoleInfo } = useRoleApi();

const props = defineProps({
	showCode: { type: Boolean, default: true },
	showTitle: { type: Boolean, default: false },
	treeProps: {
		type: Object,
		default: () => {
			return roleTreeDefaultProps;
		},
	},
	placeholder: { type: String, default: '请输入关键词' },
});

const emits = defineEmits(['nodeClick', 'currentChange']);

const loading = ref(false);
const sTreeData = ref([]);
const filterText = ref('');
const roleTreeRef = ref();
const defaultProps = ref({});
const defaultExpandedKeys = [];
watch(filterText, (val) => {
	roleTreeRef.value.filter(val);
});
const filterMethod = (value, data) => {
	if (!value) return true;
	return data.roleId.includes(value) || data.roleName.includes(value);
};
const loadTreeData = async () => {
	initTreeProps();
	const treeData = await getTreeData();
	initTreeData(treeData);
};
const initTreeData = (treeData) => {
	sTreeData.value = treeData;
};
const initTreeProps = () => {
	const { treeProps } = props;
	let resultProps = XEUtils.clone(treeProps, true);
	if (props.showCode) {
		resultProps.label = (data, node) => {
			return `${data.roleCode || data.roleId} ${data.roleName}`;
		};
	} else {
		resultProps.label = 'roleName';
	}
	defaultProps.value = resultProps;
};
const getTreeData = () => {
	loading.value = true;
	return new Promise((reslove) => {
		getRoleInfo({ adCode: '' })
			.then((res) => {
				const { code, msg, data } = res;
				if (code === 200) {
					reslove(data);
				} else {
					reslove([]);
				}
			})
			.catch((err) => {
				reslove([]);
			})
			.finally(() => {
				loading.value = false;
			});
	});
};
const handleNodeClick = (data, treeNode, treeVNode, event) => {
	emitNodeClick(toRaw(data), treeNode);
};
const handleNodeChange = (data, treeNode) => {
	emitNodeChange(toRaw(data), treeNode);
};

// ----- emits 方法的定义
const emitNodeClick = (data, treeNode) => {
	emits('nodeClick', data, treeNode);
};
const emitNodeChange = (data, treeNode) => {
	emits('currentChange', data, treeNode);
};

// ----- 执行方法
loadTreeData();
</script>

<style lang="scss" scoped>
.rk-menu-tree-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	// border: 1px solid red;
}
.rk-menu-tree-item {
	flex: 1;
	display: flex;
	width: 100%;
	flex-direction: column;
	.tree-item-search {
		height: 50px;
		display: flex;
		padding: 0 15px;
		align-items: center;
		background-color: #dce4fb;
		.item-search-title {
			font-size: 16px;
			text-align: left;
			color: #525151;
			padding-right: 8%;
		}
		.item-search-content {
			flex: 1;
			// padding-left: 8%;
		}
	}
	.tree-item-content {
		flex: 1;
		width: 100%;
		overflow: auto;
		display: flex;
		.tree-item-content-center {
			position: relative;
			height: 0;
			flex-grow: 2;
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
		}
	}
}
</style>
