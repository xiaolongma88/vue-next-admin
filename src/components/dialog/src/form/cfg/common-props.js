import RkUtils from '@/utils/rk-utils.js'

// 填报的props定义
export const FillingProps = {
  // 单位ID
  agId: { type: String, default: '' },
  // 区划编码
  adCode: { type: String, default: '' },
  // 单位名称
  agName: { type: String, default: '' },
  // 单位编码
  agCode: { type: String, default: '' },
  // 父级单位ID
  agParentId: { type: String, default: '' },
  // 父级单位名称
  agParentName: { type: String, default: '' },
  // 项目ID
  proId: { type: String, default: RkUtils.getGuid() },
  // 储备表单ID
  formId: { type: String, default: '' },
  // 表单CODE
  formCode: { type: String, default: '' },
  // 表单类型
  formType: { type: String, default: '' },
  // 项目类型 GE-一般项目|SP-专项项目
  proType: { type: String, default: '' },
  // 本次申报Id
  applyId: { type: String, default: '' },
  // 是否预算单位: 1 是 2 否
  isBgtAg: { type: String, default: '1' },
  // 项目来源 1：基础库 2：储备库 3:需求库 4：历史项目 5、一体化同步项目 6、存量债务无项目生成项目
  proSource: { type: String, default: '2' },
  // 流程标识
  processKey: { type: String, default: '' },
  // 面板类型
  buttonCode: { type: String, default: 'add' },
  // 附件规则
  busiType: { type: String, default: 'ET001' },
  // 债券类型
  bondTypeCode: { type: String, default: '' },
  // tab选中的页签
  defaultTabActiveName: { type: String }
}

export const UploadeProps = {
  // 项目ID
  proId: { type: String, default: '' },
  // 储备表单ID
  formId: { type: String, default: '' },
  // 申报ID
  applyId: { type: String, default: '' },
  // 表单CODE
  formCode: { type: String, default: '' },
  // 表单类型
  formType: { type: String, default: 'yhs' },
  // 附件规则
  busiType: { type: String, default: 'ET001' },
  // 面板类型
  buttonCode: { type: String, default: 'add' },
  // 规则ID
  ruleId: { type: String, default: '' },
  // tab选中的页签
  defaultTabActiveName: { type: String }
}

// 机构维护信息填报和会所律所信息的props定义
export const AgencyProps = {
  formCode: { type: String, required: true },
  // 机构ID
  agencyId: { type: String, default: '' },
  // 机构类型 类型 1机构 2-会计 3-律师
  organizationType: { type: [String, Number], default: '1' },
  // 面板类型
  buttonCode: { type: String, default: 'add' },
}