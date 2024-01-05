export const WHETHER_ENUMS = {
    label: '通用是否选项',
    value: 'WHETHER_ENUMS',
    options: {
        '0': {value: '0', label: '否'},
        '1': {value: '1', label: '是'}
    }
}
export const WHETHER_NUM_ENUMS = {
    label: '通用是否选项',
    value: 'WHETHER_NUM_ENUMS',
    options: {
        '0': {value: 0, label: '否'},
        '1': {value: 1, label: '是'}
    }
}
export const COMMON_MONTH_ENUMS = {
    label: '通用月份选项',
    value: 'COMMON_MONTH_ENUMS',
    options: {
        '1': {value: '1', label: '1月'},
        '2': {value: '2', label: '2月'},
        '3': {value: '3', label: '3月'},
        '4': {value: '4', label: '4月'},
        '5': {value: '5', label: '5月'},
        '6': {value: '6', label: '6月'},
        '7': {value: '7', label: '7月'},
        '8': {value: '8', label: '8月'},
        '9': {value: '9', label: '9月'},
        '10': {value: '10', label: '10月'},
        '11': {value: '11', label: '11月'},
        '12': {value: '12', label: '12月'},
    }
}
export const COMMON_BOND_DEADLINE = {
    label: '通用债券期限',
    value: 'COMMON_BOND_DEADLINE',
    options: {
        '1': {value: '1', label: '1年'},
        '3': {value: '3', label: '3年'},
        '5': {value: '5', label: '5年'},
        '7': {value: '7', label: '7年'},
        '10': {value: '10', label: '10年'},
        '15': {value: '15', label: '15年'},
        '20': {value: '20', label: '20年'},
        '30': {value: '30', label: '30年'}
    }
}
export const COMMON_STOP_OPEN_ENUMS = {
    label: '通用启用停用模式[0|1]',
    value: 'COMMON_STOP_OPEN_ENUMS',
    options: {
        // 'success' | 'info' | 'warning' | 'danger' | ''
        '0': {value: '0', label: '停用', echo: '未启用', tagType: 'danger'},
        '1': {value: '1', label: '启用', echo: '已启用', tagType: ''},
    }
}
export const COMMON_STOP_OPEN_MT_ENUMS = {
    label: '通用启用停用模式[1|2]',
    value: 'COMMON_STOP_OPEN_MT_ENUMS',
    options: {
        '1': {value: '1', label: '启用', echo: '已启用', tagType: 'danger'},
        '2': {value: '2', label: '停用', echo: '未启用', tagType: ''},
    }
}
export const COMMON_WORKFLOW_STATUS_ENUMS = {
    label: '通用工作流待发布已发布',
    value: 'COMMON_WORKFLOW_STATUS_ENUMS',
    options: {
        '0': {value: 0, label: '待发布', echo: '待发布', tagType: 'danger'},
        '1': {value: 1, label: '已发布', echo: '已发布', tagType: ''},
    }
}
export const COMMON_AMOUNT_UNIT = {
    label: '通用金额单位',
    value: 'COMMON_AMOUNT_UNIT',
    options: {
        '1': {value: 1, label: '元', echo: '元', tagType: ''},
        '2': {value: 2, label: '万元', echo: '万元', tagType: ''},
        '3': {value: 3, label: '亿元', echo: '亿元', tagType: ''},
    }
}
export const COMMON_BOND_TYPES = {
    label: '通用申请类型',
    value: 'BOND_TYPES',
    options: {
        '1': {value: '1', label: '一般债券', echo: '一般债券'},
        '2': {value: '2', label: '专项债券', echo: '专项债券'}
    }
}
export default {
    label: '通用选项',
    value: 'common'
}

export const toArray = (obj) => {
    if (obj && obj.options) {
        return Object.values(obj.options)
    }
    return []
}
