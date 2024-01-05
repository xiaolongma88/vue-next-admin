export const ROLE_SHARE_STATUS_ENUMS = {
    label: '是否共享',
    value: 'ROLE_SHARE_STATUS_ENUMS',
    options: {
        // 'success' | 'info' | 'warning' | 'danger' | ''
        '0': {value: 0, label: '共享', echo: '共　享', tagType: 'danger'},
        '1': {value: 1, label: '不共享', echo: '不共享', tagType: ''},
    }
}

export const ROLE_TYPE_ENUMS = {
    label: '角色类型',
    value: 'ROLE_TYPE_ENUMS',
    options: {
        // 'success' | 'info' | 'warning' | 'danger' | ''
        '0': {value: 0, label: '管理员', echo: '管理员', tagType: 'danger'},
        '1': {value: 1, label: '财政', echo: '财政', tagType: ''},
        '2': {value: 2, label: '单位', echo: '单位', tagType: ''},
        '3': {value: 3, label: '部门', echo: '部门', tagType: ''},
        '4': {value: 4, label: '金融机构', echo: '金融机构', tagType: ''},
        '5': {value: 5, label: '监管机构', echo: '监管机构', tagType: ''}
    }
}

export const ROLE_STATUS_ENUMS = {
    label: '角色状态',
    value: 'ROLE_STATUS_ENUMS',
    options: {
        '0': {value: '0', label: '停用', echo: '停用', tagType: 'danger'},
        '1': {value: '1', label: '启用', echo: '启用', tagType: ''},
    }
}

export default {
    label: '角色选项',
    value: 'role'
}
