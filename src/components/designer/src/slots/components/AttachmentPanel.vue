<template>
	<div class="upload-main">
		<div class="upload-main-header">
			<div class="header-content flex">
				<el-input
					v-model="fileName"
					style="width: 250px; margin: 10px 20px 10px 20px"
					clearable
					:placeholder="placeholder"
					:suffix-icon="Search"
					@clear="handleRest"
					@change="handleChange($event)"
				/>
				<span class="flex">
					<el-icon style="margin-right: 5px"> <InfoFilled style="color: #23abe0" /> </el-icon>{{ `共${searchCount}个底稿文件` }}</span
				>
			</div>
		</div>
		<div id="mainContentId" class="upload-main-content topMargin bottomMargin leftMargin rightMargin">
			<div :class="isSearch ? 'upload-main-content-lf-hidden' : 'upload-main-content-lf rightMargin'" ref="contentTreeRef">
				<div class="content-lf-contain">
					<el-tree
						style="padding: 10px"
						ref="elTreeRef"
						v-loading="fileLoadig"
						node-key="ruleId"
						:data="treeData"
						default-expand-all
						:props="defaultProps"
						:current-node-key="currentNodeKey"
						highlight-current
						@node-click="handleNodeClick"
					>
						<template #default="{ node, data }">
							<span class="tree-content">
								<span class="tree-content-contain">
									<span class="contain-star" v-if="data.nullable === 'N'">*</span>
									<span class="contain-lable" :title="node.label">{{ node.label }}</span>
									<el-icon v-if="data.status === 1" class="contain-check">
										<SuccessFilled />
									</el-icon>
								</span>
							</span>
						</template>
					</el-tree>
				</div>
			</div>
			<div class="upload-main-content-rg">
				<div class="content-rg-contain">
					<div class="contet-rg-table">
						<rk-grid
							ref="rkGridRef"
							keyField="attachmentId"
							style="width: 100%"
							:boxConfig="false"
							:toolbarConfig="false"
							:dataUrl="'/uploadFile/list'"
							:params="fileParams"
							:pagerConfig="false"
							:columns="columns"
							@loaded="handleLoaded"
						>
							<template #operation="{ row }">
								<div class="operation-box">
									<el-button link icon="View" @click.stop="handleOptation(row, 'preview')"></el-button>
									<el-button type="primary" link icon="download" @click.stop="handleOptation(row, 'downLoad')"></el-button>
									<template v-if="!deleteHidden">
										<el-button type="danger" link icon="Delete" @click.stop="handleOptation(row, 'delete')"></el-button>
									</template>
								</div>
							</template>
						</rk-grid>
					</div>
					<div class="content-rg-file" v-if="selectData.ruleId && selectData.ruleId != '1' && !uploadHidden">
						<el-upload
							v-if="!uploadHidden"
							drag
							ref="uploadRef"
							v-loading="uploadLoading"
							:action="uploadUrl"
							:data="uploadParams"
							:headers="headers"
							:limit="1"
							:on-exceed="handleOnExceed"
							:on-success="handleOnSuccess"
							:on-progress="handleOnProgress"
							:on-error="handleOnError"
						>
							<el-icon class="el-icon--upload"><UploadFilled /></el-icon>
							<div class="el-upload__text">
								<em>你可以将文件拖拽到特定区域以进行上传。</em>
							</div>
							<template #tip>
								<div style="padding-top: 10px">
									<div style="display: block; width: 100%; white-space: nowrap">
										<p>
											{{ `上传文件类型：${selectData.fileSuffix}` }}
										</p>
										<p>
											{{ `上传文件大小：${formatDataFileSize(selectData.maxLimit)}` }}
										</p>
									</div>
								</div>
							</template>
						</el-upload>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup name="AttachmentPanel">
import XEUtils from 'xe-utils';
import { ref, getCurrentInstance, reactive, watch } from 'vue';
import { RkConfirmBox } from '@/components/message-box/index.js';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, genFileId, ElLoading } from 'element-plus';
import { dowloadFile, previewFile, fileType, openNewWindow, formatDataFileSize } from '@/utils/file-utils.js';
import { AuthUtils } from '@/utils';
import { REQ_HEADER_KEY } from '@/utils/http/cfg/http-config';

import { SuccessFilled, InfoFilled, UploadFilled } from '@element-plus/icons-vue';

import { useFilesApi } from '@/api';
const { uploadFileRuleData, delUploadFileData, previewFileData, downloadFileData, getAllUploadFiles } = useFilesApi();

const props = defineProps({
	title: {
		type: [String],
		default: '附件管理面板',
	},
	//规则类型
	busiType: {
		type: [String],
		default: '',
	},
	//业务ID
	busiId: {
		type: [String],
		default: '',
	},
	// 请求方式
	method: { type: String, default: 'post' },
	placeholder: {
		type: [String],
		default: '请输入文件名称',
	},
	defaultProps: {
		type: Object,
		default: () => ({
			children: 'children',
			label: 'fileDesc',
		}),
	},
	// 表单回显数据
	formData: { type: Object, default: () => ({}) },
	// 是否用于表单中
	useInForm: { type: Boolean, default: false },
	// 表单类型配置
	formType: { type: String, default: '' },
	slotDataHouse: { type: Object, default: () => ({}) },
});
let uploadHidden = ref(false);
let deleteHidden = ref(true);
let currentNodeKey = ref(null);
let tempCurrentNodeKey = ref('1');
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
const fileLoadig = ref(false);
const rkGridRef = ref(null);
const elTreeRef = ref(null);
let fileName = ref(null);
let fileParams = ref({});
let isSearch = ref(false);
const searchCount = ref(0);
const uploadUrl = import.meta.env.VITE_APP_BASE_API + '/uploadFile/file';
// 添加请求头
let headers = reactive({});
// 添加防重放的随机数
headers['t'] = +new Date();
// 验证token是否存在，并携带请求头
const accessToken = AuthUtils.accessToken.getValue();
if (!XEUtils.isEmpty(accessToken)) {
	headers[REQ_HEADER_KEY] = accessToken;
}
let uploadParams = reactive({});
let selectData = reactive({});
const uploadRef = ref('');
const uploadLoading = ref(false);
const columns = ref([
	{ field: 'fileName', title: '文件名称', align: 'left', width: 250, headerAlign: 'center' },
	{ field: 'fileDesc', title: '附件类型', showOverflow: true, width: 200, align: 'left' },
	{ field: 'fileType', title: '文件类型', showOverflow: true, width: 120, align: 'center' },
	{
		field: 'fileSize',
		title: '文件大小',
		showOverflow: true,
		width: 120,
		align: 'center',
		slots: {
			default: ({ row }) => {
				const fileSize = formatDataFileSize(row.fileSize);
				return fileSize;
			},
		},
	},
	{ field: 'uploadTime', title: '上传时间', width: 200, showOverflow: true, align: 'center' },
	{
		field: 'operation',
		title: '操作',
		width: 150,
		showOverflow: true,
		align: 'center',
		slots: { default: 'operation' },
	},
]);
let treeData = reactive([]);
let contentTreeRef = ref(null);
// add: 新增, edit:修改  atty:律所  acct:会所  finance:财评报告, yhs:一户式
let editArray = ['edit'];
let allArray = ['atty', 'acct', 'finance'];
let uploadHiddenArray = ['yhs'];
watch(
	() => props.formType,
	(newValue) => {
		if (newValue) {
			if (allArray.includes(newValue)) {
				uploadHidden.value = false;
				deleteHidden.value = true;
			} else if (editArray.includes(newValue)) {
				uploadHidden.value = false;
				deleteHidden.value = false;
			} else if (uploadHiddenArray.includes(newValue)) {
				uploadHidden.value = true;
				deleteHidden.value = true;
			} else {
				uploadHidden.value = false;
				deleteHidden.value = false;
			}
		}
	},
	{ deep: true, immediate: true }
);
onMounted(() => {
	if (props.busiId && props.busiType) {
		const params = {
			busiId: props.busiId,
			busiType: props.busiType,
		};
		getUploadFileRuleData(params);
		fileParams.value = {
			...params,
		};
		uploadParams = {
			...params,
		};
	}
});

/**获取附件数据 */
const getUploadFileRuleData = async (params) => {
	fileLoadig.value = true;
	const queryParams = {
		...params,
		busiProperty: '%',
	};
	const result = await uploadFileRuleData(queryParams);
	const { data, code, msg } = result;
	if (code === 200) {
		let model = [
			{
				ruleId: '1',
				fileDesc: '全部',
				children: [...data],
			},
		];
		treeData = model;
		fileLoadig.value = false;
		currentNodeKey.value = tempCurrentNodeKey.value;
	} else {
		console.error(msg);
		fileLoadig.value = false;
	}
};
/**左侧树点击方法 */
const handleNodeClick = (data) => {
	tempCurrentNodeKey.value = data.ruleId;
	fileParams.value = {
		...fileParams.value,
		ruleId: data.ruleId,
	};
	uploadParams = {
		...uploadParams,
		ruleId: data.ruleId,
	};
	selectData = {
		...data,
	};
	if (tempCurrentNodeKey.value === '1') {
		fileParams.value.fileName = undefined;
		fileParams.value.ruleId = undefined;
	}
	if (allArray.includes(props.formType)) {
		if (selectData.ruleId === props.formData.ruleId) {
			uploadHidden.value = false;
			deleteHidden.value = false;
		} else {
			uploadHidden.value = true;
			deleteHidden.value = true;
		}
	}
	handleSearch();
};
/**输入监听 */
const handleChange = (value) => {
	isSearch.value = value ? true : false;
	fileParams.value = {
		...fileParams.value,
		fileName: fileName.value,
	};
	handleSearch();
};
/**获取表格数据 */
const handleLoaded = (finalData) => {
	searchCount.value = finalData.length ?? 0;
	setSlotDataHouse();
};
/**表格点击方法 */
const handleOptation = async (row, type) => {
	const { fileId, fileName } = row;
	if (type === 'preview') {
		const disableFileArray = ['rar', 'zip'];
		if (disableFileArray.includes(row.fileType)) {
			globalProxy.$message({ message: '此文件为压缩包，请下载后查看！', type: 'warning' });
			return;
		}
		const loading = ElLoading.service({
			lock: true,
			text: '加载中',
		});
		const result = await previewFileData(fileId);
		const code = result?.code;
		const msg = result?.message;
		if (code) {
			globalProxy.$message({ message: msg ?? '业务失败！', type: 'error' });
			loading.close();
		} else {
			if (result) {
				let url = null;
				const permitArray = ['jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG', 'gif', 'GIF', 'bmp', 'BMP', 'Bmp'];
				const pdfArray = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pdf', 'PDF', 'Pdf'];
				if (permitArray.includes(row.fileType)) {
					const type = row.fileType.toLowerCase();
					url = previewFile(result, fileType[type]);
					openNewWindow(url, fileName);
				} else if (pdfArray.includes(row.fileType)) {
					url = previewFile(result, fileType.pdf);
					openNewWindow(url, fileName);
				} else {
					globalProxy.$message({ message: '暂不支持预览，请下载后查看！', type: 'warning' });
				}
				loading.close();
			} else {
				loading.close();
				globalProxy.$message({ message: '没有任何数据！', type: 'warning' });
			}
		}
	} else if (type === 'downLoad') {
		globalProxy.$message({ message: '文件正在下载，请稍后！', type: 'info' });
		const loading = ElLoading.service({
			lock: true,
			text: '加载中',
		});
		const result = await downloadFileData(fileId);
		const code = result?.code;
		const msg = result?.message;
		if (code) {
			loading.close();
			globalProxy.$message({ message: msg ?? '业务失败！', type: 'error' });
		} else {
			if (result) {
				dowloadFile(result, fileName);
				loading.close();
			} else {
				globalProxy.$message({ message: '没有任何数据！', type: 'warning' });
				loading.close();
			}
		}
	} else if (type === 'delete') {
		RkConfirmBox({
			title: '提示',
			content: `您确定要删除吗？`,
			onSubmit: async function () {
				const loading = ElLoading.service({
					lock: true,
					text: '加载中',
				});
				const result = await delUploadFileData(fileId);
				const { data, code, msg } = result;
				if (code === 200) {
					loading.close();
					globalProxy.$message({ message: '删除成功！', type: 'success' });
					handleSearch();
					const params = {
						busiId: props.busiId,
						busiType: props.busiType,
					};
					getUploadFileRuleData(params);
				} else {
					loading.close();
					globalProxy.$message({ message: msg ?? '业务失败！', type: 'error' });
				}
			},
			onCancel: function () {},
		});
	}
};
/**当超出限制时，执行的钩子函数 */
const handleOnExceed = (files) => {
	uploadRef.value.clearFiles();
	const file = files[0];
	file.uid = genFileId();
	uploadRef.value.handleStart(file);
};
/**上传文件中 */
const handleOnProgress = (evt, uploadFile, uploadFiles) => {
	uploadLoading.value = true;
	// console.log('上传中', evt, uploadFile, uploadFiles)
};
/**上传文件成功 */
const handleOnSuccess = async (response, uploadFile, uploadFiles) => {
	uploadLoading.value = false;
	// console.log('上传成功', response, uploadFile, uploadFiles)
	const { msg, code } = response;
	if (code === 200) {
		ElMessage({
			message: '文件上传成功！',
			center: true,
			type: 'success',
		});
	} else {
		ElMessage({
			message: msg + '！',
			center: true,
			type: 'error',
		});
	}
	rkGridRef.value.searchEvent();
	const params = {
		busiId: props.busiId,
		busiType: props.busiType,
	};
	await getUploadFileRuleData(params);
	uploadRef.value.clearFiles();
};
/**上传文件失败 */
const handleOnError = (error, uploadFile, uploadFiles) => {
	console.log('上传失败', error, uploadFile, uploadFiles);
	uploadLoading.value = false;
	ElMessage({
		message: '文件上传失败！',
		center: true,
		type: 'error',
	});
	uploadRef.value.clearFiles();
};
/**重新获取数据 */
const handleSearch = (type = 'search') => {
	rkGridRef.value.searchEvent();
};
/**重置 */
const handleRest = () => {
	fileParams.value.fileName = undefined;
	handleSearch();
};
// 设置附件数据
const setSlotDataHouse = () => {
	if (props.useInForm) {
		// ----- 表单的插槽数据空间操作
		const queryParams = {
			busiId: props.busiId,
			busiType: props.busiType,
		};
		getAllUploadFiles(queryParams)
			.then((res) => {
				const { code, data, msg } = res;
				if (code === 200) {
					props.slotDataHouse['AttachmentPanel'] = data;
				} else {
					props.slotDataHouse['AttachmentPanel'] = [];
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
};
</script>
<style lang="scss" scoped>
$borderColor: rgb(233, 233, 233);
$backgroundColor: rgb(233, 237, 246);
$whiteBackgroundColor: #fff;
.vxe-toolbar {
	padding-top: 0;
}
.flex {
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
}
.flexJustifyCenter {
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: center;
}
.topPadding {
	padding-top: 10px;
}
.leftPadding {
	padding-left: 10px;
}
.rightPadding {
	padding-right: 10px;
}
.bottomPadding {
	padding-bottom: 10px;
}
.topMargin {
	margin-top: 10px;
}
.bottomMargin {
	margin-bottom: 10px;
}
.leftMargin {
	margin-left: 10px;
}
.rightMargin {
	margin-right: 10px;
}
.upload-main {
	width: 100%;
	height: 100%;
	background-color: $backgroundColor;
	.upload-main-header {
		width: 100%;
		background-color: $whiteBackgroundColor;
		.header-content {
			font-size: 14px;
			box-sizing: border-box;
		}
	}
	.upload-main-content {
		box-sizing: border-box;
		display: flex;
		flex-wrap: nowrap;
		box-sizing: border-box;
		height: calc(100% - 72px);
		overflow: hidden;
		.upload-main-content-lf-hidden {
			width: 0px;
		}
		.upload-main-content-lf {
			width: 300px;
			height: 100%;
			background-color: $whiteBackgroundColor;
			box-sizing: border-box;
			.content-lf-contain {
				box-sizing: border-box;
				border: 1px solid $borderColor;
				border-radius: 4px;
				height: 100%;
				overflow-y: scroll;
				.el-tree {
					overflow-y: hidden;
				}
				.tree-content {
					overflow: hidden;
					width: 100%;
					padding-top: 10px;
					padding-bottom: 10px;
					.tree-content-contain {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.contain-star {
							position: absolute;
							color: red;
						}
						.contain-lable {
							flex: 1;
							padding-right: 10px;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							-o-text-overflow: ellipsis;
						}
						.contain-check {
							color: #40c475;
						}
					}
				}
			}
		}
		.upload-main-content-rg {
			flex: 1;
			width: 0;
			height: 100%;
			background-color: $whiteBackgroundColor;
			box-sizing: border-box;
			z-index: 999;

			.content-rg-contain {
				display: flex;
				flex-direction: column;
				height: 100%;
				padding: 10px;
				.contet-rg-table {
					flex: 1;
					height: 0;
					width: 100%;
				}
				.content-rg-file {
					height: 300px;
					width: 100%;
					margin-top: 20px;
					background-color: $whiteBackgroundColor;
					border-radius: 4px;
					border: 1px dashed rgb(233, 233, 233);
					padding: 10px;
				}
			}
		}
	}
	.iframe {
		width: 100%;
		height: 100%;
	}
}
</style>
