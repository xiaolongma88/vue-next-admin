import { useSettingStore } from '@/stores/modules';
import { RESULT_CODE_ENUMS } from '../cfg/http-config.js';

/** 请求响应操作 */
export const ResponseUtils = {
	/**
	 * 检查是否登录
	 *
	 * @param {String|Number} code 响应返回code
	 * @returns {Boolean} true-已登录 false-未登录
	 * @author LiSong
	 * @date 2022-10-20 9:30
	 */
	checkIsLogin(code) {
		let flag = true;
		switch (code) {
			// 401: 未登录，没有访问权限
			case RESULT_CODE_ENUMS.NOT_LOGIN_CODE.code:
				flag = false;
				break;
			// 300: token已过期
			case RESULT_CODE_ENUMS.EXPIRED_TOKEN_CODE.code:
				flag = false;
				break;
			// 303: 签名异常
			case RESULT_CODE_ENUMS.SIGNATURE_ERROR_CODE.code:
				flag = false;
				break;
			default:
				flag = true;
				break;
		}
		return flag;
	},
	/** 校验请求结果是否加密 */
	checkIsEncrypted(value) {
		// vuex中配置的是否开启加密
		const encryptOpen = useSettingStore().encryptOpen;
		if (encryptOpen && value && (typeof value === 'string' || value instanceof String) && value.includes('ENC ')) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 检查用户是否离线（其他地方登录，强制离线）
	 *
	 * @param {String|Number} code 响应返回code
	 * @returns {Boolean} true-已离线 false-未离线
	 * @author LiSong
	 * @date 2022-10-20 9:30
	 */
	checkAccountIsOffline(code) {
		return RESULT_CODE_ENUMS.ACCOUNT_OFFLINE_CODE.code == code;
	},
};
