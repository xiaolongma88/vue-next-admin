<!--
 * @Author: lisong
 * @Date: 2023-04-17 16:22:20
 * @LastEditors: lisong
 * @LastEditTime: 2023-04-24 16:38:38
 * @Description: 项目评分
-->
<template>
	<rk-grid
		ref="rkGridRef"
		title=""
		keyField="pfbzId"
		:boxConfig="false"
		:seqConfig="false"
		:data="tableData"
		:columns="tableColumns"
		:rowConfig="{
			isHover: false,
			isCurrent: false,
		}"
		:editConfig="!editDisable"
		:spanMethod="mergeRowMethod"
		:pagerConfig="false"
		:showOverflow="false"
		:toolbarConfig="false"
	>
		<template #toolbar_title_buttons>
			<el-button type="primary" plain @click="handleInfo">获取数据</el-button>
		</template>
		<template #file_name_select="{ row, column }">
			<rk-tree-select
				v-model="row.fileId"
				v-model:label="row.fileName"
				:data="filesOptions"
				:props="{ label: 'fileName', value: 'fileId' }"
				:showCode="false"
				:fristNodeSelected="true"
			>
			</rk-tree-select>
		</template>
		<template #file_place_input="{ row, column }">
			<el-input-number v-model="row.filePlace" :min="1" clearable controls-position="right" />
		</template>
	</rk-grid>
</template>

<script setup name="ProjectReviewPanel">
import XEUtils from 'xe-utils';
import FormUtils from '@/components/designer/cfg/rk-form-utils.js';
import { FILL_FORM_TYPE_CONFIG } from '@/components/designer/cfg/rk-form-conf.js';
import { defAxios as request } from '@/utils/http';

// 向上触发的方法
const emits = defineEmits(['setFormItemValue']);
// 加载中
const loading = ref(false);
// props
const props = defineProps({
	// 组件的名称，用于组织插槽数据，提供给表单设计器以及渲染器（必须定义）
	title: { type: String, default: '项目评分表格' },
	// 表单数据信息
	formData: { type: Object, default: () => ({}) },
	// 表单类型：add|edit|view|yhs|atty|acct|finance
	formType: {
		type: String,
		default: 'view',
		validator(value) {
			return FormUtils.vaildateFormType(value);
		},
	},
	slotDataHouse: { type: Object, default: () => ({}) },
});

onBeforeMount(() => {
	initEditDisable();
	loadTableData();
});

// 设置表格是否禁用编辑: 默认不禁用-false
const editDisable = ref(false);
const initEditDisable = () => {
	const allowTypes = [FILL_FORM_TYPE_CONFIG.ADD.value, FILL_FORM_TYPE_CONFIG.EDIT.value, FILL_FORM_TYPE_CONFIG.STANDBY.value];
	editDisable.value = !allowTypes.includes(props.formType);
};

// 所在文件名称下拉选项
const filesOptions = ref([]);
// ----- 表单的插槽数据空间操作
watch(
	() => props.slotDataHouse.AttachmentPanel,
	(newValue, oldValue) => {
		if (XEUtils.isEmpty(newValue)) {
			filesOptions.value = [];
		} else {
			filesOptions.value = newValue;
		}
	},
	{ deep: true, immediate: true }
);

// ----- 表格相关操作
// 表格的模板引用
const rkGridRef = ref();
const tableColumns = ref([
	{ field: 'pfbzOrder', title: '序号', width: 75, align: 'center' },
	{ field: 'scoreType', title: '条目类型', width: 120, align: 'left', visible: false },
	{ field: 'entryLev1', title: '一级条目', width: 120, align: 'left' },
	{ field: 'entryLev2', title: '二级条目', width: 200, align: 'left' },
	{ field: 'reviewDesc', title: '评审内容', width: 350, align: 'left' },
	{ field: 'reviewStandard', title: '评审标准', width: 120, align: 'center' },
	{
		field: 'fileName',
		title: '所在文件名称',
		width: 200,
		align: 'left',
		className: 'gs-cell-bg',
		editRender: { autofocus: '.el-input__inner' },
		slots: { edit: 'file_name_select' },
	},
	{
		field: 'filePlace',
		title: '所在文件位置',
		width: 200,
		align: 'center',
		className: 'gs-cell-bg',
		editRender: { autofocus: '.el-input__inner' },
		slots: { edit: 'file_place_input' },
	},
	{ field: 'remark', title: '备注', width: 350, align: 'left' },
]);
const tableData = ref([]);
const loadTableData = () => {
	if (props.formType === FILL_FORM_TYPE_CONFIG.VIEW.value) {
		return;
	}
	loading.value = true;
	const { buttonCode } = props.formData;
	let queryParams = {};
	if (buttonCode === FILL_FORM_TYPE_CONFIG.ADD.value) {
		queryParams = {
			zjtxly: props.formData['FUND_INVEST_AREA_CODE'],
			zqlxId: props.formData['bondTypeCode'],
		};
	} else {
		queryParams = {
			applyId: props.formData.applyId,
		};
	}
	request({
		url: '/onlineReview/getDebtTZqglPfbzListByID',
		method: 'post',
		data: queryParams,
	})
		.then((res) => {
			const { code, data, msg } = res;
			tableData.value = data;
		})
		.finally(() => {
			loading.value = false;
		});
};
// 表格合计行
const mergeRowMethod = ({ row, _rowIndex, column, visibleData }) => {
	const fields = ['scoreType', 'entryLev1', 'entryLev2'];
	const cellValue = row[column.field];
	if (cellValue && fields.includes(column.field)) {
		const prevRow = visibleData[_rowIndex - 1];
		let nextRow = visibleData[_rowIndex + 1];
		if (prevRow && prevRow[column.field] === cellValue) {
			return { rowspan: 0, colspan: 0 };
		} else {
			let countRowspan = 1;
			while (nextRow && nextRow[column.field] === cellValue) {
				nextRow = visibleData[++countRowspan + _rowIndex];
			}
			if (countRowspan > 1) {
				return { rowspan: countRowspan, colspan: 1 };
			}
		}
	}
};

const handleInfo = () => {
	const { fullData } = rkGridRef.value.getTableData();
	// const flag = validateData()
	console.log('插槽数据空间中附件数据', props.slotDataHouse.AttachmentPanel);
	console.log('当前页面表格数据', JSON.parse(JSON.stringify(fullData)));
	// console.log('校验页面表格数据', flag)
	console.log('getCompData', getCompData());
};

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
 * 获取投资计划数据的方法，暴露给表单调用，固定名称getCompData
 */
const getCompData = function () {
	const { fullData } = rkGridRef.value.getTableData();
	return {
		reviewApply_data: JSON.parse(JSON.stringify(fullData)),
	};
};
/**
 * 校验表格数据
 */
const validateData = function () {
	const { fullData } = rkGridRef.value.getTableData();
	let flag = true;
	fullData.some((item) => {
		const { fileId, filePlace } = item;
		if (!fileId && !filePlace) {
			flag = false;
			return;
		}
	});
	return {
		valid: flag,
		message: '项目评分：评分项文件名称不能为空！',
	};
};

defineExpose({
	getCompData,
	validateData,
});
</script>

<style lang="scss" scoped>
:deep(.gs-cell-bg) {
	background-color: #ffe850;
}
</style>
