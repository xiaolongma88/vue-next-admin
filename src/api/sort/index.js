
import { defAxios as request } from '@/utils/http'


export function useSortApi() {
    return {
        getMaxSortId,
        validateSort,
        saveProjSort,
        cancelProjSort,
        confirmProjSort,
        revokeConfirmProjSort
    }
}

// 根据区划编码查询备选项目最大排序值
function getMaxSortId(bondTypeCode) {
    return request({
        url: `/proAltApply/getMaxSortId/${bondTypeCode}`,
        method: 'get',
    })
}

function validateSort(params) {
    return request({
        url: `/proAltApply/validateSort`,
        method: 'post',
        data: params
    })
}


//保存确认
function saveProjSort(params) {
    return request({
        url: '/proAltApply/saveSort',
        method: 'post',
        data: params
    })
}

function cancelProjSort(params) {
    return request({
        url: '/proAltApply/cancelSort',
        method: 'post',
        data: params
    })
}

function confirmProjSort(params) {
    return request({
        url: '/proAltApply/confirm',
        method: 'post',
        data: params
    })
}

function revokeConfirmProjSort(params) {
    return request({
        url: '/proAltApply/cancelConfirm',
        method: 'post',
        data: params
    })
}


