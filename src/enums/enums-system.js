export const REQUIRED_UPLOAD_STATUS = {
    label: '是否必传',
    value: 'REQUIRED_UPLOAD_STATUS',
    options: {
        'Y': { value: 'Y', label: '非必传', echo: '非必传', color: '#f50', tagType: '' },
        'N': { value: 'N', label: '必传', echo: '必　传', color: '#87d068', tagType: 'danger' },
    }
}
export const LIMIT_STATUS = {
    label: '是否限制',
    value: 'LIMIT_STATUS',
    options: {
        0: { value: 0, label: '不限制', echo: '不限制', color: '#f50', tagType: '' },
        1: { value: 1, label: '限制', echo: '限　制', color: '#87d068', tagType: 'danger' },
    }
}
export const UNIT_STATUS_ENUMS = {
    label: '单位状态',
    value: 'UNIT_STATUS_ENUMS',
    options: {
        '0': { value: '0', label: '停用', echo: '停用', color: '#f50', tagType: 'danger' },
        '1': { value: '1', label: '启用', echo: '启用', color: '#87d068', tagType: '' },
    }
}
export const LOGIN_MODE_ENUMS = {
    label: '登录模式',
    value: 'LOGIN_STATUS_ENUMS',
    options: {
        '0': { value: '0', label: '密码登录', echo: '密码登录' },
        '1': { value: '1', label: 'CA登录', echo: 'CA登录' },
        '2': { value: '2', label: '手机登录', echo: '手机登录' },
        '3': { value: '3', label: '三种都可', echo: '三种都可' },
    }
}

export const USER_STATUS_ENUMS = {
    label: '用户状态',
    value: 'USER_STATUS_ENUMS',
    options: {
        '1': { value: '1', label: '启用', echo: '启用', color: '#87d068', tagType: '' },
        '2': { value: '2', label: '停用', echo: '停用', color: '#f50', tagType: 'danger' },
    }
}

export const USER_TYPE = {
    label: '用户类型',
    value: 'USER_TYPE',
    options: {
        '0': { value: 0, code: 0, text: '单位', label: '单位', },
        '1': { value: 1, code: 1, text: '财政', label: '财政', },
        '2': { value: 2, code: 2, text: '部门', label: '部门', },
        '5': { value: 5, code: 5, text: '处室', label: '处室', },
    }
}

export default {
    label: '系统选项',
    value: 'system'
}
