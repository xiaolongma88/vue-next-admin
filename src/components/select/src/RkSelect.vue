<template>
	<vxe-select
		ref="selectRef"
		:="$attrs"
		clearable
		v-model="selectValue"
		:options="optionData"
		:size="props.size"
		@clear="clearClick"
		@change="change"
		:filterable="isSearch"
	>
	</vxe-select>
</template>

<script setup>
import XEUtils from 'xe-utils';
import { nextTick, onMounted, ref, watch, watchEffect } from 'vue';
import { useDictApi } from '@/api/dict';
import { useNamespace } from 'element-plus';
import { EnumsDataPools } from '@/enums';

let ns = useNamespace('select', ref('rk'));

const emits = defineEmits(['change', 'update:modelValue']);
const props = defineProps({
	modelValue: {
		type: [Object, String, Number],
	},
	/**
	 * label字段指定 默认和el-select默认字段相同
	 */
	labelConfig: {
		type: Object,
		default: () => {
			return {
				value: 'value',
				label: 'label',
			};
		},
	},
	size: {
		type: String,
		default: 'medium',
	},
	options: {
		type: Array,
	},
	// 本地字典
	enum: { type: [String, Object], default: '' },
	/**
	 * 服务器请求方法 返回数组参数
	 */
	server: {
		type: Function,
	},
	showCode: {
		type: Boolean,
		default: true,
	},
	/**
	 * 字典项根据字典值查询，Object:{name:'XM_OBJ_NAME',params:{},dataLabel:'data'}
	 */
	dist: {
		type: [String, Object],
		default: '',
	},
	isSearch: {
		type: Boolean,
		default: true,
	},
});

const selectRef = ref(null);

const selectValue = ref(props.modelValue);

watchEffect(() => {
	selectValue.value = props.modelValue;
});
const optionData = ref([]);

//优先级options>dist>enum>server
const parserOptionsData = () => {
	/**
	 * 判断传入值
	 */
	if (props.options) {
		propOptionsType();
	} else if (props.dist) {
		propDistType();
	} else if (props.enum) {
		const result = dealEnumData();
		optionData.value = result;
	} else if (props.server) {
		propServerType();
	}
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
/**
 * 生成 dataOption的值（赋值）
 * @param options
 */
const generateDataOptions = (options) => {
	if (options && Array.isArray(options)) {
		let data = options.map((item) => {
			let temp = {
				value: item[props.labelConfig.value],
				label: '',
			};
			if (props.labelConfig) {
				if (typeof props.labelConfig.label === 'function') {
					if (props.showCode && item['code']) {
						temp.label = `${item['code']} ${props.labelConfig.label(item)}`;
					} else {
						temp.label = props.labelConfig.label(item);
					}
				} else {
					if (props.showCode && item['code']) {
						temp.label = `${item['code']} ${item[props.labelConfig.label]}`;
					} else {
						temp.label = item[props.labelConfig.label];
					}
				}
			}
			return temp;
		});
		optionData.value = data;
	}
};

/**
 * 数据是Option处理
 */
const propOptionsType = () => {
	if (props.options && Array.isArray(props.options)) {
		generateDataOptions(props.options);
	}
};
/**
 * 数据是Dist
 * @returns {Promise<void>}
 */
const propDistType = async () => {
	let options = [];
	if (props.dist) {
		let params = {};
		let dataLabel = 'data';
		if (typeof props.dist === 'string') {
			params = { name: props.dist };
		} else if (typeof props.dist === 'object') {
			if (props.dist.hasOwnProperty('name') && props.dist['name']) {
				Object.assign(params, { name: props.dist['name'] });
			}
			if (props.dist.hasOwnProperty('params') && props.dist['params']) {
				Object.assign(params, props.dist[params]);
			}
			if (props.dist.hasOwnProperty('dataLabel') && props.dist['dataLabel']) {
				dataLabel = props.dist['dataLabel'];
			}
		}
		let resp = await useDictApi().getDistData(params);
		options = resp[dataLabel];
	}
	generateDataOptions(options);
};

/**
 * 数据是Option处理
 */
const propServerType = async () => {
	let option = await props.server();
	generateDataOptions(option);
};

const change = (value) => {
	let data = optionData.value.filter((item) => {
		return item[props.labelConfig.value] === value.value;
	});
	emits('change', data, value);
	emits('update:modelValue', value.value);
};
onMounted(() => {
	nextTick(() => {
		parserOptionsData();
	});
});

const clearClick = () => {
	emits('change', null, '');
};
</script>

<style scoped lang="scss">
@use '@/styles/mixins/function.scss' as *;

@include b('select') {
	&-option {
		&__input {
			position: absolute;
			z-index: 1000;
			margin: 0;
			padding: 0;
			width: 100%;
			top: 0;
			background-color: #ffffff;
		}
	}
}
</style>
