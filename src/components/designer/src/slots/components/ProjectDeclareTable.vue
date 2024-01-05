<!--
 * @Author: lisong
 * @Date: 2023-04-17 16:22:20
 * @LastEditors: lisong
 * @LastEditTime: 2023-04-24 16:38:38
 * @Description: 申报列表
-->
<template>
	<rk-grid
		ref="rkGridRef"
		title=""
		dataUrl="/proAltApply/queryAlternateProjectSqjl"
		:boxConfig="false"
		:seqConfig="true"
		:params="queryParams"
		:columns="tableColumns"
		:pagerConfig="false"
		:toolbarConfig="false"
	>
	</rk-grid>
</template>

<script setup name="ProjectDeclareTable">
// 向上触发的方法
const emits = defineEmits(['setFormItemValue']);
const loading = ref(false);

const props = defineProps({
	// 组件的名称，用于组织插槽数据，提供给表单设计器以及渲染器（必须定义）
	title: { type: String, default: '项目申报记录' },
	// 表单数据信息
	formData: { type: Object, default: () => ({}) },
	// 业务ID
	busiId: { type: [String], default: '' },
});

// ----- 表格相关操作
// 表格的模板引用
const rkGridRef = ref();
// 表格的查询参数
const queryParams = ref({
	proId: props.formData.proId,
});
// 表格的数据字段
const tableColumns = ref([
	{ field: 'agencyName', title: '申报单位', width: 250, align: 'left' },
	{ field: 'proName', title: '项目名称', width: 310, align: 'left' },
	{ field: 'proCode', title: '项目编码', width: 150, align: 'left' },
	{ field: 'fiscalYear', title: '年度', width: 100, align: 'left' },
	{ field: 'bondTypeName', title: '申请类型', width: 100, align: 'left' },
	{ field: 'applyAmt', title: '申请金额(万元)', width: 150, align: 'center', formatter: 'formatThousand' },
	{ field: 'applyDate', title: '申报日期', width: 120, align: 'left' },
	{ field: 'setupYear', title: '立项年度', width: 100, align: 'left' },
	{ field: 'proTypeName', title: '项目类型', width: 150, align: 'left' },
	{ field: 'totalBudget', title: '项目总概算', width: 150, align: 'left', formatter: 'formatThousand' },
	{ field: 'startDate', title: '开工日期', width: 150, align: 'left' },
	{ field: 'endDate', title: '竣工日期', width: 150, align: 'left' },
	{ field: 'proStatusName', title: '建设状态', width: 150, align: 'left' },
	// { field: 'Field2', title: '上报审核意见', width: 150, align: 'left' },
	// { field: 'Field3', title: '状态', width: 150, align: 'left' },
	// { field: 'Field4', title: '备注', width: 150, align: 'left' },
]);

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

defineExpose({
	// getCompData
});
</script>

<style lang="scss" scoped>
:deep(.gs-cell-bg) {
	background-color: #e6e6e6;
}
</style>
