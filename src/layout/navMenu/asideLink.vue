<template>
	<component :is="linkType" v-bind="linkProps()" class="aside-link">
		<slot />
	</component>
</template>

<script setup>
import { IsUtils } from '@/utils';

// 定义Props
const props = defineProps({
	to: { type: [String, Object], required: true },
});
// 是否存在外链
const isExternal = computed(() => {
	return IsUtils.isExternal(props.to);
});
// 标签类型
const linkType = computed(() => {
	// 包含外链返回a标签
	if (isExternal.value) {
		return 'a';
	}
	return 'router-link';
});
// 处理传入的props信息
function linkProps() {
	if (isExternal.value) {
		return {
			href: props.to,
			target: '_blank',
			rel: 'noopener',
		};
	}
	return {
		to: props.to,
	};
}
</script>
