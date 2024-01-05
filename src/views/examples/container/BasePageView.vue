<template>
	<rk-container :isFooter="false" :isAside="false">
		<template #header_left>
			<el-button-group>
				<el-button type="primary" :class="[ns.be('left-g', 'btn')]">未审核</el-button>
				<el-button :class="ns.be('left-g', 'btn')">已审核 </el-button>
			</el-button-group>
		</template>
		<template #header_right>
			<el-button type="primary" :class="[ns.be('right-g', 'btn')]">审核</el-button>
			<el-button :class="ns.be('right-g', 'btn')">退回</el-button>
			<el-button :class="ns.be('right-g', 'btn')">操作记录</el-button>
			<el-button v-if="!showCondition" :class="ns.be('right-g', 'btn')" @click="showCondition = true">展开条件</el-button>
			<el-button v-else :class="ns.be('right-g', 'btn')" @click="showCondition = false">收起条件</el-button>
		</template>
		<template #main>
			<rk-center>
				<template #condition>
					<rk-center-bar v-show="showCondition">
						<template #content>
							<el-form ref="form" :inline="true" :model="form" label-width="80px">
								<el-form-item label="申报年度">
									<el-input v-model="form.name"></el-input>
								</el-form-item>
								<el-form-item label="申报批次">
									<el-input v-model="form.name"></el-input>
								</el-form-item>
							</el-form>
						</template>
						<template #buttons>
							<el-button>新增项目</el-button>
							<el-button>修改</el-button>
							<el-button>删除</el-button>
							<el-button type="primary">送审</el-button>
						</template>
					</rk-center-bar>
				</template>
				<template #content>
					<!-- <rk-pdf :src="pdfFile"/> -->
				</template>
			</rk-center>
		</template>
	</rk-container>
</template>

<script setup>
import { useNamespace } from 'element-plus';
import { reactive } from 'vue';
// import RkPdf from "../../components/pdf/RkPdf.vue";
// import pdfFile from '@/assets/compressed.tracemonkey-pldi-09.pdf'

const ns = useNamespace('page', ref('rk'));
const form = reactive({
	name: '',
});
const showCondition = ref(true);
</script>

<style scoped lang="scss">
@use '@/styles/mixins/function.scss' as *;

@include b(page) {
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

		// &__btn {
		// }

		&__btn:nth-child(1) {
			border-radius: 10px 0 0 10px;
		}

		&__btn:last-child {
			border-radius: 0 10px 10px 0;
		}
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

		&__btn {
			margin-left: 10px;
		}
	}
}
</style>
