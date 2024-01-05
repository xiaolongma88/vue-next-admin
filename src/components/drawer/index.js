import { defineAsyncComponent } from 'vue';

const OperationLog = defineAsyncComponent(() => import('./src/OperationLog.vue'));

export { OperationLog };
