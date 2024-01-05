<!--
 * @Author: ljc
 * @Date: 2023-04-25 15:00:24
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-26 19:19:24
 * @Description: 储备项目上报
-->

<template>
  <RkContainer :isFooter="false"
    :isAside="isAside">
    <template #header_left>
      <RkButtonGroup :options="json_sb_button"
        v-model="queryParams.wfStatus"
        @click="handleSearch" />
    </template>
    <template #header_right>
      <template v-if="queryParams.wfStatus=== '001' || queryParams.wfStatus=== '004' ">
        <el-button type="primary"
          @click="handleOperation('send','上报', 0)">上报</el-button>
      </template>
      <template v-if="queryParams.wfStatus==='002'">
        <el-button type="danger"
          @click="handleOperation('cancle','撤销', 1)">撤销上报</el-button>
      </template>
      <el-button @click="handleOpenRecord">操作记录</el-button>
    </template>
    <template #aside>
      <RkAdAgTree :agTreeHidden="true"
        @adNodeClick="handleAdNodeClick"
        @toggleHidden="(hidden) => isAside = !hidden" />
    </template>
    <template #main>
      <rk-center>
        <template #content>
          <rk-grid ref="reserveProjRef"
            title="储备项目上报"
            dataUrl="/proResApply/reserveProjectPage"
            boxConfig
            :params="queryParams"
            :columns="tableColumns"
            :footerConfig="{
              showFooter:true,
              footerParams:['applyAmt','proCapital','totalBudget']
            }">
            <template #toolbar_title_buttons>
              <el-form-item label="单位"
                style="margin: 0 10px">
                <rk-select style="width: 80px;height: 30px"
                  :isSearch="false"
                  :options="toArray(COMMON_AMOUNT_UNIT)"
                  v-model="queryParams.dw"
                  @change="handleSearch"></rk-select>
              </el-form-item>
              <el-date-picker v-model="queryParams.reportYear"
                placeholder="请选择申报年度"
                clearable
                type="year"
                format="YYYY"
                value-format="YYYY"
                @change="handleSearch" />
            </template>
            <template #status="{ row }">
              <el-tag :type="COMMON_STOP_OPEN_ENUMS.options[row.status].tagType"
                class="mx-1"
                effect="plain">
                {{ COMMON_STOP_OPEN_ENUMS.options[row.status].echo }}
              </el-tag>
            </template>
          </rk-grid>
        </template>
      </rk-center>
    </template>
    <OperationLog ref="OperationLogRef"
      :isNote="isNote"
      :title="logTitle" />
  </RkContainer>
</template>
  
  <script setup >
import { json_sb_button } from '@/common/button-data.js'
import { COMMON_STOP_OPEN_ENUMS, toArray, COMMON_AMOUNT_UNIT } from '@/enums/enums-common.js'
import { WF_TASK_SEND_AUDIT, WF_TASK_AUDIT, WF_TASK_CANCEL, WF_TASK_BACK } from '@/common/cons-common.js'
import { RkConfirmBox } from '@/components/message-box/index.js'
import { useProjectApi } from '@/api/index'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/modules';
import XEUtils from 'xe-utils'
import { ElLoading } from "element-plus"

const { reserveProHandleTask }  = useProjectApi();
const OperationLogRef = ref(null)
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
const reserveProjRef = ref('')
const isNote = ref(false)
const logTitle = ref('操作记录')
let route = useRoute()
const userStore = useUserStore();
// 查询参数
let queryParams = reactive({
  wfStatus: route.query.wfStatus ?? '001',
  processKey: route.query.processKey,
  status: undefined,
  bondTypeCode: undefined,
  nodeId: route.query.nodeId,
  adCode: userStore.userInfo.adCode,
  agCode: undefined,
  agId: undefined,
  reportYear: undefined,
  mhcx: undefined,
  dw: 2,
  selectType: 1
})
let isAside = ref(false)
const tableColumns = ref([
  { field: 'agencyName', title: '申报单位', width: 180, align: 'left', },
  {
    field: 'proName',
    title: '项目名称',
    width: 250,
    align: 'left',
    // 关键代码
    cellRender: { name: 'xmYHS' }
  },
  { field: 'proCode', title: '项目编码', width: 200, align: 'left', },
  { field: 'fiscalYear', title: '年度', width: 120, align: 'center', },
  { field: 'debtDeadlineName', title: '债券期限', width: 130, align: 'center', },
  {
    field: 'applyAmt',
    title: '申请金额',
    formatter: 'formatThousand',
    width: 150,
    sumable: true,
    align: 'right'
  },
  {
    field: 'expFuncName', title: '支出功能分类', width: 200, align: 'left'
  },
  {
    field: 'govBgtEcoName', title: '政府预算支出经济分类', width: 250, align: 'left'
  },
  {
    field: 'depBgtEcoName', title: '部门预算支出经济分类', width: 250, align: 'left'
  },
  {
    field: 'proCapital',
    title: '项目资本金',
    formatter: 'formatThousand',
    width: 150,
    align: 'right'
  },
  {
    field: 'bondTypeName', title: '申请类型', width: 150, align: 'center',
  },
  { field: 'applyDate', title: '申报日期', width: 120, align: 'center' },
  { field: 'setupYear', title: '立项年度', width: 100, align: 'center' },
  { field: 'proTypeName', title: '项目类型', width: 150, align: 'left' },
  { field: 'fundInvestAreaName', title: '资金投向领域', width: 200, align: 'left' },
  {
    field: 'totalBudget',
    title: '项目总概算',
    formatter: 'formatThousand',
    width: 150,
    align: 'right'
  },
  { field: 'proStatusName', title: '建设状态', width: 120, align: 'left' },
  { field: 'startDate', title: '开工日期', width: 120, align: 'center' },
  { field: 'endDate', title: '竣工日期', width: 120, align: 'center' },
  { field: 'remark', title: '备注', width: 120, align: 'left' },
])
// 左侧树点击
const handleAdNodeClick = (data) => {
  const { id, code, name, parentId, leaf } = data
  queryParams.agId = id
  queryParams.adCode = code
  handleSearch()
}
/**查询 */
const handleSearch = () => {
  reserveProjRef.value.searchEvent()
}
//上报、撤销上报、删除
const handleOperation = async (buttonType, textName) => {
  const seleRows = reserveProjRef.value.getCheckboxRecords()
  if (seleRows.length == 0 || !seleRows) {
    globalProxy.$message({ message: `请至少选择一条数据进行${textName}！`, type: "warning" });
    return;
  }
  RkConfirmBox({
    title: '提示',
    content: `您确定要${textName}吗？`,
    onSubmit: async function () {
      //获取选中数据
      const ProId = []
      const TaskId = []
      const ApplyId = []
      seleRows.forEach(element => {
        ProId.push(element.proId)
        TaskId.push(element.taskId)
        ApplyId.push(element.applyId)
      });
      const proIds = ProId.join(',')
      const taskIds = TaskId.join(',')
      const applyIds = ApplyId.join(',')

      const loading = ElLoading.service({ fullscreen: true, text: `${textName}中,请稍等...` })
      if (buttonType == 'send') { //上报
        //获取选中数据
        const ProId = []
        const TaskId = []
        const ApplyId = []
        seleRows.forEach(element => {
          ProId.push(element.proId)
          TaskId.push(element.taskId)
          ApplyId.push(element.applyId)
        });
        const proIds = ProId.join(',')
        const taskIds = TaskId.join(',')
        const applyIds = ApplyId.join(',')
        const params = { applyIds, taskIds, proIds, nodeId: queryParams.nodeId, taskType: WF_TASK_AUDIT.value }
        const result = await reserveProHandleTask(params)
        const { data, code, msg } = result
        if (code === 200) {
          globalProxy.$message({ message: `${textName}成功！`, type: "success" });
          loading.close()
          handleSearch()
        } else {
          loading.close()
          globalProxy.$message({ message: `${msg}`, type: "error" });
        }
      } else if (buttonType == 'cancle') { //撤销
        const params = { applyIds, taskIds, proIds, nodeId: queryParams.nodeId, taskType: WF_TASK_CANCEL.value }
        const result = await reserveProHandleTask(params)
        const { data, code, msg } = result
        if (code === 200) {
          loading.close()
          globalProxy.$message({ message: `${textName}成功！`, type: "success" });
          handleSearch()
        } else {
          loading.close()
          globalProxy.$message({ message: `${msg}`, type: "error" });
        }
      }
    },
    onCancel: function () {
    }
  })
}
//操作记录
const handleOpenRecord = () => {
  const seleRows = reserveProjRef.value.getCheckboxRecords()
  if (seleRows.length == 0 || !seleRows || seleRows.length > 1) {
    globalProxy.$message({ message: "请选择一条数据！", type: "warning" });
    return;
  }
  let applyId = ''
  seleRows.forEach(element => {
    applyId = element.applyId
  });
  OperationLogRef.value.handleOpen(applyId)
}
  </script>
  <style lang="scss" scoped>
.w-200px {
	width: 200px;
}
</style>
  