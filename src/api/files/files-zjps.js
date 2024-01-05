import { defAxios as request, decryptAxios as decryptRequest } from '@/utils/http';
import {} from '@/utils/http';
export function useFilesZjpsApi() {
	return {
		downloadReportData(params) {
			return request({
				url: '/onlineReview/downloadReport',
				method: 'post',
				responseType: 'blob',
				data: params,
			});
		},
		downloadData(params, progressFunc) {
			return request({
				url: '/onlineReview/download',
				method: 'post',
				responseType: 'blob',
				data: params,
				onDownloadProgress: progressFunc,
			});
		},
		onlineReviewData(params) {
			return request({
				url: '/onlineReview/previewReport',
				method: 'post',
				responseType: 'blob',
				data: params,
			});
		},
		getOnlineUploadFiles(params) {
			return request({
				url: '/uploadFile/previewList',
				method: 'post',
				data: params,
			});
		},
	};
}
