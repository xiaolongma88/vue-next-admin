<!--
 * @Author: lisong
 * @Date: 2023-04-13 16:10:48
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-23 09:16:46
 * @Description: 布局样式示例-上下表格
-->
<template>
	<RkTopBottomContainer :isFooter="false">
		<template #header_left>
			<RkButtonGroup :options="json_jcsh_button" v-model="queryParams.wfStatus" />
		</template>
		<template #header_right>
			<el-button>新增项目</el-button>
			<el-button>修改</el-button>
			<el-button>删除</el-button>
			<el-button type="primary">送审</el-button>
			<el-button>操作记录</el-button>
			<el-button v-if="!showCondition" @click="showCondition = true">展开条件</el-button>
			<el-button v-else @click="showCondition = false">收起条件</el-button>
		</template>
		<template #aside>
			<RkAdAgTree />
		</template>
		<template #main_top>
			<rk-center>
				<template #condition>
					<rk-center-bar v-show="showCondition">
						<template #content>
							<el-form ref="form" :inline="true">
								<el-form-item label="申报年度" style="padding-bottom: 0px">
									<el-input v-model="queryParams.sbYear"></el-input>
								</el-form-item>
								<el-form-item label="申报批次">
									<el-input v-model="queryParams.sbBatch"></el-input>
								</el-form-item>
							</el-form>
						</template>
						<template #buttons>
							<el-button type="primary">查询</el-button>
							<el-button>重置</el-button>
						</template>
					</rk-center-bar>
				</template>
				<template #content>
					<rk-grid ref="vformRef" title="表单管理" :data="tableData" boxConfig :columns="tableColumns">
						<template #toolbar_title_buttons>
							<el-select v-model="queryParams.status" placeholder="请选择状态" class="mr-15px w-200px" clearable>
								<el-option v-for="item in COMMON_STOP_OPEN_ENUMS.options" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
							<el-input v-model="queryParams.keyWords" placeholder="请输入名称/编码" class="mr-15px w-200px" clearable> </el-input>
						</template>
						<template #operation="{ row }">
							<div class="operation-box">
								<el-button type="primary" link>设计</el-button>
								<el-button type="primary" link>预览</el-button>
							</div>
						</template>
						<template #status="{ row }">
							<el-tag :type="COMMON_STOP_OPEN_ENUMS.options[row.status].tagType" class="mx-1" effect="plain">
								{{ COMMON_STOP_OPEN_ENUMS.options[row.status].echo }}
							</el-tag>
						</template>
					</rk-grid>
				</template>
			</rk-center>
		</template>
		<template #main_bottom>
			<rk-center>
				<template #content>
					<rk-grid ref="vformRef" title="表单管理" :data="tableData" boxConfig :columns="tableColumns">
						<template #toolbar_title_buttons>
							<el-select v-model="queryParams.status" placeholder="请选择状态" class="mr-15px w-200px" clearable>
								<el-option v-for="item in COMMON_STOP_OPEN_ENUMS.options" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
							<el-input v-model="queryParams.keyWords" placeholder="请输入名称/编码" class="mr-15px w-200px" clearable> </el-input>
						</template>
						<template #operation="{ row }">
							<div class="operation-box">
								<el-button type="primary" link>设计</el-button>
								<el-button type="primary" link>预览</el-button>
							</div>
						</template>
						<template #status="{ row }">
							<el-tag :type="COMMON_STOP_OPEN_ENUMS.options[row.status].tagType" class="mx-1" effect="plain">
								{{ COMMON_STOP_OPEN_ENUMS.options[row.status].echo }}
							</el-tag>
						</template>
					</rk-grid>
				</template>
			</rk-center>
		</template>
	</RkTopBottomContainer>
</template>

<script setup>
import { json_jcsh_button } from '@/common/button-data.js';
import { COMMON_STOP_OPEN_ENUMS } from '@/enums/enums-common.js';

const showCondition = ref(false);

// 查询参数
const queryParams = ref({
	status: undefined,
	wfStatus: '001',
	keyWords: undefined,
	sbYear: '',
	sbBatch: '',
});
const tableData = ref([
	{
		status: 1,
		name: '张三',
		code: 2222,
		createTime: '2011-01-01',
	},
	{
		status: 1,
		name: '李四',
		code: 2222,
		createTime: '2011-01-01',
	},
]);
const tableColumns = ref([
	{ field: 'status', title: '状态', width: 120, align: 'center', slots: { default: 'status' } },
	{ field: 'name', title: '名称', align: 'left', headerAlign: 'center' },
	{ field: 'code', title: '编码', align: 'left', width: 300, headerAlign: 'center' },
	{ field: 'createTime', title: '创建时间', width: 200, showOverflow: true, align: 'center' },
	{ field: 'operation', title: '操作', width: 120, showOverflow: true, align: 'center', slots: { default: 'operation' } },
]);
</script>

<style scoped></style>
