<!--
 * @Author: ljc
 * @Date: 2023-05-22 10:52:01
 * @LastEditors: g05047
 * @LastEditTime: 2023-06-09 17:28:51
 * @Description: 区划树下拉选择
-->

<template>
	<vxe-pulldown class="rk-tree-select" ref="vxePullDownRef" v-model="pulldownVisible" :disabled="disabled" @hide-panel="handlePullDownHide">
		<template #default>
			<el-input
				readonly
				type="text"
				ref="selectInputRef"
				v-model="selectValue"
				:title="selectValue"
				:disabled="disabled"
				:placeholder="placeholder"
				@click="echoInputClick"
				@mouseover="setSelectInputHover(true)"
				@mouseleave="setSelectInputHover(false)"
			>
				<template #suffix>
					<template v-if="selectHoverVisible && clearable && modelValue">
						<el-icon @click="clearSelectValue">
							<CircleClose />
						</el-icon>
					</template>
					<template v-else>
						<el-icon @mouseover="setSelectInputHover(true)" @mouseleave="setSelectInputHover(false)">
							<caret-top v-if="pulldownVisible" />
							<caret-bottom v-else />
						</el-icon>
					</template>
				</template>
			</el-input>
		</template>
		<template #dropdown>
			<div class="rk-tree-select-dropdown" :style="pulldownStyle">
				<div class="rk-tree-select-dropdown-search" v-show="filterable">
					<el-input ref="searchInputRef" v-model="searchValue" prefix-icon="search" :placeholder="filterPlaceholder">
						<template #suffix>
							<span class="clear-icon">
								<el-icon @click="searchValue = ''">
									<CircleClose />
								</el-icon>
							</span>
						</template>
					</el-input>
				</div>
				<div class="rk-tree-select-dropdown-content" :class="[filterable ? 'border-top-none' : '']">
					<el-tree
						ref="treeRef"
						class="rk-tree-select-center"
						:="$attrs"
						:data="treeData"
						v-loading="loading"
						:node-key="localProps.value"
						:props="localProps"
						:highlight-current="true"
						:filter-node-method="filterTreeNode"
						@node-click="handleNodeClick"
					>
					</el-tree>
				</div>
			</div>
		</template>
	</vxe-pulldown>
</template>

<script setup name="RkAdTreeSelect">
import { nextTick, ref, watch } from 'vue';
import { useTreeApi } from '@/api/tree';
import { useUserStore } from '@/stores/modules';

const userStore = useUserStore();
const code = userStore.userInfo.adCode;
const props = defineProps({
	// 用于v-model
	modelValue: { type: [String, Number] },
	// 用于v-model:label 回显选中选项的label
	label: { type: [String, Number] },
	// 节点配置信息
	props: {
		type: Object,
		default: () => {
			return {
				label: 'name',
				value: 'code',
				children: 'children',
				disabled: 'disabled',
			};
		},
	},
	//拿某个单位下的区划树
	adCode: { type: [String, Number], default: '' },
	// 是否展示编码
	showCode: { type: Boolean, default: true },
	// 是否禁用
	disabled: { type: Boolean, default: false },
	// 是否清空
	clearable: { type: Boolean, default: true },
	// 提示语
	placeholder: { type: String, default: '请选择' },
	// 是否可搜索
	filterable: { type: Boolean, default: true },
	// 搜索框提示语
	filterPlaceholder: { type: String, default: '输入关键字进行过滤' },
	// 父节点是否可以选中
	parentNodeSelected: { type: Boolean, default: true },
	// 是否选中节点后关闭下拉容器
	closePanelNodeSelected: { type: Boolean, default: true },
	// 下拉面板与选择器同宽
	pulldownMatchSelectWidth: { type: Boolean, default: false },
});

// 用于定义v-model
const emits = defineEmits([
	'update:modelValue', // 用于定义v-model
	'update:label', // 用于定义v-model
	'change',
]);
// 下拉容器的模板引用
const vxePullDownRef = ref();
// 下拉容器是否展示
const pulldownVisible = ref(false);
let adCode = ref(null);

// 初始化加载
onMounted(() => {
	loadTreeData();
	initPullDownWidth();
});
// 监听下拉面板展开状态
watch(pulldownVisible, (newValue, oldValue) => {
	if (newValue) {
		// 设置树节点选中
		setTreeSelect();
		// 设置搜索输入框获取焦点
		setSearchInputFocus();
	}
});
// 监听下拉面板展开状态
watch(
	() => props.adCode,
	(newValue, oldValue) => {
		if (newValue) {
			adCode.value = props.adCode;
		} else {
			adCode.value = code;
		}
	},
	{ deep: true, immediate: true }
);

onMounted(() => {
	watch(
		() => props.modelValue,
		(newValue, oldValue) => {
			if (!newValue) {
				clearSelectValue();
			}
		},
		{ deep: false, immediate: true }
	);
});
// ----- vxe-pulldown相关
let pulldownMaxWidth = 300;
const pulldownStyle = ref({});
/**
 * 在下拉面板被触发隐藏时触发该事件
 */
const handlePullDownHide = () => {
	// 设置显示输入框划过状态
	setSelectInputHover(false);
	// 下拉面板隐藏
	pulldownVisible.value = false;
	// 展示输入框失去焦点
	selectInputRef.value.blur();
	// 重置搜索内容
	searchValue.value = '';
	// 重置树节点选中
	resetTreeSelect();
};
/** 初始化下拉面板宽度 */
const initPullDownWidth = () => {
	if (props.pulldownMatchSelectWidth) {
		pulldownMaxWidth = selectInputRef.value.$el.offsetWidth;
		pulldownStyle.value['width'] = `${pulldownMaxWidth}px`;
	}
};

// ----- 展示的输入框相关
const selectValue = ref('');
const selectInputRef = ref();
// 展示输入框鼠标是否划过
const selectHoverVisible = ref(false);
/** 展示输入库点击触发 */
const echoInputClick = function () {
	pulldownVisible.value = !pulldownVisible.value;
};
/** 点击清除图标 */
const clearSelectValue = function () {
	selectValue.value = '';
	emitModelValue('', false);
	resetTreeSelect();
};
/**
 * 设置鼠标是否划过展示输入框
 * @param {Boolean} value 状态值
 */
const setSelectInputHover = function (value) {
	selectHoverVisible.value = value;
};

// ----- 搜索的输入框相关
const searchValue = ref('');
const searchInputRef = ref();
/**
 * 搜索查询内容
 * @param {String} value 查询内容
 */
const handleSearch = async function (value) {
	treeRef.value.filter(value);
};
/** 设置搜索输入框获取焦点 */
const setSearchInputFocus = () => {
	nextTick(() => {
		searchInputRef.value.focus();
	});
};
/** 监听搜索内容 */
watch(searchValue, (newValue, oldValue) => {
	handleSearch(newValue);
});

// ----- 树形结构相关
const treeRef = ref();
const treeData = ref([]);
const localProps = reactive(props.props);
const loading = ref(false);
/**
 * 加载树结构数据：优先级：data > dist > enum > server
 */
const loadTreeData = async () => {
	const params = {
		code: adCode.value,
	};
	const data = await getAdData(params);
	treeData.value = data;
};
// ----- 处理基础数据相关
/**获取区划树接口 */
const getAdData = async (param) => {
	loading.value = true;
	const result = await useTreeApi().getSysAdata(param);
	const { data, code, msg } = result;
	if (code === 200) {
		loading.value = false;
		return data;
	} else {
		console.error(msg);
		loading.value = false;
		return [];
	}
};
/**
 * 树结构查询
 * @param {String} value 查询内容
 * @param {Object} data 树节点
 */
const filterTreeNode = (value, data) => {
	if (!value) return true;
	return data[localProps.label].includes(value);
};
/**
 * 设置树结构选中
 */
const setTreeSelect = () => {
	// 设置默认数据回显
	if (props.modelValue) {
		nextTick(() => {
			treeRef.value.setCurrentKey(props.modelValue);
		});
	}
};
/**
 * 重置树结构选中项
 */
const resetTreeSelect = () => {
	if (treeRef.value) {
		treeRef.value.setCurrentKey(null);
	}
};
/** 树节点点击 */
const handleNodeClick = (data, node, config, event) => {
	const { parentNodeSelected } = props;
	if (parentNodeSelected) {
		emitModelValue(data);
	} else {
		if (data[localProps.children] && data[localProps.children].length > 0) {
			return;
		} else {
			emitModelValue(data);
		}
	}
};
/**
 * 向上触发设置选中值
 *
 * @param {Object} data 节点数据
 */
const emitModelValue = (data, closePanel = true) => {
	selectValue.value = data[localProps.label];
	emitChange(data[localProps.value], data[localProps.label], data);
	emits('update:modelValue', data[localProps.value]);
	emits('update:label', data[localProps.label]);
	if (props.closePanelNodeSelected && closePanel) {
		handlePullDownHide();
	}
};

/**
 * 向上触发内容改变事件
 * @param {Object} data 选中节点数据
 */
const emitChange = (value, lable, data) => {
	if (value) {
		emits('change', value, lable, data);
	} else {
		emits('change', '', '');
	}
};
</script>

<style lang="scss" scoped>
.rk-tree-select {
	width: 100%;
	:deep(.vxe-pulldown--panel) {
		z-index: 99999 !important;
	}
	:deep(.vxe-pulldown--wrapper) {
		border-radius: 4px 4px 0 0;
	}
}

.rk-tree-select-dropdown {
	// border: 1px solid #dcdfe6;
	// border-radius: 4px;
	.rk-tree-select-dropdown-search {
		:deep(.el-input__wrapper) {
			border-radius: 4px 4px 0 0;
		}
	}
	.rk-tree-select-dropdown-content {
		min-height: 100px;
		max-height: 300px;
		overflow: auto;
		border: 1px solid #dcdfe6;

		.clear-icon {
			cursor: pointer;
		}
		.rk-tree-select-center {
			padding: 5px 0;
			:deep(.el-tree-node__content) {
				padding-right: 24px;
				.el-tree-node__label {
					flex: 1;
				}
			}
		}
	}
	.border-top-none {
		border-top: none;
	}
}
</style>
