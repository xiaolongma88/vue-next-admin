<template>
  <RkContainer :isFooter="false"
    :isAside="false">
    <template #header_left></template>
    <template #header_right>
      <el-button :disabled="!editConfig"
        type="primary"
        @click="handleOperation('add','添加')">添加</el-button>
      <el-button :disabled="editConfig"
        @click="handleOperation('edit')">编辑</el-button>
      <el-button :disabled="!editConfig"
        @click="handleOperation('cancleEdit')">取消编辑</el-button>
      <el-button type="primary"
        :disabled="!editConfig"
        @click="handleOperation('save','保存')">保存</el-button>
      <el-button type="danger"
        :disabled="!editConfig"
        @click="handleOperation('delete','删除')">删除</el-button>
    </template>
    <template #main>
      <rk-grid ref="scoingRef"
        title="评分标准维护"
        dataUrl="/ZqglPfbz/getDebtTZqglPfbzList"
        :params="scoringParams"
        keyField="pfbzId"
        boxConfig
        :editConfig="{ beforeEditMethod: () => { return editConfig } }"
        :toolbarConfig="true"
        :keepSource="true"
        :columns="columns"
        :checkboxConfig="{
        reserve: true,
      }"
        @edit-closed="handleEditClose">
        <template #toolbar_title_buttons>
          <el-input v-model="scoringParams.keyWords"
            placeholder="请输入一级条目/二级条目"
            style="width: 250px;"
            clearable
            @input="handleSearch">
          </el-input>
        </template>
        <template #rk_input_edit="{ row, column }">
          <el-input placeholder="请输入内容"
            class="rk_input_edit"
            clearable
            v-model="row[column.field]" />
        </template>
        <template #rk_input_number="{ row, column }">
          <el-input-number placeholder="请输入内容"
            controls-position="right"
            :min="0"
            class="rk_input_edit"
            clearable
            v-model="row[column.field]" />
        </template>
        <template #rk_status_edit="{ row,column }">
          <rk-tree-select enum="COMMON_STOP_OPEN_ENUMS"
            :filterable="false"
            :showCode="false"
            :clearable="false"
            v-model="row[column.field]">
          </rk-tree-select>
        </template>
        <template #rk_level_edit="{ row,column }">
          <rk-tree-select enum="EXPERT_CONDITION_STATUS"
            :filterable="false"
            :showCode="false"
            :clearable="false"
            v-model="row[column.field]">
          </rk-tree-select>
        </template>
        <template #rk_score_edit="{ row,column }">
          <rk-tree-select enum="EXPERT_SCORE_STATUS"
            :filterable="false"
            :showCode="false"
            :clearable="false"
            v-model="row[column.field]">
          </rk-tree-select>
        </template>
      </rk-grid>
    </template>
  </RkContainer>
</template>
  <script setup >
import { COMMON_STOP_OPEN_ENUMS } from '@/enums/enums-common.js'
import { EXPERT_SCORE_STATUS, EXPERT_CONDITION_STATUS } from '@/enums/enums-expert.js'
import { RkConfirmBox } from '@/components/message-box/index.js'
import { useScoreApi} from '@/api/score'
import XEUtils from 'xe-utils'
import { ElLoading } from "element-plus"

const { deleteDebtTZqglPfbzByIds, saveOrUpdateDebtTZqglPfbz  } = useScoreApi();
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
let editTableData = ref([])
let addTableData = ref([])
const editConfig = ref(false)
const scoingRef = ref('')
const scoringParams = reactive({
  keyWords: undefined,
})
const columns = ref([
  { field: 'pfbzOrder', title: '排序', width: 100, align: 'center', editRender: { autofocus: '.el-input__inner' }, slots: { edit: 'rk_input_number' } },
  {
    field: 'status', title: '状态', width: 120, align: 'center', editRender: { autofocus: '.el-input__inner' }, slots:
    {
      edit: 'rk_status_edit',
      default: ({ row }) => {
        const status = row.status || 0
        const statusName = COMMON_STOP_OPEN_ENUMS.options[status].label
        return statusName
      }
    },
  },
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

const handleOperation = async (type, textName) => {
  if (type === 'add') {
    const record = {
      pfbzOrder: 0,
      status: 0,
      record: undefined,
      entryLev1: '前置条件',
      entryLev2: undefined,
      reviewDesc: undefined,
      reviewStandard: undefined,
      scoreType: 1,
      scoreRange: undefined,
      remark: undefined,
    }
    const { row: newRow } = await scoingRef.value.insertAt(record, 0)
    await scoingRef.value.setEditCell(newRow, 'record')
    addTableData.value.push(record)
  } else {
    if (type === 'save') {
      const updateRecords = scoingRef.value.getUpdateRecords()
      editTableData.value = updateRecords
      let insertRecords = scoingRef.value.getInsertRecords()
      let pfbzInsertList = []
      let pfbzUpdateList = []
      for (const key in updateRecords) {
        if (Object.hasOwnProperty.call(updateRecords, key)) {
          const element = updateRecords[key];
          if (XEUtils.isNull(element.entryLev1) || XEUtils.isUndefined(element.entryLev1)) {
            globalProxy.$message({ message: `一级条目不能为空！`, type: "warning" });
            return
          }
          if (XEUtils.isNull(element.reviewDesc) || XEUtils.isUndefined(element.reviewDesc)) {
            globalProxy.$message({ message: `评审内容不能为空！`, type: "warning" });
            return
          }
          if (XEUtils.isNull(element.reviewStandard) || XEUtils.isUndefined(element.reviewStandard)) {
            globalProxy.$message({ message: `评审标准不能为空！`, type: "warning" });
            return
          }
          if (XEUtils.isNull(element.scoreType) || XEUtils.isUndefined(element.scoreType)) {
            globalProxy.$message({ message: `评分选项不能为空！`, type: "warning" });
            return
          }
          if (element.scoreType === 1) { // 分数
            if (XEUtils.isNull(element.scoreRange) || XEUtils.isUndefined(element.scoreRange)) {
              globalProxy.$message({ message: `分值不能为空！`, type: "warning" });
              return
            }
          }
        }
      }
      for (const key in insertRecords) {
        if (Object.hasOwnProperty.call(insertRecords, key)) {
          const element = insertRecords[key];
          if (XEUtils.isNull(element.entryLev1) || XEUtils.isUndefined(element.entryLev1)) {
            globalProxy.$message({ message: `一级条目不能为空！`, type: "warning" });
            return
          }
          if (XEUtils.isNull(element.reviewDesc) || XEUtils.isUndefined(element.reviewDesc)) {
            globalProxy.$message({ message: `评审内容不能为空！`, type: "warning" });
            return
          }
          if (XEUtils.isNull(element.reviewStandard) || XEUtils.isUndefined(element.reviewStandard)) {
            globalProxy.$message({ message: `评审标准不能为空！`, type: "warning" });
            return
          }
          if (XEUtils.isNull(element.scoreType) || XEUtils.isUndefined(element.scoreType)) {
            globalProxy.$message({ message: `评分选项不能为空！`, type: "warning" });
            return
          }
          if (element.scoreType === 1) { // 分数
            if (XEUtils.isNull(element.scoreRange) || XEUtils.isUndefined(element.scoreRange)) {
              globalProxy.$message({ message: `分值不能为空！`, type: "warning" });
              return
            }
          }
        }
      }
      let obj = {};
      insertRecords = insertRecords.reduce((curr, next) => {
        /*判断对象中是否已经有该属性  没有的话 push 到 curr数组*/
        obj[next.status + next.entryLev1 + next.entryLev2 + next.reviewDesc + next.reviewStandard + next.scoreType + next.scoreRange] ? '' : obj[next.status + next.entryLev1 + next.entryLev2 + next.reviewDesc + next.reviewStandard + next.scoreType + next.scoreRange] = curr.push(next);
        return curr;
      }, []);
      pfbzUpdateList = [
        ...updateRecords
      ]
      pfbzInsertList = [
        ...insertRecords
      ]
      const params = { pfbzInsertList, pfbzUpdateList }
      const loading = ElLoading.service({ fullscreen: true })
      const result = await saveOrUpdateDebtTZqglPfbz(params)
      const { data, code, msg } = result
      if (code === 200) {
        loading.close()
        globalProxy.$message({ message: `${textName}成功！`, type: "success" });
        handleSearch()
      } else {
        loading.close()
        globalProxy.$message({ message: `${msg}`, type: "error" });
      }
    } else if (type === 'edit') {
      editConfig.value = true
    } else if (type === 'cancleEdit') {
      editConfig.value = false
      let insertRecords = scoingRef.value.getInsertRecords()
      if (insertRecords && insertRecords.length > 0) {
        scoingRef.value.remove(insertRecords)
      }
    }
    else if (type === 'delete') {
      const seleRows = scoingRef.value.getCheckboxRecords()
      if (seleRows.length == 0 || !seleRows) {
        globalProxy.$message({ message: `请至少选择一条数据进行${textName}！`, type: "warning" });
        return;
      }
      RkConfirmBox({
        title: '提示',
        content: `您确定要${textName}吗？`,
        onSubmit: async function () {
          //删除行
          scoingRef.value.removeCheckboxRow()
          const removeRecords = scoingRef.value.getRemoveRecords()
          if (removeRecords.length > 0) {
            // 获取选中数据
            const pfbzIdList = []
            removeRecords.forEach(element => {
              pfbzIdList.push(element.pfbzId)
            });
            const params = { idList: pfbzIdList }
            const result = await deleteDebtTZqglPfbzByIds(params)
            const { data, code, msg } = result
            if (code === 200) {
              globalProxy.$message({ message: `${textName}成功！`, type: "success" });
              handleSearch()
            } else {
              globalProxy.$message({ message: `${msg}`, type: "error" });
            }
          }

        },
        onCancel: function () {
        }
      })
    } else {
    }
  }
}
//查询
const handleSearch = () => {
  scoingRef.value.searchEvent()
}
//编辑关闭
const handleEditClose = ({ column }) => {
  const updateRecords = scoingRef.value.getUpdateRecords()
  editTableData.value = updateRecords
}
  </script>
  <style lang="scss" scoped >
:deep(.el-input-number) {
  width: 80px;
}
.operation-box {
  display: flex;
  justify-content: space-around;
}
.scoing-container {
  height: 100%;
}
.vform-table-search {
  margin-right: 15px;
}
</style>