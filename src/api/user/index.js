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
		getAllUser:()=>{
			return request({
				url:'/all_user',
				method:'get'
			})
		},
		addUser:(userInfo)=>{
			return request({
				url:'/add_user',
				method:'post',
				data:userInfo
			})
		},
		deleteOne:(userId)=>{
			return request({
				url:'/del_user',
				method:'post',
				data: {
					"userId":userId
				}
			})
		},
		editUser:(userInfo)=>{
			return request({
				url:'/edit_user',
				method:'post',
				data:userInfo
			})
		},
		test1: () => {
			return request({
				url: 'https://echarts.apache.org/examples/data/asset/data/life-expectancy-table.json',
				method: 'get',
			});
		},
		test2: () => {
			return request({
				url: 'https://echarts.apache.org/examples/data/asset/data/life-expectancy-table.json',
				method: 'get',
			});
		},
	};
}
