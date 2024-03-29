import { defineStore } from 'pinia';
import { useUserApi } from '@/api/user';
import { useRoute } from 'vue-router';
import {Session} from "@/utils";
export const useMenuStore = defineStore('Menu', {
	state: () => ({
		// 路由数据
		route: [],
		// 是否开启加密
		addRoutes: [],
		routeParamsMap: {},
	}),
	actions: {
		getUserMenus() {
			return new Promise((resolve) => {
				useUserApi()
					.getUserMenus()
					.then((res) => {
						const { code, data, msg } = res;
						const result = this.parseAsyncRoutes(JSON.parse(data.routes.replaceAll("\\","")));
						resolve(result);
					});
			});
		},
		getRouteParams() {
			const route = useRoute();
			return this.routeParamsMap[route.path];
		},

		parseAsyncRoutes(routerMap, parentRoute) {
			function parseHide(name) {
				const info=Session.get('userInfo');
				let flag = true
				const {menuAuth} = info
				for (let menu of menuAuth) {
					if(menu === name){
						flag=false
					}
				}
				return flag
			}

			return routerMap.map((route) => {
				const { meta, children } = route;
				const newMeta = {
					title: meta.title,
					isLink: meta.isLink,
					isHide: parseHide(route.name),
					isKeepAlive: meta.isKeepAlive?meta.isKeepAlive:false,
					isAffix: false,
					isIframe: false,
					icon: meta.icon ? `rk-${meta.icon}` : '',
					roles: meta.roles,
					authority: meta.authority?meta.authority:"",
					routerParams: meta.routerParams || '',
				};
				if (meta.iframeSrc) {
					newMeta['isLink'] = meta.iframeSrc;
					newMeta['isIframe'] = true;
				}
				let newPath = '';
				if (parentRoute) {
					newPath = `${parentRoute.path}/${route.path}`;
				} else {
					newPath = route.path;
				}
				let component = route.component;
				if (['LayoutView', 'BlankView'].includes(route.component)) {
					component = 'layout/routerView/parent';
				} else {
					component = component.slice(1);
				}
				const newRoute = {
					path: newPath,
					name: route.name,
					redirect: route.redirect,
					component: component,
					meta: newMeta,
				};
				if (meta.routerParams) {
					let query = {};
					let paramsArray = meta.routerParams.split('&');
					paramsArray.forEach((param) => {
						let paramValues = param.split('=');
						query[paramValues[0]] = paramValues[1];
					});
					newRoute['query'] = query;
					this.routeParamsMap[newPath] = query;
				}
				if (children && children.length) {
					newRoute['children'] = this.parseAsyncRoutes(children, newRoute);
				}
				return newRoute;
			});
		},
	},
});
