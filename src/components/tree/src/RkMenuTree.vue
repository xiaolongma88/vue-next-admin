<template>
	<div class="rk-menu-tree-wrapper">
		<div class="rk-menu-tree-item">
			<div class="tree-item-search">
				<div class="item-search-title" v-show="showTitle">
					<span>菜单树</span>
				</div>
				<div class="item-search-content">
					<el-input v-model="filterText" :placeholder="placeholder" :prefix-icon="Search" clearable :style="{ width: showSave ? '280px' : '100%' }" />
				</div>
				<div class="item-save-btn" v-if="showSave">
					<el-button type="primary" @click="handleSave">保存</el-button>
				</div>
			</div>
			<div class="tree-item-content" v-loading="loading">
				<div class="tree-item-content-center">
					<el-tree
						id="menuTreeId"
						ref="menuTreeRef"
						highlight-current
						:data="sTreeData"
						:props="defaultProps"
						:node-key="defaultProps.value"
						:show-checkbox="showSave"
						:current-node-key="currentNodeKey"
						:default-expand-all="false"
						:filter-node-method="filterMethod"
						:expand-on-click-node="false"
						:default-expanded-keys="defaultExpandedKeys"
						@check="handleCheck"
						@node-expand="handleExpand"
						@node-collapse="handleCollapse"
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

import TreeUtils from '@/components/tree/cfg/tree-utils.js';
import { menuTreeDefaultProps, menuRootNode } from '@/components/tree/cfg/tree-config.js';

import { useRoleApi } from '@/api/role';
import { useTreeApi } from '@/api/tree';

// ----- 组件中调用的API ----- //
const { getMenuTree } = useTreeApi();
const { getRoleRelMenu } = useRoleApi();
// ----- 组件中调用的API ----- //

const props = defineProps({
	showSave: { type: Boolean, default: false },
	showCode: { type: Boolean, default: true },
	roleCode: { type: String },
	showTitle: { type: Boolean, default: false },
	treeProps: {
		type: Object,
		default: () => {
			return menuTreeDefaultProps;
		},
	},
	placeholder: { type: String, default: '请输入关键词' },
	// 是否显示顶部节点
	showRootNode: { type: Boolean, default: true },
	// 顶部节点内容描述
	rootNodeText: { type: String, default: '全部' },
	// 树结构展开的层级
	expandedLevel: { type: Number, default: 1 },
});

const emits = defineEmits(['nodeClick', 'currentChange', 'save']);

const loading = ref(false);
// 树结构数据
const sTreeData = ref([]);
// 请求获取的树结构树
const rTreeData = ref([]);
// 筛选内容
const filterText = ref('');
// 树机构的模板引用对象
const menuTreeRef = ref();
// 默认的props
const defaultProps = ref({});
// 树节点信息
const treeNodeMap = ref({});
// 树节点可展开节点信息
const treeExpandMap = ref({});
// 当前选中的节点信息
const currentNodeKey = ref('');
// 树节点展开信息
const treeExpandedKeys = ref([]);
// 树节点默认展开信息
const defaultExpandedKeys = ref([]);
watch(filterText, (val) => {
	menuTreeRef.value.filter(val);
});
const loadTreeData = async () => {
	initTreeProps();
	const resultData = await getTreeData();
	const treeData = XEUtils.clone(resultData.children, true);
	initTreeExpanded(treeData);
	initTreeData(treeData);
	initTreeFirstNode();
};
const reloadTreeData = async () => {
	defaultExpandedKeys.value = [];
	const resultData = await getTreeData();
	const treeData = XEUtils.clone(resultData.children, true);
	initTreeData(treeData);
	if (currentNodeKey.value) {
		nextTick(() => {
			if (menuTreeRef.value) menuTreeRef?.value.setCurrentKey(currentNodeKey.value);
		});
	}
	defaultExpandedKeys.value = toRaw(treeExpandedKeys.value);
	setExpanded(toRaw(treeExpandedKeys.value));
};
const initTreeData = (treeData) => {
	const { showRootNode, rootNodeText } = props;
	if (showRootNode) {
		let rootNode = XEUtils.clone(menuRootNode, true);
		rootNode.menuName = rootNodeText;
		const { nodeMap, expandMap } = TreeUtils.transfData(treeData, {
			props: { label: 'menuName', value: 'menuCode' },
			showCode: false,
		});
		treeNodeMap.value = XEUtils.clone(nodeMap, true);
		treeExpandMap.value = XEUtils.clone(expandMap, true);
		rootNode.children = treeData;
		sTreeData.value = [rootNode];
	} else {
		sTreeData.value = treeData;
	}
};
const initTreeProps = () => {
	let resultProps = XEUtils.clone(menuTreeDefaultProps, true);
	if (props.showCode) {
		resultProps.label = (data, node) => {
			return `${data.menuCode} ${data.menuAlias || data.menuName}`;
		};
	} else {
		resultProps = menuTreeDefaultProps;
	}
	defaultProps.value = resultProps;
};
const initTreeExpanded = (treeData) => {
	const { expandedLevel } = props;
	const defaultKeys = treeData.map((item) => item.menuCode);
	treeExpandedKeys.value = defaultKeys;
	defaultExpandedKeys.value = defaultKeys;
};
const initTreeFirstNode = () => {
	handleNodeChange(sTreeData.value[0]);
};
const getTreeData = () => {
	loading.value = true;
	return new Promise((reslove) => {
		getMenuTree()
			.then((res) => {
				const { code, msg, data } = res;
				if (code === 200) {
					rTreeData.value = data.children;
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
const filterMethod = (value, data) => {
	if (!value) return true;
	return data.menuCode.includes(value) || data.menuName.includes(value);
};
const handleExpand = (data, treeNode, nodeRef) => {
	let keysSet = new Set([...toRaw(treeExpandedKeys.value)]);
	keysSet.add(data.menuCode);
	treeExpandedKeys.value = [...keysSet];
};
const handleCollapse = (data, treeNode, nodeRef) => {
	let keysSet = new Set([...toRaw(treeExpandedKeys.value)]);
	keysSet.delete(data.menuCode);
	treeExpandedKeys.value = [...keysSet];
};
const handleNodeClick = (data, treeNode, treeVNode, event) => {
	const extraInfo = getExtraInfo(data);
	currentNodeKey.value = data[defaultProps.value.value];
	emitNodeClick(toRaw({ ...data, extraInfo }), treeNode);
};
const handleNodeChange = (data, treeNode) => {
	const extraInfo = getExtraInfo(data);
	emitNodeChange(toRaw({ ...data, extraInfo }), treeNode);
};

// ----- 角色绑定菜单
// 选中的keys
const sCheckedKeys = [];
// 提交的keys
const submitCheckedKeys = [];
// 监听角色编码
watch(
	() => props.roleCode,
	(newValue, oldValue) => {
		reloadTreeChecked(newValue);
	},
	{ deep: true, immediate: false }
);
// 加载复选框选中
const reloadTreeChecked = async (roleCode) => {
	loading.value = true;
	// 重置keys
	sCheckedKeys.value = [];
	submitCheckedKeys.value = [];
	// 获取绑定数据
	const resultData = await reqCheckedKeys(roleCode);
	sCheckedKeys.value = resultData.menuCodes;
	submitCheckedKeys.value = resultData.menuCodes;
	const treeData = sTreeData.value;
	loadCheckboxTree(treeData);
	loading.value = false;
	// console.log(menuTreeRef.value)
	document.getElementById('menuTreeId').scrollIntoView({
		behavior: 'smooth', //smooth:平滑，auto：直接定位
		block: 'start',
	});
};
/**
 * 加载复选框树结构
 */
const loadCheckboxTree = () => {
	const { checkedKeys, expandedKeys } = fliterCheckKeys();
	setChecked(checkedKeys);
	const targetKeys = [...new Set([...expandedKeys, ...toRaw(defaultExpandedKeys.value)])];
	setExpanded(targetKeys);
};
/**
 * 过滤复现框的值,主要是用于树结构的回显以及展开
 */
const fliterCheckKeys = () => {
	const targetKeys = [...new Set([...toRaw(sCheckedKeys.value)])];
	let checkedKeys = [];
	let expandedKeys = [];
	targetKeys.forEach((item) => {
		const target = findItemInArray(sTreeData.value, 'menuCode', item);
		if (target) {
			if (!target.children || (target.children && target.children.length === 0)) {
				checkedKeys.push(item);
			} else {
				expandedKeys.push(item);
			}
		}
	});
	return { checkedKeys, expandedKeys };
};
/**
 * 设置复选框选中
 *
 * @param {Array} targetKeys 选中的值
 */
const setChecked = (targetKeys) => {
	sCheckedKeys.value = targetKeys;
	menuTreeRef.value.setCheckedKeys(targetKeys);
};
/**
 * 设置树结构展开
 * @param {Array} targetKeys 需要展开的key
 */
const setExpanded = (targetKeys) => {
	const treeNodesMap = menuTreeRef.value.store.nodesMap;
	for (let node in treeNodesMap) {
		if (targetKeys.includes(node)) {
			treeNodesMap[node].expanded = true;
		} else {
			treeNodesMap[node].expanded = false;
		}
	}
};
/**
 * 请求获取角色绑定的菜单编码
 */
const reqCheckedKeys = (roleCode) => {
	let params = { roleCode: roleCode || props.roleCode };
	return new Promise((reslove) => {
		getRoleRelMenu(params)
			.then((res) => {
				const { code, msg, data } = res;
				if (code === 200) {
					rTreeData.value = data.children;
					reslove(data);
				} else {
					reslove([]);
				}
			})
			.catch((err) => {
				reslove([]);
			});
	});
};
/**
 * 点击节点复选框之后触发
 *
 * @param {Object} data 选中节点数据
 * @param {Object} checkedInfo {
 *  checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes
 * }
 */
const handleCheck = (data, checkedInfo) => {
	const { checkedKeys, halfCheckedKeys } = checkedInfo;
	submitCheckedKeys.value = [...checkedKeys, ...halfCheckedKeys];
};
/**
 * 保存按钮触发
 */
const saveDisabled = ref(false);
const handleSave = () => {
	emitSave(toRaw(submitCheckedKeys.value));
};

/**
 * 递归获取树结构中匹配树
 *
 * @param {Array} targetArray 需要比对的数据
 * @param {String} validField 比对的字段名称
 * @param {String} validContent 不对的内容
 * @param {String} childField 比对数据的子级字段名默认为：children
 */
function findItemInArray(targetArray, validField, validContent, childField = 'children') {
	if (!targetArray) {
		return null;
	}
	for (let item of targetArray) {
		if (item[validField] == validContent) {
			return item;
		}
		let ret = findItemInArray(item[childField], validField, validContent, childField);
		if (ret) return ret;
	}
	return null;
}

// ----- 处理一些额外参数
const getExtraInfo = (currentData) => {
	let nextLevelNo = 1;
	let nextFullUrl = '';
	let nextFullUrls = [];
	const parentIds = treeExpandMap.value[currentData[defaultProps.value.value]];
	if (!parentIds) {
		nextLevelNo = 1;
		nextFullUrl = '';
	} else {
		nextLevelNo = 2 + parentIds.length;
		parentIds.forEach((menuCode) => {
			nextFullUrls.push(treeNodeMap.value[menuCode].routerName);
		});
		nextFullUrls.push(currentData.routerName);
		nextFullUrl = `/${nextFullUrls.join('/')}`;
	}
	return {
		nextLevelNo,
		nextFullUrl,
	};
};

// ----- emits 方法的定义
const emitNodeClick = (data, treeNode) => {
	emits('nodeClick', data, treeNode);
};
const emitNodeChange = (data, treeNode) => {
	emits('currentChange', data, treeNode);
};
const emitSave = (checkedKeys) => {
	// saveDisabled.value = true
	emits('save', checkedKeys, close);
};
const close = () => {
	// console.log('11')
	saveDisabled.value = false;
};

// ----- 执行方法
loadTreeData();

defineExpose({
	reloadTreeData,
	reloadTreeChecked,
});
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
