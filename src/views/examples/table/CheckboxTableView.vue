<template>
  <div>
    <rk-grid
      ref="vformRef"
      title="复选框表格"
      dataUrl="/reviewtask/notAssignApplyPage"
      boxConfig
      keyField="applyId"
      :rowConfig="{
        isHover: true,
        isCurrent: false
      }"
      :checkboxConfig="{
        reserve: true,
        checkMethod: ({ row }) => {
          return !selectApplyIds.includes(row.applyId)
        },
        checkRowKeys: selectApplyIds,
         // visibleMethod: ({ row }) => {
        //   return !selectApplyIds.includes(row.applyId)
        // },
      }"
      :rowClassName="({ row, rowIndex, $rowIndex }) => {
        return selectApplyIds.includes(row.applyId) ? 'checked-row-item' : ''
      }"
      :params="{ adCode: '2300' }"
      :columns="tableColumns"
      :height="500"
    >
      <template #toolbar_title_buttons>
        <span></span>
      </template>
    </rk-grid>
    <rk-grid
      ref="vformRef"
      title="复选框表格"
      dataUrl="/reviewtask/notAssignApplyPage"
      keyField="applyId"
      :boxConfig="{ mode: 'radio' , fixed: true }"
      :params="{ adCode: '2300' }"
      :columns="tableColumns"
      :height="500"
    >
      <template #toolbar_title_buttons>
        <span></span>
      </template>
    </rk-grid>
  </div>
</template>

<script setup name="CheckboxTableView">

const selectApplyIds = ref([
  'FB26C4F4728525F7E050007F01003F35',
  'FB26C4F4728925F7E050007F01003F35'
])

const tableColumns = ref([
  { field: 'adName', title: '地区', width: 250, align: 'left', },
  {
    field: 'agencyName', title: '单位名称', width: 250, align: 'left',
  },
  { field: 'proCode', title: '项目编码', width: 250, align: 'left', },
  { field: 'proName', title: '项目名称', width: 250, align: 'left', },
  { field: 'setupYear', title: '立项年度', width: 120, align: 'center', },
  { field: 'fundInvestAreaName', title: '资金投向领域', width: 250, align: 'left', },
  { field: 'startDate', title: '开工日期', width: 120, align: 'center', },
  { field: 'endDate', title: '竣工日期', width: 120, align: 'center', },
  {
    field: 'applyAmt',
    title: '申报金额',
    formatter: 'formatThousand',
    width: 200,
    sumable: true,
    align: 'right'
  },
  {
    field: 'totalBudget',
    title: '项目总概算',
    formatter: 'formatThousand',
    width: 200,
    sumable: true,
    align: 'right'
  },
  {
    field: 'proCapital',
    title: '项目资本金',
    formatter: 'formatThousand',
    width: 200,
    sumable: true,
    align: 'right'
  },
  { field: 'remark', title: '备注', width: 250, align: 'left', },
])
</script>

<style lang="scss" scoped>
:deep(.checked-row-item) {
  // color: #BFBFBF;
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>