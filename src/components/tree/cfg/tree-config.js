/*
 * @Author: ljc
 * @Date: 2023-04-21 14:04:16
 * @LastEditors: g05047
 * @LastEditTime: 2023-04-21 14:06:14
 * @Description: 单位树和区划树公共参数
 *
 */

const RKAdAgConig = {
	defaultProps: {  // 树结构默认解析数据
		children: 'children',
		label: 'text',
	},
}

// 区划树默认props
export const adTreeDefaultProps = {
	label: 'text',
	value: 'code',
	children: 'children'
}

// 单位树默认props
export const agTreeDefaultProps = {
	label: 'text',
	value: 'code',
	children: 'children'
}

// 区划树根节点
export const adRootNode = {
	"id": "0000",
	"code": "0000",
	"name": "全部",
	"text": "全部",
	"levelno": 0,
	"leaf": false,
	"children": [],
	"childNum": 1,
	"parentId": null
}

// 单位树根节点
export const agRootNode = {
	"id": "",
	"code": "",
	"name": "全部",
	"text": "全部",
	"levelno": 0,
	"leaf": false,
	"children": [],
	"childNum": 1,
	"parentId": ""
}

// 菜单树根节点
export const menuRootNode = {
	"menuId": '0000',
  "menuName": '全部',
  "menuCode": '',
  "parentId": null,
  "status": null,
  "url": null,
  "menuOrder": null,
  "levelNo": null,
  "icon": null,
  "remark": null,
  "adCode": null,
  "routerPath": null,
  "routerName": null,
  "routerLink": null,
  "routerRedirect": null,
  "routerComponent": null,
  "iframeSrc": null,
  "invisible": null,
  "children": [],
  "menuType": 0
}

// 菜单树默认props
export const menuTreeDefaultProps = {
	label: (data, node) => {
		return data.menuAlias || data.menuName
	},
	value: 'menuCode',
	children: 'children'
}

export const roleTreeDefaultProps = {
	label: (data, node) => {
		return `${data.roleCode} ${data.roleName}`
	},
	value: 'roleId',
	children: 'children'
}


export default RKAdAgConig

