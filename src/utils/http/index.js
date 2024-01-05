import qs from 'qs';
import axios from 'axios';
import { blobResResolve, encryptReqResolve, resResolve, resReject, reqResolve, reqReject } from './modules/interceptors';

/**
 * 创建axios对象
 *
 * @param {Object} params { isBlob:是否为blob响应, isEncrypt:是否为请求加密 }
 * @param {Object} options 一些配置
 * @returns axios
 */
export function createAxios({ isBlob = false, isEncrypt = true } = {}, options) {
	const defaultOptions = {
		baseURL: import.meta.env.VITE_API_URL,
		timeout: 1000 * 50,
		paramsSerializer: {
			serialize(params) {
				return qs.stringify(params, { allowDots: true });
			},
		},
	};
	const server = axios.create({
		...defaultOptions,
		...options,
	});
	server.interceptors.request.use(reqResolve, reqReject);
	if (isEncrypt) {
		server.interceptors.request.use(encryptReqResolve, reqReject);
	}
	if (isBlob) {
		server.interceptors.response.use(blobResResolve, resReject);
	} else {
		server.interceptors.response.use(resResolve, resReject);
	}
	return server;
}
// 默认axios
export const defAxios = createAxios();
// blob方式axios
export const blobAxios = createAxios({ isBlob: true });
// 请求参数加密的axios
export const encryptAxios = createAxios({ isEncrypt: true });
// 请求参数解密的axios
export const decryptAxios = createAxios({ isEncrypt: false });
