

import { defAxios as request } from '@/utils/http';


/**
 * 审核日志
 * @returns {*}
 */
export function useTaskOperateLogApi() {
    return {
        taskOperateLogs: () => {
            return request({
                url: '/task/operateLogs',
                method: 'get',
            });
        }
    }
}
