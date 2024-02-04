import { defineStore } from 'pinia';
import XEUtils from 'xe-utils';
import { ElMessage } from 'element-plus';
import { useUserApi } from '@/api/user';
import { useLoginApi } from '@/api/login';
import { useThemeConfig } from '@/stores/themeConfig.js';
import { AuthUtils, Session } from '@/utils';




const { getUserInfo } = useUserApi();
const { login, logout } = useLoginApi();

// import
export const useUserStore = defineStore('user', {
	state: () => ({
		name: '',
		token: AuthUtils.accessToken.getValue(),
		roles: [],
		sToken: '',
		avatar: '',
		permissions: [],
	}),
	actions: {
		/**
		 * 登录接口
		 *
		 * @param {Object} params { userCode, password }
		 * @returns Promise
		 */
		signIn(params) {
			const userCode = params.userCode;
			const password = params.password;
			return new Promise((resolve, reject) => {
				login(userCode, password)
					.then((res) => {
						const { status, data, msg } = res;
						if (status === 200) {
							const { Authorization } = data;
							Session.set('token', Authorization);
							AuthUtils.accessToken.setValue(Authorization);
							this.token = Authorization;
							defaultUserInfo.userId=userCode
						} else {
							ElMessage.error(msg);
						}
						resolve(res);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		/**
		 * 退出系统
		 *
		 * @returns Promise
		 */
		signOut() {
			return new Promise((resolve, reject) => {
				if (useThemeConfig().themeConfig.isRequestRoutes) {
					logout(this.token)
						.then(() => {
							this.clearUser();
							resolve();
						})
						.catch((error) => {
							reject(error);
						});
				} else {
					this.clearUser();
				}
			});
		},
		clearUser() {
			this.token = '';
			this.roles = [];
			this.sToken = '';
			this.userInfo = '';
			this.permissions = [];
			AuthUtils.accessToken.removeValue();
			localStorage.clear();
			sessionStorage.clear();
			Session.clear();
		},
		setUserInfo(data) {
			this.userInfo = data;
		},
		/**
		 * 获取当前登录用户信息
		 *
		 * @returns Promise
		 */
		getUserInfo() {
			return new Promise((resolve, reject) => {
				getUserInfo()
					.then((res) => {
						const { status, data, msg } = res;

						this.userInfo = data;
						if (status === 200) {
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
	},
});

const defaultUserInfo = {
	time: 0,
	roles: [],
	photo: '',
	adCode: '',
	adBjCode: '',
	userName: '',
	userId:'',
	authBtnList: [],
	authMenuList:[]
};
export const useUserInfo = defineStore('userInfo', {
	state: () => ({
		userInfos: XEUtils.clone(defaultUserInfo, true),
	}),
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			} else {
				if(defaultUserInfo.userId==null){
					ElMessage.error('登录失败')
				}
				const userInfos = await this.getApiUserInfo(defaultUserInfo.userId);
				this.userInfos = userInfos;
			}
			useUserStore().setUserInfo(this.userInfos);
		},
		async getApiUserInfo(userId) {
			return new Promise((resolve) => {
				getUserInfo(userId).then((res) => {
					const { status, data, msg } = res;
					let info =JSON.parse(data.replaceAll("\\",""))
					let defaultRoles = ['admin'];
					let defaultAuthBtnList = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
					const userInfos = {
						time: new Date().getTime(),
						photo:info.img?info.img: 'https://img2.baidu.com/it/u=1978192862,2048448374&fm=253&fmt=auto&app=138&f=JPEG?w=504&h=500',
						roles: info.roles?info.roles:'common',
						userName:info.userName?info.userName: "admin",
						authBtnList: defaultAuthBtnList,
						authMenuList: info.menuList,
						...info,
					};
					Session.set('userInfo', userInfos);
					resolve(userInfos);
				});
			});
		},
		async getMockUserInfo() {
			return new Promise((resolve) => {
				setTimeout(() => {
					// 模拟数据，请求接口时，记得删除多余代码及对应依赖的引入
					const userName = Cookies.get('userName');
					// 模拟数据
					let defaultRoles = [];
					let defaultAuthBtnList = [];
					// admin 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
					let adminRoles = ['admin'];
					// admin 按钮权限标识
					let adminAuthBtnList = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
					// test 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
					let testRoles = ['common'];
					// test 按钮权限标识
					let testAuthBtnList = ['btn.add', 'btn.link'];
					// 不同用户模拟不同的用户权限
					if (userName === 'admin') {
						defaultRoles = adminRoles;
						defaultAuthBtnList = adminAuthBtnList;
					} else {
						defaultRoles = testRoles;
						defaultAuthBtnList = testAuthBtnList;
					}
					// 用户信息模拟数据
					const userInfos = {
						userName: userName,
						photo:
							userName === 'admin'
								? 'https://img2.baidu.com/it/u=1978192862,2048448374&fm=253&fmt=auto&app=138&f=JPEG?w=504&h=500'
								: 'https://img2.baidu.com/it/u=2370931438,70387529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
						time: new Date().getTime(),
						roles: defaultRoles,
						authBtnList: defaultAuthBtnList,
					};
					Session.set('userInfo', userInfos);
					resolve(userInfos);
				}, 0);
			});
		},
	},
});

