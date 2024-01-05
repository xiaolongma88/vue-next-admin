<template>
	<el-button-group>
		<el-button
			v-for="item in options"
			:key="item.value"
			:type="item.value === modelValue ? 'primary' : 'default'"
			:icon="ElementPlusIconsVue[item.icon]"
			@click="handleClick(item)"
		>
			{{ item.label }}
		</el-button>
	</el-button-group>
</template>

<script setup name="RkButtonGroup">
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
defineProps(['modelValue', 'options']);
const emits = defineEmits(['update:modelValue']);
const handleClick = function (item) {
	emits('update:modelValue', item.value);
};
</script>

<style lang="scss" scoped></style>
