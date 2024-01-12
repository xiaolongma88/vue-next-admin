import { defAxios as request } from '@/utils/http';

/**
 * 用户相关的api
 *
 * @method getUserInfo 获取用户信息
 * @method getUserAuth 获取系统密钥
 */
export function useUserApi() {
	return {
		getUserInfo: (userId) => {
			return request({
				url: '/user/info',
				method: 'post',
				data: { userId}
			});
		},
		getUserAuth: () => {
			return request({
				url: '/user/auth',
				method: 'post',
			});
		},
		getUserMenus: () => {
			return request({
				url: '/user/getUserRouterPermission',
				method: 'post',
			});
		},
	};
}
