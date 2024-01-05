import XEUtils from "xe-utils"

const RkGridConfig = {
  // 通用属性配置
  "initConfig": {
    // id属性
    "id": '',
    // 表格尺寸 medium, small, mini
    "size": 'small',
    // 表格数据
    "data": null,
    // 所有的列对齐方式
    "align": 'left',
    // 是否带有边框 [default（默认）, full（完整边框）, outer（外边框）, inner（内边框）, none（无边框）]
    "border": true,
    // 表格是否显示加载中
    "loading": false,
    // 是否带有斑马纹
    "stripe": true,
    // 表格高度 [number | string] [auto, %, px]
		"height": 'auto',
    // 是否自动监听父元素的变化去重新计算表格
    "autoResize": true,
    // 保持原始值的状态，被某些功能所依赖
    "keepSource": false,
    // 所有的表头列的对齐方式 left（左对齐）, center（居中对齐）, right（右对齐）
    "headerAlign": 'center',
    // 设置所有内容过长时显示为省略号
    "showOverflow": true,
    // 设置表头所有内容过长时显示为省略号
    "showHeaderOverflow": true,
    // 设置表尾所有内容过长时显示为省略号
    "showFooterOverflow": true,
    // 给表头的行附加 className
    "headerRowClassName": 'rk-grid-header-row',
    // 给表头的单元格附加 className
    "headerCellClassName": 'rk-grid-header-cell',
    // 给表尾的行附加 className
    "footerRowClassName": 'rk-grid-footer-row',
    // 给表尾的单元格附加 className
    "footerCellClassName": 'rk-grid-footer-cell'
  },
  // 行配置信息
  "rowConfig": {
    // 当鼠标移到行时，是否要高亮当前行
    "isHover": true,
    // 当鼠标点击行时，是否要高亮当前行
		"isCurrent": true
  },
  // 排序配置
  "sortConfig": {
    // 所有列是否使用服务端排序
    "remote": false,
    // 触发方式 default（点击按钮触发）, cell（点击表头触发）
    "trigger": "cell",
    // 是否显示列头排序图标
    "showIcon": true,
  },
  "proxyConfig": {
    "seq": true,
    "props": { result: 'result', total: 'total' },
  },
  // 通用分页配置
	'pagerConfig': {
		"layouts": ['Sizes','PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'FullJump', 'Total'],
		"border": true,
		"pageSize": 20,
		"pageSizes": [20, 50, 100, 200],
		"background": true,
    "className": 'rk-grid-pager'
	},
  // 单选通用配置
	'radioConfig': {
    // 触发方式
		"trigger": 'row',
    // 高亮选中行
		"highlight": true
	},
  // 多选通用配置
	'checkboxConfig': {
    // 开启复选框范围选择功能
		"range": false,
    // 触发方式
		"trigger": 'cell',
    // 高亮勾选行
		"highlight": false
	},
  // 列配置信息
  "columnConfig": {
    // 每一列是否启用列宽调整
    "resizable": true
  },
  // 提示配置
  "tooltipConfig": {
    // 所有单元格开启工具提示
    "showAll": true,
    // 鼠标是否可进入到工具提示中
		"enterable": true
  },
  // 工具栏配置
  "toolbarConfig": {
    // 是否允许最大化
    "zoom": true,
    // 自定义列配置
    "custom": false,
    // 刷新
    "refresh": true,
    // 给工具栏 className
    "className": 'rk-grid-toolbar',
    // 插槽配置
		"slots": {
      // 右侧工具列表
			"tools": 'toolbar_tools',
      // 按钮列表
			"buttons": 'toolbar_buttons',
		}
  },
  // 编辑配置
	'editConfig': {
    //编辑模式
		"mode": 'cell',
    //自定义可编辑列的状态图标
		"icon": 'fa fa-pencil-square-o',
    //触发方式
		"trigger": 'click',
    //enabled
		"enabled": true,
    // 是否显示单元格新增与修改状态 为true时，需要keepSource为true 
		"showStatus": false
	}
}

export default XEUtils.clone(RkGridConfig, true)
