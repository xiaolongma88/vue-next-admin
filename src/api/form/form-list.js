import { defAxios as request } from '@/utils/http';

export function useFormListApi() {
	return {
		delPrdFormInfo(params) {
			return request({
				url: '/prdFormInfo/delPrdFormInfo',
				method: 'post',
				data: params,
			});
		},
		updateStatus(params) {
			return request({
				url: '/prdFormInfo/updateStatus',
				method: 'post',
				data: params,
			});
		},
		copyPrdFormInfo(value) {
			return request({
				url: '/prdFormInfo/copyPrdFormInfo',
				method: 'POST',
				data: value,
			});
		},
	};
}
