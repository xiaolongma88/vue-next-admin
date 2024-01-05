import { defAxios as request, decryptAxios as decryptRequest } from '@/utils/http';

export function useFilesSzysApi() {
	return {
		uploadSzysFile(data) {
			return decryptRequest({
				url: '/proResApply/parse',
				method: 'post',
				data: data,
				headers: {
					'Content-Type': 'multipart/form-data;',
				},
			});
		},
		downloadSzysTemplate() {
			return request({
				url: `/proResApply/szysTemplateDownLoad`,
				method: 'get',
				responseType: 'blob',
			});
		},
	};
}
