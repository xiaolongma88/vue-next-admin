import { defAxios as request } from '@/utils/http';

export function useTreeApi() {
	return {
		getSysAdata(params = {}) {
			return request({
				url: '/dict/getSysAdata',
				method: 'post',
				data: params,
			});
		},
		getSysAgData(params = {}) {
			return request({
				url: '/dict/getSysAgData',
				method: 'post',
				data: params,
			});
		},
		getAdTree(params = {}) {
			return request({
				url: '/eleAd/tree',
				method: 'post',
				data: params,
			});
		},
		getAdRegin(params = {}) {
			return request({
				url: '/eleAd/region',
				method: 'post',
				data: params,
			});
		},
		getPubAgencyTree(params = {}) {
			return request({
				url: '/pubAgency/tree',
				method: 'post',
				data: params,
			});
		},
		getMenuTree(params) {
			return request({
				url: '/menu/getMenuTree',
				method: 'post',
				params: params,
			});
		},
	};
}
