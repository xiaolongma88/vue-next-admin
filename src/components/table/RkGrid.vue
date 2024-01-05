<template>
  <vxe-grid v-bind="gridOption"
    ref="rkGridRef"
    class="rk-grid"
    :loading="loading"
    :spanMethod="spanMethod"
    @cell-click="cellClick"
    @page-change="pageChange"
    @edit-closed="editClosed"
    @radio-change="radioSelectChange"
    @cell-dblclick="cellDblclick"
    @checkbox-all="checkboxSelectAll"
    @current-change="currentChange"
    @checkbox-change="checkboxSelectChange">
    <!-- 取消单选 -->
    <template #radio_header>
      <el-button link
        type="primary"
        size="small"
        :disabled="!radioSelectedRow"
        @click="clearRadioSelected">取消
      </el-button>
    </template>
    <!-- 工具栏插槽 -->
    <template #toolbar_buttons>
      <template v-if="$slots['toolbar_buttons']">
        <slot name="toolbar_buttons"></slot>
      </template>
      <template v-else>
        <div :class="ns.b('toolbar-title')"
          v-show="title">
          <span :class="ns.be('toolbar-title', 'span')"
            class="fn-inline">{{ title }}</span>
          <i :class="ns.be('toolbar-title', 'i')"
            class="fn-inline"></i>
        </div>
        <div :class="ns.b('toolbar-left')">
        </div>
        <div :class="ns.b('toolbar-right')">
          <div class="toolbar-right-slot">
            <slot name="toolbar_title_buttons"></slot>
          </div>
          <div class="toolbar-right-button"></div>
        </div>
      </template>
    </template>
    <template #toolbar_tools>
      <slot name="toolbar_tools"></slot>
    </template>
    <!-- 自定义字段插槽 -->
    <template v-for="columnsSlot in columnSlots"
      v-slot:[columnsSlot]="{ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, _columnIndex }">
      <slot :name="columnsSlot"
        v-bind="{ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, _columnIndex }">
      </slot>
    </template>
  </vxe-grid>
</template>

<script setup name="RkGrid">
import XEUtils from 'xe-utils'
import RKUtils from '@/utils/rk-utils.js'
import GridUtils from './config/grid-utils'
import MathUtils from '../../utils/math-utils'
import RkGridConfig from './config/grid-config'
import { useNamespace } from "element-plus"

const ns = useNamespace("grid", ref("rk"))

const props = defineProps({
  // 表格Id
  id: { type: String },
  // 表格数据
  data: { type: Array },
  // 表格类型
  type: { type: String },
  // 表格标题
  title: { type: String, default: '' },
  // 表格高度
  height: { type: [Number, String], default: 'auto' },
  // 是否进行加密传输
  secret: { type: [Boolean], default: false },
  // 请求方式
  method: { type: [String], default: 'post' },
  // 请求参数
  params: { type: Object, default: () => ({}) },
  // 请求地址
  dataUrl: { type: String, validator: (value) => !XEUtils.isEmpty(value) },
  // 加载中
  loading: { type: Boolean, default: false },
  // 表格字段
  columns: { type: Array },
  // 是否自动加载
  autoLoad: { type: Boolean, default: true },
  // 数据唯一主键的字段名
  keyField: { type: String },
  // 参数类型 data|params
  paramsType: { type: String, default: 'data' },
  // 保持原始值的状态
  keepSource: { type: [Boolean], default: false },
  // 行号配置 true|false, 'left', 'right'
  seqConfig: { type: [Boolean, String], default: true },
  // 选框配置 true-默认checkbox | false | checkbox | radio | { mode: 'checkbox|radio' , fixed: 'true|false' }
  boxConfig: { type: [Boolean, String, Object], default: false },
  // 行配置
  rowConfig: { type: [Object] },
  // 字段排序配置
  sortConfig: { type: [Boolean, Object], default: true },
  // 编辑配置
  editConfig: { type: [Boolean, Object], default: false },
  //编辑校验
  editRules: { type: [Boolean, Object], default: false },
  // 分页配置：默认-true
  pagerConfig: { type: [Boolean, Object], default: true },
  // 表格工具栏
  toolbarConfig: { type: [Boolean, Object], default: true },
  // 给行附加 className
  rowClassName: { type: [String, Function], default: '' },
  // 数据代理回调方法
  responseHandle: [Function],
  // 表尾的数据获取方法，返回一个二维数组
  footerMethod: { type: [Array, Object, Function] },
  // 表尾部需要合计参数
  footerConfig: {
    type: Object,
    default: {
      showFooter: false,
      footerParams: [],
    }
  },
  // 合并行方法
  spanMethod: { type: [Object, Function] },
  // 设置表头所有内容过长时显示为省略号
  showHeaderOverflow: { type: [Boolean], default: true },
  // 设置表尾所有内容过长时显示为省略号
  showFooterOverflow: { type: [Boolean], default: true },
})

// 定义向外暴露的emit
const emit = defineEmits([
  'loaded', 'radioChange', 'checkboxAll', 'checkboxChange',
  'pageChange', 'currentChange', 'cellClick', 'cellDblclick',
  'editClosed', 'refresh'
])

// 组件mount之前
onBeforeMount(() => {
  initGridConfig()
})

// 监听props.data
watch(
  () => props.data,
  (newValue, oldValue) => {
    gridOption.data = newValue
  },
  { deep: true, immediate: false }
)
// 监听props.columns
watch(
  () => props.columns,
  (newValue, oldValue) => {
    initColumnsConfig()
  },
  { deep: true, immediate: false }
)
// 监听props.params
watch(
  () => props.params,
  (newValue, oldValue) => {
    if (!XEUtils.isEmpty(newValue)) {
      queryParams.value = props.params
    }
  },
  { deep: true, immediate: false }
)
// 监听props.params
watch(
  () => props.editConfig,
  (newValue, oldValue) => {
    if (!XEUtils.isEmpty(newValue)) {
      initEditConfig()
    }
  },
  { deep: true, immediate: false }
)

// 表格的Ref对象
const rkGridRef = ref()
// 表格的默认配置
const gridOption = reactive({
  ...RkGridConfig.initConfig,
  columns: []
})
// 表格查询参数
const queryParams = ref({})
const cacheParams = ref({})

/** 初始化表格配置 */
const initGridConfig = function () {
  initBaseConfig()
  initRowConfig()
  initSortConfig()
  initPagerConfig()
  initProxyConfig()
  initToolbarConfig()
  initColumnsConfig()
  initCheckboxConfig()
  initTooltipConfig()
  initEditConfig()
  initFooterConfig()
  initRowClassName()
}
/** 加载基础配置 */
const initBaseConfig = function () {
  // 同步prop信息到gridOpions中
  Reflect.ownKeys(RkGridConfig.initConfig).forEach(key => {
    if (props[key]) gridOption[key] = props[key]
  })
  // 初始化查询参数
  if (!XEUtils.isEmpty(props.params)) {
    queryParams.value = props.params
    cacheParams.value = XEUtils.clone(props.params, true)
  }
}
/** 初始化行配置 */
const initRowConfig = function () {
  const { keyField, rowConfig } = props
  let newRowConfig = { ...RkGridConfig.rowConfig }
  if (rowConfig) {
    newRowConfig = { ...newRowConfig, ...rowConfig }
  }
  if (keyField) newRowConfig['keyField'] = keyField
  gridOption['rowConfig'] = newRowConfig
}
/** 初始化序号字段 */
const initSeqConfig = function () {
  const { seqConfig } = props
  return GridUtils.getSeqColumn(seqConfig)
}
/** 初始化选框字段 */
const initBoxConfig = function () {
  const { boxConfig, seqConfig } = props
  const { mode, column } = GridUtils.getBoxColumn(boxConfig, seqConfig)
  gridOption[`${mode}Config`] = {
    ...RkGridConfig[`${mode}Config`],
    ...props[`${mode}Config`]
  }
  return column
}
/**
 * 初始化复选框的配置
 */
const initCheckboxConfig = function () {
  if (props.checkboxConfig) {
    gridOption['checkboxConfig'] = { ...RkGridConfig.checkboxConfig, ...props.checkboxConfig }
  }
}
/**
 * 初始化行样式
 */
const initRowClassName = function () {
  if (props.rowClassName) {
    gridOption['rowClassName'] = props.rowClassName
  }
}
/** 初始化排序 */
const initSortConfig = function () {
  if (props.sortConfig) {
    gridOption['sortConfig'] = { ...RkGridConfig.sortConfig, ...props.sortConfig }
  }
}
/** 初始化表尾部 */
const initFooterConfig = function () {
  if (props.footerConfig.showFooter) {
    gridOption['showFooter'] = props.footerConfig.showFooter
    gridOption['footerMethod'] = footerMethod
  } else {
    gridOption['showFooter'] = false
  }
}
/** 表尾方法 */
const footerMethod = ({ columns }) => {
  const data = rkGridRef.value.getData()
  let footerData = ['合计']
  let fieldTotal = 0
  columns.forEach((item, index) => {
    footerData.push('')
    for (var i = 0; i < props.footerConfig.footerParams.length; i++) {
      let element = props.footerConfig.footerParams[i]
      element = element.replace('', ' ').trim()
      if (item.property === element) {
        const { field } = item
        fieldTotal = RKUtils.formatThousand(handleCalcAmt(data, field))
        footerData.splice(index, 1, fieldTotal)
      }
    }
  })
  return [footerData]
}
/** 计算表尾数据 */
const handleCalcAmt = (records, field) => {
  let count = 0
  records.forEach(row => {
    count = MathUtils.mathAdd(count, Number(row[field]))
  })
  return count
}
/** 初始化分页配置 */
const initPagerConfig = function () {
  const { pagerConfig } = props
  const finalPagerConfig = RkGridConfig.pagerConfig
  if (pagerConfig && XEUtils.isBoolean(pagerConfig)) {
    gridOption['pagerConfig'] = { ...finalPagerConfig }
  }
  if (pagerConfig && XEUtils.isObject(pagerConfig)) {
    gridOption['pagerConfig'] = {
      ...finalPagerConfig,
      ...pagerConfig
    }
  }
}
/** 初始化数据代理配置 */
const initProxyConfig = function () {
  const { data, autoLoad, dataUrl } = props
  // 传入数据则不使用数据代理
  if (!data) {
    if (dataUrl) {
      const proxyConfig = {
        ...RkGridConfig.proxyConfig,
        autoLoad: autoLoad,
        ajax: { query: ({ page }) => initProxyQuery({ page }) }
      }
      gridOption['proxyConfig'] = proxyConfig
    } else {
      console.error('dataUrl值不能为空!')
    }
  }
}
/** 初始化数据代理请求 */
const initProxyQuery = function ({ page }) {
  const { method, dataUrl, paramsType, pagerConfig, responseHandle } = props
  const proxyQuery = GridUtils.getProxyQuery({
    page, params: queryParams.value, method, dataUrl, paramsType, pagerConfig
  })
  return new Promise(reslove => {
    setTimeout(() => {
      let tableData = []
      let finalData = {}
      let finalKeys = RkGridConfig.proxyConfig.props
      proxyQuery.then(res => {
        const { code, data, msg } = res
        if (code === 200) {
          tableData = pagerConfig ? data.rows : data
          // 数据回调处理
          if (responseHandle) tableData = responseHandle(tableData)
          if (pagerConfig) {
            finalData = {}
            finalData[finalKeys.total] = data.records
            finalData[finalKeys.result] = tableData
          } else {
            finalData = tableData
          }
        } else {
          console.error(msg)
          if (pagerConfig) {
            finalData = {}
            finalData[finalKeys.total] = 0
            finalData[finalKeys.result] = []
          } else {
            finalData = []
          }
        }
        reslove(finalData)
        emit('loaded', finalData)
      }).catch(err => {
        console.error(err)
        if (pagerConfig) {
          finalData[finalKeys.total] = 0
          finalData[finalKeys.result] = []
        } else {
          finalData = []
        }
        reslove(finalData)
      })
    }, 100)
  })
}
/** 初始化表格字段配置 */
const columnSlots = ref([])
const initColumnsConfig = function () {
  gridOption['columnConfig'] = { ...RkGridConfig.columnConfig }
  const finalColumns = GridUtils.parseColumns(props.columns)
  columnSlots.value = GridUtils.getColumnSlots(props.columns)
  gridOption.columns = [
    ...initBoxConfig(),
    ...initSeqConfig(),
    ...finalColumns
  ]
}
/** 初始化工具栏配置 */
const initToolbarConfig = function () {
  const { toolbarConfig } = props
  let finalToolbarConfig = RkGridConfig.toolbarConfig
  // 自定义刷新方法
  finalToolbarConfig.refresh = {
    queryMethod: () => {
      return new Promise((reslove, reject) => {
        if (props.dataUrl) {
          searchEvent()
          reslove(true)
        } else {
          // console.log('queryMethod2')
          emitRefresh()
          reslove(true)
        }
      })
    }
  }
  if (toolbarConfig && XEUtils.isBoolean(toolbarConfig)) {
    gridOption['toolbarConfig'] = { ...finalToolbarConfig }
  }
  if (toolbarConfig && XEUtils.isObject(toolbarConfig)) {
    gridOption['toolbarConfig'] = { ...finalToolbarConfig, ...toolbarConfig }
  }
}
/** 初始化提示配置 */
const initTooltipConfig = function () {
  const { tooltipConfig } = props
  let finalTooltipConfig = RkGridConfig.tooltipConfig
  if (tooltipConfig) {
    finalTooltipConfig = { ...finalTooltipConfig, ...tooltipConfig }
  }
  gridOption['tooltipConfig'] = { ...finalTooltipConfig }
}
// 初始化编辑配置
const initEditConfig = function () {
  const { editConfig, keepSource } = props
  let config = null
  const finaleditConfig = RkGridConfig.editConfig
  if (editConfig && XEUtils.isObject(editConfig)) {
    config = { ...finaleditConfig, ...editConfig }
    config.showStatus = keepSource
  }
  if (editConfig && XEUtils.isBoolean(editConfig)) {
    config = { ...finaleditConfig }
  }
  if (config) gridOption['editConfig'] = config
}

// ----- 表格数据操作
/** 还原数据，需要keep-source开启，还原指定row或表格 */
const revertData = function (row) {
  return rkGridRef.value.revertData(row)
}
/** 重载数据 */
const reloadData = function (data) {
  return rkGridRef.value.reloadData(data)
}
/** 重载数据 */
const reloadRow = function (row, record, field) {
  rkGridRef.value.reloadRow(row, record, field)
}
/** 获取表格数据 */
const getTableData = function () {
  return rkGridRef.value.getTableData()
}
/** 设置表格数据 */
const setTableData = function (data) {
  gridOption.data = data
}

// ----- 表格异步操作
/** 重置表格查询   */
const resetEvent = function (params) {
  const cacheParamsData = XEUtils.clone(cacheParams.value, true)
  queryParams.value = { ...cacheParamsData, ...params }
  rkGridRef.value.commitProxy('reload')
  return cacheParamsData
}
/** 查询表格数据 */
const searchEvent = function (params) {
  radioSelectedRow.value = null
  setTimeout(() => {
    if (rkGridRef.value) {
      rkGridRef.value.commitProxy('reload')
    }
  }, 100)
}

// ----- 单选框操作
const radioSelectedRow = ref()
const clearRadioRow = function () {
  radioSelectedRow.value = null
  rkGridRef.value.clearRadioRow()
  rkGridRef.value.clearCurrentRow()
}
const removeRadioRow = function () {
  return rkGridRef.value.removeRadioRow()
}
const radioSelectChange = function (params) {
  radioSelectedRow.value = params.row
  emit('radioChange', params)
}
const clearRadioSelected = function () {
  clearRadioRow()
  emit('radioChange', null)
}
const getRadioRecord = function () {
  return rkGridRef.value.getRadioRecord()
}

// ----- 复选框操作
const checkboxSelectAll = function (item) {
  emit('checkboxAll', item)
}
const checkboxSelectChange = function (item) {
  emit('checkboxChange', item)
}
const getCheckboxRecords = function () {
  return rkGridRef.value.getCheckboxRecords()
}
const setCheckboxRow = function (rows, checked) {
  return rkGridRef.value.setCheckboxRow(rows, checked)
}
const clearCheckboxRow = function () {
  rkGridRef.value.clearCheckboxRow()
  rkGridRef.value.clearCurrentRow()
}
const removeCheckboxRow = function () {
  return rkGridRef.value.removeCheckboxRow()
}

// ----- 分页相关操作
const pageChange = function (params) {
  emit('pageChange', params)
}

// ----- 表格其他操作
const cellClick = function (params, e) {
  emit('cellClick', params)
}
const cellDblclick = function (params) {
  emit('cellDblclick', params)
}
const currentChange = function (params) {
  emit('currentChange', params)
}


// ----- 表格编辑操作
// 单元格编辑状态下被关闭时会触发该事件
const editClosed = function (params) {
  emit('editClosed', params)
}

const getData = function () {
  return rkGridRef.value.getData()
}

// 只对 keep-source 开启有效，获取已修改的数据
const getUpdateRecords = function () {
  return rkGridRef.value.getUpdateRecords()
}
// 用于 edit-config，获取已激活的行数据
const getEditRecord = function () {
  return rkGridRef.value.getEditRecord()
}
// 判断行是否为激活编辑状态
const isEditByRow = function (row) {
  return rkGridRef.value.isEditByRow(row)
}
// 激活行编辑并激活第一个单元格
const setEditRow = function (row) {
  return rkGridRef.value.setEditRow(row)
}
// 手动清除单元格激活状态
const clearEdit = function () {
  return rkGridRef.value.clearEdit()
}
// 选中指定的单元格
const setEditCell = function (row, fieldOrColumn) {
  return rkGridRef.value.setEditCell(row, fieldOrColumn)
}
/**
 * 手动清空单元格内容，如果不创参数，则清空整个表格内容，
 * 如果传了行则清空指定行内容，如果传了指定字段，则清空该字段内容
 */
const clearData = function (rows, field) {
  rkGridRef.value.clearData(rows, field)
}
/**
 * 手动清除表格所有条件，还原到初始状态
 * （对于增删改查的场景中可能会用到，比如在数据保存之后清除表格缓存）
 */
const clearAll = function () {
  rkGridRef.value.clearAll()
}

// ----- 添加删除表格操作
// 用于 edit-config，获取插入的临时数据
const getInsertRecords = function () {
  return rkGridRef.value.getInsertRecords()
}
// 获取已删除的数据
const getRemoveRecords = function () {
  return rkGridRef.value.getRemoveRecords()
}
// 判断行是否为插入的临时数据
const isInsertByRow = function (row) {
  return rkGridRef.value.isInsertByRow(row)
}
// 往表格插入临时数据，从指定位置插入一行或多行；第二个参数：row 指定位置、null从第一行插入、-1 从最后插入
const insertAt = function (record, row = -1) {
  return rkGridRef.value.insertAt(record, row)
}
// 删除指定行数据，指定 row 或 [row, ...] 删除多条数据，如果为空则删除所有数据
const remove = function (rows) {
  return rkGridRef.value.remove(rows)
}

// emits方法定义
const emitRefresh = () => {
  emit('refresh')
}
// 对外暴露方法
defineExpose({
  revertData,
  reloadData,
  reloadRow,
  getTableData,
  setTableData,
  clearRadioRow,
  removeRadioRow,
  getRadioRecord,
  getCheckboxRecords,
  setCheckboxRow,
  clearCheckboxRow,
  removeCheckboxRow,
  resetEvent,
  searchEvent,
  getData,
  getUpdateRecords,
  getEditRecord,
  isEditByRow,
  setEditRow,
  clearEdit,
  setEditCell,
  clearData,
  clearAll,
  getInsertRecords,
  getRemoveRecords,
  isInsertByRow,
  insertAt,
  remove
})
</script>

<style lang="scss" scoped>
</style>
