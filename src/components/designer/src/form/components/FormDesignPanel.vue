<!--
 * @Author: lisong
 * @Date: 2023-04-13 16:10:48
 * @LastEditors: lisong
 * @LastEditTime: 2023-04-13 16:49:05
 * @Description: 表单设计
-->
<template>
	<VFormDesigner
		class="rk-form-design"
		ref="vfDesignerRef"
		:busiConfig="busiConfig"
		:enumsConfig="enumsConfig"
		:slotsConfig="slotsConfig"
		:designerConfig="designerConfig"
		:slotFieldList="slotFieldList"
		:axiosConfig="axiosConfig"
	>
	</VFormDesigner>
</template>

<script setup name="FormDesignPanel">
import { isEmpty } from 'xe-utils';
import { defAxios } from '@/utils/http';
import { useUserStore } from '@/stores/modules';
import { EnumsDataPools } from '@/enums'
// import { slotFieldList } from '@/components/form-slots/index.js'

const slotFieldList = [];

// 表单设计器
const props = defineProps({
	formJson: { type: [String, Object], default: '' },
});

const vfDesignerRef = ref();
watch(
	() => props.formJson,
	(newValue, oldValue) => {
		nextTick(() => {
			if (!isEmpty(newValue)) {
				vfDesignerRef.value.setFormJson(newValue);
			} else {
				vfDesignerRef.value.clearDesigner();
			}
		});
	},
	{ deep: true, immediate: true }
);

const busiConfig = ref({
	userInfo: useUserStore().userInfo,
	dataHouse: {},
});
const axiosConfig = ref({
	request: defAxios,
});
const enumsConfig = ref({
	dataPools: EnumsDataPools,
});
const slotsConfig = ref({
	dataPools: slotFieldList,
});
const designerConfig = ref({
	resetFormJson: true,
});
function getFormData() {
	const formJson = vfDesignerRef.value.getFormJson();
	const fieldWidgets = vfDesignerRef.value.getFieldWidgets();
	let slotJson = [];
	let formFileds = [];
	fieldWidgets.forEach((item) => {
		let fieldOptions = item.field.options;
		if (item.type === 'slot') {
			slotJson.push({
				id: item.field.id,
				key: item.field.key,
				value: item.name,
				label: fieldOptions.label,
			});
		} else {
			const dataField = fieldOptions.dataField;
			formFileds.push({
				code: item.name,
				field: dataField ? dataField.split('.')[1] : '',
				tableName: dataField ? dataField.split('.')[0] : '',
			});
		}
	});
	return {
		formJson: formJson,
		slotJson: slotJson,
		formFileds: formFileds,
	};
}

defineExpose({
	getFormData,
});
</script>

<style lang="scss">
.rk-form-design .form-widget-container {
	.el-tabs__header {
		background-color: #e3f1fe;
	}
	.el-tabs__nav-scroll {
		padding: 0 5px;
	}
	.el-tabs__content {
		padding: 15px;
	}
}
</style>
