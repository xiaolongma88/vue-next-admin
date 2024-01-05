<!--
 * @Author: ljc
 * @Date: 2023-04-25 15:00:24
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-27 11:00:54
 * @Description: 备选项目下级审核
-->
<template>
  <RkContainer :isFooter="false"
    :isAside="isAside">
    <template #header_left>
      <RkButtonGroup :options="json_xjshs_button"
        v-model="queryParams.wfStatus"
        @click="handleSearch" />
    </template>
    <template #header_right>
      <template v-if="queryParams.wfStatus=== '001'">
        <el-button type="primary"
          @click="handleOperation('audit','审核')">审核</el-button>
        <el-button @click="handleOperation('back','退回')">退回</el-button>
      </template>
      <template v-else-if="queryParams.wfStatus=== '002'">
        <el-button type="danger"
          @click="handleOperation('cancle','撤销审核')">撤销审核</el-button>
      </template>
      <el-button @click="handleOpenRecord()">操作记录</el-button>
      <el-button v-if="!showCondition"
        @click="showCondition=true">展开条件</el-button>
      <el-button v-else
        @click="showCondition=false">收起条件</el-button>
    </template>
    <template #aside>
      <RkAdAgTree :agTreeHidden="true"
        @adNodeClick="handleAdNodeClick"
        @toggleHidden="(hidden) => isAside = !hidden" />
    </template>
    <template #main>
      <rk-center>
        <template #condition>
          <rk-center-bar v-show="showCondition">
            <template #content>
              <el-form ref="form"
                :inline="true">
                <el-form-item label="申报年度">
                  <el-date-picker v-model="queryParams.reportYear"
                    placeholder="请选择申报年度"
                    clearable
                    format="YYYY"
                    value-format="YYYY"
                    type="year" />
                </el-form-item>
                <el-form-item label="债券类型">
                  <rk-tree-select enum="BOND_TYPE_ENUMS"
                    :filterable="false"
                    :showCode="false"
                    placeholder="请选择债券类型"
                    v-model="queryParams.bondTypeCode">
                  </rk-tree-select>
                </el-form-item>
              </el-form>
            </template>
            <template #buttons>
              <el-button type="primary"
                @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </template>
          </rk-center-bar>
        </template>
        <template #content>
          <rk-grid ref="standbyBelowProjAuditViewRef"
            title="备选项目下级审核"
            dataUrl="/proAltApply/page"
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
              <el-input v-model="queryParams.mhcx"
                placeholder="请输入申报单位/名称"
                class="w-200px"
                clearable
                @input="handleSearch">
              </el-input>
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
    <reserve-proj-note-dialog ref="reserveProjNoteDialogRef"
      :ok="dialogOkClick"
      :visible="noteVisible"></reserve-proj-note-dialog>
  </RkContainer>
</template>

<script setup >
import { json_xjshs_button } from '@/common/button-data.js'
import { COMMON_STOP_OPEN_ENUMS, COMMON_AMOUNT_UNIT, toArray } from '@/enums/enums-common.js'
import { WF_TASK_SEND_AUDIT, WF_TASK_AUDIT, WF_TASK_CANCEL, WF_TASK_BACK } from '@/common/cons-common.js'
import { reactive } from 'vue'
import { RkConfirmBox } from '@/components/message-box/index.js'
import { useRoute } from 'vue-router'
import XEUtils from 'xe-utils'
import ReserveProjNoteDialog from '../dialogs/ProjNoteDialog.vue'
import { ElLoading } from "element-plus"
import { useProjectApi } from '@/api/index'

const { standProHandleTask } = useProjectApi();
const reserveProjNoteDialogRef = ref(null)
const showCondition = ref(false)
const OperationLogRef = ref(null)
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
const standbyBelowProjAuditViewRef = ref(null)
const isNote = ref(false)
const logTitle = ref('操作记录')
let route = useRoute()
// 查询参数
let queryParams = reactive({
  wfStatus: route.query.wfStatus ?? '001',
  processKey: route.query.processKey,
  status: undefined,
  bondTypeCode: undefined,
  nodeId: route.query.nodeId,
  adCode: undefined,
  agCode: undefined,
  agId: undefined,
  reportYear: undefined,
  mhcx: undefined,
  dw: 2,
  selectType: 1
})
let auditParams = {

}
let isAside = ref(false)
const noteVisible = ref(false)
const tableColumns = ref([
  { field: 'agencyName', title: '申报单位', width: 180, align: 'left', },
  { field: 'sortId', title: '重点项目排序号', width: 150, align: 'center', visible: queryParams.nodeId === 'node_6' ? true : false },
  {
    field: 'proName',
    title: '项目名称',
    width: 250,
    align: 'left',
    // 关键代码
    cellRender: { name: 'stXmYHS' }
  },
  { field: 'proCode', title: '项目编码', width: 200, align: 'left', },
  { field: 'fiscalYear', title: '年度', width: 120, align: 'center', },
  { field: 'debtDeadlineName', title: '债券期限', width: 130, align: 'center', },
  {
    field: 'applyAmt',
    title: '申请金额',
    formatter: 'formatThousand',
    width: 150,
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
    field: 'bondTypeName', title: '申请类型', width: 150, align: 'center'
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
  standbyBelowProjAuditViewRef.value.searchEvent()
}
/**重置 */
const handleReset = () => {
  const wfStatus = queryParams.wfStatus
  queryParams.reportYear = undefined
  queryParams.bondTypeCode = undefined
  const params = standbyBelowProjAuditViewRef.value.resetEvent(queryParams)
  Object.assign(queryParams, params)
  queryParams.wfStatus = wfStatus
}
//送审、撤销送审、删除
const handleOperation = async (buttonType, textName, buttonStatus) => {
  const seleRows = standbyBelowProjAuditViewRef.value.getCheckboxRecords()
  if (seleRows.length == 0 || !seleRows) {
    globalProxy.$message({ message: `请至少选择一条数据进行${textName}！`, type: "warning" });
    return;
  }
  if (buttonType === 'audit') { //审核
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
    const params = { applyIds, taskIds, proIds, nodeId: queryParams.nodeId, taskType: WF_TASK_AUDIT.value, }
    auditParams = params
    noteVisible.value = true
  } else {
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
        if (buttonType == 'back') { //退回
          const params = { applyIds, taskIds, proIds, nodeId: queryParams.nodeId, taskType: WF_TASK_BACK.value }
          const result = await standProHandleTask(params)
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
        if (buttonType == 'cancle') { //取消
          const params = { applyIds, taskIds, proIds, nodeId: queryParams.nodeId, taskType: WF_TASK_CANCEL.value }
          const result = await standProHandleTask(params)
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
}
/**
 * 审核
 * @param note
 */
const dialogOkClick = async (note) => {
  auditParams.note = note
  const loading = ElLoading.service({ fullscreen: true, text: `审核中,请稍等...` })
  const result = await standProHandleTask(auditParams)
  const { data, code, msg } = result
  if (code === 200) {
    loading.close()
    globalProxy.$message({ message: `审核成功！`, type: "success" });
    noteVisible.value = false
    handleSearch()
  } else {
    loading.close()
    globalProxy.$message({ message: `${msg}`, type: "error" });
    noteVisible.value = false
  }
}
//操作记录
const handleOpenRecord = () => {
  const seleRows = standbyBelowProjAuditViewRef.value.getCheckboxRecords()
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
