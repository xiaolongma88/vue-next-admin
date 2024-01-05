<template>
  <el-drawer v-model="visible"
    class="rk-workflow-drawer"
    size="100%"
    append-to-body
    :show-close="false"
    :with-header="false">
    <div class="rk-workflow-drawer-container">
      <div class="workflow-drawer-header"
        flex>
        <div class="workflow-drawer-header-title">
          <span class="title-info">工作流设计</span>
        </div>
        <div class="workflow-drawer-header-tools"
          flex-col>
          <slot name="footer"></slot>
        </div>
      </div>
      <div class="workflow-drawer-body">
        <slot name="workflow"></slot>
      </div>
    </div>
  </el-drawer>
</template>

  <script setup>
import { ref } from "vue"
const visible = ref(false)
// Drawer相关操作
// 打开Drawer
function handleOpen(e) {
  visible.value = true
}
// 关闭Drawer
function handleClose() {
  visible.value = false
}
// 对外暴露方法
defineExpose({
  handleOpen,
  handleClose,
})
  </script>

  <style lang="scss" scoped>
.rk-workflow-drawer-container {
  height: 100%;
  background-color: #f0f2f5;
}

.workflow-drawer-header {
  width: 100%;
  height: 52px;
  line-height: 52px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .workflow-drawer-header-title {
    width: 300px;
    padding-left: 20px;
    .title-info {
      font-size: 16px;
    }
  }

  .workflow-drawer-header-tools {
    text-align: right;
    width: 330px;
    padding-right: 20px;
  }
}
.workflow-drawer-body {
  background-color: #fff;
  height: calc(100vh - 52px);
}
</style>
  
  <style lang="scss">
.rk-workflow-drawer {
  .el-drawer__body {
    padding: 0;
  }
}
</style>