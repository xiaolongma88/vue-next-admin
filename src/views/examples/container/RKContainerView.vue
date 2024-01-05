<template>
	<RkContainer :isFooter="false">
		<template #header_left>
			<RkButtonGroup :options="json_jcsh_button" v-model="queryParams.wfStatus" />
		</template>
		<template #header_right>
			<el-button @click="handleAdd">新增项目</el-button>
			<el-button>修改</el-button>
			<el-button>删除</el-button>
			<el-button type="primary">送审</el-button>
			<el-button>操作记录</el-button>
			<el-button v-if="!showCondition" @click="showCondition = true">展开条件 </el-button>
			<el-button v-else @click="showCondition = false">收起条件 </el-button>
		</template>
		<template #aside>
			<RkAdAgTree />
		</template>
		<template #main>
			<RkCenter>
				<template #condition>
					<RkCenterBar v-show="showCondition">
						<template #content>
							<el-form ref="form" :inline="true">
								<el-form-item label="申报年度">
									<el-input v-model="queryParams.sbYear"></el-input>
								</el-form-item>
								<!-- <el-form-item label="申报批次">
                  <el-input v-model="queryParams.sbBatch"></el-input>
                </el-form-item> -->
								<!-- <el-form-item label="下拉框">
									<rk-select dist="DEBT_ZGBM" v-model="selectVal" :labelConfig="{ value: 'id', label: 'name' }" />
								</el-form-item>
								<el-form-item label="下拉树">
									<rk-tree-select dist="DEBT_ZWXMLX"
                    :props="{label:'name',children:'children'}"
                    @node-click="handleNodeClick" :clearable="true">
                  </rk-tree-select>
									<rk-tree-select v-model="treeSelectValue" dist="DEBT_ZWXMLX"> </rk-tree-select>
								</el-form-item> -->
							</el-form>
						</template>
						<template #buttons>
							<el-button type="primary">查询</el-button>
							<el-button>重置</el-button>
						</template>
					</RkCenterBar>
				</template>
				<template #content>
					<rk-grid
						ref="vformRef"
						title="表单管理"
						dataUrl="/prdFormInfo/queryPrdFormInfoPageList"
						boxConfig
						:params="queryParams"
						:columns="tableColumns"
					>
						<template #toolbar_title_buttons>
							<!-- <el-select v-model="queryParams.status"
                placeholder="请选择状态"
                class="mr-15px w-200px"
                clearable>
                <el-option v-for="item in COMMON_STOP_OPEN_ENUMS.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select> -->
							<el-input v-model="queryParams.keyWords" placeholder="请输入名称/编码" class="mr-15px w-200px" clearable> </el-input>
							<!-- <rk-select v-model="queryParams.type" enum="EXPERT_INPUT_STATUS" @change="handleSearch"></rk-select>
							<rk-select v-model="queryParams.type" :options="options" @change="handleSearch"></rk-select>
							<rk-select
								v-model="queryParams.type"
								:dist="{ name: 'DEBT_V_CTS_ELE_XMJSZT' }"
								:labelConfig="{
									value: 'id',
									label: 'name',
								}"
								@change="handleSearch"
							></rk-select> -->
						</template>
						<template #operation="{ row }">
							<div class="operation-box">
								<el-button type="primary" link>设计 </el-button>
								<el-button type="primary" link>预览 </el-button>
							</div>
						</template>
						<template #status="{ row }">
							<el-tag :type="COMMON_STOP_OPEN_ENUMS.options[row.status].tagType" class="mx-1" effect="plain">
								{{ COMMON_STOP_OPEN_ENUMS.options[row.status].echo }}
							</el-tag>
						</template>
					</rk-grid>
				</template>
			</RkCenter>
		</template>
		<RkFormDesigner ref="rkFormDesignRef" />
	</RkContainer>
</template>

<script setup>
import { ref, watch } from 'vue';
import { json_jcsh_button } from '@/common/button-data.js';
import { COMMON_STOP_OPEN_ENUMS } from '@/enums/enums-common.js';
import { RkFormDesigner } from '@/components/designer';

const showCondition = ref(false);

// 查询参数
const queryParams = ref({
	status: undefined,
	wfStatus: '001',
	keyWords: undefined,
	sbYear: '',
	sbBatch: '',
	type: undefined,
});
const vformRef = ref('');
const treeSelectValue = ref('');
const selectVal = ref('');
const options = ref([
	{
		value: '1',
		label: '测试1',
	},
	{
		value: '2',
		label: '测试2',
	},
]);

watch(selectVal, (v) => {
	console.log(v);
});
watch(
	() => queryParams.type,
	(newValue) => {
		console.log(newValue);
	}
);

const tableColumns = ref([
	{ field: 'status', title: '状态', width: 120, align: 'center', slots: { default: 'status' } },
	{ field: 'name', title: '名称', align: 'left', headerAlign: 'center' },
	{ field: 'code', title: '编码', align: 'left', width: 300, headerAlign: 'center' },
	{ field: 'createTime', title: '创建时间', width: 200, showOverflow: true, align: 'center' },
	{ field: 'operation', title: '操作', width: 120, showOverflow: true, align: 'center', slots: { default: 'operation' } },
]);
const handleSearch = () => {
	console.log(queryParams.value);
	vformRef.value.searchEvent();
};
const labelFormat = (item) => {
	return `${item.code}-${item.name}`;
};

const labelFunc = (data) => {
	return `${data.code}  ${data.name}`;
};
const handleNodeClick = (data) => {
	console.log(data);
};

const rkFormDesignRef = ref(null);
const handleAdd = () => {
	rkFormDesignRef.value.handleOpen();
};
</script>

<style lang="scss" scoped>
.mr-15px {
	margin-right: 15px;

	&:last-child {
		margin-right: 0;
	}
}

.w-200px {
	width: 200px;
}
</style>
