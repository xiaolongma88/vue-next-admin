export const REQ_HEADER_KEY = 'Authorization';

export const RESULT_CODE_ENUMS = {
	NOT_LOGIN_CODE: { code: 401, msg: '未登录，没有访问权限' },
	EXPIRED_TOKEN_CODE: { code: 300, msg: 'token已过期' },
	SIGNATURE_ERROR_CODE: { code: 303, msg: '签名异常' },
	INVALID_LICENSE_CODE: { code: 503, msg: '非法的License信息' },
	ACCOUNT_OFFLINE_CODE: { code: 305, msg: '账号已在其他地方登录，被强制退出' },
};
