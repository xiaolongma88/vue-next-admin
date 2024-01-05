<template>
  <div class="tree-main">
    <div class="tree-header">
      <el-input v-model="filterText"
        placeholder="请输入关键词"
        :prefix-icon="Search"
        clearable />
    </div>
    <div class="tree-content">
      <el-tree ref="scoringTreeRef"
        class="filter-tree"
        style="height: 100%;"
        v-loading="loading"
        node-key="code"
        :="$attrs"
        :current-node-key="currentNodeKey"
        :data="dataList"
        highlight-current
        :props="treeProps"
        :default-expanded-keys="defaultExpandedKeys"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick" />
    </div>
  </div>
</template>
  <script setup>
// import {  onMounted, reactive, ref, toRaw, watch, } from 'vue'
import { ElTree } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { useScoreApi } from '@/api/score';
const { zqlxZjtxlyTreeList } = useScoreApi();
const props = defineProps(
  {
    modelValue: {
      type: [Object, String, Number, Array]
    },
    currentNodeKey: {
      type: String,
      default: ""
    },
    // 树节点替换字段
    treeProps: {
      type: Object,
      default: () => {
        return {
          label: 'text',
          value: 'code',
          children: 'children'
        }
      }
    },
  }
)

const emit = defineEmits(['nodeClick'])
const loading = ref(false)
let currentNodeKey = ref(props.currentNodeKey)
let defaultExpandedKeys = reactive([])
let dataList = ref([])
const filterText = ref('')
const scoringTreeRef = ref()

watch(filterText, (val) => {
  scoringTreeRef.value.filter(val)
})
const filterNode = (value, data) => {
  if (!value) return true
  const key = props.treeProps.label
  return data[key].includes(value)
}
onMounted(async () => {
  await getTreeData()
  watch(() => props.currentNodeKey, (value) => {
    if (value) {// 存在
      handleDefaultChecked(value)
    } else {
      handleDefaultChecked('first')
    }
  }, { deep: true, immediate: true })
})
/**获取树结构 */
const getTreeData = async (param) => {
  loading.value = true
  const result = await zqlxZjtxlyTreeList(param)
  const { data, code, msg } = result
  if (code === 200) {
    dataList.value = data
    loading.value = false
  } else {
    console.error(msg)
    loading.value = false
  }
}
/**默认选中 */
const handleDefaultChecked = (type) => {
  let dataArray = []
  dataArray = toRaw(dataList.value)
  if (type === 'first') {
    if (dataArray.length) {
      const firstNode = dataArray[0]
      const code = String(dataArray[0].code)
      currentNodeKey.value = code
      defaultExpandedKeys = [code]
      handleNodeClick(firstNode)
    } else {
      dataArray.forEach(element => {
        const code = String(element.code)
        if (code === props.currentNodeKey) {
          const selectRow = element
          defaultExpandedKeys = [code]
          handleNodeClick(selectRow)
        }
      })
    }
  }
}
/**树形选中 */
const handleNodeClick = (data) => {
  emit('nodeClick', { data })
}
  </script>
  <style lang="scss" scoped>
.tree-main {
  width: 100%;
  height: 100%;
  .tree-header {
    height: 50px;
    display: flex;
    align-items: center;
    background-color: #dce4fb;
    .tree-search {
      font-size: 16px;
      margin-left: 3px;
      text-align: left;
      padding-left: 10px;
      display: inline-block;
      color: #525151;
    }
    .el-input {
      flex: 1;
      margin-bottom: 5px;
      padding-left: 8%;
      padding-right: 8%;
      padding-top: 5px;
      width: 75%;
    }
  }
  .tree-content {
    height: calc(100% - 50px);
    .filter-tree {
      overflow: auto;
    }
    :deep(.el-tree-node > .el-tree-node__children) {
      overflow: visible;
    }
  }
}
</style>