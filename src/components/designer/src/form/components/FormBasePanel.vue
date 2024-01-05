<!--
 * @Author: lisong
 * @Date: 2023-04-13 16:10:48
 * @LastEditors: g05047
 * @LastEditTime: 2023-05-10 09:02:27
 * @Description: 表单配置
-->
<template>
	<div class="rk-form-base-conf-body">
		<el-form ref="rkFormBaseConfRef" class="base-conf-form" :model="baseConfForm" :rules="baseConfRules" label-width="auto">
			<el-form-item label="表单名称" prop="name">
				<el-input v-model="baseConfForm.name" />
			</el-form-item>
			<el-form-item label="表单编码" prop="code">
				<el-input v-model="baseConfForm.code" />
			</el-form-item>
			<el-form-item label="表单排序" prop="orderNum">
				<el-input-number v-model="baseConfForm.orderNum" :min="1" style="width: 100%" />
			</el-form-item>
			<el-form-item label="表单描述" prop="remark">
				<el-input v-model="baseConfForm.remark" type="textarea" :autosize="{ minRows: 10, maxRows: 12 }" />
			</el-form-item>
			<el-form-item label="自定义规则" prop="validateContent">
				<el-input v-model="baseConfForm.validateContent" type="textarea" :autosize="{ minRows: 10, maxRows: 12 }" />
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup name="FormBasePanel">
import XEUtils from 'xe-utils';
import { FormBaseConfigPojo } from '@/components/designer/cfg/rk-form-pojo.js';

const props = defineProps({
	formData: { type: [String, Object], default: () => ({}) },
});

const rkFormBaseConfRef = ref();
const baseConfForm = ref({ ...FormBaseConfigPojo });
const baseConfRules = reactive({
	name: [{ required: true, message: '请输入表单名称', trigger: 'blur' }],
	code: [{ required: true, message: '请输入表单编码', trigger: 'blur' }],
	// orderNum: [
	//   { required: true, message: '请输入表单排序', trigger: 'blur' }
	// ],
});
watch(
	() => props.formData,
	(newValue, oldValue) => {
		nextTick(() => {
			if (!XEUtils.isEmpty(newValue)) {
				baseConfForm.value = newValue;
			} else {
				baseConfForm.value = { ...FormBaseConfigPojo };
			}
		});
	},
	{ deep: true, immediate: true }
);

const getFormData = function () {
	return new Promise((reslove) => {
		rkFormBaseConfRef.value.validate((valid) => {
			if (valid) {
				reslove(toRaw(baseConfForm.value));
			} else {
				reslove('');
			}
		});
	});
};
const resetFormData = function () {
	rkFormBaseConfRef.value.resetFields();
	baseConfForm.value = XEUtils.clone(FormBaseConfigPojo, true);
};

defineExpose({
	getFormData,
	resetFormData,
});
</script>

<style lang="scss" scoped>
.rk-form-base-conf-body {
	height: 100%;
	background-color: #fff;
	padding-top: 50px;
	display: flex;
	justify-content: center;
	.base-conf-form {
		width: 45%;
	}
}
</style>
