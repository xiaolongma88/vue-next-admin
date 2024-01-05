<template>
	<i class="el-sub-menu iconfont" v-if="iconClass">
		<svg :class="svgClass" aria-hidden="true">
			<use :xlink:href="iconName" :fill="color" />
		</svg>
	</i>
</template>

<script>
export default defineComponent({
	props: {
		iconClass: {
			type: String,
			required: true,
		},
		className: {
			type: String,
			default: '',
		},
		color: {
			type: String,
			default: '',
		},
	},
	setup(props) {
		return {
			iconName: computed(() => {
				return `#icon-${props.iconClass.replace('rk-', '')}`;
			}),
			svgClass: computed(() => {
				if (props.className) {
					return `svg-icon ${props.className}`;
				}
				return 'svg-icon';
			}),
		};
	},
});
</script>

<style scope lang="scss">
.sub-el-icon,
.nav-icon {
	display: inline-block;
	font-size: 15px;
	margin-right: 12px;
	position: relative;
}

.svg-icon {
	width: 15px;
	height: 15px;
	position: relative;
	fill: currentColor;
	vertical-align: -2px;
}
</style>
