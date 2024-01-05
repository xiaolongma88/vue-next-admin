import { defineAsyncComponent } from 'vue';

const RkDialog = defineAsyncComponent(() => import('./src/RkDialog.vue'));
const UploadProjDialog = defineAsyncComponent(() => import('./src/form/UploadProjDialog.vue'));
const ReserveProjDialog = defineAsyncComponent(() => import('./src/form/ReserveProjDialog.vue'));
const OrganizeInfoDialog = defineAsyncComponent(() => import('./src/form/OrganizeInfoDialog.vue'));

export { ReserveProjDialog, UploadProjDialog, RkDialog, OrganizeInfoDialog };
