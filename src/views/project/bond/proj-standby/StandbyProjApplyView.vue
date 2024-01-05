
<!--
 * @Author: ljc
 * @Date: 2023-04-25 15:00:24
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-27 10:32:28
 * @Description: 备选项目申报
-->

<template>
  <RkContainer :isFooter="false"
    :isAside="isAside">
    <template #header_left>
      <RkButtonGroup :options="json_jb_button"
        v-model="queryParams.wfStatus"
        @click="handleSearch" />
    </template>
    <template #header_right>
      <el-button v-if="queryParams.wfStatus=='001'"
        @click="handelEdit('add')">添加项目</el-button>
      <el-button v-if="queryParams.wfStatus=='001' || queryParams.wfStatus=='004'"
        @click="handelEdit('edit')">修改</el-button>
      <el-button v-if="queryParams.wfStatus=='001' || queryParams.wfStatus=='004'"
        type="danger"
        @click="handleOperation('delete', '删除')">删除</el-button>
      <el-button v-if="queryParams.wfStatus=='001' || queryParams.wfStatus=='004'"
        type="primary"
        @click="handleOperation('send','送审')">送审</el-button>
      <el-button v-if="queryParams.wfStatus=='002'"
        type="danger"
        @click="handleOperation('cancle','撤销送审')">撤销送审</el-button>
      <el-button @click="handleOpenRecord">操作记录</el-button>
    </template>
    <template #aside>
      <RkAdAgTree :adTreeHidden="true"
        @agNodeClick="handleAgNodeClick"
        @agCurrentChange='handleAgNodeChange'
        @toggleHidden="(hidden) => isAside = !hidden" />
    </template>
    <template #main>
      <rk-center>
        <template #content>
          <rk-grid ref="standbyProjApplyViewRef"
            title="备选项目申报"
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
    <OperationLog ref="OperationLogRef" />
    <standby-proj-apply-dialog ref="standbyProjApplyDialogRef"
      @refresh="handleSearch"></standby-proj-apply-dialog>
    <ReserveProjDialog ref="standbyProjDialogRef"
      type="standby"
      :formCode="$route.query.formCode"
      :processKey="$route.query.processKey"
      @refresh="handleRefresh" />
  </RkContainer>
</template>
  <script setup >
import { json_jb_button } from '@/common/button-data.js'
import { COMMON_STOP_OPEN_ENUMS, COMMON_AMOUNT_UNIT, toArray } from '@/enums/enums-common.js'
import { WF_TASK_SEND_AUDIT, WF_TASK_AUDIT, WF_TASK_CANCEL, WF_TASK_BACK } from '@/common/cons-common.js'
import { RkConfirmBox } from '@/components/message-box/index.js'
import StandbyProjApplyDialog from '../dialogs/StandbyProjApplyDialog.vue'
import { useRoute } from 'vue-router'
import { ReserveProjDialog } from '@/components/dialog';
import { FILL_PROJ_FORM_CONFIG } from '@/components/designer/cfg/rk-form-conf.js'
import { useUserStore } from '@/stores/modules';
import XEUtils from 'xe-utils'
import { ElLoading } from "element-plus"
import { useProjectApi } from '@/api/index'

const { standProHandleTask, deleteAlternateProject } = useProjectApi();
const OperationLogRef = ref(null)
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
const standbyProjApplyViewRef = ref(null)
const standbyProjApplyDialogRef = ref(null)
let isAside = ref(false)
let leaf = ref(false)
const userStore = useUserStore();
let route = useRoute()
// 查询参数
let queryParams = reactive({
  wfStatus: route.query.wfStatus ?? '001',
  processKey: route.query.processKey,
  status: undefined,
  bondTypeCode: undefined,
  nodeId: route.query.nodeId,
  adCode: userStore.userInfo.adBjCode,
  agCode: userStore.userInfo.agCode,
  agId: userStore.userInfo.agId,
  reportYear: undefined,
  mhcx: undefined,
  dw: 2,
})
const processKey = ref(null)
processKey.value = queryParams.processKey
const standbyProjDialogRef = ref(null)
// 储备项目ID
const selectProId = ref('')
// 基本信息
const baseInfo = reactive({
  // 选中项目ID
  proId: undefined,
  // 选中区划编码
  adCode: undefined,
  // 单位ID
  agId: undefined,
  // 选中单位编码
  agCode: undefined,
  // 单位名称
  agName: undefined,
  // 项目来源：1：基础库 2：储备库 3:需求库 4：历史项目 5、一体化同步项目 6、存量债务无项目生成项目
  proSource: undefined,
  applyId: undefined,
  processKey: undefined
})
const tableColumns = ref([
  { field: 'agencyName', title: '申报单位', width: 180, align: 'left', },
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
const handleAgNodeClick = (data) => {
  const { id, code, name, parentId, leaf: isLeaf } = data
  queryParams.agId = id
  queryParams.agCode = code
  leaf.value = isLeaf
  handleSearch()
}
// 树节点选中变化触发
const handleAgNodeChange = (data, treeNode) => {
  const { id, code, name, parentId, leaf: isLeaf } = data
  // 叶子节点
  leaf.value = isLeaf
  if (!code) {
    // 查询参数赋值
    queryParams.agId = userStore.userInfo.agId
    queryParams.agCode = userStore.userInfo.agCode
  } else {
    // 查询参数赋值
    queryParams.agId = id
    queryParams.agCode = code
  }
}

/**查询 */
const handleSearch = () => {
  standbyProjApplyViewRef.value.searchEvent()
}
//送审、撤销送审、删除
const handleOperation = async (buttonType, textName, buttonStatus) => {
  const seleRows = standbyProjApplyViewRef.value.getCheckboxRecords()
  if (seleRows.length == 0 || !seleRows) {
    globalProxy.$message({ message: `请至少选择一条数据进行${textName}！`, type: "warning" });
    return;
  }
  if (buttonType == 'edit') { //修改
  } else if (buttonType == 'send') { //送审
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
    const params = { applyIds, taskIds, proIds, nodeId: queryParams.nodeId, taskType: WF_TASK_SEND_AUDIT.value }
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
        if (buttonType == 'delete') {  //删除
          const params = { applyIds, taskIds, proIds }
          const result = await deleteAlternateProject(params)
          const { data, code, msg } = result
          if (code === 200) {
            loading.close()
            globalProxy.$message({ message: `${textName}成功！`, type: "success" });
            handleSearch()
          } else {
            loading.close()
            globalProxy.$message({ message: `${msg}`, type: "error" });
          }
        } else if (buttonType == 'cancle') { //撤销
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
//操作记录
const handleOpenRecord = () => {
  const seleRows = standbyProjApplyViewRef.value.getCheckboxRecords()
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

//新增项目
const handelEdit = (type) => {
  const params = {
    adCode: queryParams.adCode,
    agCode: queryParams.agCode,
    processKey: queryParams.processKey
  }
  if (type == 'add') {
    if (!leaf.value) {
      globalProxy.$message({ message: '请先选择单位再进行操作！', type: "warning" });
      return;
    }
    standbyProjApplyDialogRef.value.handleOpen(params)
  } else if (type == 'edit') {
    const seleRows = standbyProjApplyViewRef.value.getCheckboxRecords()
    if (seleRows.length == 0 || !seleRows || seleRows.length > 1) {
      globalProxy.$message({ message: "请选择一条数据！", type: "warning" });
      return;
    }
    const seleRow = seleRows[0]
    selectProId.value = seleRow.proId
    baseInfo.proId = seleRow.proId
    baseInfo.applyId = seleRow.applyId
    baseInfo.adCode = queryParams.adCode
    baseInfo.agCode = queryParams.agCode
    baseInfo.agName = seleRow.agencyName
    baseInfo.processKey = queryParams.processKey
    handleEdit()
  }
}
/**
 * 修改项目
 */
const handleEdit = () => {
  const editInfo = toRaw(baseInfo)
  standbyProjDialogRef.value.handleEdit(editInfo)
}
const handleRefresh = () => {
  handleSearch()
}

  </script>
  
  <style lang="scss" scoped>
.w-200px {
	width: 200px;
}
</style>
  