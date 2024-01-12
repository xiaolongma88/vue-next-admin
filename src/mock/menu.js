import Mock from 'mockjs'
Mock.mock('/api/user/getUserRouterPermission', 'post', (req) => {
    return {
        status: 200,
        msg: '成功',
        data: {
            routes:[
            {
                "path": "/limits",
                "name": "limits",
                "component": "layout/routerView/parent",
                "redirect": "/limits/frontEnd",
                "meta": {
                    "title": "权限管理",
                    "isLink": "",
                    "isHide": false,
                    "isKeepAlive": true,
                    "isAffix": false,
                    "isIframe": false,
                    "roles": ["admin"],
                    "icon": "iconfont icon-quanxian"
                },
                "children": [
                    {
                        "path": "/limits/frontEnd",
                        "name": "limitsBackEnd",
                        "component": "layout/routerView/parent",
                        "redirect":"",
                        "meta": {
                            "title": "前端控制",
                            "isLink": "",
                            "isHide": false,
                            "isKeepAlive": true,
                            "isAffix": false,
                            "isIframe": false,
                            "roles": ["admin"]
                        },
                        "children":[]
                    },
                    {
                        "path": "/limits/backEnd/page",
                        "name": "limitsBackEndEndPage",
                        "component": "limits/backEnd/page/index",
                        "meta": {
                            "title": "后端控制",
                            "isLink": "",
                            "isHide": false,
                            "isKeepAlive": true,
                            "isAffix": false,
                            "isIframe": false,
                            "roles": ["admin"]
                        }
                    }
                ]
            },
            {
                "path": "/menu",
                "name": "menu",
                "component": "layout/routerView/parent",
                "redirect": "/menu/menu1",
                "meta": {
                    "title": "菜单嵌套",
                    "isLink": "",
                    "isHide": false,
                    "isKeepAlive": true,
                    "isAffix": false,
                    "isIframe": false,
                    "roles": ["admin", "common"],
                    "icon": "iconfont icon-caidan"
                },
                "children": [
                    {
                        "path": "/menu/menu1",
                        "name": "menu1",
                        "component": "layout/routerView/parent",
                        "redirect": "/menu/menu1/menu11",
                        "meta": {
                            "title": "菜单1",
                            "isLink": "",
                            "isHide": false,
                            "isKeepAlive": true,
                            "isAffix": false,
                            "isIframe": false,
                            "roles": ["admin", "common"],
                            "icon": "iconfont icon-caidan"
                        },
                        "children": [
                            {
                                "path": "/menu/menu1/menu11",
                                "name": "menu11",
                                "component": "menu/menu1/menu11/index",
                                "meta": {
                                    "title": "菜单11",
                                    "isLink": "",
                                    "isHide": false,
                                    "isKeepAlive": true,
                                    "isAffix": false,
                                    "isIframe": false,
                                    "roles": ["admin", "common"],
                                    "icon": "iconfont icon-caidan"
                                }
                            },
                            {
                                "path": "/menu/menu1/menu12",
                                "name": "menu12",
                                "component": "layout/routerView/parent",
                                "redirect": "/menu/menu1/menu12/menu121",
                                "meta": {
                                    "title": "菜单12",
                                    "isLink": "",
                                    "isHide": false,
                                    "isKeepAlive": true,
                                    "isAffix": false,
                                    "isIframe": false,
                                    "roles": ["admin", "common"],
                                    "icon": "iconfont icon-caidan"
                                },
                                "children": [
                                    {
                                        "path": "/menu/menu1/menu12/menu121",
                                        "name": "menu121",
                                        "component": "menu/menu1/menu12/menu121/index",
                                        "meta": {
                                            "title": "菜单121",
                                            "isLink": "",
                                            "isHide": false,
                                            "isKeepAlive": true,
                                            "isAffix": false,
                                            "isIframe": false,
                                            "roles": ["admin", "common"],
                                            "icon": "iconfont icon-caidan"
                                        }
                                    },
                                    {
                                        "path": "/menu/menu1/menu12/menu122",
                                        "name": "menu122",
                                        "component": "menu/menu1/menu12/menu122/index",
                                        "meta": {
                                            "title": "菜单122",
                                            "isLink": "",
                                            "isHide": false,
                                            "isKeepAlive": true,
                                            "isAffix": false,
                                            "isIframe": false,
                                            "roles": ["admin", "common"],
                                            "icon": "iconfont icon-caidan"
                                        }
                                    }
                                ]
                            },
                            {
                                "path": "/menu/menu1/menu13",
                                "name": "menu13",
                                "component": "menu/menu1/menu13/index",
                                "meta": {
                                    "title": "菜单13",
                                    "isLink": "",
                                    "isHide": false,
                                    "isKeepAlive": true,
                                    "isAffix": false,
                                    "isIframe": false,
                                    "roles": ["admin", "common"],
                                    "icon": "iconfont icon-caidan"
                                }
                            }
                        ]
                    },
                    {
                        "path": "/menu/menu2",
                        "name": "menu2",
                        "component": "menu/menu2/index",
                        "meta": {
                            "title": "菜单2",
                            "isLink": "",
                            "isHide": false,
                            "isKeepAlive": true,
                            "isAffix": false,
                            "isIframe": false,
                            "roles": ["admin", "common"],
                            "icon": "iconfont icon-caidan"
                        }
                    }
                ]
            },
            {
                "path": "/fun",
                "name": "funIndex",
                "component": "layout/routerView/parent",
                "redirect": "/fun/tagsView",
                "meta": {
                    "title": "功能",
                    "isLink": "",
                    "isHide": false,
                    "isKeepAlive": true,
                    "isAffix": false,
                    "isIframe": false,
                    "roles": ["admin", "common"],
                    "icon": "iconfont icon-crew_feature"
                },
                "children": [
                    {
                        "path": "/fun/tagsView",
                        "name": "funTagsView",
                        "component": "fun/tagsView/index",
                        "meta": {
                            "title": "tagsView",
                            "isLink": "",
                            "isHide": false,
                            "isKeepAlive": true,
                            "isAffix": false,
                            "isIframe": false,
                            "roles": ["admin", "common"],
                            "icon": "ele-Pointer"
                        }
                    }
                ]
            },
            {
                "path": "/chart",
                "name": "chartIndex",
                "component": "chart/index",
                "meta": {
                    "title": "大数据图表",
                    "isLink": "",
                    "isHide": false,
                    "isKeepAlive": true,
                    "isAffix": false,
                    "isIframe": false,
                    "roles": ["admin", "common"],
                    "icon": "iconfont icon-ico_shuju"
                },
                "children":[]
            },
            {
                "path": "/personal",
                "name": "personal",
                "component": "personal/index",
                "meta": {
                    "title": "个人中心",
                    "isLink": "",
                    "isHide": false,
                    "isKeepAlive": true,
                    "isAffix": false,
                    "isIframe": false,
                    "roles": ["admin", "common"],
                    "icon": "iconfont icon-gerenzhongxin"
                }
            },
            {
                "path": "/tools",
                "name": "tools",
                "component": "tools/index",
                "meta": {
                    "title": "工具类集合",
                    "isLink": "",
                    "isHide": false,
                    "isKeepAlive": true,
                    "isAffix": false,
                    "isIframe": false,
                    "roles": ["admin", "common"],
                    "icon": "iconfont icon-gongju"
                },
                "children":[]
            },
            {
                "path": "/link",
                "name": "layoutLinkView",
                "component": "layout/routerView/link",
                "meta": {
                    "title": "外链",
                    "isLink": "https://element-plus.gitee.io/#/zh-CN/component/installation",
                    "isHide": false,
                    "isKeepAlive": false,
                    "isAffix": false,
                    "isIframe": false,
                    "roles": ["admin"],
                    "icon": "iconfont icon-caozuo-wailian"
                },
                "children":[]
            },
            {
                "path": "/iframes",
                "name": "layoutIfameView",
                "component": "layout/routerView/iframe",
                "meta": {
                    "title": "内嵌IfameView",
                    "isLink": "https://gitee.com/lyt-top/vue-next-admin",
                    "isHide": false,
                    "isKeepAlive": true,
                    "isAffix": true,
                    "isIframe": true,
                    "roles": ["admin"],
                    "icon": "iconfont icon-neiqianshujuchucun"
                },
                "children":[]
            }
        ]}
    }
})