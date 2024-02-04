import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import { directive } from '/@/directive/index';
import other from '/@/utils/other';

// 全局引入ElementPlus
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import ElementPlus from 'element-plus';
import '/@/theme/index.scss';
// svg图标
import 'virtual:svg-icons-register';
// 引入VForm3
import VForm3 from '@/../lib/vform/designer.umd.js';
import '@/../lib/vform/designer.style.css';
// 引入全局工作流
import ProcessDesigner from './components/bpmn/package/designer/index';
import './components/bpmn/package/theme/index.scss';
// 引入全局组件配置
import { setupComponents } from '@/components/index.js';
// vxe-table表格
import VxeTablePlugins from '@/plugins/vxe-table-plugins.jsx';
import 'vxe-table/lib/style.css';

// 引入样式
import '@/styles/index.scss';
import '@/mock/mock.js'

const app = createApp(App);
setupComponents(app);
directive(app);
other.elSvg(app);
// 配置工作流
app.use(ProcessDesigner);
// 添加vxe-table
app.use(VxeTablePlugins);
// 添加ElementPlus
app.use(ElementPlus, { size: 'default', locale: zhCn });

// 添加VForm表单设计器
app.use(VForm3);
app.use(pinia).use(router).mount('#app');
