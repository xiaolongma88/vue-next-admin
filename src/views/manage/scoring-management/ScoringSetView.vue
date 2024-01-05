<template>
  <RkContainer :isFooter="false"
    style="padding-top: 8px;"
    :isHeader="true">
    <template #header_left></template>
    <template #header_right>
      <el-button style="margin-left: 12px;"
        type="primary"
        @click="handleOperation('add','添加')">添加</el-button>
      <el-button type="danger"
        @click="handleOperation('delete','删除')">删除</el-button>
    </template>
    <template #aside>
      <scoring-tree placolder="请输入关键词"
        :treeProps="{
          label: 'text',
          value: 'code',
          children: 'childList'
        }"
        defaultExpandAll
        @nodeClick="handleNodeClick"></scoring-tree>
    </template>
    <template #main>
      <RkCenter>
        <template #content>
          <rk-grid ref="scoringSetViewRef"
            dataUrl="/ZqglPfbz/getPfbzListByCode"
            title="评分标准设置"
            boxConfig
            :autoLoad="false"
            :params="queryParams"
            :columns="tableColumns"
            style="width: 100%;">
            <template #toolbar_title_buttons>
              <el-input v-model="queryParams.keyWords"
                placeholder="请输入一级条目/二级条目"
                style="width: 250px;"
                clearable
                @input="handleSearch">
              </el-input>
            </template>
          </rk-grid>
        </template>
      </RkCenter>
    </template>
    <scoring-set-add-dialog ref="scoringSetAddDialogRef"
    @refresh="handleSearch"></scoring-set-add-dialog>
  </RkContainer>
</template>

<script setup >
import { RkConfirmBox } from '@/components/message-box/index.js'
import ScoringTree from './components/ScoringTree.vue'
import { useScoreApi } from '@/api/score';
import { EXPERT_SCORE_STATUS } from '@/enums/enums-expert.js'
import ScoringSetAddDialog from './dialogs/ScoringSetAddDialog.vue'
import { ElLoading } from "element-plus"

const { deletePrdReviewRuleByIds } = useScoreApi();
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
const scoringSetViewRef = ref(null)
const scoringSetAddDialogRef = ref(null)
// 查询参数
let queryParams = reactive({
  keyWords: undefined,
  code: undefined
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
// 左侧树点击
const handleNodeClick = ({ data }) => {
  const { code } = data
  queryParams.code = code
  handleSearch()
}
/**查询 */
const handleSearch = () => {
  scoringSetViewRef.value.searchEvent()
}
//上报、撤销上报、删除
const handleOperation = async (buttonType, textName) => {
  if (buttonType === 'add') {
    scoringSetAddDialogRef.value.handleOpen(queryParams.code)
  } else {
    const seleRows = scoringSetViewRef.value.getCheckboxRecords()
    if (seleRows.length == 0 || !seleRows) {
      globalProxy.$message({ message: `请至少选择一条数据进行${textName}！`, type: "warning" });
      return;
    }
    RkConfirmBox({
      title: '提示',
      content: `您确定要${textName}吗？`,
      onSubmit: async function () {
        //获取选中数据
        const ruleIdList = []
        seleRows.forEach(element => {
          ruleIdList.push(element.pfbzId)
        });
        if (buttonType == 'delete') { //删除
          const params = { ruleIdList, code: queryParams.code }
          const loading = ElLoading.service({ fullscreen: true })
          const result = await deletePrdReviewRuleByIds(params)
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
</script>
<style lang="scss" scoped>
.w-200px {
  width: 200px;
}
</style>
    