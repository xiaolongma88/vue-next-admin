/**
 * 通用工具方法
 */
export const CommonUtils = {
	/**
	 * 获取基础数据查询参数
	 * @param {String|Object} dist 目标数据
	 * @returns Object 查询参数
	 */
	getDistQueryParams: function (dist) {
		// 封装查询参数
		let params = {};
		// 字符串类型
		if (dist instanceof String || typeof dist === 'string') {
			params = { name: dist };
		}
		// 对象类型
		if (dist instanceof Function || typeof dist === 'object') {
			// name属性
			if (dist.hasOwnProperty('name') && dist.name) {
				params = { ...params, name: dist.name };
			} else {
				console.error('dist为对象类型时，name属性必传！');
			}
			if (dist.hasOwnProperty('params') && dist.params) {
				params = { ...params, ...dist.params };
			}
		}
		return params;
	},
	/**
	 * 校验dist参数信息
	 * @param {String|Object} dist 目标数据
	 * @returns String 校验不通过-提示语不为空 校验通过-提示语为空
	 */
	validateDist: (dist) => {
		let msg = '';
		// 字符串类型
		if (dist instanceof String || typeof dist === 'string') {
			msg = dist ? '' : 'dist为字符串类型时，值不能为空';
		}
		if (dist instanceof Function || typeof dist === 'object') {
			if (dist.hasOwnProperty('name') && dist.name) {
				msg = dist.name ? '' : 'dist为对象类型时，name属性必传，且之不能为空！';
			}
		}
		return msg;
	},
	validateServer: (data) => {
		if (data instanceof Object || typeof data === 'object') {
			if (!data.hasOwnProperty('url')) {
				return 'server为对象类型时，url属性必传，且之不能为空！';
			} else {
				if (!data.url) {
					return 'server为对象类型时，url属性必传，且之不能为空！';
				}
			}
			if (!data.hasOwnProperty('method')) {
				return 'server为对象类型时，method属性必传，且之不能为空！';
			} else {
				if (!data.url) {
					return 'server为对象类型时，method属性必传，且之不能为空！';
				}
			}
			return '';
		} else {
			return 'server需要为对象类型数据！';
		}
	},
};

/**
 * 转换树结构基础数据的结构
 */
export const TreeSelectUtils = {
	nodeMap: {},
	expandMap: {},
	parseData: function (target, config, targetCodes = []) {
		if (!target) return [];
		const { showCode, props } = config;
		return target.map((item) => {
			let code = item[props.code || 'code'];
			let label = item[props.label];
			let value = item[props.value];
			item[props.label] = showCode ? `${code || value} ${label}` : label;
			item[props.value] = value;
			targetCodes = [...targetCodes, value];
			if (item.children && item.children.length > 0) {
				item.children = TreeSelectUtils.parseData(item.children, config, targetCodes);
			}
			TreeSelectUtils.nodeMap[value] = item;
			TreeSelectUtils.expandMap[value] = targetCodes;
			targetCodes.pop();
			return item;
		});
	},
	transfData: function (target, config) {
		TreeSelectUtils.nodeMap = {};
		TreeSelectUtils.expandMap = {};
		const treeData = TreeSelectUtils.parseData(target, config);
		return {
			nodeMap: TreeSelectUtils.nodeMap,
			parseData: treeData,
			expandMap: TreeSelectUtils.expandMap,
		};
	},
};
