<template>
  <div>
    <rk-grid
      ref="vformRef"
      title="无数据代理表格"
      boxConfig
      keyField="applyId"
      :rowConfig="{ isHover: true, isCurrent: false }"
      :checkboxConfig="{
        reserve: true,
        checkMethod: ({ row }) => {
          return !selectApplyIds.includes(row.applyId)
        },
        checkRowKeys: selectApplyIds,
      }"
      :rowClassName="({ row, rowIndex, $rowIndex }) => {
        return selectApplyIds.includes(row.applyId) ? 'checked-row-item' : ''
      }"
      :data="tableData"
      :columns="tableColumns"
      :height="500"
    >
    <template #pager>
      <vxe-pager
        v-bind="RkGridConfig.pagerConfig"
        v-model:current-page="tablePage.currentPage"
        v-model:page-size="tablePage.pageSize"
        :total="tablePage.total"
        @page-change="handlePageChange">
      </vxe-pager>
    </template>
  </rk-grid>
  </div>
</template>

<script setup name="CheckboxTableView">
// import { defAxios as request } from '@/utils/http'
import request from '/@/utils/request';
import RkGridConfig from '@/components/table/config/grid-config.js'

const selectApplyIds = ref([
  'FB26C4F4728525F7E050007F01003F35',
  'FB26C4F4728925F7E050007F01003F35'
])


const tableData = ref([])
const tablePage = reactive({
  currentPage: 1,
  pageSize: 15,
  total: 0
})
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

const getTableData = function () {
  request({
    url: '/reviewtask/notAssignApplyPage',
    method: 'POST',
    data: {
      page: tablePage.currentPage,
      pageSize: tablePage.pageSize,
      adCode: '2300'
    }
  }).then(res => {
    // console.log('res', res)
    const { code, data, msg } = res
    tablePage.total = data.records
    tableData.value = data.rows
  })
}
const handlePageChange = function ({ currentPage, pageSize }) {
  tablePage.currentPage = currentPage
  tablePage.pageSize = pageSize
  getTableData()
}

getTableData()
</script>

<style lang="scss" scoped>
:deep(.checked-row-item) {
  // color: #BFBFBF;
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>