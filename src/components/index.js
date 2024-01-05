// ----- 二次封装表格
import RkGrid from './table/RkGrid.vue';
// import SvgIcon from '@/components/SvgIcon/index.vue'

// ----- 按钮组
import { RkButtonGroup } from '@/components/button';

// ----- 下拉框
import { RkSelect } from '@/components/select';

// ----- 树下拉框
import { RkTreeSelect } from '@/components/tree-select';

// ----- 布局相关
import { RkBar, RkCenter, RkCenterBar, RkContainer, RkTopBottom } from '@/components/container';

// ----- 弹出框
import { RkDialog } from '@/components/dialog';

// ----- 树结构面板
import { RkAdAgTree } from '@/components/tree';

// ----- 抽屉面板
import { OperationLog } from '@/components/drawer';

const components = {
	'rk-grid|RkGrid': RkGrid,
	// "svg-icon|SvgIcon": SvgIcon,
	'rk-select|RkSelect': RkSelect,
	'rk-tree-select|RkTreeSelect': RkTreeSelect,
	'rk-button-group|RkButtonGroup': RkButtonGroup,
	'rk-ad-ag-tree|RkAdAgTree': RkAdAgTree,
	'rk-dialog|RkDialog': RkDialog,

	'rk-bar|RkBar': RkBar,
	'rk-center|RkCenter': RkCenter,
	'rk-center-bar|RkCenterBar': RkCenterBar,
	'rk-container|RkContainer': RkContainer,
	'rk-top-bottom-container|RkTopBottomContainer': RkTopBottom,

	'operation-log|OperationLog': OperationLog,
};
export const setupComponents = function (app) {
	Reflect.ownKeys(components).forEach((keys) => {
		if (keys.includes('|')) {
			keys.split('|').forEach((key) => {
				app.component(key, components[keys]);
			});
		} else {
			app.component(keys, components[keys]);
		}
	});
};
