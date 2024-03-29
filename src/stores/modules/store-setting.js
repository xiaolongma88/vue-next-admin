import { defineStore } from 'pinia';
import { useUserApi } from '@/api/user';
import { CryptoUtils } from '@/utils';

export const useSettingStore = defineStore('setting', {
	state: () => ({
		// 加解密密钥
		secretKey: '',
		// 是否开启加密
		encryptOpen: false,
		added:false
	}),
	actions: {
		setSecretKey() {
			return new Promise((resolve, reject) => {
				useUserApi()
					.getUserAuth()
					.then((res) => {
						const { status, data, msg } = res;
						if (status === 200) {
							const { signature } = data;
							this.secretKey = signature;
							CryptoUtils.setCryptoSecretKey(signature);
							resolve(data);
						} else {
							reject(msg);
						}
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		setAdded(date){
			this.added = date
		}
	},
});
