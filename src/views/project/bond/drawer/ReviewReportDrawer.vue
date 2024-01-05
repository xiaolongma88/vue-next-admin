
<!--  项目评审详情 -->
<template>
  <vxe-modal class-name="rk-modal"
    resize
    transfer
    show-zoom
    fullscreen
    destroyOnClose
    v-model="visible"
    width="90%"
    height="90%"
    :z-index="1002"
    min-width="460"
    min-height="320"
    @close="handleClose">
    <template #title>
      <div w-xs>项目评审详情：{{ localData.proName }}</div>
    </template>
    <template #default>
      <review-report-components :source="dataSource" />
    </template>
  </vxe-modal>
</template>
<script setup>

// ----- 弹窗相关操作
// 是否展示弹窗
import { useTaskApi } from "@/api/index.js";
import { computed, ref, watch } from "vue";
import ReviewReportComponents from "@/views/project/bond/drawer/ReviewReportComponents.vue";
import { ElMessage } from "element-plus";
const { reviewTask } = useTaskApi();

const dataSource = ref({})


const visible = ref(false)
// 是否加载中
const loading = ref(false)

const localData = ref({})


/**
 * 打开弹窗
 * @param {Object} config 配置信息
 */
const handleOpen = async (config) => {
  localData.value = config
  const { applyId, reviewTaskId } = config
  let resp = await reviewTask({ applyId, taskId: reviewTaskId })
  if (resp.code === 200) {
    dataSource.value = resp.data
    visible.value = true
  } else {
    ElMessage.error({ message: '请求错误' })
  }
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
.project-review-body {
	height: 100%;
	display: flex;
	flex-direction: column;

	.project-review-overview {
		p {
			font-size: 16px;
			margin-bottom: 5px;
		}
	}

	.project-review-detail {
		flex: 1;
		min-height: 200px;
	}
}
</style>
