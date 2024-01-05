// 表单类型配置
export const FILL_FORM_TYPE_CONFIG = {
  'YHS': { value: 'yhs', desc: '一户式' },
  'ADD': { value: 'add', desc: '新增' },
  'EDIT': { value: 'edit', desc: '修改' },
  'VIEW': { value: 'view', desc: '查看' },
  'ATTY': { value: 'atty', desc: '律所' },
  'ACCT': { value: 'acct', desc: '会所' },
  'STANDBY': { value: 'standby', desc: '备选项目' },
  'FINANCE': { value: 'finance', desc: '财评报告' },
}

// 一户式类型常量与表单ID配置
export const YHS_PROJ_FORM_CONFIG = {
  // 专项
  'SP': { value: 'SP', formCode: 'special_bond_reserve_form_yhs', formType: FILL_FORM_TYPE_CONFIG.YHS.value },
  // 一般
  'GE': { value: 'GE', formCode: 'base_bond_reserve_form_yhs', formType: FILL_FORM_TYPE_CONFIG.YHS.value },
  // 备选
  'ST': { value: 'ST', formCode: 'standby_project_filling_form_yhs', formType: FILL_FORM_TYPE_CONFIG.YHS.value },
  // 律师事务所
  'AT': { value: 'AT', formCode: 'fin_legal_report_upload_form', formType: FILL_FORM_TYPE_CONFIG.YHS.value },
  // 财评报告
  'FD': { value: 'FD', formCode: 'fin_legal_report_upload_form', formType: FILL_FORM_TYPE_CONFIG.YHS.value },
  // 专家评分
  'EXP': { value: 'EXP', formCode: 'zjps_form_yhs', formType: FILL_FORM_TYPE_CONFIG.YHS.value },
}

// 表单填报常量与表单ID配置
export const FILL_PROJ_FORM_CONFIG = {
  // 专项
  'SP': { value: 'SP', formCode: 'special_bond_reserve_form' },
  // 一般
  'GE': { value: 'GE', formCode: 'base_bond_reserve_form' },
  // 备选
  'ST': { value: 'ST', formCode: 'standby_project_filling_form' },
  // 律师事务所
  'AT': { value: 'AT', formCode: 'fin_legal_report_upload_form' },
  // 财评报告
  'FD': { value: 'FD', formCode: 'fin_legal_report_upload_form' },
}

export const FILL_INFO_FORM_CONFIG = {
  // 机构信息维护
  'INFO_AG': { value: 'INFO_AG', formCode: 'agency_info_form' },
  // 专家信息维护
  'INFO_EXP': { value: 'INFO_EXP', formCode: 'system_zjgl_manage' },
  // 会所律师信息维护
  'INFO_LAW_ACC': { value: 'INFO_LAW_ACC', formCode: 'fin_repo_legal_opinion_form' },
}

// 表单页签的取值
export const FORM_TAB_PANEL_CONFIG = {
  'JBXX': { value: 'jbxx', label: '基本信息' },
  'QQZB': { value: 'qqzb', label: '前期准备' },
  'BCSB': { value: 'bcsb', label: '本次申报' },
  'TZJH': { value: 'tzjh', label: '投资计划' },
  'SZYS': { value: 'szys', label: '收支预算' },
  'XMPF': { value: 'xmpf', label: '项目评分' },
  'ATTA': { value: 'atta', label: '附件' },
}

// 获取填报表单类型
export const getFillFormTypeArray = () => {
  let FillFormTypeArray = []
  Object.keys(FILL_FORM_TYPE_CONFIG).forEach(key => {
    FillFormTypeArray.push(FILL_FORM_TYPE_CONFIG[key].value)
  })
  return FillFormTypeArray
}
