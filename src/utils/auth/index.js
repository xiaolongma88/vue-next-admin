import { ACCESS_TOKEN } from './cfg/auth-config';
export const AuthUtils = {
	setToken(key, value) {
		sessionStorage.setItem(key, value);
	},
	getToken(key) {
		return sessionStorage.getITem(key);
	},
	checkToken(key) {
		return this.getToken(key) ? true : false;
	},
	removeToken(key) {
		sessionStorage.removeItem(key);
	},
	// 认证token操作
	accessToken: {
		setValue: (value) => {
			if (value) {
				localStorage.setItem(ACCESS_TOKEN, value);
			}
		},
		getValue: () => {
			return localStorage.getItem(ACCESS_TOKEN);
		},
		checkValue: () => {
			const token = localStorage.getItem(ACCESS_TOKEN);
			return token ? true : false;
		},
		removeValue: () => {
			localStorage.removeItem(ACCESS_TOKEN);
		},
	},
};
