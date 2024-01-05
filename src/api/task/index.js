import { defAxios as request } from '@/utils/http';

export function useTaskApi() {
	return {
		getProcessImg,
		auditTask,
		backTask,
		cancelTask,
		sendAudit,
		reviewTask,
		taskOperateLogs,
	};
}

/**
 * 获取流程图片
 *
 * @returns Proxy
 */
export function getProcessImg(params) {
	return request({
		url: '/task/generateProcessImg',
		method: 'get',
		params: params,
	});
}

// 审核
export function auditTask(params) {
	return request({
		url: '/task/audit',
		method: 'post',
		data: params,
	});
}

// 退回任务
export function backTask(params) {
	return request({
		url: '/task/backTask',
		method: 'post',
		data: params,
	});
}

// 撤销任务
export function cancelTask(params) {
	return request({
		url: '/task/cancelTask',
		method: 'post',
		data: params,
	});
}

// 送审
export function sendAudit(params) {
	return request({
		url: '/task/sendAudit',
		method: 'post',
		data: params,
	});
}

export function reviewTask(params) {
	return request({
		url: '/reviewtask/getExpertRuleList',
		method: 'post',
		data: params,
	});
}

/**
 * 审核日志
 * @returns {*}
 */
export function taskOperateLogs() {
	return request({
		url: '/task/operateLogs',
		method: 'get',
	});
}
