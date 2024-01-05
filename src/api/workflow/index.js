/*
 * @Author: ljc
 * @Date: 2023-04-06 17:22:53
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-26 10:14:32
 * @Description: 工作流管理接口
 */

import { defAxios as request } from '@/utils/http';

export function useWorkflowApi() {
    return {
        getProcessInfo,
        getProcessPage,
        postProcessDeploy,
        postProcessDelete,
        getProcessPreview,
        getProcessDownLoad,
        getProcessFormPage,
        postProcessSetMaster,
        getProcessVersionPage,
        getProcessRoleList,
        postProcessSave,
        postValidationList
    }
}

/**
 * 获取工作流预览接口
 *
 * @returns Proxy
 */
 function getProcessInfo(params) {
    return request({
        url: '/process/info',
        method: 'post',
        data: params
    })
}

/**
 * 获取流程列表数据
 *
 * @returns Proxy
 */
 function getProcessPage(params) {
    return request({
        url: '/process/page',
        method: 'post',
        data: params
    })
}

/**
 * 部署流程
 *
 * @returns Proxy
 */
 function postProcessDeploy(params) {
    return request({
        url: '/process/deploy',
        method: 'post',
        data: params
    })
}

/**
 * 删除流程
 *
 * @returns Proxy
 */
 function postProcessDelete(params) {
    return request({
        url: '/process/delete',
        method: 'post',
        data: params
    })
}

/**
 * 流程预览
 *
 * @returns Proxy
 */
 function getProcessPreview(params) {
    return request({
        url: '/process/preview',
        method: 'post',
        data: params
    })
}

/**
 * 下载文件
 *
 * @returns Proxy
 */
 function getProcessDownLoad(params) {
    return request({
        url: '/process/downLoad',
        method: 'post',
        data: params
    })
}

/**
 * 获取表单列表
 *
 * @returns Proxy
 */
 function getProcessFormPage(params) {
    return request({
        url: '/process/formPage',
        method: 'post',
        data: params
    })
}

/**
 * 设置流程主版本
 *
 * @returns Proxy
 */
 function postProcessSetMaster(params) {
    return request({
        url: '/process/setMaster',
        method: 'post',
        data: params
    })
}

/**
 * 获取表单列表
 *
 * @returns Proxy
 */
 function getProcessVersionPage(params) {
    return request({
        url: '/process/versionPage',
        method: 'post',
        data: params
    })
}

/**
 * 获取角色列表
 *
 * @returns Proxy
 */
 function getProcessRoleList(params) {
    return request({
        url: '/process/roleList',
        method: 'post',
        data: params
    })
}

/**
 * 保存工作流程
 *
 * @returns Proxy
 */
 function postProcessSave(params) {
    return request({
        url: '/process/save',
        method: 'post',
        data: params,
    })
}

/**
 * 获取校验条件列表
 *
 * @returns Proxy
 */
 function postValidationList(params) {
    return request({
        url: '/process/validationList',
        method: 'post',
        data: params,
    })
}
