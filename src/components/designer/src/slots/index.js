/*
 * @Author: lisong
 * @Date: 2023-04-13 16:39:42
 * @LastEditors: lisong
 * @LastEditTime: 2023-04-24 18:05:17
 * @Description: 表单中使用的插槽替换组件
 */
let slotModules = {
	names: [],
	values: {},
};
let slotFieldList = [];

const slotsName = {
	AttachmentPanel: '附件面板',
	ProjectSzysTable: '收支预算表格',
};

/**
 * 获取组件名称
 * @param {String} path 组件地址
 * @returns String 组件名称
 */
function getComponentName(path) {
	const analysisPath = path.split('/');
	const componentName = analysisPath.pop().replace('.vue', '');
	return componentName;
}

const modules = import.meta.globEager('./components/*.vue');
for (const path in modules) {
	const module = modules[path].default;
	const { name, props } = module;
	const cname = name || getComponentName(path);
	const title = props ? props?.title?.default : '';
	slotModules.names.push(cname);
	slotModules.values[cname] = module;
	slotFieldList.push({ label: title || slotsName[cname] || cname, name: cname });
}
export { slotFieldList };

console.log('slotFieldList', { slotFieldList, slotModules });

export default slotModules;
