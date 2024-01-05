<template>
	<div :class="[ns.b('common'), ns.b(type)]">
		<slot />
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useNamespace } from 'element-plus';

defineProps({
	//类型 默认左对齐 ["left","right","center"]
	type: {
		type: String,
		default: 'left',
	},
});

const ns = useNamespace('bar', ref('rk'));
</script>

<style scoped lang="scss">
@use '@/styles/mixins/function.scss' as *;

@include b(bar) {
	&-common {
		display: flex;
		height: 100%;
		width: 100%;
		padding: 0 10px;
		align-items: center;
	}
	&-left {
		justify-content: flex-start;
	}
	&-right {
		justify-content: flex-end;
	}
	&-center {
		justify-content: center;
	}
}
</style>
