<template>
	<div class="rk-ad-ag-tree-wrapper">
		<div class="rk-ad-ag-tree-item" v-show="!insideAdTreeHidden">
			<div class="tree-item-search">
				<div class="item-search-title">
					<span>{{ adTitle }}</span>
				</div>
				<div class="item-search-content">
					<el-input v-model="adFilterText" :placeholder="adPlaceholder" :prefix-icon="Search" clearable />
				</div>
			</div>
			<div class="tree-item-content" v-loading="adLoading">
				<div class="tree-item-content-center">
					<el-tree
						ref="adTreeRef"
						highlight-current
						:data="adTreeData"
						:props="adTreeProps"
						:node-key="adTreeProps.value"
						:filter-node-method="filterAdNodeMethod"
						:default-expand-all="defaultExpandAll"
						:default-expanded-keys="adDefaultExpandedKeys"
						@node-click="handleAdNodeClick"
						@current-change="handleAdNodeChange"
					/>
				</div>
			</div>
		</div>
		<div class="rk-ad-ag-tree-item" v-show="!insideAgTreeHidden">
			<div class="tree-item-search">
				<div class="item-search-title">
					<span>{{ agTitle }}</span>
				</div>
				<div class="item-search-content">
					<el-input v-model="agFilterText" :placeholder="agPlaceholder" :prefix-icon="Search" clearable />
				</div>
			</div>
			<div class="tree-item-content" v-loading="agLoading">
				<div class="tree-item-content-center">
					<el-tree
						ref="agTreeRef"
						highlight-current
						:data="agTreeData"
						:props="agTreeProps"
						:node-key="adTreeProps.value"
						:filter-node-method="filterAgNodeMethod"
						:default-expand-all="defaultExpandAll"
						:default-expanded-keys="agDefaultExpandedKeys"
						@node-click="handleAgNodeClick"
						@current-change="handleAgNodeChange"
					/>
					<!-- <div style="display: flex; flex-direction: column; height: 100%;">
            <div style="flex-grow: 1; height: 0;">
              <div style="overflow: auto; height: 100%;">
              </div>
            </div>
          </div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup name="RkAdAgTreePanel">
import XEUtils from 'xe-utils';
import { nextTick } from 'vue';
import { ElTree } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { useTreeApi } from '@/api/tree';
import { useUserStore } from '@/stores/modules';
import TreeUtils from '@/components/tree/cfg/tree-utils.js';
import { adTreeDefaultProps, agTreeDefaultProps, agRootNode } from '@/components/tree/cfg/tree-config.js';

// 用户信息
const userInfo = useUserStore().userInfo;

// 组件中调用的API
const { getSysAdata, getSysAgData, getAdTree } = useTreeApi();

// emits方法定义
const emits = defineEmits([
	'loaded',
	'adLoaded',
	'agLoaded',
	'nodeClick',
	'adNodeClick',
	'agNodeClick',
	'currentChange',
	'adCurrentChange',
	'agCurrentChange',
	'toggleHidden',
]);

// props
const props = defineProps({
	// ----- 公共属性
	// 宽度：默认100%
	width: { type: String, default: '100%' },
	// 高度：默认100%
	height: { type: String, default: '100%' },
	// 节点是否可重复点击
	clickRepeatable: { type: Boolean, default: true },
	// 是否默认展开所有节点：默认false
	defaultExpandAll: { type: Boolean, default: false },
	// 节点点击是否自动展开
	clickAutoExpanded: { type: Boolean, default: false },
	// 父节点是否可点击
	parentNodeClickable: { type: Boolean, default: false },

	// 区划树唯一ID
	adId: { type: String },
	// 区划树标题
	adTitle: { type: String, default: '区划' },
	// 区划树节点替换字段
	adTreeProps: {
		type: Object,
		default: () => {
			return adTreeDefaultProps;
		},
	},
	// 区划树是否隐藏：默认false
	adTreeHidden: { type: Boolean, default: false },
	// 区划搜索框提示语
	adPlaceholder: { type: String, default: '请输入关键词' },
	// 区划树根节点是否可见
	adRootVisible: { type: Boolean, default: false },

	// 单位树唯一ID
	agId: { type: String },
	// 单位树标题
	agTitle: { type: String, default: '单位' },
	// 区划树节点替换字段
	agTreeProps: {
		type: Object,
		default: () => {
			return agTreeDefaultProps;
		},
	},
	// 单位树是否隐藏：默认false
	agTreeHidden: { type: Boolean, default: false },
	// 单位搜索框提示语
	agPlaceholder: { type: String, default: '请输入关键词' },
	// 单位树根节点是否可见
	agRootVisible: { type: Boolean, default: false },
	isAdTree: { type: Boolean, default: false },
});

onBeforeMount(() => {
	loadTreeData();
});

// ----- 公共的emits操作
const emitLoaded = () => {
	emits('loaded', toRaw(adTreeData), toRaw(agTreeData));
};
const emitNodeClick = () => {
	emits('nodeClick', toRaw(adCurrentNode.value), toRaw(agCurrentNode.value));
};
const emitCurrentChange = () => {
	// 区划显示 单位显示 - 单位加载完以后触发
	emits('currentChange', toRaw(adCurrentNode.value), toRaw(agCurrentNode.value));
};
const emitToggleHidden = () => {
	emits('toggleHidden', insideAdTreeHidden.value && insideAgTreeHidden.value);
};

// 加载树结构数据
const loadTreeData = async () => {
	if (insideAdTreeHidden.value) {
		const { agId, adBjCode: adCode } = userInfo;
		await loadAgTreeData({ agId, adCode });
	} else {
		await loadAdTreeData();
	}
	emitToggleHidden();
};

// ----- 区划树结构操作
const adLoading = ref(false);
const adTreeRef = ref();
const adTreeData = ref([]);
const adFilterText = ref('');
const adCurrentNode = ref({});
const insideAdTreeHidden = ref(props.adTreeHidden);
const adDefaultExpandedKeys = ref([]);
// 加载区划树
const loadAdTreeData = async () => {
	if (insideAdTreeHidden.value) return;
	const treeData = await getAdTreeData();
	initAdTreeData(treeData);
	initAdTreeHidden(treeData);
	initAdTreeConfig(treeData);
	initAdTreeLoaded(treeData);
	if (insideAgTreeHidden.value) {
		emitLoaded();
	}
};
const reloadAdTreeData = async () => {
	const treeData = await getAdTreeData();
	initAdTreeData(treeData);
	initAdTreeHidden(treeData);
	initAdTreeConfig(treeData);
	initAdTreeLoaded(treeData);
	// 设置选中
	if (adCurrentNode.value[props.adTreeProps.value]) {
		nextTick(() => {
			adTreeRef?.value.setCurrentKey(adCurrentNode.value[props.adTreeProps.value]);
		});
	}
};
// 初始化区划树结构
const initAdTreeData = (treeData) => {
	adTreeData.value = treeData;
};
// 初始化区划树显示隐藏
const initAdTreeHidden = (treeData) => {
	// 是否只有一个节点，设置区划树隐藏显示
	const hidden = TreeUtils.hasOnlyOneNode(treeData);
	insideAdTreeHidden.value = hidden;
	// 如果区划树只有一个节点，并单位树不隐藏，将单位树隐藏
	if (hidden && !insideAgTreeHidden.value) {
		insideAgTreeHidden.value = true;
	}
};
// 初始化区划树一些配置信息
const initAdTreeConfig = (treeData) => {
	if (treeData && treeData.length > 0) {
		const firstTreeNode = treeData[0];
		const firstTreeNodeValue = String(firstTreeNode[props.adTreeProps.value]);
		adDefaultExpandedKeys.value = [firstTreeNodeValue];
		nextTick(() => {
			if (adTreeRef.value) adTreeRef?.value.setCurrentKey(firstTreeNodeValue);
		});
	}
};
// 初始化区划树加载后
const initAdTreeLoaded = (treeData) => {
	emitAdLoaded(treeData);
};
// 过滤区划树节点的方法
const filterAdNodeMethod = (value, data) => {
	if (!value) return true;
	return data[props.adTreeProps.label].includes(value);
};
// 区划树节点点击触发
const handleAdNodeClick = (data, treeNode, treeVNode, event) => {
	if (!props.clickAutoExpanded) {
		treeNode.expanded = !treeNode.expanded;
	}
	let oldValue = adCurrentNode.value[props.adTreeProps.value];
	let newValue = data[props.adTreeProps.value];
	if (!props.clickRepeatable) {
		if (newValue === oldValue) return;
	}
	emitAdNodeClick(toRaw(data), treeNode);
	emitNodeClick();
};
// 区划树当前选中节点变化时触发的事件
const handleAdNodeChange = (data, treeNode) => {
	adCurrentNode.value = XEUtils.clone(toRaw(data), true);
	emitAdCurrentChange(toRaw(data), treeNode);
	if (!insideAdTreeHidden.value && insideAgTreeHidden.value) {
		emitCurrentChange();
	}
	const agQueryParams = { agId: userInfo.agId, adCode: data.code };
	loadAgTreeData(agQueryParams);
};
// 获取区划树数据
const getAdTreeData = () => {
	adLoading.value = true;
	return new Promise((reslove) => {
		if (props.isAdTree) {
			const params = { code: userInfo.adCode };
			getAdTree(params)
				.then((res) => {
					const { code, data, msg } = res;
					reslove(code === 200 ? data : []);
				})
				.catch((err) => {
					console.error(err);
					reslove([]);
				})
				.finally(() => {
					adLoading.value = false;
				});
		} else {
			getSysAdata()
				.then((res) => {
					const { code, data, msg } = res;
					reslove(code === 200 ? data : []);
				})
				.catch((err) => {
					console.error(err);
					reslove([]);
				})
				.finally(() => {
					adLoading.value = false;
				});
		}
	});
};
// ----- adTree watch 操作
// 监听区划树搜索框数据变化
watch(adFilterText, (newValue) => {
	if (adTreeRef) adTreeRef.value.filter(newValue);
});
// ----- adTree emits 操作
const emitAdLoaded = (treeData) => {
	emits('adLoaded', treeData);
};
const emitAdNodeClick = (data, treeNode) => {
	emits('adNodeClick', data, treeNode);
};
const emitAdCurrentChange = (data, treeNode) => {
	emits('adCurrentChange', data, treeNode);
};

// ----- 单位树结构操作
const agLoading = ref(false);
const agTreeRef = ref();
const agTreeData = ref([]);
const agFilterText = ref('');
const agCurrentNode = ref({});
const insideAgTreeHidden = ref(props.agTreeHidden);
const agDefaultExpandedKeys = ref([]);
// 加载单位树
const loadAgTreeData = async (params) => {
	if (insideAgTreeHidden.value) return;
	const treeData = await getAgTreeData(params);
	initAgTreeHidden(treeData);
	const dealTreeData = initAgTreeData(treeData);
	initAgTreeConfig(dealTreeData);
	initAgTreeLoaded(treeData);
	emitLoaded();
};
const reloadAgTreeData = async () => {
	const { agId, adBjCode } = userInfo;
	let adCode = adCurrentNode.value.code || adBjCode;
	const queryParams = { agId, adCode };
	const treeData = await getAgTreeData(queryParams);
	initAgTreeHidden(treeData);
	const dealTreeData = initAgTreeData(treeData);
	initAgTreeConfig(dealTreeData);
	initAgTreeLoaded(treeData);
	emitLoaded();
	const currentKey = agCurrentNode.value[agTreeProps.value];
	if (currentKey) {
		nextTick(() => {
			if (agTreeRef.value) {
				agTreeRef.value.setCurrentKey(currentKey);
			}
		});
	}
};
// 初始化单位树结构
const initAgTreeData = (treeData) => {
	let resultTreeData = [];
	// 处理树机构存在全部节点
	if (treeData && treeData.length > 2) {
		const rootNode = XEUtils.clone(agRootNode, true);
		rootNode.children = treeData;
		let newTreeData = [rootNode];
		agTreeData.value = newTreeData;
		resultTreeData = newTreeData;
	} else {
		agTreeData.value = treeData;
		resultTreeData = treeData;
	}
	return resultTreeData;
};
// 初始化单位树显示隐藏
const initAgTreeHidden = (treeData) => {
	const hidden = TreeUtils.hasOnlyOneNode(treeData);
	insideAgTreeHidden.value = hidden;
};
// 初始化单位树一些配置信息
const initAgTreeConfig = (treeData) => {
	if (treeData && treeData.length > 0) {
		const firstTreeNode = treeData[0];
		const firstTreeNodeValue = String(firstTreeNode[props.agTreeProps.value]);
		agDefaultExpandedKeys.value = [firstTreeNodeValue];
		nextTick(() => {
			if (agTreeRef.value) {
				agTreeRef.value.setCurrentKey(firstTreeNodeValue);
			}
		});
	} else {
		emitCurrentChange();
	}
};
// 初始化单位树加载后
const initAgTreeLoaded = (treeData) => {
	emitAgLoaded(treeData);
};
// 过滤单位树节点的方法
const filterAgNodeMethod = (value, data) => {
	if (!value) return true;
	return data[props.agTreeProps.label].includes(value);
};
// 单位树节点点击触发
const handleAgNodeClick = (data, treeNode, treeVNode, event) => {
	if (!props.clickAutoExpanded) {
		treeNode.expanded = !treeNode.expanded;
	}
	let oldValue = agCurrentNode.value[props.agTreeProps.value];
	let newValue = data[props.agTreeProps.value];
	if (!props.clickRepeatable) {
		if (newValue === oldValue) return;
	}
	emitAgNodeClick(toRaw(data), treeNode);
	emitNodeClick();
};
// 单位树当前选中节点变化时触发的事件
const handleAgNodeChange = (data, treeNode) => {
	agCurrentNode.value = XEUtils.clone(toRaw(data), true);
	emitAgCurrentChange(toRaw(data), treeNode);
	emitCurrentChange();
};
// 获取单位树数据
const getAgTreeData = (params) => {
	agLoading.value = true;
	return new Promise((reslove) => {
		getSysAgData(params)
			.then((res) => {
				const { code, data, msg } = res;
				reslove(code === 200 ? data : []);
			})
			.catch((err) => {
				console.error(err);
				reslove([]);
			})
			.finally(() => {
				agLoading.value = false;
			});
	});
};
// ----- agTree watch 操作
// 监听区划树搜索框数据变化
watch(agFilterText, (newValue) => {
	if (agTreeRef.value) agTreeRef.value.filter(newValue);
});
// ----- agTree emits 操作
const emitAgLoaded = (treeData) => {
	emits('agLoaded', treeData);
};
const emitAgNodeClick = (data, treeNode) => {
	emits('agNodeClick', data, treeNode);
};
const emitAgCurrentChange = (data, treeNode) => {
	emits('agCurrentChange', data, treeNode);
};

defineExpose({
	reloadAdTreeData,
	reloadAgTreeData,
});
</script>

<style lang="scss" scoped>
.rk-ad-ag-tree-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	// border: 1px solid red;
}
.rk-ad-ag-tree-item {
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
		}
		.item-search-content {
			flex: 1;
			padding-left: 8%;
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
