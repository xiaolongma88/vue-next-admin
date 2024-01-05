import { defAxios as request } from '@/utils/http';

export function useRoleApi() {
	return {
		getRoleInfo(params) {
			return request({
				url: '/role/getRoleInfo',
				method: 'post',
				data: params,
			});
		},
		bindRoleMenu(params) {
			return request({
				url: '/role/bindRoleMenu',
				method: 'post',
				data: params,
			});
		},
		getRoleInfoList(params) {
			return request({
				url: '/role/getRoleInfoList',
				method: 'post',
				data: params,
			});
		},
		getRoleRelMenu(params) {
			return request({
				url: '/role/getRoleRelMenu',
				method: 'post',
				params: params,
			});
		},
		roleSave(params) {
			return request({
				url: '/role/saveRole',
				method: 'post',
				data: params,
			});
		},
		roleDelete(params) {
			return request({
				url: '/role/deleteRole',
				method: 'post',
				data: params,
			});
		},
	};
}
