import { defAxios as request } from '@/utils/http';

/**
 * 地图相关的api
 *
 * @method getUserInfo 获取用户信息
 * @method getUserAuth 获取系统密钥
 */
export function useMapApi() {
    return {
        getLocation: (addr) => {
            return request({
                url: 'https://restapi.amap.com/v3/geocode/geo?key=dbf1dc260826e2d9b296bac98ab033a9&address='+addr,
                method: 'get',
            });
        },

    };
}