<template>
	<slot name="condition" />
	<div :class="ns.b()">
		<div :class="ns.b('m')">
			<slot name="content" />
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useNamespace } from 'element-plus';

let ns = useNamespace('center-content', ref('rk'));
</script>

<style scoped lang="scss">
@use '@/styles/mixins/function.scss' as *;

@include b('center-content') {
	flex: 1;
	position: relative;
	&-m {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
	}
}
</style>
