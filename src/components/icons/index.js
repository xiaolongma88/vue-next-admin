// import RkIcon from './src/RkIcon.vue';
// import SvgIcon from './src/SvgIcon.vue';
// import IconList from './src/icon-selector/list.vue';
// import IconSelector from './src/icon-selector/index.vue';

const RkIcon = defineAsyncComponent(() => import('./src/RkIcon.vue'));
const SvgIcon = defineAsyncComponent(() => import('./src/SvgIcon.vue'));
const IconList = defineAsyncComponent(() => import('./src/icon-selector/list.vue'));
const IconSelector = defineAsyncComponent(() => import('./src/icon-selector/index.vue'));

export { SvgIcon, IconList, IconSelector, RkIcon };
