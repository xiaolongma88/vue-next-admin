import XEUtils from 'xe-utils'
import IsUtils from '@/utils/is-utils.js'
import RKUtils from '@/utils/rk-utils.js'
import { EnumsDataPools } from '@/enums'

import {
  // 全局对象
  VXETable,

  // 表格功能
  Filter,
  Edit,
  // Menu,
  // Export,
  // Keyboard,
  Validator,

  // 可选组件
  Icon,
  Column,
  // Colgroup,
  Grid,
  Tooltip,
  Toolbar,
  Pager,
  // Form,
  // FormItem,
  // FormGather,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  // Switch,
  Input,
  Select,
  // Optgroup,
  Option,
  // Textarea,
  Button,
  Modal,
  // List,
  Pulldown,

  // 表格
  Table
} from 'vxe-table'
import zhCN from 'vxe-table/es/locale/lang/zh-CN'

// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VXETable.setup({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})

/**
 * 渲染表格数据内容为空时显示
 */
VXETable.formats.add('emptyText', {
  cellFormatMethod ({ cellValue }) {
    return IsUtils.isNotEmpty(cellValue) ? cellValue : ''
  }
})
// 格式化金额显示：万 （小数点后补零）
VXETable.formats.add('formatThousand', {
  cellFormatMethod ({ cellValue }, digits = 2, fillZero = true) {
    return IsUtils.isNotEmpty(cellValue) ? RKUtils.formatAmount(cellValue, digits, fillZero) : ''
  }
})
// 格式化金额显示：元 （小数点后补零）
VXETable.formats.add('formatAmountBit', {
  cellFormatMethod ({ cellValue }, digits = 2, fillZero = true) {
    return IsUtils.isNotEmpty(cellValue) ? RKUtils.formatAmount(cellValue, digits, fillZero) : ''
  }
})
// 本地枚举数据表格字段通用回显
VXETable.formats.add('enumsFormats', {
  cellFormatMethod ({ cellValue }, enumName) {
    let echoValue = cellValue
    if (enumName && IsUtils.isNotEmpty(cellValue)) {
      let enumOption = EnumsDataPools[enumName].options[cellValue]
      echoValue = enumOption ? enumOption.echo || enumOption.label || '' : ''
    }
    return echoValue
  }
})


// 本地枚举数据表格字段通用回显
VXETable.renderer.add('enumsRender', {
  renderDefault(renderOpts, params) {
    const { row, column } = params
    const { enumName, isTag } = renderOpts
    const cellValue = row[column.field]
    let echoValue = cellValue
    let tagType = ''
    if (enumName && IsUtils.isNotEmpty(cellValue)) {
      let enumOption = EnumsDataPools[enumName].options[cellValue]
      echoValue = enumOption ? enumOption.echo || enumOption.label || '' : ''
      tagType = enumOption ? enumOption.tagType || '' : ''
    }
    return isTag ?  [
      <el-tag type={tagType}>{echoValue}</el-tag>
    ] : echoValue
  }
})



function useTable (app) {
  // 表格功能
  app.use(Filter)
  .use(Edit)
  // .use(Menu)
  // .use(Export)
  // .use(Keyboard)
  .use(Validator)

  // 可选组件
  app.use(Icon)
  .use(Column)
  // .use(Colgroup)
  .use(Grid)
  .use(Tooltip)
  .use(Toolbar)
  .use(Pager)
  // .use(Form)
  // .use(FormItem)
  // .use(FormGather)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Radio)
  .use(RadioGroup)
  .use(RadioButton)
  // .use(Switch)
  .use(Input)
  .use(Select)
  // .use(Optgroup)
  .use(Option)
  // .use(Textarea)
  .use(Button)
  .use(Modal)
  // .use(List)
  .use(Pulldown)

  // 安装表格
  .use(Table)

  // 给 vue 实例挂载内部对象，例如：
  // app.config.globalProperties.$XModal = VXETable.modal
  // app.config.globalProperties.$XPrint = VXETable.print
  // app.config.globalProperties.$XSaveFile = VXETable.saveFile
  // app.config.globalProperties.$XReadFile = VXETable.readFile
}

export default useTable
