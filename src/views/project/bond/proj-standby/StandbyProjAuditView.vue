<!--
 * @Author: songdeyuan
 * @Date: 2023/5/18 16:31
 * @Description: 备选项目审核
-->
<template>
  <rk-container :isFooter="false"
    :isAside="isAside">
    <template #header_left>
      <RkButtonGroup :options="json_jcsh_button"
        v-model="queryParams.wfStatus" />
    </template>
    <template #header_right>
      <template v-if="queryParams.wfStatus=== '001'">
        <el-button type="primary"
          @click="handleOperation('audit','审核', 0)">审核
        </el-button>
        <el-button @click="handleOperation('back','退回', 2)">退回</el-button>
      </template>
      <template v-else-if="queryParams.wfStatus=== '002'">
        <el-button type="danger"
          @click="handleOperation('cancel','撤销审核', 1)">撤销审核
        </el-button>
      </template>
      <el-button @click="handleOpenRecord">操作记录</el-button>
    </template>
    <template #aside>
      <rk-ad-ag-tree :adTreeHidden="true"
        @agNodeClick="handleAgNodeClick"
        @toggleHidden="(hidden)=> isAside = !hidden">
      </rk-ad-ag-tree>
    </template>
    <template #main>
      <rk-grid ref="standbyProjRef"
        title="备选项目审核"
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
              @change="selectChange"></rk-select>
          </el-form-item>
          <el-form-item style="margin: 0px">
            <el-input v-model="queryParams.mhcx"
              placeholder="请输入申报单位/项目名称"
              class="w-200px"
              clearable>
            </el-input>
          </el-form-item>
        </template>
      </rk-grid>
    </template>
    <proj-note-dialog v-model:visible="visible"
      :ok="dialogOkClick" />
    <OperationLog ref="OperationLogRef"
      :isNote="isNote"
      :title="LogTitle" />
  </rk-container>
</template>
  <script setup lang="jsx">
  // 专项债券项目备选审核列表
  import {json_jcsh_button} from '@/common/button-data.js'
  import {watch, ref, reactive, getCurrentInstance, onMounted} from "vue";
  import { useFormListApi } from '@/api/index'
  import {RkConfirmBox} from "@/components/message-box";
  import {toArray, COMMON_AMOUNT_UNIT} from '@/enums/enums-common';
  import { useProjectApi } from '@/api/index'
  import {useRoute, useRouter} from "vue-router";
  import {WF_TASK_AUDIT, WF_TASK_BACK, WF_TASK_CANCEL} from "@/common/cons-common";
  import { useUserStore } from '@/stores/modules';
  import ProjNoteDialog from "@/views/project/bond/dialogs/ProjNoteDialog.vue";
  import ISUtils from '@/utils/is-utils.js'
  
const {delPrdFormInfo, updateStatus} = useFormListApi()
  const { standProHandleTask } =useProjectApi();
  const userInfo = useUserStore().userInfo
  const route = useRoute()
  const router = useRouter()
  const showCondition = ref(true)
  const isAside = ref(false)
  const standbyProjRef = ref(null)
  const OperationLogRef = ref(null)
  const isNote = ref(false)
  const LogTitle = ref('操作记录')
  const {appContext} = getCurrentInstance();
  const globalProxy = appContext.config.globalProperties;
  const visible = ref(false)
  
  
  // 查询参数
  let queryParams = reactive({
      mhcx: "",
      dw: 2,
      nodeId: "node_2",
      processKey: route.query.processKey,
      wfStatus: route.query.wfStatus ?? '001',
      agId: userInfo.agId,
      adCode: userInfo.adBjCode,
      agCode: userInfo.agCode,
  })
  
  watch(
      () => router.currentRoute.value.name,
      (newRouterName) => {
          if (newRouterName) {
              queryParams.nodeId = route.query.nodeId
          }
      },
      {immediate: true}
  )
  
  const tableColumns = ref([
      {field: 'agencyName', title: '申报单位', width: 180},
      {
          field: 'sortId',
          title: '重点项目排序号',
          width: 150,
          align: 'center',
          visible: !ISUtils.isCountyUser(userInfo.adCode)
      },
      {
          field: 'proName', title: '项目名称', width: 250,
          cellRender: {name: 'stXmYHS'}
      },
      {field: 'proCode', title: '项目编码', width: 200},
      {field: 'fiscalYear', title: '年度', width: 120, align: 'center',},
      {field: 'debtDeadlineName', title: '债券期限', width: 130, align: 'center',},
      {
          field: 'applyAmt',
          title: '申请金额',
          formatter: 'formatThousand',
          width: 150,
          align: 'right'
      },
      {
          field: 'expFuncName', title: '支出功能分类', width: 200
      },
      {
          field: 'govBgtEcoName', title: '政府预算支出经济分类', width: 250
      },
      {
          field: 'depBgtEcoName', title: '部门预算支出经济分类', width: 250
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
      {field: 'applyDate', title: '申报日期', width: 120, align: 'center'},
      {field: 'setupYear', title: '立项年度', width: 100, align: 'center'},
      {field: 'proTypeName', title: '项目类型', width: 150},
      {field: 'fundInvestAreaName', title: '资金投向领域', width: 200},
      {
          field: 'totalBudget',
          title: '项目总概算',
          formatter: 'formatThousand',
          width: 150,
          align: 'right'
      },
      {field: 'proStatusName', title: '建设状态', width: 120, align: 'left'},
      {field: 'startDate', title: '开工日期', width: 120, align: 'center'},
      {field: 'endDate', title: '竣工日期', width: 120, align: 'center'},
      {field: 'remark', title: '备注', width: 120, align: 'left'},
  ])
  const auditParams = reactive({
      applyIds: '',
      proIds: '',
      taskIds: '',
      note: '',
      taskType: '',
      nodeId: queryParams.nodeId
  })
  
  //操作记录
  const handleOpenRecord = () => {
      const seleRows = standbyProjRef.value.getCheckboxRecords()
      if (seleRows.length === 0 || !seleRows || seleRows.length > 1) {
          globalProxy.$message({message: "请选择一条数据！", type: "warning"});
          return
      }
      let applyId = ''
      seleRows.forEach(element => {
          applyId = element.applyId
      });
      OperationLogRef.value.handleOpen(applyId)
  }
  
  /**
   * 审核
   * @param note
   */
  const dialogOkClick = async (note) => {
      auditParams.note = note
      auditParams.taskType = WF_TASK_AUDIT.value
      const resp = await standProHandleTask(auditParams)
      visible.value = false
      const {code, msg} = resp
      if (code === 200) {
          globalProxy.$message({message: `审核成功！`, type: "success"});
          handleSearch()
      } else {
          globalProxy.$message({message: `${msg}`, type: "error"});
      }
  }
  
  //送审、撤销送审、删除
  const handleOperation = async (buttonType, textName, buttonStatus) => {
      const seleRows = standbyProjRef.value.getCheckboxRecords()
      if (seleRows.length === 0 || !seleRows) {
          globalProxy.$message({message: `请至少选择一条数据进行${textName}！`, type: "warning"});
          return;
      }
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
      Object.assign(auditParams, {proIds, taskIds, applyIds})
      if (buttonType === 'audit') { //审核
          visible.value = true
          return
      }
      RkConfirmBox({
          title: '提示',
          content: `您确定要${textName}吗？`,
          onSubmit: async function () {
              //获取选中数据
  
  
              if (buttonType === 'back') { //退回
                  let params = {proIds, taskIds, applyIds}
                  Object.assign(auditParams, params, {taskType: WF_TASK_BACK.value})
                  const result = await standProHandleTask(auditParams)
                  const {code, msg} = result
                  if (code === 200) {
                      globalProxy.$message({message: `${textName}成功！`, type: "success"});
                      handleSearch()
                  } else {
                      globalProxy.$message({message: `${msg}`, type: "error"});
                  }
              }
              if (buttonType === 'cancel') { //取消
                  let params = {proIds, taskIds, applyIds}
                  Object.assign(auditParams, params, {taskType: WF_TASK_CANCEL.value})
                  const result = await standProHandleTask(auditParams)
                  const {code, msg} = result
                  if (code === 200) {
                      globalProxy.$message({message: `${textName}成功！`, type: "success"});
                      handleSearch()
                  } else {
                      globalProxy.$message({message: `${msg}`, type: "error"});
                  }
              }
          },
          onCancel: function () {
          }
      })
  }
  
  watch(() => queryParams.wfStatus, () => {
      handleSearch()
  })
  
  /**查询 */
  const handleSearch = () => {
      standbyProjRef.value.searchEvent()
  }
  
  /**查询 */
  const handleReset = () => {
      standbyProjRef.value.resetEvent()
  }
  
  // agCode监听
  const handleAgNodeClick = (obj) => {
      if (obj) {
          queryParams.agCode = obj.code
          queryParams.agId = obj.id
          handleSearch()
      }
  }
  const selectChange = (value) => {
      queryParams.dw = value
      handleSearch()
  }
  
  onMounted(() => {
      watch(() => queryParams.nodeId, () => {
          handleSearch()
      }, {immediate: false})
  })
  
  </script>
  
  <style lang="scss" scoped>
</style>
  