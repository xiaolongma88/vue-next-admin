import { defAxios as request } from '@/utils/http';

/**
 * 登录api接口集合
 *
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
	return {
		login: (userCode, password) => {
			return request({
				url: '/login',
				data: { userCode, password },
				method: 'post',
				headers: { isToken: false },
			});
		},
		logout: () => {
			return request({
				url: '/logout',
				method: 'post',
			});
		},
	};
}
