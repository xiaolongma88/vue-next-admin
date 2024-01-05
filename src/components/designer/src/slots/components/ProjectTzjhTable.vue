<!--
 * @Author: lisong
 * @Date: 2023-04-17 16:22:20
 * @LastEditors: lisong
 * @LastEditTime: 2023-04-24 16:38:38
 * @Description: 投资计划表格
-->
<template>
	<rk-grid
		ref="rkGridRef"
		title=""
		boxConfig
		:data="data"
		:columns="columns"
		:loading="loading"
		:editConfig="!editDisable"
		:keepSource="true"
		:pagerConfig="false"
	>
		<template #toolbar_title_buttons v-if="!editDisable">
			<el-button type="primary" plain @click="handleOperation('add', '新增行')">新增行</el-button>
			<el-button type="danger" plain @click="handleOperation('delete', '删除行')">删除行</el-button>
		</template>
		<template #rk_select_year_edit="{ row, column }">
			<el-date-picker v-model="row[column.field]" @change="dateChangeEvent($event, row, column)" value-format="YYYY" type="year" placeholder="选择年">
			</el-date-picker>
		</template>
		<template #rk_input_ysa="{ row, column }">
			<div class="bgc full-size">
				{{ formatAmount(row[column.field]) }}
			</div>
		</template>
		<template #rk_input_sspa_edit="{ row, column }">
			<vxe-input
				v-model="row[column.field]"
				type="float"
				@blur="blurEvent(row, column)"
				@focus="focusEvent(row, column)"
				clearable
				@clear="blurEvent(row, column)"
				align="right"
			></vxe-input>
		</template>
		<template #rk_input_sspa="{ row, column }">
			{{ formatAmount(row[column.field]) }}
		</template>
		<template #rk_input_bpa_edit="{ row, column }">
			<vxe-input
				v-model="row[column.field]"
				type="float"
				@blur="blurEvent(row, column)"
				@focus="focusEvent(row, column)"
				@clear="blurEvent(row, column)"
				clearable
				align="right"
			></vxe-input>
		</template>
		<template #rk_input_bpa="{ row, column }">
			{{ formatAmount(row[column.field]) }}
		</template>
		<template #rk_input_fpa_edit="{ row, column }">
			<vxe-input
				v-model="row[column.field]"
				type="float"
				@blur="blurEvent(row, column)"
				@focus="focusEvent(row, column)"
				align="right"
				@clear="blurEvent(row, column)"
				clearable
			></vxe-input>
		</template>
		<template #rk_input_fpa="{ row, column }">
			{{ formatAmount(row[column.field]) }}
		</template>
		<template #rk_input_mpa_edit="{ row, column }">
			<vxe-input
				v-model="row[column.field]"
				type="float"
				@blur="blurEvent(row, column)"
				@focus="focusEvent(row, column)"
				align="right"
				@clear="blurEvent(row, column)"
				clearable
			></vxe-input>
		</template>
		<template #rk_input_mpa="{ row, column }">
			{{ formatAmount(row[column.field]) }}
		</template>
		<template #rk_input_spa_edit="{ row, column }">
			<vxe-input
				v-model="row[column.field]"
				type="float"
				@blur="blurEvent(row, column)"
				@focus="focusEvent(row, column)"
				align="right"
				@clear="blurEvent(row, column)"
				clearable
			></vxe-input>
		</template>
		<template #rk_input_spa="{ row, column }">
			{{ formatAmount(row[column.field]) }}
		</template>
		<template #rk_input_opa_edit="{ row, column }">
			<vxe-input
				v-model="row[column.field]"
				type="float"
				@blur="blurEvent(row, column)"
				@focus="focusEvent(row, column)"
				align="right"
				@clear="blurEvent(row, column)"
				clearable
			></vxe-input>
		</template>
		<template #rk_input_opa="{ row, column }">
			{{ formatAmount(row[column.field]) }}
		</template>
	</rk-grid>
</template>

<script setup name="ProjectTzjhTable">
import RKUtils from '@/utils/rk-utils.js';
import { getCurrentInstance, onBeforeMount, onMounted, reactive } from 'vue';
import { FILL_FORM_TYPE_CONFIG } from '@/components/designer/cfg/rk-form-conf.js';

import { useProjectApi } from '@/api';
const { queryInvestPlanByProId } = useProjectApi();
// 向上触发的方法
const emits = defineEmits(['setFormItemValue']);
const loading = ref(false);
// 允许编辑的类型
const allowTypes = [FILL_FORM_TYPE_CONFIG.ADD.value, FILL_FORM_TYPE_CONFIG.EDIT.value];
const props = defineProps({
	// 组件的名称，用于组织插槽数据，提供给表单设计器以及渲染器（必须定义）
	title: { type: String, default: '投资计划表格' },
	// 表单数据信息
	formData: {
		type: Object,
		default: () => {
			return {
				proId: 'test',
			};
		},
	},
	formType: { type: String },
});
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
// 表格的模板引用
const rkGridRef = ref();

// ----- 表格相关操作
const defaultColumns = [
	{
		field: 'SET_YEAR',
		title: '年度',
		width: 120,
		align: 'left',
		editRender: { autofocus: '.el-input__inner' },
		slots: { edit: 'rk_select_year_edit' },
	},
	{
		field: 'YEAR_SUM_AMT',
		title: '年度总投资',
		width: 150,
		align: 'right',
		slots: { default: 'rk_input_ysa' },
	},
	{
		field: 'SUP_SUBS_PLAN_AMT',
		title: '上级补助资金-计划投资',
		width: 235,
		align: 'right',

		editRender: { autofocus: '.el-input__inner' },
		slots: { edit: 'rk_input_sspa_edit', default: 'rk_input_sspa' },
	},
	{
		field: 'BUDG_PLAN_AMT',
		title: '本级财政预算资金-计划投资',
		width: 235,
		align: 'right',
		editRender: { autofocus: '.el-input__inner' },
		slots: { edit: 'rk_input_bpa_edit', default: 'rk_input_bpa' },
	},
	{
		field: 'FINA_PLAN_AMT',
		title: '融资资金-计划投资',
		width: 235,
		align: 'right',
		editRender: { autofocus: '.el-input__inner' },
		slots: { edit: 'rk_input_fpa_edit', default: 'rk_input_fpa' },
	},
	{
		field: 'MARK_PLAN_AMT',
		title: '市场化融资资金-计划投资',
		width: 235,
		align: 'right',
		editRender: { autofocus: '.el-input__inner' },
		slots: { edit: 'rk_input_mpa_edit', default: 'rk_input_mpa' },
	},
	{
		field: 'SELF_PLAN_AMT',
		title: '单位自筹资金-计划投资',
		width: 235,
		align: 'right',
		editRender: { autofocus: '.el-input__inner' },
		slots: { edit: 'rk_input_spa_edit', default: 'rk_input_spa' },
	},
	{
		field: 'OTHER_PLAN_AMT',
		title: '其他资金-计划投资',
		width: 235,
		align: 'right',
		editRender: { autofocus: '.el-input__inner' },
		slots: { edit: 'rk_input_opa_edit', default: 'rk_input_opa' },
	},
];
const defaultData = {
	PLAN_ID: '',
	SET_YEAR: '',
	YEAR_SUM_AMT: 0,
	SUP_SUBS_PLAN_AMT: 0,
	BUDG_PLAN_AMT: 0,
	FINA_PLAN_AMT: 0,
	MARK_PLAN_AMT: 0,
	SELF_PLAN_AMT: 0,
	OTHER_PLAN_AMT: 0,
};
const initTzjhData = [
	{
		PLAN_ID: '',
		SET_YEAR: '',
		YEAR_SUM_AMT: 0,
		SUP_SUBS_PLAN_AMT: 0,
		BUDG_PLAN_AMT: 0,
		FINA_PLAN_AMT: 0,
		MARK_PLAN_AMT: 0,
		SELF_PLAN_AMT: 0,
		OTHER_PLAN_AMT: 0,
	},
];
const queryParam = reactive({
	map: void 0,
	proId: '',
});

const data = ref(initTzjhData);
const columns = ref(defaultColumns);

// ----- emits 方法定义
/**
 * 向上触发的方法，修改表单中的字段信息
 *
 * @param {String} fieldName 字段名称
 * @param {String} fieldValue 字段值
 */
const emitSetFormItemValue = function (fieldName, fieldValue) {
	emits('setFormItemValue', fieldName, fieldValue);
};

// ----- 获取组件数据
/**
 * 获取本次申报数据的方法，暴露给表单调用，固定名称getCompData
 */
const getCompData = function () {
	const { fullData } = rkGridRef.value.getTableData();
	return {
		pro_plan_grid: JSON.parse(JSON.stringify(fullData)),
	};
};

//处理新增行删除行
const handleOperation = async (buttonType, textName) => {
	if (buttonType === 'add') {
		const { row: newRow } = await rkGridRef.value.insertAt(defaultData);
		await rkGridRef.value.setEditCell(newRow, 'name');
	} else if (buttonType === 'delete') {
		const selectRows = rkGridRef.value.getCheckboxRecords();
		if (selectRows.length === 0 || !selectRows) {
			globalProxy.$message({ message: `请勾选要删除的数据！`, type: 'warning' });
			return;
		}
		rkGridRef.value.removeCheckboxRow();
	}
};

//失去焦点事件
const blurEvent = async (row, column) => {
	row.YEAR_SUM_AMT =
		(Number(row.SUP_SUBS_PLAN_AMT) || 0) +
		(Number(row.BUDG_PLAN_AMT) || 0) +
		(Number(row.FINA_PLAN_AMT) || 0) +
		(Number(row.MARK_PLAN_AMT) || 0) +
		(Number(row.SELF_PLAN_AMT) || 0) +
		(Number(row.OTHER_PLAN_AMT) || 0);
	row[column.field] = row[column.field] || 0;
	await rkGridRef.value.reloadRow(row);
	calculateTotalBudget();
};
const dateChangeEvent = async (value, row, column) => {
	// console.log(value, row, column)
	const { tableData } = rkGridRef.value.getTableData();
	let data = tableData.filter((item) => {
		return item[column.field] === row[column.field];
	});
	if (data && data.length > 1) {
		globalProxy.$message.warning('投资计划列表中”年度”不能相同');
		row[column.field] = null;
		await rkGridRef.value.reloadRow(row);
	}
};
const formatAmount = (cellValue) => {
	return RKUtils.formatAmount(cellValue, 2, true);
};
//计算项目总概算
const calculateTotalBudget = () => {
	const { tableData } = rkGridRef.value.getTableData();
	let totalBudget = 0;
	if (tableData) {
		tableData.forEach((item) => {
			totalBudget += Number(item['YEAR_SUM_AMT']);
		});
	}
	emitSetFormItemValue('TOTAL_BUDGET', totalBudget);
	emitSetFormItemValue('PRO_TOTAL_AMT', totalBudget);
};

const tzjhTabName = '投资计划';
const tzjhCheck = (tableData, formData) => {
	// console.log({ tableData, formData })
	let result = { valid: false, message: `${tzjhTabName}：校验不通过！` };
	if (tableData && tableData.length === 0) {
		result.message = `${tzjhTabName}：必须录入投资计划明细！`;
		return result;
	}
	for (let i in tableData) {
		let tableItem = tableData[i];
		// console.log('tableItem', tableItem)
		if (!tableItem.SET_YEAR) {
			result.message = `${tzjhTabName}：投资计划列表中“年度”不能为空！`;
			return result;
		}
		if (tableItem.YEAR_SUM_AMT <= 0) {
			result.message = `${tzjhTabName}：${tableItem.SET_YEAR}年投资计划年度总投资不能小于等于0！`;
			return result;
		}
	}
	const setYearLen = new Set(tableData.map((item) => item.SET_YEAR)).size;
	if (tableData.length > setYearLen) {
		result.message = `${tzjhTabName}：投资计划列表中"年度"不能相同`;
		return result;
	}
	result.valid = true;
	return result;
};

const validateData = function () {
	const { fullData } = rkGridRef.value.getTableData();
	let checkResult = tzjhCheck(fullData, props.formData);
	if (allowTypes.includes(props.formType)) {
		return {
			valid: checkResult.valid,
			message: checkResult.message,
		};
	} else {
		return {
			valid: true,
			message: '校验通过！',
		};
	}
};

//得到焦点事件
const focusEvent = (row, column) => {
	if (!row['SET_YEAR']) {
		globalProxy.$message({ message: `请填写投资计划列表中"年度"列！`, type: 'warning' });
	}
};
//请求初始化数据
onMounted(async () => {
	loading.value = true;
	const { proId } = props.formData;
	if (proId && props.formType !== FILL_FORM_TYPE_CONFIG.ADD.value) {
		queryParam.proId = proId;
		const res = await queryInvestPlanByProId(queryParam);
		if (res.code === 200) {
			data.value = res.data;
		}
	}
	loading.value = false;
});

onBeforeMount(() => {
	initEditDisable();
});

// 设置表格是否禁用编辑: 默认不禁用-false
const editDisable = ref(false);
const initEditDisable = () => {
	editDisable.value = !allowTypes.includes(props.formType);
};

defineExpose({
	getCompData,
	validateData,
});
</script>

<style lang="scss" scoped>
.full-size {
	position: absolute;
	width: calc(100% - 1px);
	height: calc(100% - 1px);
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 0 10px;
}

.bgc {
	background-color: #e6e6e6;
}

:deep(.vxe-input.type--float .vxe-input--inner) {
	padding-right: 1.8em !important;
}

:deep(.vxe-input.type--float .vxe-input--suffix.is--clear) {
	right: 0.2em !important;
}

:deep(.vxe-input.type--float .vxe-input--extra-suffix) {
	display: none !important;
}
</style>
