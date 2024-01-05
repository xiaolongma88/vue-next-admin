import { defAxios as request } from '@/utils/http';
export * from './form-list';

export function useFormDesignerApi() {
	return {
		/**
		 * 新增表单配置
		 *
		 * @param {Object} params 表单配置信息
		 * @returns axios
		 */
		addPrdFormInfo(params) {
			return request({
				url: '/prdFormInfo/addPrdFormInfo',
				method: 'POST',
				data: params,
			});
		},
		/**
		 * 通过表单id查询表单配置信息
		 *
		 * @param {String} value 表单ID
		 * @returns axios
		 */
		getPrdFormInfoByFormId(formId) {
			return request({
				url: '/prdFormInfo/queryPrdFormInfoListByFormId',
				method: 'GET',
				params: { formId },
			});
		},
		/**
		 * 通过表单id查询表单配置信息
		 *
		 * @param {String} value 表单编码
		 * @returns axios
		 */
		getPrdFormInfoByFormCode(formCode) {
			return request({
				url: '/prdFormInfo/queryPrdFormInfoListByFormCode',
				method: 'GET',
				params: { formCode },
			});
		},
	};
}
