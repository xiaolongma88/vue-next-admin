import XEUtils from 'xe-utils';
import router from '@/router/index.js';
import { ElMessage } from 'element-plus';
import { useUserStore, useSettingStore } from '@/stores/modules';
import { AuthUtils, CryptoUtils, ResponseUtils } from '@/utils';
import { REQ_HEADER_KEY } from '@/utils/http/cfg/http-config';

/**
 * 默认的请求拦截处理方法
 * @param {Object} config 请求信息
 * @returns Object 配置信息
 */
export function reqResolve(config) {
	// 添加防重放的随机数
	config.headers['t'] = +new Date();
	// 验证token是否存在，并携带请求头
	const accessToken = AuthUtils.accessToken.getValue();
	if (!XEUtils.isEmpty(accessToken)) {
		config.headers[REQ_HEADER_KEY] = accessToken;
	}
	return config;
}
const whiteUrlList = ['/login', '/pubAgency/importExcelForPubagencyInfo', '/proResApply/parse'];
const encMethodList = ['post'];
/**
 * 设计加密的请求拦截处理方法
 * @param {Object} config 请求信息
 * @returns Object 配置信息
 */
export function encryptReqResolve(config) {
	const encryptOpen = useSettingStore().encryptOpen;
	const { method, url } = config;
	if (encryptOpen && encMethodList.includes(method.toLowerCase()) && !whiteUrlList.includes(url.toLowerCase())) {
		if (config.data) {
			config.headers['content-type'] = 'application/json;charset=UTF-8';
			config.data = CryptoUtils.encryptValue(config.data);
		}
	}
	return config;
}
/**
 * 默认的请求拦截处理错误方法
 * @param {Object} error 错误信息
 * @returns Object 配置信息
 */
export function reqReject(error) {
	console.error(error);
	return Promise.reject(error);
}
/**
 * 默认响应拦截
 *
 * @param {Object} response 请求响应对象
 * @returns function
 */
export function resResolve(response) {
	// 设置刷新token
	const refreshToken = response.headers['refresh-token'];
	AuthUtils.accessToken.setValue(refreshToken);
	// 处理响应数据
	let responseResult = null;
	const responseData = response.data;
	responseResult = responseData;

	// 判断是否为加密数据
	if (ResponseUtils.checkIsEncrypted(responseData)) {
		responseResult = CryptoUtils.decryptValue(responseData);
	} else {
		responseResult = responseData;
	}

	if (responseResult && !ResponseUtils.checkIsLogin(responseResult.code)) {
		// useUserStore().signOut();
		useUserStore()
			.signOut()
			.then(() => {
				router.replace({ path: '/login' });
			});
	}
	return responseResult;
}
/**
 * blob请求方式响应拦截
 *
 * @param {Object} response 请求响应对象
 * @returns function
 */
export function blobResResolve(response) {
	// 设置刷新token
	const refreshToken = response.headers['refresh-token'];
	AuthUtils.accessToken.setValue(refreshToken);
	// 处理响应数据
	let responseResult = response;
	if (responseResult && !ResponseUtils.checkIsLogin(responseResult.code)) {
		useUserStore()
			.signOut()
			.then(() => {
				router.replace({ path: '/login' });
			});
	}
	return responseResult;
}

export function resReject(error) {
	if (isReqTimeout(error)) {
		console.error('resReject', '请求超时，请稍后重试！');
		// ElMessage({
		//   type: 'error',
		//   message: '请求超时，请稍后重试！',
		//   grouping: true
		// })
	}
	return Promise.reject(error);
}

/**
 * 请求是否超时
 *
 * @param {Object} error 错误信息
 * @returns {Boolean} true - 请求超时 false-请求未超时
 */
const errorCodesList = ['ECONNABORTED'];
function isReqTimeout(error) {
	return errorCodesList.includes(error.code) || error.message === 'Network Error' || error.message.includes('timeout');
}
