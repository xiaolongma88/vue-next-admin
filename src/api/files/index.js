import { defAxios as request, decryptAxios as decryptRequest } from '@/utils/http';

export * from './files-szys';
export * from './files-zjps';

export function useFilesApi() {
	return {
		uploadFileRuleData(params) {
			return request({
				url: '/uploadFile/rule',
				method: 'post',
				data: params,
			});
		},
		delUploadFileData(fileId) {
			return request({
				url: `/uploadFile/delete/${fileId}`,
				method: 'post',
				data: {},
			});
		},
		previewFileData(fileId) {
			return request({
				url: `/uploadFile/preview/${fileId}`,
				method: 'post',
				responseType: 'blob',
			});
		},
		downloadFileData(fileId) {
			return request({
				url: `/uploadFile/download/${fileId}`,
				method: 'post',
				responseType: 'blob',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				},
			});
		},
		getAllUploadFiles(params) {
			return request({
				url: '/uploadFile/list',
				method: 'post',
				data: params,
			});
		},
	};
}
