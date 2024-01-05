<!--
 * @Author: ZHM zhuimin111@163.com
 * @Date: 2023-04-24 18:04:21
 * @LastEditors: g05047
 * @LastEditTime: 2023-05-30 20:40:10
-->
<template>
	<el-drawer v-model="visible" append-to-body class="operation-log" :with-header="false" :show-close="false" direction="rtl" size="100%">
		<div class="operation-log-header">
			<span class="title-info">{{ props.title }}</span>
			<el-button type="danger" plain @click="handleClose">关闭</el-button>
		</div>
		<div class="operation-Log-container">
			<el-tabs v-model="activeName" class="operation-tabs">
				<el-tab-pane label="操作记录" name="first" style="height: 100%">
					<div class="operation-Log-tablebox">
						<rk-grid
							ref="operationLogRef"
							method="get"
							:params="workManageParams"
							boxConfig="false"
							:dataUrl="'/task/operateRecord'"
							:pagerConfig="false"
							:columns="columns"
						>
							<template #process="{ row }">
								<div>
									<span v-if="row.prevTaskName != null">【{{ row.prevTaskName }}】</span>
									<span v-if="row.prevTaskAssignee != null">（{{ row.prevTaskAssignee }}）</span>
									<span v-if="row.prevTaskName != null"> -></span>
									<span class="tagName">【{{ row.currentTaskName }}】</span>
									<span v-if="row.assignee != null">（{{ row.assignee }}）</span>
									<span v-if="row.nextTaskName != null">->【{{ row.nextTaskName }}】</span>
									<span v-if="row.nextTaskAssignee != null">（{{ row.nextTaskAssignee }}）</span>
								</div>
							</template>
						</rk-grid>
					</div>
				</el-tab-pane>
				<el-tab-pane label="流程图" class="workImg-content" name="third">
					<div v-html="workImg"></div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</el-drawer>
</template>
<script setup name="OperationLog">
import { ref, reactive } from 'vue';
import { useTaskApi } from '@/api';

const { getProcessImg } = useTaskApi();

const activeName = ref('first');
const operationLogRef = ref('');
let workImg = ref('');
let workManageParams = reactive({
	objectId: '',
});
const visible = ref(false);

const props = defineProps({
	ok: {
		type: [Promise, Function],
		default: () => {
			return new Promise((resolve) => resolve());
		},
	},
	cancel: {
		type: Promise,
		default: () => {
			return new Promise((resolve) => resolve());
		},
	},
	title: {
		type: String,
		default: '操作记录',
	},
	isNote: {
		type: Boolean,
		default: false,
	},
});

//表格
const columns = ref([
	{ field: 'actionTypeName', title: '类型', width: 100, align: 'center', headerAlign: 'center' },
	{ field: 'prevName', title: '任务过程', align: 'left', slots: { default: 'process' }, headerAlign: 'center' },
	{ field: 'startTime', title: '开始时间', width: 200, align: 'center', headerAlign: 'center' },
	{ field: 'endTime', title: '结束时间', width: 200, showHeaderOverflow: true, align: 'center', headerAlign: 'center' },
	{ field: 'opinion', title: '意见', showOverflow: true, headerAlign: 'center' },
]);
// 获取工作流图片
const getProcessImgData = async () => {
	const result = await getProcessImg({ objectId: workManageParams.objectId });
	const { data, code, msg } = result;
	if (code === 200) {
		workImg.value = data;
	} else {
	}
};
// 打开Drawer
const handleOpen = (applyId) => {
	workManageParams.objectId = applyId;
	visible.value = true;
	getProcessImgData();
	nextTick(() => {
		handleSearch();
	});
};

/**查询 */
const handleSearch = () => {
	operationLogRef.value.searchEvent();
};

// 关闭Drawer
function handleClose() {
	activeName.value = 'first';
	visible.value = false;
}

// 对外暴露方法
defineExpose({
	handleOpen,
	handleClose,
});
</script>
<style lang="scss" scoped>
.operation-Log-container {
	padding: 20px;
	height: calc(100% - 50px);
}
.operation-log-header {
	width: 100%;
	height: 50px;
	line-height: 50px;
	border-bottom: 1px solid #ebeef5;
	background-color: #e3f2fe;
	padding: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.title-info {
		font-size: 18px;
	}
}
.workImg-content {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow-x: auto;
	overflow-y: auto;
}
.operation-tabs {
	display: flex;
	flex-direction: column;
	height: 100%;
}
.operation-Log-tablebox {
	height: 100%;
}
.tagName {
	color: rgb(236, 70, 70);
}
.operation-Log-note {
	width: 100%;
	display: flex;
	justify-content: left;
	margin-top: 20px;
}
.operation-note-content {
	width: 50%;
}
// .{
//   color:#f56c6c;
// }
.operation-footer {
	float: right;
}
</style>
<style lang="scss">
.operation-log {
	.el-drawer__body {
		padding: 0;
	}
	.el-tabs__content {
		height: 100%;
	}
}
</style>
