/**
 * 通用转义数据工具类
 */
const ParseUtils = {
  /**
   * 获取项目路径
   *
   * @param {String} path 路径
   * @returns String
   */
  getNormalPath(path) {
    if (path.length === 0 || !path || path == 'undefined') {
      return path
    };
    let res = path.replace('//', '/')
    if (res[res.length - 1] === '/') {
      return res.slice(0, res.length - 1)
    }
    return res
  },
  /**
   * 转换枚举数据为数组数据
   * @param {Object} obj 目标数据
   * @returns Array
   */
  tranfEnumOptionsToArray: (obj) => {
    if (obj && obj.options) {
      return Object.values(obj.options)
    }
    return []
  },
}

export default ParseUtils
