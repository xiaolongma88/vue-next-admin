<template>
	<rk-container>
		<template #[slotName] v-for="(slot, slotName) in $slots">
			<slot :name="slotName" />
		</template>
		<template #main>
			<div :class="ns.b('main-content')">
				<div :class="ns.b('top')" :style="{ height: defaultSize.planBasicHeight }">
					<slot v-if="$slots.main_top" name="main_top"></slot>
					<div v-else :class="ns.b('ex-text-center')">slot="main_top"</div>
				</div>
				<div :class="ns.b('line')" @mousedown.stop="planResize.planMousedDown" @mouseup.stop="planResize.planMouseUp"></div>
				<div :class="ns.b('bottom')">
					<slot v-if="$slots.main_top" name="main_bottom"></slot>
					<div v-else :class="ns.b('ex-text-center')">slot="main_bottom"</div>
				</div>
				<div v-if="isMove" :class="ns.b('panel-mask')" @mouseup.stop="planResize.planMouseUp" @mousemove.stop="planResize.planMouseMove"></div>
			</div>
		</template>
	</rk-container>
</template>

<script setup>
import { reactive, ref } from 'vue';
import RkContainer from './RkContainer.vue';
import { useNamespace } from 'element-plus';

const ns = useNamespace('layout-double', ref('rk'));

//鼠标是否移动状态
const isMove = ref(false);

// 默认尺寸
const defaultSize = reactive({
	planBasicHeight: '50%',
});

//拖动改变面板大小
const planResize = {
	//鼠标按下
	planMousedDown: (e) => {
		isMove.value = true;
	},
	//鼠标移动
	planMouseMove: (e) => {
		//鼠标按下且面板不是关闭状态
		if (isMove.value) {
			defaultSize.planBasicHeight = `${e.layerY}px`;
		}
	},
	//鼠标松开
	planMouseUp: (e) => {
		isMove.value = false;
	},
};
</script>
<style scoped lang="scss">
@use '@/styles/mixins/function.scss' as *;

@include b(layout-double) {
	&-main-content {
		display: flex;
		height: 100%;
		width: 100%;
		position: relative;
		flex-direction: column;
		flex-wrap: nowrap;
	}
	&-panel-mask {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		opacity: 0.3;
	}
	&-top {
		width: 100%;
		height: 50%;
		display: flex;
		flex-direction: column;
	}
	&-bottom {
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	&-line {
		height: 5px;
		width: 100%;
		background-color: #dadada;
		cursor: n-resize;
		z-index: 100;
	}
	&-line:hover {
		background-color: #eaeaea;
	}
	&-ex-text-center {
		text-align: center;
		font-size: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
}
</style>
