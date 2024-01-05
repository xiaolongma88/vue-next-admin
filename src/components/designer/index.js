import { defineAsyncComponent } from 'vue';

const RkFormRender = defineAsyncComponent(() => import('./src/form/components/FormRenderPanel.vue'));
const RkFormDesigner = defineAsyncComponent(() => import('./src/form/RkFormDesigner.vue'));

export { RkFormDesigner, RkFormRender };
