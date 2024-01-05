<template>
	<el-container :class="ns.b()" :style="{ padding: '8px', background: '#fff', paddingTop: isHeader ? 0 : '8px' }">
		<el-header v-if="isHeader" :class="ns.b('header')">
			<slot v-if="$slots.header" name="header" />
			<div v-else :class="ns.b('header-group')">
				<div :class="ns.be('header-group', 'left')">
					<rk-bar>
						<slot v-if="$slots.header_left" name="header_left" />
						<div v-else :class="ns.b('ex-text-center')">slot="header_left"</div>
					</rk-bar>
				</div>

				<div :class="ns.be('header-group', 'right')">
					<rk-bar type="right">
						<slot v-if="$slots.header_right" name="header_right" />
						<div v-else :class="ns.b('ex-text-center')">slot="header_right"</div>
					</rk-bar>
				</div>
			</div>
		</el-header>
		<el-container style="position: relative">
			<div :class="ns.b('content')">
				<div :class="ns.b('aside')" v-show="isAside" :style="{ '--var-aside-width': moveSize.planWidth }">
					<el-aside v-show="showAside" :class="ns.be('aside', 'body')" :width="defaultSize.planBasicWidth">
						<slot v-if="$slots.aside" name="aside" />
						<div v-else :class="ns.b('ex-text-center')">slot="aside"</div>
					</el-aside>
					<div
						ref="asideBlockRef"
						:class="ns.be('aside', 'line')"
						@click="onLineClick"
						@mousedown.stop="planResize.planMousedDown"
						@mouseup.stop="planResize.planMouseUp"
					>
						<el-icon v-if="showAside">
							<arrow-left />
						</el-icon>
						<el-icon v-else>
							<arrow-right />
						</el-icon>
					</div>
				</div>
				<el-container style="border: 1px solid #dadada">
					<el-main :class="ns.b('main-content')" :style="{ height: isFooter ? 'calc(100% - 60px)' : '100%' }">
						<slot v-if="$slots.main" name="main" />
						<div v-else :class="ns.b('ex-text-center')">slot="main"</div>
					</el-main>
					<el-footer v-if="isFooter" :class="ns.b('main-footer')">
						<slot v-if="$slots.footer" name="footer" />
						<div v-else :class="ns.b('ex-text-center')">slot="footer"</div>
					</el-footer>
				</el-container>
			</div>
		</el-container>
		<div v-if="isMove" :class="ns.b('panel-mask')" @mouseup.stop="planResize.planMouseUp" @mousemove.stop="planResize.planMouseMove"></div>
		<slot></slot>
	</el-container>
</template>

<script setup>
import RkBar from './RkBar.vue';
import { reactive, ref } from 'vue';
import { useNamespace } from 'element-plus';
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue';

const props = defineProps({
	//是否显示Aside面板，默认显示
	isAside: {
		type: Boolean,
		default: true,
	},
	//是否显示Footer,默认显示
	isFooter: {
		type: Boolean,
		default: true,
	},
	//是否显示 Header，默认显示
	isHeader: {
		type: Boolean,
		default: true,
	},
});

//名称空间
const ns = useNamespace('layout', ref('rk'));

//是否显示左侧面板
const showAside = ref(true);

//伸缩条
const asideBlockRef = ref(null);

// 默认尺寸
const defaultSize = reactive({
	planBasicWidth: '300px',
});

const moveSize = reactive({
	planWidth: '300px',
	tempWidth: '300px',
});

//鼠标是否移动状态
const isMove = ref(false);
//移动中
const moving = ref(false);

//拖动改变面板大小
const planResize = {
	//鼠标按下
	planMousedDown: (e) => {
		isMove.value = true;
	},
	//鼠标移动
	planMouseMove: (e) => {
		//鼠标按下且面板不是关闭状态
		if (isMove.value && showAside.value) {
			moving.value = true;
			moveSize.planWidth = `${e.layerX}px`;
			moveSize.tempWidth = `${e.layerX}px`;
		}
	},
	//鼠标松开
	planMouseUp: (e) => {
		isMove.value = false;
		defaultSize.planBasicWidth = moveSize.planWidth;
		//设置移动中延时关闭
		setTimeout(() => {
			moving.value = false;
		}, 100);
	},
};

const onLineClick = () => {
	if (!moving.value) {
		showAside.value = !showAside.value;
		if (showAside.value) {
			moveSize.planWidth = moveSize.tempWidth;
			defaultSize.planBasicWidth = moveSize.tempWidth;
		} else {
			moveSize.planWidth = '0px';
		}
	}
};
</script>

<style scoped lang="scss">
@use '@/styles/mixins/function.scss' as *;

@include b(layout) {
	height: 100%;
	width: 100%;
	position: relative;
	&-panel-mask {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		opacity: 0.3;
		z-index: 800;
	}
	&-header {
		display: flex;
	}

	&-header-group {
		display: flex;
		align-content: center;
		align-items: center;
		width: 100%;

		&__left {
			width: 50%;
			box-sizing: border-box;
			height: 100%;
		}

		&__right {
			width: 50%;
			box-sizing: border-box;
			height: 100%;
		}
	}

	&-header-left {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	&-left-g {
		width: 90%;
		display: flex;
		justify-content: flex-start;
	}

	&-header-right {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	&-right-g {
		width: 90%;
		display: flex;
		justify-content: flex-end;
	}

	&-aside {
		//background-color: #0d84ff;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		margin-right: 10px;

		&__body {
			box-sizing: border-box;
			border: 1px solid #dadada;
		}

		&__line {
			position: absolute;
			top: 0;
			width: 10px;
			left: var(--var-aside-width);
			height: 100%;
			cursor: w-resize;
			z-index: 1000;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&__line:hover {
			background-color: #eaeaea;
		}
	}
	&-content {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
	}
	&-main-content {
		//background-color: #e7746f;
		box-sizing: border-box;
		padding: 0;
		margin: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}
	&-main-footer {
		//background-color: #f8f38b;
		box-sizing: border-box;
		border: 1px solid #dadada;
		border-left: unset;
		border-right: unset;
		border-bottom: unset;
		padding: 0;
		margin: 0;
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

:deep(.el-header) {
	padding: 0;
}
</style>
