<!--
 * @Author: sdy
 * @Date: 2023-04-23 17:52:47
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-20 17:08:39
 * @Description: 布局查询的Bar
-->
<template>
	<div :class="[ns.b(), background ? '' : 'no-background']">
		<div :class="[ns.b('content')]">
			<slot name="content"></slot>
		</div>
		<div :class="ns.b('btn-group')">
			<slot name="buttons"></slot>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useNamespace } from 'element-plus';
let ns = useNamespace('condition', ref('rk'));

const props = defineProps({
	background: { type: [String, Boolean], default: true },
});
</script>

<style scoped lang="scss">
@use '@/styles/mixins/function.scss' as *;

@include b('condition') {
	width: 100%;
	background-color: #edf1fc;
	padding: 10px;
	display: flex;
	justify-items: flex-start;
	&-content {
		display: flex;
		flex: 1;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0 10px 0 0;
	}
	&-btn-group {
		min-width: 15%;
		display: flex;
		align-items: flex-start;
		justify-content: flex-end;
	}
}

.no-background {
	background: unset;
	border-bottom: 1px solid #dadada;
}
</style>
<style lang="scss">
@use '@/styles/mixins/function.scss' as *;
@include b('condition-bar') {
	.el-form-item {
		margin-right: 15px;
		margin-bottom: 0;
	}
}
</style>
