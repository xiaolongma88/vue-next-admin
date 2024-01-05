
export default {
  isNull: (val) => {
    return val === null
  },
  isUndef: (val) => {
    return typeof val === 'undefined'
  },
  /** 是否不为空 */
  isNotEmpty(value) {
    return !(value === '' || value === undefined || value === null)
  },
  isNullOrUndef: (val) => {
    return this.isNull(val) || this.isUndef(val)
  },
  isReqTimeout: (error) => {
    return error.code === 'ECONNABORTED' || error.message === "Network Error" || error.message.includes("timeout")
  },
  /**
   * 是否外连地址
   *
   * @param {String} path 访问路径
   * @returns Boolean
   */
  isExternal: (path) => {
    return /^(https?:|mailto:|tel:)/.test(path)
  },
  /**
   * 判断路径是否是http或https
   * @param {String} path 访问路径
   * @returns Boolean
   */
  isHttpPath: (path) => {
    return path.indexOf('http://') !== -1 || path.indexOf('https://') !== -1
  },
  /**
    * 判断是否包含
    * @param {String} applyId applyId
    * @returns Boolean true 包含 fasle 不包含
    */
  isInclude: (tableData, applyId) => {
    let isFind = false
    var index = tableData.findIndex(item => item.applyId === applyId)
    if (index === -1) { // 不包含
      isFind = false
    } else {
      isFind = true // 包含
    }
    return isFind
  },
  /**
   * 是否地市用户
   *
   * @param {String} adCode 区划编码
   * @returns Boolean true|false
   */
  isCityUser: (adCode) => {
    if (adCode && (adCode.length / 2 === 2)) {
      return true
    } else {
      return false
    }
  },
  /**
   * 是否区县用户
   *
   * @param {String} adCode 区划编码
   * @returns Boolean true|false
   */
  isCountyUser: (adCode) => {
    if (adCode && (adCode.length / 2 === 3)) {
      return true
    } else {
      return false
    }
  },
  /**
   * 是否省级用户
   *
   * @param {String} adCode 区划编码
   * @returns Boolean true|false
   */
  isProvinceUser: (adCode) => {
    console.log('adCode', adCode)
    if (adCode && (adCode.length / 2 === 1)) {
      return true
    } else {
      return false
    }
  }
}
