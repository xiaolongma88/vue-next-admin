
  <!--
 * @Author: ljc
 * @Date: 2023-04-20 13:43:40
 * @LastEditors: g05047
 * @LastEditTime: 2023-04-21 14:28:23
 * @Description: 下拉树
-->
<template>
  <div class="app-container"
    style="height: 100%; padding-top: 0;">
    <div style="display: flex; height: 100%;">
      <div class="tree-content">
        <RkAdAgTree
          :agTreeHidden="true"
          @adNodeClick="handleAdNodeClick"
        />
      </div>
      <div class="tree-content">
        <RkAdAgTree
          :adTreeHidden="true"
          @agNodeClick="handleAgNodeClick"
        />
      </div>
      <div class="tree-content">
        <RkAdAgTree />
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['adNodeClick', 'agNodeClick'])

const handleAdNodeClick = ({ data, adTreeNode, label, event }) => {
  emit('adNodeClick', { data, adTreeNode, label, event })
}
const handleAgNodeClick = ({ data, adTreeNode, agTreeNode, label, event }) => {
  emit('agNodeClick', { data, adTreeNode, agTreeNode, label, event })
}
</script>

<style lang="scss" scoped>
.tree-content {
  width: 100%;
  height: 100%;
  margin-right: 20px;
}
</style>