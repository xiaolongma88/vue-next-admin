import { defAxios as request } from '@/utils/http';

export function useAgencyApi() {
	return {
		saveThirdAgency,
		saveAgencyUser,
		saveAgencyRegion,
		getAgencyByAgencyId,
		deleteThirdAgency,
		deleteAgencyUser,
		deleteAgencyRegion,
		updateAgencyStatus,
	};
}

//保存机构
export function saveThirdAgency(params) {
	return request({
		url: '/thirdAgency/saveThirdAgency',
		method: 'post',
		data: params,
	});
}
//保存机构用户
export function saveAgencyUser(params) {
	return request({
		url: '/thirdAgency/saveAgencyUser',
		method: 'post',
		data: params,
	});
}

//保存机构区划
export function saveAgencyRegion(params) {
	return request({
		url: '/thirdAgency/saveAgencyRegion',
		method: 'post',
		data: params,
	});
}
//通过机构Id查询机构信息
export function getAgencyByAgencyId(params) {
	return request({
		url: '/thirdAgency/getAgencyByAgencyId',
		method: 'post',
		data: params,
	});
}

//删除机构
export function deleteThirdAgency(params) {
	return request({
		url: '/thirdAgency/deleteThirdAgency',
		method: 'post',
		data: params,
	});
}

//删除机构用户
export function deleteAgencyUser(params) {
	return request({
		url: '/thirdAgency/deleteAgencyUser',
		method: 'post',
		data: params,
	});
}

//删除机构区划
export function deleteAgencyRegion(params) {
	return request({
		url: '/thirdAgency/deleteAgencyRegion',
		method: 'post',
		data: params,
	});
}

//启用/停用机构
export function updateAgencyStatus(params) {
	return request({
		url: '/thirdAgency/updateAgencyStatus',
		method: 'post',
		data: params,
	});
}
