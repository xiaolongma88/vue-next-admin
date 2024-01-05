const TreeUtils = {
  nodeMap: {},
  expandMap: {},
  hasOnlyOneNode: (treeData) => {
    if (treeData) {
      if ((treeData.length === 1) && ((treeData[0].childNum === 0) || (treeData[0].children.length === 0))) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  parseData: function (target, config, targetCodes = []) {
    if (!target) return []
    const { showCode, props } = config
    return target.map(item => {
      let label = item[props.label]
      let value = item[props.value]
      item[props.label] = showCode ? `${value} ${label}` : label
      item[props.value] = value
      targetCodes = [ ...targetCodes, value ]
      if (item.children && item.children.length > 0) {
        item.children = TreeUtils.parseData(item.children, config, targetCodes)
      }
      TreeUtils.nodeMap[value] = item
      TreeUtils.expandMap[value] = targetCodes
      targetCodes.pop()
      return item
    })
  },
  transfData: function (target, config) {
    TreeUtils.nodeMap = {}
    TreeUtils.expandMap = {}
    const treeData = TreeUtils.parseData(target, config)
    return {
      nodeMap: TreeUtils.nodeMap,
      parseData: treeData,
      expandMap: TreeUtils.expandMap
    }
  }
}

export default TreeUtils
