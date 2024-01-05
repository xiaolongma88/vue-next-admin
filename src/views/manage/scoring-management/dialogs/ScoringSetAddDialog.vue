<template>
  <rk-dialog width="80%"
    height="70%"
    title=" "
    :visible="visible"
    :destroyOnClose="true"
    @close="visible = false"
    :maskClosable="false">
    <RkContainer :isFooter="false"
      :isAside="false"
      :isHeader="false">
      <template #main>
        <RkCenter>
          <template #content>
            <rk-grid ref="scoringSetAddDialogRef"
              dataUrl="/ZqglPfbz/selectReviewRuleList"
              title="评分标准列表"
              boxConfig
              :params="queryParams"
              :pagerConfig="false"
              :columns="tableColumns">
              <template #toolbar_tools>
                <rk-tree-select enum="EXPERT_CONDITION_STATUS"
                  style="margin-right: 12px;"
                  :filterable="false"
                  :showCode="false"
                  :clearable="true"
                  v-model="queryParams.entryLev1"
                  @change="handleSearch">
                </rk-tree-select>
              </template>
            </rk-grid>
          </template>
        </RkCenter>
      </template>
    </RkContainer>
    <template #footer>
      <el-button type="primary"
        @click="handleConfirm">保存</el-button>
      <el-button @click="hanldeClose">取消</el-button>
    </template>
  </rk-dialog>
</template>
<script setup>
import { EXPERT_SCORE_STATUS } from '@/enums/enums-expert.js'
import { useScoreApi } from '@/api/score';
const emit = defineEmits(['refresh'])
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
const scoringSetAddDialogRef = ref(null)
const visible = ref(false)

const { savePrdReviewRule } = useScoreApi();
// 查询参数
let queryParams = reactive({
  code: undefined,
  entryLev1: undefined
})
const tableColumns = ref([
  {
    field: 'entryLev1', title: '一级条目', width: 120, align: 'center', editRender: { autofocus: '.el-input__inner' }, slots: {
      edit: 'rk_level_edit',
      default: ({ row }) => {
        const entryLev1 = row.entryLev1 || '前置条件'
        return entryLev1
      }
    }
  },
  { field: 'entryLev2', title: '二级条目', width: 350, align: 'left', editRender: { autofocus: '.el-input__inner' }, slots: { edit: 'rk_input_edit' } },
  { field: 'reviewDesc', title: '评审内容', width: 700, align: 'left', editRender: { autofocus: '.el-input__inner' }, slots: { edit: 'rk_input_edit' } },
  { field: 'reviewStandard', title: '评审标准', width: 120, align: 'center', editRender: { autofocus: '.el-input__inner' }, titleSuffix: { message: '注意，必填信息！' }, slots: { edit: 'rk_input_edit' } },
  {
    field: 'scoreType', title: '评分选项', width: 120, align: 'center', editRender: {
      autofocus: '.el-input__inner'
    }, slots: {
      edit: 'rk_score_edit',
      default: ({ row }) => {
        const scoreType = row.scoreType || '1'
        const scoreTypeName = EXPERT_SCORE_STATUS.options[scoreType].label
        return scoreTypeName
      }
    }
  },
  { field: 'scoreRange', title: '分值', width: 120, align: 'center', editRender: { autofocus: '.el-input__inner' }, slots: { edit: 'rk_input_edit' } },
  { field: 'remark', title: '备注', width: 120, align: 'left', editRender: { autofocus: '.el-input__inner' }, slots: { edit: 'rk_input_edit' } },
])
/** 查询 */
const handleSearch = () => {
  scoringSetAddDialogRef.value.searchEvent()
}

/** 打开弹出层 */
const handleOpen = (id) => {
  visible.value = true
  queryParams.code = id
}
/** 关闭弹窗 */
const hanldeClose = () => {
  visible.value = false
  const params = scoringSetAddDialogRef.value.resetEvent(queryParams)
  Object.assign(queryParams, params)
}
/** 确认提交 */
const handleConfirm = async () => {
  const seleRows = scoringSetAddDialogRef.value.getCheckboxRecords()
  if (seleRows.length == 0 || !seleRows) {
    globalProxy.$message({ message: `请至少选择一条数据进行操作！`, type: "warning" });
    return;
  }
  //获取选中数据
  const ruleIdList = []
  seleRows.forEach(element => {
    ruleIdList.push(element.pfbzId)
  });
  const params = { code: queryParams.code, ruleIdList }
  const result = await savePrdReviewRule(params)
  const { data, code, msg } = result
  if (code === 200) {
    visible.value = false
    globalProxy.$message({ message: `保存成功！`, type: "success" });
    emit('refresh')
  } else {
    visible.value = false
    globalProxy.$message({ message: `${msg}`, type: "error" });
  }
}
// 对外暴露方法
defineExpose({
  handleOpen
})
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
      