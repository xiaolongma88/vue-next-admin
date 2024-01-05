import { defAxios as request } from '@/utils/http';

export function useDictApi() {
	return {
		getDistData: (params) => {
			return request({
				url: '/dict/getDictData',
				method: 'post',
				data: params,
			});
		},
	};
}
