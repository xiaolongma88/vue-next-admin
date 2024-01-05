<!-- 项目入库列表 -->
<template>
  <RkContainer :isFooter="false"
    :isAside="isAside">
    <template #header_left>
      <RkButtonGroup :options="json_xjshs_button"
        v-model="queryParams.wfStatus"
        @click="handleSearch" />
    </template>
    <template #header_right>
      <template v-if="queryParams.wfStatus === '001'">
        <el-button type="primary"
          @click="handleOperation('audit', '审核')">审核
        </el-button>
        <el-button @click="handleOperation('back', '退回')">退回</el-button>
      </template>
      <template v-else-if="queryParams.wfStatus === '002'">
        <el-button type="danger"
          @click="handleOperation('cancle', '撤销审核')">撤销审核
        </el-button>
      </template>
      <el-button @click="handleOpenRecord()">操作记录</el-button>
      <el-button v-if="!showCondition"
        @click="showCondition = true">展开条件
      </el-button>
      <el-button v-else
        @click="showCondition = false">收起条件
      </el-button>
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
              <el-form :inline="true">
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
                @click="handleSearch">查询
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </template>
          </rk-center-bar>
        </template>
        <template #content>
          <rk-grid ref="reserveProjRef"
            title="项目入库"
            :dataUrl="query.proType === '1' ? '/proResApply/financeFinalAuditPage' : '/proAltApply/financeFinalAuditPage'"
            boxConfig
            :params="queryParams"
            :columns="tableColumns"
            :footerConfig="{
                            showFooter: true,
                            footerParams: ['applyAmt', 'proCapital', 'totalBudget']
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
                class="mr-15px w-200px"
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
            <template #proj_score="{ row, column }">
              <a class="yhs-pro-name-no-underline"
                href='javascript:;'
                @click="handleOpenScore(row)">{{
                                row[column.field] || '—' }}</a>
            </template>
          </rk-grid>
        </template>
      </rk-center>
    </template>
    <OperationLog ref="OperationLogRef" />
    <reserve-proj-note-dialog ref="reserveProjNoteDialogRef"
      :ok="dialogOkClick"
      v-model:visible="noteVisible"></reserve-proj-note-dialog>
    <ExpertRatingList ref="expertRatingRef" />
  </RkContainer>
</template>

<script setup lang="jsx">
import { ElMessage } from 'element-plus'
import { json_xjshs_button } from '@/common/button-data.js'
import { COMMON_AMOUNT_UNIT, COMMON_STOP_OPEN_ENUMS, toArray } from '@/enums/enums-common.js'
import { WF_TASK_AUDIT, WF_TASK_BACK, WF_TASK_CANCEL } from '@/common/cons-common.js'
import { reactive, ref } from 'vue'
import { RkConfirmBox } from '@/components/message-box/index.js'
import { useRoute } from 'vue-router'
import ReserveProjNoteDialog from '../dialogs/ProjNoteDialog.vue'
import { useUserStore } from '@/stores/modules';
import ExpertRatingList from "../drawer/ExpertRatingList.vue";
import { useProjectApi } from '@/api/index'

const { reserveProHandleTask,standProHandleTask, } = useProjectApi();
let reserveProjNoteDialogRef = ref(null)
const noteVisible = ref(false)
const showCondition = ref(false)
const OperationLogRef = ref(null)
const reserveProjRef = ref('')
let route = useRoute()
const query = route.query
// 查询参数
const userInfo = useUserStore().userInfo
let queryParams = reactive({
  wfStatus: route.query.wfStatus ?? '001',
    processKey: route.query.processKey,
    status: undefined,
    mhcx: undefined,
    bondTypeCode: undefined,
    nodeId: route.query.nodeId,
    adCode: userInfo.adCode,
    agCode: undefined,
    agId: undefined,
    dw: 2,
    selectType: 1,
    reportYear: undefined,
})
const expertRatingRef = ref(null)
let auditParams = {}
let isAside = ref(false)
let xmYhs = (query.proType == '2') ? 'stXmYHS' : 'xmYHS'
const tableColumns = ref([
    { field: 'agencyName', title: '申报单位', width: 180, align: 'left', },
    {
        field: 'proName', title: '项目名称', width: 250, align: 'left', cellRender: { name: xmYhs }
    },
    { field: 'isPermitName', title: '是否满足发债要求（机构）', width: 200, align: 'center', },
    { field: 'score', title: '评审得分', width: 120, align: 'center', slots: { default: 'proj_score' } },
    { field: 'proCode', title: '项目编码', width: 200, align: 'left', },
    { field: 'fiscalYear', title: '年度', width: 120, align: 'center' },
    { field: 'debtDeadlineName', title: '债券期限', width: 130, align: 'center' },
    { field: 'applyAmt', title: '申请金额', width: 150, align: 'right', formatter: 'formatThousand' },
    {
        field: 'expFuncName', title: '支出功能分类', width: 200, align: 'left'
    },
    {
        field: 'govBgtEcoName', title: '政府预算支出经济分类', width: 250, align: 'left'
    },
    {
        field: 'depBgtEcoName', title: '部门预算支出经济分类', width: 250, align: 'left'
    },
    { field: 'bondTypeName', title: '申请类型', width: 150, align: 'center' },
    { field: 'applyDate', title: '申报日期', width: 120, align: 'center' },
    { field: 'setupYear', title: '立项年度', width: 100, align: 'center' },
    { field: 'proTypeName', title: '项目类型', width: 150, align: 'center' },
    { field: 'fundInvestAreaName', title: '资金投向领域', width: 200, align: 'left' },
    { field: 'totalBudget', title: '项目总概算', width: 150, align: 'right', formatter: 'formatThousand' },
    { field: 'proStatusName', title: '建设状态', width: 120, align: 'left' },
    { field: 'startDate', title: '开工日期', width: 120, align: 'center' },
    { field: 'endDate', title: '竣工日期', width: 120, align: 'center' },
    { field: 'remark', title: '备注', width: 120, align: 'left' },
])
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

/**重置 */
const handleReset = () => {
    const wfStatus = queryParams.wfStatus
    queryParams.reportYear = undefined
    queryParams.bondTypeCode = undefined
    const params = reserveProjRef.value.resetEvent(queryParams)
    Object.assign(queryParams, params)
    queryParams.wfStatus = wfStatus
}
//打开评分结果
const handleOpenScore = (row) => {
    expertRatingRef.value.handleOpen(row)
}

//送审、撤销送审、删除
const handleOperation = async (buttonType, textName) => {
    const seleRows = reserveProjRef.value.getCheckboxRecords()
    if (seleRows.length == 0 || !seleRows) {
        ElMessage({ message: `请至少选择一条数据进行${textName}！`, type: "warning" });
        return;
    }
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
    auditParams = { applyIds, taskIds, proIds, nodeId: queryParams.nodeId, taskType: WF_TASK_AUDIT.value, }
    if (buttonType == 'audit') { //审核
        noteVisible.value = true
        return
    }
    RkConfirmBox({
        title: '提示',
        content: `您确定要${textName}吗？`,
        onSubmit: async function () {
            if (buttonType == 'back') { //退回
                const params = { applyIds, taskIds, proIds, nodeId: queryParams.nodeId, taskType: WF_TASK_BACK.value }
                let result = null;
                if (query.proType == 1) {
                    result = await reserveProHandleTask(params);
                } else {
                    result = await standProHandleTask(params);
                }
                const { data, code, msg } = result
                if (code === 200) {
                    ElMessage({ message: `${textName}成功！`, type: "success" });
                    handleSearch()
                } else {
                    ElMessage({ message: `${msg}`, type: "error" });
                }
            } else if (buttonType == 'cancle') { //取消
                const params = { applyIds, taskIds, proIds, nodeId: queryParams.nodeId, taskType: WF_TASK_CANCEL.value }
                let result = null;
                if (query.proType == 1) {
                    result = await reserveProHandleTask(params);
                } else {
                    result = await standProHandleTask(params);
                }
                const { data, code, msg } = result
                if (code === 200) {
                    ElMessage({ message: `${textName}成功！`, type: "success" });
                    handleSearch()
                } else {
                    ElMessage({ message: `${msg}`, type: "error" });
                }
            }
        },
        onCancel: function () {
        }
    })
}

/**
* 审核
* @param note
*/
const dialogOkClick = async (note) => {
    auditParams.note = note
    let result = null;
    if (query.proType == 1) {
        result = await reserveProHandleTask(auditParams);
    } else {
        result = await standProHandleTask(auditParams);
    }
    const { data, code, msg } = result
    if (code === 200) {
        ElMessage({ message: `审核成功！`, type: "success" });
        handleSearch()
        noteVisible.value = false
    } else {
        ElMessage({ message: `${msg}`, type: "error" });
        noteVisible.value = false
    }
}
//操作记录
const handleOpenRecord = () => {
    const seleRows = reserveProjRef.value.getCheckboxRecords()
    if (seleRows.length == 0 || !seleRows || seleRows.length > 1) {
        ElMessage({ message: "请选择一条数据！", type: "warning" });
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
.mr-15px {
	margin-right: 15px;

	&:last-child {
		margin-right: 0;
	}
}

.w-200px {
	width: 200px;
}
</style>
