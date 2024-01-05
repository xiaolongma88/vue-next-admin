/*
 * @Author: ljc
 * @Date: 2023-04-26 14:13:41
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-26 15:00:30
 * @Description:储备管理和备选管理 撤销 送审 审核 退回
 */
import {blobAxios, defAxios as request, encryptAxios} from '@/utils/http'

export function useProjectApi() {
	return {
		reserveProHandleTask,
		standProHandleTask,
		saveSpecialProject,
		saveGenericProject,
		saveStandByProject,
		getReserveProjectInfo,
		getReserveProjectInfoWithNameProId,
		deleteReserveProject,
		deleteAlternateProject,
		queryInvestPlanByProId,
		queryBgtBalanceByProId,
		saveAgencyPermit,
		proAltSaveAgencyPermit,
		proAltApplyExportSort,
	};
}

/***********************************储备管理 撤销 送审 审核 退回************************************/
// taskType: 任务类型：sendAudit-送审 audit-审核 back-退回 cancel-撤销
export function reserveProHandleTask(params) {
	return request({
		url: '/proResApply/handleTask',
		method: 'post',
		data: params,
	});
}

/***********************************备选管理 撤销 送审 审核 退回************************************/

// taskType:任务类型：sendAudit-送审 audit-审核 back-退回 cancel-撤销
export function standProHandleTask(params) {
	return request({
		url: '/proAltApply/handleTask',
		method: 'post',
		data: params,
	});
}

/***********************************储备项目保存以及获取信息************************************/

/**
 * 保存专项储备项目信息
 * @param {Object} params 保存参数
 * @returns axios
 */
export function saveSpecialProject(params) {
	return encryptAxios({
		url: '/proResApply/saveSpecialReserveProject',
		method: 'POST',
		data: params,
	});
}

/**
 * 保存一般储备项目信息
 * @param {Object} params 保存参数
 * @returns axios
 */
export function saveGenericProject(params) {
	return encryptAxios({
		url: '/proResApply/saveGenericReserveProject',
		method: 'POST',
		data: params,
	});
}

/**
 * 保存一般储备项目信息
 * @param {Object} params 保存参数
 * @returns axios
 */
export function saveStandByProject(params) {
	return encryptAxios({
		url: '/proAltApply/saveAlternateProject',
		method: 'POST',
		data: params,
	});
}

/**
 * 获取储备项目信息
 *
 * @param {Object} params { "proId": "", "formCode": "", "applyId": '' }
 * @returns axios
 */
export function getReserveProjectInfo(params) {
	return request({
		url: '/proResApply/queryReserveProjectByProId',
		method: 'POST',
		data: params,
	});
}

export function getReserveProjectInfoWithNameProId(params) {
	return request({
		url: '/proResApply/queryReserveProjectWithNameByProId',
		method: 'POST',
		data: params,
	});
}

/**
 * 删除储备项目信息
 *
 * @param {Object} params { "proIds": "", "applyIds": "" }
 * @returns axios
 */
export function deleteReserveProject(params) {
	return request({
		url: '/proResApply/deleteReserveProject',
		method: 'POST',
		data: params,
	});
}

/**
 * 通过申报Id删除备选项目
 *
 * @param {Object} params { "proIds": "", "applyIds": "" }
 * @returns axios
 */
export function deleteAlternateProject(params) {
	return request({
		url: '/proAltApply/deleteAlternateProject',
		method: 'POST',
		data: params,
	});
}

/**
 * 通过项目Id查询投资计划
 *
 * @param params
 * @returns {*}
 */
export function queryInvestPlanByProId(params) {
	return request({
		url: '/proResApply/queryInvestPlanByProId',
		method: 'POST',
		data: params,
	});
}

/**
 * 通过项目Id查询收支预算
 *
 * @param params
 * @returns {*}
 */
export function queryBgtBalanceByProId(params) {
	return request({
		url: '/proResApply/queryBgtBalanceByProId',
		method: 'POST',
		data: params,
	});
}

/**
 * 储备保存机构终审
 *
 * @param params
 * @returns {*}
 */
export function saveAgencyPermit(params) {
	return request({
		url: '/proResApply/saveAgencyPermit',
		method: 'POST',
		data: params,
	});
}

/**
 * 备选保存机构终审
 *
 * @param params
 * @returns {*}
 */
export function proAltSaveAgencyPermit(params) {
	return request({
		url: '/proAltApply/saveAgencyPermit',
		method: 'POST',
		data: params,
	});
}

/**
 * 项目排序导出
 * @param params
 * @returns {*}
 */
export function proAltApplyExportSort(params) {
	return blobAxios({
		url: '/proAltApply/exportSort',
		method: 'post',
		data: params,
		responseType: 'blob',
	});
}
