let EnumsPools = {};
let EnumsOptions = [];
let EnumsDataPools = {};
const modules = import.meta.globEager('./**/*.js');
for (const path in modules) {
	for (let key in modules[path]) {
		if (key !== 'default') {
			let module = modules[path][key];
			if ((module instanceof Object || typeof module === 'object') && !(module instanceof Function)) {
				if (module.hasOwnProperty('value') && module.hasOwnProperty('label') && module.hasOwnProperty('options')) {
					EnumsPools[key] = module;
					EnumsDataPools[key] = module;
					EnumsOptions.push(module);
				}
			}
		}
	}
}

export { EnumsPools, EnumsOptions, EnumsDataPools };
