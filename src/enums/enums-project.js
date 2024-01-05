/* 债务转贷审核类型 */
export const RELOAN_AUDIT_STATUS = {
    label: '债务转贷审核类型',
    value: 'RELOAN_AUDIT_STATUS',
    options: {
        '1': {value: 1, label: '未处理'},
        '2': {value: 2, label: '已处理'},
    }
}
/** 存续状态 */
export const EXIST_STATUS = {
    label: '存续状态',
    value: 'EXIST_STATUS',
    options: {
        '001': {value: '001', label: '一次性项目'},
        '002': {value: '002', label: '经常性项目'},
        '003': {value: '003', label: '阶段性项目'},
    }
}
/** 债券类型 */
export const BOND_TYPE_ENUMS = {
    label: '债券类型',
    value: 'BOND_TYPE_ENUMS',
    options: {
        '1': {value: '1', label: '一般债券'},
        '2': {value: '2', label: '专项债券'}
    }
}
/** 项目库类型 */
export const PROJ_TYPE_ENUMS = {
    label: '项目库类型',
    value: 'PROJ_TYPE_ENUMS',
    options: {
        '0': {value: '0', label: '全部'},
        '1': {value: '1', label: '储备'},
        '2': {value: '2', label: '备选'},
    }
}

export default {
    label: '项目选项',
    value: 'project'
}
