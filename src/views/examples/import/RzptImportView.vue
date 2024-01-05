<template>
  <RkContainer
    :isFooter="false"
    :isAside="false">
    <template #header_left>
      <span>融资平台数据导入</span>
    </template>
    <template #header_right>
      <el-button type="primary">快捷导入</el-button>
      <el-button type="primary">入库正式表</el-button>
      <el-button >查看历史日志</el-button>
      <el-button >清空日志</el-button>
      <el-button type="danger">清空中间表</el-button>
      <el-button type="danger">一键清库</el-button>
    </template>
    <template #main>
      <RkCenter>
        <template #content>
          111
        </template>
      </RkCenter>
    </template>
    <SysParamsDialog ref="sysParamsDialogRef"
      @confirm="handleSearch" />
  </RkContainer>
</template>

<script setup>
// 
</script>

<style lang="scss" scoped>

</style>