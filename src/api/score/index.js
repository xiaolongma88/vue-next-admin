import { defAxios as request } from '@/utils/http';
export function useScoreApi() {
    return {
        // 批量删除评分标准信息
        deleteDebtTZqglPfbzByIds(params) {
            return request({
                url: '/ZqglPfbz/deleteDebtTZqglPfbzByIds',
                method: 'post',
                data: params
            })
        },
        // 保存评分标准信息
        saveOrUpdateDebtTZqglPfbz(params) {
            return request({
                url: '/ZqglPfbz/saveOrUpdateDebtTZqglPfbz',
                method: 'post',
                data: params
            })
        },
        //债券类型-资金投向领域关联树结构
        zqlxZjtxlyTreeList(params) {
            return request({
                url: '/ZqglPfbz/zqlxZjtxlyTreeList',
                method: 'post',
                data: params
            })
        },
        //评分标准-资金领域关联表保存
        savePrdReviewRule(params) {
            return request({
                url: '/ZqglPfbz/savePrdReviewRule',
                method: 'post',
                data: params
            })
        },

        //删除资金投向领域-评分标准关联信息
        deletePrdReviewRuleByIds(params) {
            return request({
                url: '/ZqglPfbz/deletePrdReviewRuleByIds',
                method: 'post',
                data: params
            })
        }
    }
}