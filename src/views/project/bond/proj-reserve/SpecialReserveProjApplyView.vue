    <!-- 专项债券项目储备申报列表 -->
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
        @click="handelAdd">新增项目</el-button>
      <el-button v-if="queryParams.wfStatus=='001' || queryParams.wfStatus=='004'"
        @click="handleOpenRecord('edit', '修改')">修改</el-button>
      <el-button v-if="queryParams.wfStatus=='001' || queryParams.wfStatus=='004'"
        type="danger"
        @click="handleOperation('delete', '删除')">删除</el-button>
      <el-button v-if="queryParams.wfStatus=='001' || queryParams.wfStatus=='004'"
        type="primary"
        @click="handleOperation('send','送审')">送审</el-button>
      <el-button v-if="queryParams.wfStatus=='002'"
        type="danger"
        @click="handleOperation('cancel','撤销送审')">撤销送审</el-button>
      <el-button @click="handleOpenRecord('rocord', '操作记录')">操作记录</el-button>
    </template>
    <template #aside>
      <RkAdAgTree :adTreeHidden="true"
        @agNodeClick="handleAgNodeClick"
        @agCurrentChange="handleAgNodeChange"
        @toggleHidden="(hidden) => isAside = !hidden" />
    </template>
    <template #main>
      <rk-center>
        <template #content>
          <rk-grid ref="projGridRef"
            title="专项债券储备信息表"
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
                  @change="selectChange"></rk-select>
              </el-form-item>
              <el-input v-model="queryParams.mhcx"
                placeholder="请输入申报单位/项目名称"
                class="mr-15px w-200px"
                @input="handleSearch"
                clearable>
              </el-input>
            </template>
            <template #bondType="{ row }">
              <span class="mx-1">
                {{ COMMON_BOND_TYPES.options[row.bondTypeCode].echo }}
              </span>
            </template>
          </rk-grid>
        </template>
      </rk-center>
    </template>
    <OperationLog ref="operationLogRef" />
    <ReserveProjDialog ref="projDialogRef"
    type="special"
    :formCode="$route.query.formCode"
    :processKey="$route.query.processKey"
    @refresh="handleSearch" />
  </RkContainer>
</template>
<script setup>
import { useUserStore } from '@/stores/modules';
import { ReserveProjDialog } from '@/components/dialog';
import { RkConfirmBox } from '@/components/message-box/index.js'
import { json_jb_button } from '@/common/button-data.js'
import { WF_TASK_SEND_AUDIT, WF_TASK_CANCEL } from '@/common/cons-common.js'
import { COMMON_BOND_TYPES, toArray, COMMON_AMOUNT_UNIT } from '@/enums/enums-common.js'
import { useProjectApi } from '@/api/index'
import XEUtils from 'xe-utils'
import { ElMessage, ElLoading } from "element-plus"

const { deleteReserveProject, reserveProHandleTask } = useProjectApi();
// ----- pinia
const userInfo = useUserStore().userInfo

// ----- 路由相关操作
const route = useRoute()
const query = route.query

// ----- 表格相关操作
// 表格的模板引用
const projGridRef = ref('')
// 操作记录模板引用
const operationLogRef = ref(null)
// 查询参数
const queryParams = reactive({
  dw: 2,
  mhcx: undefined,
  status: undefined,
  wfStatus: route.query.wfStatus ?? '001',
  nodeId: query.nodeId,
  processKey: query.processKey,
  // 债券类型测试数据 1、一般 2、专项
  bondTypeCode: 2,
  agId: userInfo.agId,
  adCode: userInfo.adBjCode,
  agCode: userInfo.agCode,
})

// 表格字段定义
const tableColumns = ref([
  { field: 'agencyName', title: '申报单位', width: 180, },
  {
    field: 'proName', title: '项目名称', width: 250, align: 'left',
    cellRender: { name: 'xmYHS' }
  },
  { field: 'proCode', title: '项目编码', width: 200, align: 'center' },
  { field: 'fiscalYear', title: '年度', width: 120, align: 'center' },
  { field: 'debtDeadlineName', title: '债券期限', width: 130, align: 'center' },
  { field: 'applyAmt', title: '申请金额', width: 150, align: 'right', formatter: 'formatThousand' },
  { field: 'expFuncName', title: '支出功能分类', width: 200 },
  { field: 'govBgtEcoName', title: '政府预算支出经济分类', width: 250 },
  { field: 'depBgtEcoName', title: '部门预算支出经济分类', width: 250 },
  { field: 'proCapital', title: '项目资本金', width: 150, align: 'right', formatter: 'formatThousand' },
  {
    field: 'bondTypeCode', title: '申请类型', width: 120, align: 'center',
    formatter: ['enumsFormats', 'COMMON_BOND_TYPES']
  },
  { field: 'applyDate', title: '申报日期', width: 120, align: 'center' },
  { field: 'setupYear', title: '立项年度', width: 100, align: 'center' },
  { field: 'proTypeName', title: '项目类型', width: 150 },
  { field: 'fundInvestAreaName', title: '资金投向领域', width: 200 },
  { field: 'totalBudget', title: '项目总概算', width: 150, align: 'right', formatter: 'formatThousand' },
  { field: 'proStatusName', title: '建设状态', width: 120 },
  { field: 'startDate', title: '开工日期', width: 120, align: 'center' },
  { field: 'endDate', title: '竣工日期', width: 120, align: 'center' },
  { field: 'remark', title: '备注', width: 120 },
])
// 查询
const handleSearch = () => {
  projGridRef.value.searchEvent()
}
//送审、撤销送审、删除
const handleOperation = async (buttonType, textName) => {
  const seleRows = projGridRef.value.getCheckboxRecords()
  if (seleRows.length == 0 || !seleRows) {
    ElMessage({ message: `请至少选择一条数据进行${textName}！`, type: "warning" });
    return;
  }
  //获取选中数据
  const ProId = []
  const TaskId = []
  const ApplyId = []
  let isTemp = false
  for (const key in seleRows) {
    if (Object.hasOwnProperty.call(seleRows, key)) {
      const element = seleRows[key];
      if (buttonType == 'send') {
        if (element.isTemp === 1) {
          isTemp = true
          break
        }
      } else {
        isTemp = false
      }
      ProId.push(element.proId)
      TaskId.push(element.taskId)
      ApplyId.push(element.applyId)
    }
  }
  if (isTemp) {
    ElMessage({ message: `选中数据在暂存区，请完善信息保存后进行送审！`, type: "warning" });
    return
  }
  const applyIds = ApplyId.join(',')
  const proIds = ProId.join(',')
  const taskIds = TaskId.join(',')
  let loading = null
  if (buttonType == 'send') { //送审
    loading = ElLoading.service({ fullscreen: true, text: textName + '中,请稍等..' })
    const deleteParams = { applyIds, taskIds, proIds, bondTypeCode: 2, nodeId: queryParams.nodeId, taskType: WF_TASK_SEND_AUDIT.value }
    const result = await reserveProHandleTask(deleteParams)
    const { data, code, msg } = result
    if (code === 200) {
      loading.close()
      ElMessage({ message: `${textName}成功！`, type: "success" });
      handleSearch()
    } else {
      loading.close()
      ElMessage({ message: `${msg}`, type: "error" });
    }
  } else if (buttonType == 'cancel') { //撤销送审
    loading = ElLoading.service({ fullscreen: true, text: textName + '中,请稍等..' })
    const deleteParams = { applyIds, taskIds, proIds, nodeId: queryParams.nodeId, taskType: WF_TASK_CANCEL.value }
    const result = await reserveProHandleTask(deleteParams)
    const { data, code, msg } = result
    if (code === 200) {
      loading.close()
      ElMessage({ message: `${textName}成功！`, type: "success" });
      handleSearch()
    } else {
      loading.close()
      ElMessage({ message: `${msg}`, type: "error" });
    }
  } else { //删除
    RkConfirmBox({
      title: '提示',
      content: `您确定要${textName}吗？`,
      onSubmit: async function () {
        loading = ElLoading.service({ fullscreen: true, text: textName + '中,请稍等..' })
        const deleteParams = { proIds, applyIds }
        const result = await deleteReserveProject(deleteParams)
        const { data, code, msg } = result
        if (code === 200) {
          loading.close()
          ElMessage({ message: `${textName}成功！`, type: "success" });
          handleSearch();
        } else {
          loading.close()
          ElMessage({ message: `${msg}`, type: "error" });
        }
      },
      onCancel: function () {
      }
    })
  }
}
const handleOpenRecord = (buttonType, textName) => {
  const seleRows = projGridRef.value.getCheckboxRecords()
  if (seleRows.length == 0 || !seleRows || seleRows.length > 1) {
    ElMessage({ message: "请选择一条数据！", type: "warning" });
    return;
  }
  //修改
  if (buttonType == 'edit') {
    handleEditProj(seleRows[0])
  }
  //操作记录
  else {
    let applyId = ''
    seleRows.forEach(element => {
      applyId = element.applyId
    });
    operationLogRef.value.handleOpen(applyId)
  }
}
//  新增项目
const handelAdd = () => {
  if (!isLeaf.value) {
    ElMessage({ message: '请先选择单位再进行操作！', type: "warning" });
    return;
  }
  handleAddProj()
}
// 金额单位切换
const selectChange = (value) => {
  queryParams.dw = value
  handleSearch()
}

// ----- 左侧树操作
const isLeaf = ref(false)
// 是否显示左侧面板
const isAside = ref(false)
// 树节点点击触发
const handleAgNodeClick = (data, treeNode) => {
  // 表格查询
  handleSearch()
}
// 树节点选中变化触发
const handleAgNodeChange = (data, treeNode) => {
  const { id, code, name, parentId, leaf, parentName } = data
  // 叶子节点
  isLeaf.value = leaf
  if (!code) {
    // 查询参数赋值
    queryParams.agId = userInfo.agId
    queryParams.agCode = userInfo.agCode
  } else {
    // 查询参数赋值
    queryParams.agId = id
    queryParams.agCode = code
  }
  // 表单基本信息
  baseInfo.agId = id
  baseInfo.agCode = code
  baseInfo.agName = name
  baseInfo.agParentName = (parentId == '0') ? '' : parentName
  baseInfo.agParentId = (parentId == '0') ? '' : parentId
}

// ----- 项目填报|编辑弹窗相关
// 项目申报基本信息
const baseInfo = reactive({
  // 选中项目ID
  proId: '',
  // 选中区划编码
  adCode: userInfo.adBjCode,
  // 单位ID
  agId: '',
  // 选中单位编码
  agCode: '',
  // 单位名称
  agName: '',
  // 上级单位Id
  agParentId: ''
})
// 项目添加面板模板引用
const projDialogRef = ref()
/** 添加项目 */
const handleAddProj = () => {
  const addInfo = XEUtils.clone(toRaw(baseInfo), true)
  projDialogRef.value.handleAdd(addInfo);
}
/** 修改项目 */
const handleEditProj = ({ proId, applyId }) => {
  const editInfo = XEUtils.clone(toRaw(baseInfo), true)
  editInfo['proId'] = proId
  editInfo['applyId'] = applyId
  projDialogRef.value.handleEdit(editInfo)
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
