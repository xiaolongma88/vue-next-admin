<template>
	<RkContainer :isFooter="false" :isAside="false">
		<template #header_left></template>
		<template #header_right>
			<el-button type="primary" @click="handleAdd">新建</el-button>
			<el-button @click="handleOperation('status', '启用', 1)">启用</el-button>
			<el-button @click="handleOperation('status', '停用', 0)">停用</el-button>
			<el-button type="danger" @click="handleOperation('delete', '删除')">删除</el-button>
		</template>
		<template #main>
			<rk-grid
				ref="vformGridRef"
				:dataUrl="'/prdFormInfo/queryPrdFormInfoPageList'"
				title="表单管理"
				boxConfig
				:toolbarConfig="true"
				:params="vformParams"
				:pagerConfig="true"
				:columns="columns"
			>
				<template #toolbar_title_buttons>
					<el-select v-model="vformParams.status" placeholder="请选择状态" class="mr-12" clearable style="width: 200px" @change="handleSearch">
						<el-option v-for="item in COMMON_STOP_OPEN_ENUMS.options" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
					<el-input v-model="vformParams.keyWords" placeholder="请输入名称/编码" style="width: 250px" @blur="handleSearch" clearable> </el-input>
					<!-- <el-button type="primary"
            @click="handleSearch">查询</el-button>
          <el-button
            @click="handleReset"
            style="margin-right: 15px;">重置</el-button> -->
				</template>
				<template #operation="{ row }">
					<div class="operation-box">
						<el-button type="primary" link @click.stop="handleEdit(row)">设计</el-button>
						<el-button type="primary" link @click.stop="handlePreview(row)">预览</el-button>
						<el-button type="primary" link @click.stop="handleCopy(row.formId, row.name)">复制</el-button>
					</div>
				</template>
				<template #status="{ row }">
					<el-tag :type="COMMON_STOP_OPEN_ENUMS.options[row.status].tagType">
						{{ COMMON_STOP_OPEN_ENUMS.options[row.status].echo }}
					</el-tag>
				</template>
			</rk-grid>
		</template>
		<RkFormDesign ref="rkFormDesignRef" @save="handleSearch()" />
		<RkFormPreview ref="rkFormPreviewRef" />
	</RkContainer>
</template>
<script setup name="VFormTable">
import { ref, getCurrentInstance, reactive, defineAsyncComponent } from 'vue';
import { useFormListApi } from '@/api';
import { RkConfirmBox } from '@/components/message-box/index.js';
import { COMMON_STOP_OPEN_ENUMS } from '@/enums/enums-common.js';

const RkFormDesign = defineAsyncComponent(() => import('@/components/designer/src/form/RkFormDesigner.vue'));
const RkFormPreview = defineAsyncComponent(() => import('@/components/designer/src/form/RkFormPreview.vue'));

const { delPrdFormInfo, updateStatus, copyPrdFormInfo } = useFormListApi();

const vformGridRef = ref('');
const rkFormDesignRef = ref(null);
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
const vformParams = reactive({
	keyWords: undefined,
	status: undefined,
});
//表格
const columns = ref([
	{
		field: 'status',
		title: '状态',
		width: 120,
		align: 'center',
		cellRender: { name: 'enumsRender', enumName: 'COMMON_STOP_OPEN_ENUMS', isTag: true },
	},
	// { field: 'formId', title: '表单ID', align: 'left', headerAlign: 'center' },
	{ field: 'name', title: '名称', align: 'left', width: 350, headerAlign: 'center' },
	{ field: 'code', title: '编码', align: 'left', width: 350, headerAlign: 'center' },
	{ field: 'createTime', title: '创建时间', width: 200, showOverflow: true, align: 'center' },
	{ field: 'operation', title: '操作', width: 150, showOverflow: true, align: 'center', slots: { default: 'operation' } },
]);
/**查询 */
const handleSearch = () => {
	vformGridRef.value.searchEvent();
};
/**重新获取数据 */
const handleReset = () => {
	vformParams.keyWords = null;
	vformParams.status = null;
	vformGridRef.value.resetEvent();
};
/** 删除按钮操作 */
const handleOperation = async (buttonType, textName, buttonStatus) => {
	const seleRows = vformGridRef.value.getCheckboxRecords();
	if (seleRows.length == 0 || !seleRows) {
		globalProxy.$message({ message: '请至少选择一条数据进行操作！', type: 'warning' });
		return;
	}
	RkConfirmBox({
		title: '提示',
		content: `您确定要${textName}吗？`,
		onSubmit: async function () {
			//获取选中数据
			const Ids = [];
			seleRows.forEach((element) => {
				Ids.push(element.formId);
			});
			const formIds = Ids.join(',');
			const status = buttonStatus;
			const params = { formIds, status };
			if (buttonType == 'delete') {
				//删除
				const result = await delPrdFormInfo(params);
				const { data, code, msg } = result;
				if (code === 200) {
					globalProxy.$message({ message: `${textName}成功！`, type: 'success' });
					handleSearch();
				} else {
					globalProxy.$message({ message: `${msg}`, type: 'error' });
				}
			} else if (buttonType == 'status') {
				//启用停用
				const result = await updateStatus(params);
				const { data, code, msg } = result;
				if (code === 200) {
					globalProxy.$message({ message: `${textName}成功！`, type: 'success' });
					handleSearch();
				} else {
					globalProxy.$message({ message: `${msg}`, type: 'error' });
				}
			}
		},
		onCancel: function () {},
	});
};
/**
 * 新建表单
 */
const handleAdd = () => {
	rkFormDesignRef.value.handleOpen();
};

const handleEdit = (row) => {
	rkFormDesignRef.value.handleOpen(row);
};
const rkFormPreviewRef = ref();
const handlePreview = (row) => {
	rkFormPreviewRef.value.handleOpen(row);
};
// 复制
const handleCopy = async (formId, name) => {
	const params = { formId: formId };
	const result = await copyPrdFormInfo(params);
	const { data, code, msg } = result;
	if (code === 200) {
		globalProxy.$message({ message: '复制[' + name + ']成功', type: 'success' });
		handleSearch();
	} else {
		globalProxy.$message({ message: `${msg}`, type: 'error' });
	}
};
</script>
<style lang="scss" scoped>
.operation-box {
	display: flex;
	justify-content: space-around;
}

.VFormTable-container {
	height: 100%;
}

.vform-table-search {
	margin-right: 15px;
}
</style>
