<template>
	<div class="app-container">
		<div class="VFormTable-container">
			<rk-grid
				ref="vformRef"
				:data="SzysTableData"
				:toolbarConfig="true"
				:pagerConfig="false"
				:editConfig="true"
				:keepSource="false"
				:columns="columns"
				@edit-closed="handleEditClose"
			>
				<template #toolbar_buttons>
					<el-button type="primary" plain @click="handleAdd">添加</el-button>
					<el-button type="danger" plain @click="handleDelete">删除</el-button>
					<el-button type="primary" plain @click="getTableData">获取数据</el-button>
				</template>
				<template #toolbar_tools>
					<el-input v-model="vformParams.keyWords" placeholder="请输入名称/编码" class="vform-table-search" style="width: 250px" clearable>
					</el-input>
					<el-button type="primary" plain @click="getUpdateData">查询</el-button>
				</template>
				<template #rk_input_edit="{ row, column }">
					<!-- <el-input placeholder="请输入内容"
            class="rk_input_edit"
            clearable
            v-model="row[column.field]" /> -->
					<rk-select dist="DEBT_ZGBM" :labelConfig="{ value: 'id' }" :labelFormat="labelFormat" />
				</template>
				<template #rk_time_edit="{ row, column }">
					<!-- <el-date-picker style="width: 100%;"
            v-model="row[column.field]"
            valueFormat="YYYY-MM-DD" /> -->
					<rk-tree-select dist="DEBT_ZWXMLX" v-model="row[column.field]"> </rk-tree-select>
				</template>
			</rk-grid>
		</div>
	</div>
</template>
<script setup name="EditTable">
import SzysTableData from '@/mock/SzysTableData.json';

const labelFormat = (item) => {
	return `${item.code}-${item.name}`;
};
const labelFunc = (data) => {
	return `${data.code}  ${data.name}`;
};

const columns = ref([
	{ field: 'BAL_TYPE_NAME', title: '收支类别', width: 200, align: 'left' },
	{ field: 'BAL_FORMULA', title: '公式', width: 160, align: 'left' },
	{
		field: 'TOTAL',
		title: '合计',
		width: 300,
		sortable: false,
		children: [
			{
				field: 'SRAMT_Y',
				title: '收入',
				width: 150,
				align: 'right',
				formatter: ['formatAmountBit'],
				editRender: { autofocus: '.el-input__inner' },
				slots: { edit: 'rk_input_edit' },
			},
			{
				field: 'ZCAMT_Y',
				title: '支出',
				width: 150,
				align: 'right',
				formatter: ['formatAmountBit'],
				editRender: { autofocus: '.el-input__inner' },
				slots: { edit: 'rk_time_edit' },
			},
		],
	},
]);

import { ref, reactive } from 'vue';
const vformRef = ref('');
const vformParams = reactive({
	keyWords: undefined,
	status: undefined,
});

//添加行
const handleAdd = async () => {
	const record = {
		name: '新增项目',
	};
	const { row: newRow } = await vformRef.value.insertAt(record);
	await vformRef.value.setEditCell(newRow, 'name');
};

//编辑关闭
const handleEditClose = ({ column }) => {
	const { tableData } = vformRef.value.getTableData();
	console.log(tableData);
};

//删除行
const handleDelete = ({ column }) => {
	vformRef.value.removeCheckboxRow();
};

//获取被修改的数据
const getUpdateData = () => {
	//keepSource开启有效
	const updateRecords = vformRef.value.getUpdateRecords();
	//删除行
	const removeRecords = vformRef.value.getRemoveRecords();
	console.log(updateRecords);
};

/**
 * 获取表格数据
 */
const getTableData = () => {
	const { fullData } = vformRef.value.getTableData();
	console.log('fullData', fullData);
};
</script>
<style lang="scss" scoped>
.operation-box {
	display: flex;
	justify-content: space-around;
}

.VFormTable-container {
	height: 100%;
	padding-left: 8px;
	padding-right: 8px;
}

.vform-table-search {
	margin-right: 15px;
}
</style>
