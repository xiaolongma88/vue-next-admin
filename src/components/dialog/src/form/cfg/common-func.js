import { useProjectApi } from '@/api';

const { getReserveProjectInfo } = useProjectApi();

/**
 * 获取表单回显信息
 * @param {Object} params 查询参数
 */
export const getProjectInfo = ({ proId, applyId, formCode, formType }, final) => {
	return new Promise((resolve, reject) => {
		const params = { proId, formCode };
		if (applyId) params['applyId'] = applyId;
		getReserveProjectInfo(params)
			.then((res) => {
				// console.log('getProjectInfo', res)
				const { code, data, msg } = res;
				if (code === 200) {
					resolve(data);
				} else {
					console.error(msg);
					reject(msg);
				}
			})
			.catch((err) => {
				console.error(err);
				reject(err);
			})
			.finally(() => {
				if (final) {
					final();
				}
			});
	});
};
