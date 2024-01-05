<!--
 * @Author: ljc
 * @Date: 2023-04-25 15:00:24
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-27 10:33:02
 * @Description: 备选项目申报添加项目弹框
-->
<template>
  <div>
    <rk-dialog width="85%"
      height="80%"
      :title="title"
      v-if="visible"
      :visible="visible"
      :destroyOnClose="false"
      @close="hanldeClose"
      :maskClosable="false">
      <rk-container :isFooter="false"
        :isAside="false"
        :isHeader='false'>
        <template #main>
          <rk-center>
            <template #condition>
              <rk-center-bar>
                <template #content>
                  <el-form :inline="true"
                    label-width="80px">
                    <el-form-item label="项目类型">
                      <RkTreeSelect class="mr-15px w-200px"
                        v-model="queryParams.proType"
                        dist='DSY_V_ELE_ZWXMLX'>
                      </RkTreeSelect>
                    </el-form-item>
                    <el-form-item label="建设状态">
                      <RkTreeSelect class="mr-15px w-200px"
                        v-model="queryParams.proStatusCode"
                        :filterable="false"
                        :showCode="false"
                        :dist="{
                       name: 'DEBT_V_CTS_ELE_XMJSZT',
                       params: {
                          condition: ' AND GUID IN (1,2)'
                        }
                       }">
                      </RkTreeSelect>
                    </el-form-item>
                    <el-form-item label="模糊查询">
                      <el-input class="mr-15px w-200px"
                        placeholder="请输入项目编码/名称"
                        v-model="queryParams.mhcx"></el-input>
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
              <rk-grid ref="alternateProjectRef"
                dataUrl="/proAltApply/alternateProjectPage"
                :params="queryParams"
                :columns="tableColumns"
                :boxConfig="{ mode: 'radio' , fixed: true }"
                :toolbarConfig="false">
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
      </rk-container>
      <template #footer>
        <el-button type="primary"
          @click="handleConfirm">保存</el-button>
        <el-button @click="hanldeClose">取消</el-button>
      </template>
    </rk-dialog>
    <ReserveProjDialog ref="standbyProjDialogRef"
      type="standby"
      :formCode="$route.query.formCode"
      :processKey="$route.query.processKey"
      @refresh="handleRefresh" />
  </div>
</template>

<script setup>
import { useNamespace } from "element-plus";
import { COMMON_STOP_OPEN_ENUMS } from '@/enums/enums-common.js'
import { ElMessage } from 'element-plus'
import { nextTick, reactive, ref, toRaw } from "vue"
import { ReserveProjDialog } from '@/components/dialog';
import XEUtils from 'xe-utils'
import { FILL_PROJ_FORM_CONFIG } from '@/components/designer/cfg/rk-form-conf.js'

const ns = useNamespace("page", ref("rk"));
const emit = defineEmits(['refresh'])
const alternateProjectRef = ref(null)
let selectData = reactive({})
const title = ref('添加项目')
const visible = ref(false)
const processKey = ref(null)
// 查询参数
let queryParams = ref({
  proStatusCode: undefined,
  status: undefined,
  mhcx: undefined,
  adCode: undefined,
  agCode: undefined,
  processKey: undefined,
  proType: undefined
})
const standbyProjDialogRef = ref(null)
// 基本信息
const baseInfo = reactive({
  applyId: undefined,
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
  bondTypeCode: undefined,
  processKey: undefined
})
const tableColumns = ref([
  { field: 'agencyName', title: '申报单位', width: 180, align: 'left', },
  {
    field: 'proName', title: '项目名称', width: 250, align: 'left',
    // 关键代码
    cellRender: { name: 'xmYHS' }
  },
  { field: 'proCode', title: '项目编码', width: 200, align: 'left', },
  { field: 'fiscalYear', title: '年度', width: 120, align: 'center', },
  { field: 'debtDeadlineName', title: '债券期限', width: 130, align: 'center', },
  {
    field: 'applyAmt',
    title: '申请金额（万元）',
    formatter: 'formatThousand',
    width: 150,
    align: 'right'
  },
  {
    field: 'proCapital',
    title: '项目资本金（万元）',
    formatter: 'formatThousand',
    width: 150,
    align: 'right'
  },
  {
    field: 'bondTypeName', title: '申请类型', width: 150, align: 'left'
  },
  { field: 'applyDate', title: '申报日期', width: 120, align: 'center' },
  { field: 'setupYear', title: '立项年度', width: 100, align: 'center' },
  { field: 'proNatureName', title: '项目性质', width: 150, align: 'left' },
  { field: 'proTypeName', title: '项目类型', width: 150, align: 'left' },
  { field: 'fundInvestAreaName', title: '资金投向领域', width: 200, align: 'left' },
  { field: 'startDate', title: '开工日期', width: 120, align: 'center' },
  { field: 'endDate', title: '竣工日期', width: 120, align: 'center' },
  { field: 'proStatusName', title: '建设状态', width: 120, align: 'left' },
])

/** 打开弹出层 */
const handleOpen = async (params, model) => {
  visible.value = true
  queryParams.value.adCode = params.adCode
  queryParams.value.agCode = params.agCode
  queryParams.value.processKey = params.processKey
  processKey.value = params.processKey
  selectData = {
    ...model
  }
}
/** 关闭弹窗 */
const hanldeClose = () => {
  visible.value = false
  handleReset()
}
/**重新获取数据 */
const handleSearch = () => {
  alternateProjectRef.value.searchEvent()
}
/**重置 */
const handleReset = () => {
  const params = alternateProjectRef.value.resetEvent()
  queryParams.value = {
    ...params
  }
}
/** 确认提交 */
const selectedRow = ref()
const handleConfirm = () => {
  selectedRow.value = null
  const seleRow = alternateProjectRef.value.getRadioRecord()
  if (!seleRow) {
    ElMessage.warning('请选择一条数据进行操作！')
  } else {
    // 表单参数赋值
    selectedRow.value = seleRow
    visible.value = false
    handleAdd()
  }
}
// 添加方法
const handleAdd = () => {
  if (selectedRow) {
    const seleRow = toRaw(selectedRow.value)
    const { bondTypeCode } = seleRow
    const addInfo = XEUtils.clone(toRaw(baseInfo), true)
    addInfo.proId = seleRow.proId
    addInfo.agName = seleRow.agencyName
    addInfo.proType = (bondTypeCode == '1') ? FILL_PROJ_FORM_CONFIG.GE.value : FILL_PROJ_FORM_CONFIG.SP.value
    addInfo.applyId = seleRow.applyId
    addInfo.bondTypeCode = seleRow.bondTypeCode
    // 资金投向领域编码
    addInfo.fundInvestAreaCode = seleRow.fundInvestAreaCode
    addInfo.adCode = queryParams.value.adCode
    addInfo.agCode = queryParams.value.agCode
    addInfo.processKey = queryParams.value.processKey
    standbyProjDialogRef.value.handleAdd(addInfo)
  }
}
const handleRefresh = () => {
  emit('refresh')
}

// 对外暴露方法
defineExpose({
  handleOpen
})
</script>

<style lang="scss" scoped>
</style>