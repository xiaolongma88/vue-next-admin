// 菜单状态
export const AD_STATUS_ENUMS = {
  '1': { code: '1', text: '启用', color: '#87d068' },
  '2': { code: '2', text: '停用', color: "#f50" }
}

export const AD_STATUS = {
  OPEN: AD_STATUS_ENUMS['1'].code.toString(),
  STOP: AD_STATUS_ENUMS['2'].code.toString()
}
