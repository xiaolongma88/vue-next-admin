

// --------- 下拉枚举项 (可作为表单枚举选项) --------- //
export const MENU_TYPE_ENUMS = {
  label: '菜单类型',
  value: 'MENU_TYPE_ENUMS',
  options: {
    '0': { value: 0, label: '菜单', echo: '菜单', color: '#2db7f5', tagType: 'danger' },
    '1': { value: 1, label: '按钮', echo: '按钮', color: '#ea76df', tagType: '' },
  }
}

export const MENU_INVISIBLE_ENUMS = {
  label: '菜单是否显示',
  value: 'MENU_INVISIBLE_ENUMS',
  options: {
      '0': { value: 0, label: '隐藏', echo: '隐藏', color: '#87d068', tagType: 'danger' },
      '1': { value: 1, label: '显示', echo: '显示', color: '#e6bd29', tagType: '' },
  }
}


// --------- 对象枚举项 --------- //
export const MENU_TYPE_CONS = {
  'MENU': MENU_TYPE_ENUMS.options['0'],
  'BUTTON': MENU_TYPE_ENUMS.options['1']
}



export default {
  label: '菜单选项',
  value: 'menu'
}
