<!--
 * @Author: ljc
 * @Date: 2023-04-06 19:53:27
 * @LastEditors: g05047
 * @LastEditTime: 2023-05-25 11:12:53
 * @Description: 工作流预览
-->
<template>
  <vxe-modal v-model="previewModal.isShow"
    width="80%"
    height="70%"
    :title="previewModal.processName ? previewModal.processName : ' '"
    resize
    mask-closable
    show-footer
    show-zoom
    destroyOnClose
    @hide="handleHide"
    @close="handleHide">
    <template #default>
      <div class="preview-content"
        v-html="previewModal.processSrc">
      </div>
    </template>
    <template #footer>
      <el-button @click="handleHide">关闭</el-button>
    </template>
  </vxe-modal>
</template>
  <script  setup>
/**属性传值 */
const props = defineProps({
  previewModal: {
    type: Object,
    default: {}
  },
})
/**取消弹框 */
const handleHide = () => {
  props.previewModal.isShow = false
}

  </script>
  <style lang="scss" >
.preview-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>