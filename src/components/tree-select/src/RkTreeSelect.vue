<template>
	<vxe-pulldown class="rk-tree-select" ref="vxePullDownRef" v-model="pulldownVisible" :disabled="disabled" @hide-panel="handlePullDownHide">
		<slot :click="echoInputClick" :value="selectValue">
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
		</slot>
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

<script setup name="RkTreeSelect">
import XEUtils from 'xe-utils';
import request from '@/utils/request';
import IsUtils from '@/utils/is-utils.js';
import { nextTick } from 'vue';
import { useDictApi } from '@/api/dict';
import { EnumsDataPools } from '@/enums';
import { CommonUtils, TreeSelectUtils } from '@/utils/select';
import { CircleClose, CaretBottom , CaretTop } from '@element-plus/icons-vue'

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
				code: 'code',
				label: 'label',
				value: 'value',
				children: 'children',
				disabled: 'disabled',
			};
		},
	},
	// 传入数据
	data: { type: Array, default: () => [] },
	// 字典类型 String | Object: { name: '', params: {},}
	dist: { type: [String, Object], default: '' },
	// 本地字典
	enum: { type: [String, Object], default: '' },
	// 自定义请求
	server: { type: [Function, Object] },
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
	// 选中第一个节点
	fristNodeSelected: { type: Boolean, default: false },
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

// 初始化加载
onMounted(() => {
	loadTreeData();
	initPullDownWidth();
});
watch(
	() => props.modelValue,
	(newValue, oldValue) => {
		setSelectValue();
	}
);
watch(
	() => props.data,
	(newValue, oldValue) => {
		loadTreeData();
	}
);
// 监听下拉面板展开状态
watch(pulldownVisible, (newValue, oldValue) => {
	if (newValue) {
		// 设置树节点选中
		setTreeSelect();
		// 设置搜索输入框获取焦点
		setSearchInputFocus();
	}
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
	if (selectInputRef.value) {
		selectInputRef.value.blur();
	}
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
/** 设置展示输入框的值（select回显内容）*/
const setSelectValue = function () {
	if (IsUtils.isNotEmpty(props.modelValue)) {
		const data = treeNodeMap.value[props.modelValue];
		if (data) {
			selectValue.value = data[localProps.label];
		} else {
			selectValue.value = '';
		}
	} else {
		selectValue.value = '';
	}
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
const treeNodeMap = ref({});
const treeExpandMap = ref({});
/**
 * 加载树结构数据：优先级：data > dist > enum > server
 */
const loadTreeData = async () => {
	treeData.value = [];
	let result = [];
	if (props.data && props.data.length > 0) {
		result = dealStaticData();
	} else if (props.dist) {
		result = await dealBaseData();
	} else if (props.enum) {
		result = dealEnumData();
	} else if (props.server) {
		result = await dealServerData();
	}
	// 设置树结构数据
	setTreeData(result);
};
// ----- 处理基础数据相关
/** 处理基础数据 */
const dealBaseData = async () => {
	if (!props.dist) return;
	const { dist } = props;
	// 处理tree的props
	localProps.label = 'name';
	localProps.value = 'code';
	// 检查传递的参数
	const msg = CommonUtils.validateDist(dist);
	if (msg) {
		console.error(msg);
		return;
	}
	// 获取查询参数
	const params = CommonUtils.getDistQueryParams(dist);
	// 请求数据
	const result = await loadBaseData(params);
	return result;
};
/**
 * 加载基础数据
 * @param {Object} params 查询参数
 */
const loadBaseData = (params) => {
	return new Promise((reslove) => {
		useDictApi()
			.getDistData(params)
			.then((res) => {
				const { code, data, msg } = res;
				if (code === 200) {
					reslove(data);
				} else {
					console.error(msg);
					reslove([]);
				}
			})
			.catch((err) => {
				console.error(err);
				reslove([]);
			});
	});
};
// ----- 处理本地静态数据
const dealEnumData = () => {
	if ((props.enum instanceof String || typeof props.enum === 'string') && props.enum) {
		const enumOptions = XEUtils.clone(EnumsDataPools[props.enum].options, true);
		const result = Object.keys(enumOptions).map((key) => {
			return enumOptions[key];
		});
		// 设置数据
		return result;
	} else {
		console.error('属性enum需要为字符串类型，且不为空！');
		return [];
	}
};
// ----- 处理静态数据相关
const dealStaticData = () => {
	return props.data;
};
// ----- 处理请求数据相关
const dealServerData = async () => {
	if (!props.server) return;
	const { server } = props;
	if (server && server instanceof Function) {
		// 请求数据
		const result = await loadServerFunc(server);
		return result;
	} else {
		const msg = CommonUtils.validateServer(server);
		if (msg) {
			console.error(msg);
			return;
		}
		// 请求数据
		const result = await loadServerData(server);
		return result;
	}
};
const loadServerData = (server) => {
	return new Promise((reslove) => {
		request(server)
			.then((res) => {
				const { code, data, msg } = res;
				if (code === 200) {
					reslove(data);
				} else {
					console.error(msg);
					reslove([]);
				}
			})
			.catch((err) => {
				console.error(err);
				reslove([]);
			});
	});
};
const loadServerFunc = async () => {
	const options = await props.server();
	return options;
};

/**
 * 设置树结构数据
 * @param {Array} result 树结构数据
 */
const setTreeData = (result) => {
	const { parseData, expandMap, nodeMap } = TreeSelectUtils.transfData(result, {
		showCode: props.showCode,
		props: toRaw(localProps),
	});
	treeData.value = parseData;
	treeNodeMap.value = nodeMap;
	treeExpandMap.value = expandMap;
	setSelectValue();
	setFirstSelect();
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
const setFirstSelect = () => {
	if (props.fristNodeSelected && !props.modelValue) {
		if (treeData.value.length > 0) {
			emitModelValue(treeData.value[0]);
		}
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
	emitChange(data);
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
const emitChange = (data) => {
	if (data) {
		emits('change', data[localProps.value], data, toRaw(treeData.value));
	} else {
		emits('change', '', '', '');
	}
};

defineExpose({
	treeRef,
});
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
