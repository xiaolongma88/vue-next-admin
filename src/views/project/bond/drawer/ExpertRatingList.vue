<!--  每个专家评分列表 -->
<template>
  <vxe-modal class-name="rk-modal rk-projsort-modal"
    resize
    transfer
    show-zoom
    fullscreen
    destroyOnClose
    v-model="visible"
    width="1000"
    height="600"
    :z-index="1002"
    min-width="460"
    min-height="320"
    @close="handleClose">
    <template #title>
      <span w-xs>项目名称: {{ proName }}</span>
    </template>
    <template #default>
      <RkContainer :isFooter="false"
        :isAside=false
        v-show="!loading">
        <template #header_left></template>
        <template #header_right>
          <!--                    <el-button type="primary"-->
          <!--                               @click="handleClose">返回项目列表-->
          <!--                    </el-button>-->
        </template>
        <template #main>
          <rk-center>
            <template #content>
              <rk-grid ref="expertRatingList"
                :pagerConfig="false"
                class="rk-projsort-table"
                dataUrl="/reviewtask/getExpertScoreList"
                :params="queryParams"
                :columns="tableColumns">
                <template #lodeFile="{ row }">
                  <div class="operation-box">
                    <el-button link
                      type="primary"
                      @click.stop="handleOptation(row,'preview')">预览
                    </el-button>
                    <el-button link
                      type="primary"
                      @click.stop="handleOptation(row,'downLoad')">下载
                    </el-button>
                  </div>
                </template>
                <template #proj_score="{ row, column }">
                  <span>{{ row[column.field] || "—" }}</span>
                </template>
              </rk-grid>
            </template>
          </rk-center>
        </template>
      </RkContainer>
    </template>
  </vxe-modal>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { previewFile, fileType, dowloadFile, openNewWindow } from '@/utils/file-utils.js';
import { ref } from "vue";
import { useFilesZjpsApi } from '@/api/index'
const { onlineReviewData, downloadReportData } = useFilesZjpsApi();
const expertRatingList = ref()
const emits = defineEmits([
  'close'
])


// 查询参数
let queryParams = reactive({
  applyId: undefined,
  taskId: undefined,
})

// ----- 弹窗相关操作
// 是否展示弹窗
const visible = ref(false)
// 是否加载中
const loading = ref(false)
// 表单回显数据
const echoFormData = ref({})
// 打开加载中
const openLoading = ref({})

const tableColumns = ref([
  { field: 'name', title: '姓名', width: 180 },
  { field: 'phone', title: '手机号码', width: 200 },
  { field: 'isMatchConditionName', title: '评审结果（是否满足发债要求）', width: 300, align: 'center' },
  { field: 'score', title: '评分结果', width: 150, align: 'center', slots: { default: 'proj_score' } },
  { field: 'reviewTime', title: '评审时间', width: 150 },
  { field: 'lodeFile', title: '操作', width: 150, showOverflow: true, align: 'center', slots: { default: 'lodeFile' } },
])

/**查询 */
const handleSearch = () => {
  if (expertRatingList.value) {
    expertRatingList.value.searchEvent()
  }
}

/**表格点击方法 */
const handleOptation = async (row, type) => {
  const { reviewTaskId, applyId, expertId, } = row
  let params = {
    taskId: reviewTaskId,
    applyId,
    expertId
  }
  if (type === 'preview') {
    let result = await onlineReviewData(params)
    const code = result?.code
    const msg = result?.message
    if (code) {
      ElMessage({ message: msg ?? '业务失败！', type: "error" });
    } else {
      if (result) {
        let url = null
        url = await previewFile(result, fileType.pdf)
        openNewWindow(url, '项目评审报告')
      } else {
        ElMessage({ message: '没有任何数据！', type: "warning" });
      }
    }
  } else if (type === 'downLoad') {
    ElMessage({ message: '文件正在下载，请稍后！', type: "info" })
    const result = await downloadReportData(params)
    const code = result?.code
    const msg = result?.message
    if (code) {
      ElMessage({ message: msg ?? '业务失败！', type: "error" });
    } else {
      if (result) {
        dowloadFile(result, '项目评审报告', fileType.pdf)
      } else {
        ElMessage({ message: '没有任何数据！', type: "warning" });
      }
    }
  }
}

/**
 * 打开弹窗
 * @param {Object} config 配置信息
 */
const proName = ref('')
const handleOpen = async (config) => {
  proName.value = config.proName
  queryParams.applyId = config.applyId
  queryParams.taskId = config.reviewTaskId
  visible.value = true
  handleSearch()
}
/**
 * 关闭弹窗
 */
const handleClose = () => {
  handleReset()
}
/**
 * 重置数据
 */
const handleReset = () => {
  visible.value = false
  loading.value = false
}

// 对外暴露方法
defineExpose({
  handleOpen
})
</script>

<style lang="scss" scoped>
</style>
