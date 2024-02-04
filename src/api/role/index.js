import { defAxios as request } from '@/utils/http';

export function useRoleApi() {
	return {
		getAllRole(){
			return request({
				url:'/all_role',
				method:'get'
			})
		},
		deleteOne(roleId){
			return request({
				url:'/del_role',
				method:'post',
				data:{
					id:roleId
				}
			})
		},
		addRole(params) {
			return request({
				url: '/role/add_role',
				method: 'post',
				data: params,
			});
		},
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
			console.log(params)
			return request({
				url: '/edit_role',
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
