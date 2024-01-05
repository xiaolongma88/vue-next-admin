import XEUtils from "xe-utils"
import { defAxios as request } from '@/utils/http';
const BoxOption = ['radio', 'checkbox']
const FixedOption = ['left', 'right']
const paramsOption = ['params', 'data']
const SeqColumn = { type: 'seq', width: 50, title: '序号', align: "center" }
const BoxColumn = {
  'radio': { type: 'radio', width: 60, align: "center",slots: { header: 'radio_header' }},
  'checkbox': { type: 'checkbox', width: 50, align: "center" }
}

const GridUtils = {
  /**
   * 获取序号字段
   *
   * @param {Boolean|String} seqConfig 序号配置
   * @returns Array 序号字段
   */
  getSeqColumn: function (seqConfig) {
    let seqColumn = null
    if (seqConfig && XEUtils.isString(seqConfig) && FixedOption.includes(seqConfig)) {
      seqColumn = XEUtils.clone(SeqColumn, true)
      seqColumn['fixed'] = seqConfig
    } else if(seqConfig && XEUtils.isBoolean(seqConfig)) {
      seqColumn = XEUtils.clone(SeqColumn, true)
    }
    return XEUtils.isEmpty(seqColumn) ? [] : [seqColumn]
  },
  /**
   * 获取选框字段信息
   * @param {String|Boolean|Object} boxConfig 选框配置
   * @param {Boolean|String} seqConfig 序号配置
   * @returns Object
   */
  getBoxColumn: function(boxConfig, seqConfig) {
    let boxMode = ''
    let boxColumn = null
    if (!XEUtils.isEmpty(boxConfig) && XEUtils.isString(boxConfig) && BoxOption.includes(boxConfig)) {
      boxColumn = XEUtils.clone(BoxColumn[boxConfig], true)
      boxColumn['fixed'] = 'left'
      boxMode = boxConfig
    }
    if (boxConfig && XEUtils.isBoolean(boxConfig)) {
      boxColumn = XEUtils.clone(BoxColumn['checkbox'], true)
      boxColumn['fixed'] = 'left'
      boxMode = 'checkbox'
    }
    // 如果序号浮动，那么选框也浮动
    if (boxColumn && seqConfig && XEUtils.isString(seqConfig) && FixedOption.includes(seqConfig)) {
      boxColumn['fixed'] = seqConfig
    }
    // 如果是对象，则自定义浮动
    if (boxConfig && XEUtils.isObject(boxConfig)) {
      const mode = boxConfig.hasOwnProperty('mode') ? boxConfig.mode : 'checkbox'
      boxMode = BoxOption.includes(mode) ? mode : 'checkbox'
      boxColumn = XEUtils.clone(BoxColumn[boxMode], true)
      if (boxConfig.hasOwnProperty('fixed')) {
        const fixed = boxConfig.fixed
        if (fixed && XEUtils.isString(fixed) && FixedOption.includes(fixed)) {
          boxColumn['fixed'] = fixed
        }
        if (fixed && XEUtils.isBoolean(fixed)) {
          boxColumn['fixed'] = 'left'
        }
      }
    }
    return {
      mode: boxMode,
      column: XEUtils.isEmpty(boxColumn) ? [] : [boxColumn]
    }
  },
  /**
   * 处理表格字段数据，添加一些通用属性
   *
   * @param {Array} columns 表格字段数组
   * @returns Array 处理过的表格字段数据
   */
  parseColumns: function (columns) {
    return columns.map(col => {
      // 表头文字居中
      if (!col.hasOwnProperty('headerAlign')) {
        col['headerAlign'] = 'center'
      }
      // 表格数据回显格式化
      if (!col.hasOwnProperty('formatter')) {
        col['formatter'] = 'emptyText'
      }
      // 处理合并表头
      if (col.children && col.children.length > 0) {
        col['sortable'] = false
        GridUtils.parseColumns(col.children)
      } else {
        if (!col.hasOwnProperty('sortable')) {
          col['sortable'] = true
        }
      }
      return col
    })
  },
  /**
   * 获取表格字段中定义的插槽数据
   *
   * @param {Array} columns 表格字段
   * @param {Array} columnSlots 表格字段定义插槽
   * @returns Array 收集的插槽数据
   */
  getColumnSlots: function (columns, columnSlots = []) {
    columns.forEach(col => {
      if (col.hasOwnProperty('slots')) {
        const { default : def, edit, header } = col.slots
        if (def && XEUtils.isString(def) && !columnSlots.includes(def)) {
          columnSlots.push(def)
        }
        if (edit && !columnSlots.includes(edit)) {
          columnSlots.push(edit)
        }
        if (header && !columnSlots.includes(header)) {
          columnSlots.push(header)
        }
      }
      if (col.children && col.children.length > 0) {
        columnSlots = GridUtils.getColumnSlots(col.children, columnSlots)
      }
    })
    return columnSlots
  },
  /**
   * 获取数据代理请求
   *
   * @param {Object} {
   *  page, params, method, dataUrl, paramsType, pagerConfig
   * }
   * @returns axios
   */
  getProxyQuery: function({ page, params, method,
    dataUrl, paramsType, pagerConfig }) {
    const reqConfig = {
      url: dataUrl,
      method: method
    }
    let finalParams = XEUtils.clone(params, true)
    if (pagerConfig) {
      finalParams = {
        ...finalParams,
        page: page.currentPage,
        pageSize: page.pageSize
      }
    }
    if (method === 'post') {
      if (paramsOption.includes(paramsType)) {
        reqConfig[paramsType] = finalParams
      } else {
        reqConfig['data'] = finalParams
      }
    } else {
      reqConfig['params'] = finalParams
    }
    return request(reqConfig)
  }
}

export default GridUtils
