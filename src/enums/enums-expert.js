/*
 * @Author: ljc
 * @Date: 2023-04-27 17:40:15
 * @LastEditors: g05047
 * @LastEditTime: 2023-05-24 15:00:11
 * @Description: 专家枚举
 */

/* 专家选择类型 */
export const EXPERT_INPUT_STATUS = {
    label: '类型',
    value: 'EXPERT_INPUT_STATUS',
    options: {
        '1': { value: 1, label: '核查任务' },
        '2': { value: 2, label: '评审任务' },
    }
}
/* 评分选择类型 */
export const EXPERT_SCORE_STATUS = {
    label: '类型',
    value: 'EXPERT_SCORE_STATUS',
    options: {
        '1': { value: '1', label: '分数' },
        '2': { value: '2', label: '判断' },
    }
}
/* 前置条件选择类型 */
export const EXPERT_CONDITION_STATUS = {
    label: '类型',
    value: 'EXPERT_CONDITION_STATUS',
    options: {
        '前置条件': { value: '前置条件', label: '前置条件' },
        '评分要点': { value: '评分要点', label: '评分要点' },
        '加分项': { value: '加分项', label: '加分项' },
    }
}
// 专家评审任务
export const EXPERT_ASSIGN_STATUS = {
    label: '类型',
    value: 'EXPERT_ASSIGN_STATUS',
    options: {
        '0': { value: 0, label: '待分配' },
        '1': { value: 1, label: '已分配' },
    }
}