<!--  项目终审列表 -->
<template>
  <RkContainer :isFooter="false"
    :isAside="isAside">
    <template #header_left>
      <RkButtonGroup :options="json_final_button"
        v-model="queryParams.wfStatus"
        @click="handleSearch" />
    </template>
    <template #header_right>
      <el-button type="primary"
        :disabled="editable"
        v-if="queryParams.wfStatus == '001' || queryParams.wfStatus == '004'"
        @click="editable = true">编辑
      </el-button>
      <el-button type="primary"
        :disabled="!editable"
        v-if="queryParams.wfStatus == '001' || queryParams.wfStatus == '004'"
        @click="handleSave">保存
      </el-button>
      <el-button type="danger"
        :disabled="!editable"
        v-if="queryParams.wfStatus == '001' || queryParams.wfStatus == '004'"
        @click="handleClose">取消
      </el-button>
      <el-button v-if="queryParams.wfStatus == '001' || queryParams.wfStatus == '004'"
        type="primary"
        @click="handleSend('audit', '终审')">终审
      </el-button>
      <el-button v-if="queryParams.wfStatus == '002'"
        type="danger"
        @click="handleSend('cancle', '撤销', 1)">撤销审核
      </el-button>
      <!--            <el-button @click="handleOpenRecord">操作记录</el-button>-->
    </template>
    <template #aside>
      <RkAdAgTree :agTreeHidden="true"
        @adNodeClick="handleAdNodeClick"
        @toggleHidden="(hidden) => (isAside = !hidden)" />
    </template>
    <template #main>
      <rk-center>
        <template #content>
          <rk-grid ref="grProjApply"
            :title="`${
              query.proType === '1' ? '储备' : '备选'
            }项目终审（机构）`"
            :dataUrl="
              query.proType === '1'
                ? '/proResApply/agencyFinalAuditPage'
                : '/proAltApply/agencyFinalAuditPage'
            "
            boxConfig
            :editConfig="{
              beforeEditMethod: () => {
                return editable;
              },
            }"
            :keepSource="true"
            :params="queryParams"
            :columns="tableColumns">
            <template #toolbar_title_buttons>
              <el-input v-model="queryParams.mhcx"
                placeholder="请输入项目名称"
                class="mr-15px w-200px"
                clearable
                @input="handleSearch">
              </el-input>
            </template>
            <template #operation="{ row }">
              <div class="operation-box">
                <el-button type="primary"
                  link
                  @click.stop="handleOperation('preview', row)">预览
                </el-button>
                <el-button type="primary"
                  link
                  @click.stop="handleOperation('load', row)">下载
                </el-button>
              </div>
            </template>
            <template #rk_select_edit="{ row, column }">
              <RkTreeSelect v-model="row[column.field]"
                :filterable="false"
                enum="WHETHER_ENUMS"
                :showCode="false">
              </RkTreeSelect>
            </template>
            <template #proj_score="{ row, column }">
              <a class="yhs-pro-name-no-underline"
                href="javascript:;"
                @click="handleOperation('score', row)">{{ row[column.field] || "—" }}</a>
            </template>
          </rk-grid>
        </template>
      </rk-center>
    </template>
    <OperationLog ref="OperationLogRef" />
    <reserve-proj-note-dialog ref="reserveProjNoteDialogRef"
      :ok="dialogOkClick"
      :visible="noteVisible">
    </reserve-proj-note-dialog>
    <ExpertRatingList ref="expertRatingRef" />
    <ReviewReportDrawer ref="reviewReportRef" />
  </RkContainer>

</template>
<script setup lang="jsx">
import {WF_TASK_AUDIT, WF_TASK_CANCEL} from "@/common/cons-common.js";
import {json_final_button} from "@/common/button-data.js";
import ExpertRatingList from "../drawer/ExpertRatingList.vue";
import ReviewReportDrawer from "../drawer/ReviewReportDrawer.vue";
import { useUserStore } from '@/stores/modules';
import ReserveProjNoteDialog from "../dialogs/ProjNoteDialog.vue";
import {getCurrentInstance, reactive, ref,} from "vue";
import {RkConfirmBox} from "@/components/message-box/index.js";
import {ElMessage} from "element-plus";
import { useFilesApi } from "@/api/index";
import {dowloadFile, fileType} from "@/utils/file-utils.js";
import { ElLoading } from "element-plus"
import { useProjectApi } from '@/api/index'

const { downloadData }= useFilesApi();
const {
    reserveProHandleTask,
    standProHandleTask,
    saveAgencyPermit,
    proAltSaveAgencyPermit
} = useProjectApi();
const {appContext} = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;

const grProjApply = ref("");
// 专家评分弹窗
const expertRatingRef = ref(null);
// 项目评审详情弹窗
const reviewReportRef = ref(null);
// ----- pinia
const userInfo = useUserStore().userInfo;
// ----- 路由相关操作
const route = useRoute();
const query = route.query;
// 查询参数
const queryParams = reactive({
    mhcx: void 0,
    status: void 0,
    nodeId: query.nodeId,
    wfStatus: route.query.wfStatus ?? '001',
    processKey: query.processKey,
    agId: userInfo.agId,
    adCode: userInfo.adCode,
    agCode: userInfo.agCode,
});

//是否编辑
const editable = ref(false);

const tableColumns = ref([
    {field: "adName", title: "地区", width: 150},
    {field: "agencyName", title: "单位", width: 200},
    {field: "proCode", title: "项目编码", width: 150},
    {
        field: "proName",
        title: "项目名称",
        width: 200,
        align: "left",
        cellRender: {name: "xmYHS"},
    },
    // {field: 'proStatusName', title: '项目负责人', width: 150},
    {
        field: "isMeetRequire",
        title: "是否满足发债要求",
        width: 400,
        children: [
            {
                field: "isMatchCondition",
                title: "专家评审结论",
                width: 200,
                align: "center",
                formatter: ["enumsFormats", "WHETHER_ENUMS"],
            },
            {
                field: "isPermit",
                title: "机构终审结论",
                width: 200,
                align: "center",
                formatter: ["enumsFormats", "WHETHER_ENUMS"],
                editRender: {autofocus: ".el-input__inner"},
                slots: {edit: "rk_select_edit"},
            },
        ],
    },
    {
        field: "score",
        title: "项目总得分",
        width: 150,
        align: "center",
        slots: {default: "proj_score"},
    },
    {
        field: "operation",
        title: "评审报告",
        width: 120,
        fixed: "right",
        align: "center",
        showOverflow: true,
        slots: {default: "operation"},
    },
]);
/**查询 */
const handleSearch = () => {
    grProjApply.value.searchEvent();
};
//是否为审核操作

//终审、撤销送审
const noteVisible = ref(false);
let auditParams = {};
const handleSend = async (buttonType, textName) => {
    const seleRows = grProjApply.value.getCheckboxRecords();
    if (seleRows.length === 0 || !seleRows) {
        globalProxy.$message({
            message: `请至少选择一条数据进行${textName}！`,
            type: "warning",
        });
        return;
    }
    let loading = null
    RkConfirmBox({
        title: "提示",
        content: `您确定要${textName}吗？`,
        onSubmit: async function () {
            //获取选中数据
            const ProId = [];
            const TaskId = [];
            const ApplyId = [];
            seleRows.forEach((element) => {
                ProId.push(element.proId);
                TaskId.push(element.taskId);
                ApplyId.push(element.applyId);
            });
            const proIds = ProId.join(",");
            const taskIds = TaskId.join(",");
            const applyIds = ApplyId.join(",");
            
            if (buttonType == "audit") {
                //审核
                const params = {
                    applyIds,
                    taskIds,
                    proIds,
                    nodeId: queryParams.nodeId,
                    taskType: WF_TASK_AUDIT.value,
                };
                auditParams = params;
                noteVisible.value = true;
            } else if (buttonType == "cancle") {
                //取消
                const params = {
                    applyIds,
                    taskIds,
                    proIds,
                    nodeId: queryParams.nodeId,
                    taskType: WF_TASK_CANCEL.value,
                };
                let result = null;
                //判断是否是专项
                loading = ElLoading.service({ fullscreen: true, text: textName + '中,请稍等..' })
                if (query.proType == 1) {
                    result = await reserveProHandleTask(params);
                } else {
                    result = await standProHandleTask(params);
                }
                const {data, code, msg} = result;
                if (code === 200) {
                    loading.close()
                    globalProxy.$message({
                        message: `${textName}成功！`,
                        type: "success",
                    });
                    handleSearch();
                } else {
                    loading.close()
                    globalProxy.$message({message: `${msg}`, type: "error"});
                }
            }
        },
        onCancel: function () {
        },
    });
};

const handleOperation = async (buttonType, row) => {
    const {reviewTaskId, applyId, proCode} = row;
    let params = {
        taskId: reviewTaskId,
        applyId,
        proCode,
    };
    if (buttonType == "preview") {
        //预览
        reviewReportRef.value.handleOpen(row);
    }
    if (buttonType == "load") {
        //下载
        ElMessage.warning({message: "正在下载中"});
        const result = await downloadData(params);
        const code = result?.code;
        const msg = result?.message;
        if (code) {
            ElMessage({message: msg ?? "业务失败！", type: "error"});
        } else {
            if (result) {
                dowloadFile(result, "项目评审报告", fileType.zip);
            } else {
                ElMessage({message: "没有任何数据！", type: "warning"});
            }
        }
    }
    if (buttonType == "add") {
        //添加
        noteVisible.value = true;
    }
    if (buttonType == "score") {
        //专家评分情况
        expertRatingRef.value.handleOpen(row);
    }
};

/**
 * 审核
 * @param note
 */
const dialogOkClick = async (note) => {
    auditParams.note = note;
    let result = null;
    if (query.proType == 1) {
        result = await reserveProHandleTask(auditParams);
    } else {
        result = await standProHandleTask(auditParams);
    }
    const {data, code, msg} = result;
    if (code === 200) {
        globalProxy.$message({message: `审核成功！`, type: "success"});
        handleSearch();
        noteVisible.value = false;
    } else {
        globalProxy.$message({message: `${msg}`, type: "error"});
        noteVisible.value = false;
    }
};

// 操作记录模板引用
const OperationLogRef = ref(null);
//操作记录
const handleOpenRecord = () => {
    const seleRows = grProjApply.value.getCheckboxRecords();
    if (seleRows.length == 0 || !seleRows || seleRows.length > 1) {
        globalProxy.$message({message: "请选择一条数据！", type: "warning"});
        return;
    }
    let applyId = "";
    seleRows.forEach((element) => {
        applyId = element.applyId;
    });
    OperationLogRef.value.handleOpen(applyId);
};

//获取被修改的数据
const handleSave = async () => {
    //keepSource开启有效
    const updateRecords = grProjApply.value.getUpdateRecords();
    if (updateRecords && updateRecords.length > 0) {
        let params = [];
        for (let updateRecord of updateRecords) {
            // await grProjApply.value.reloadRow(updateRecord)
            params.push({
                applyId: updateRecord.applyId,
                taskId: updateRecord.reviewTaskId,
                isPermit: updateRecord.isPermit,
            });
        }
        let result = null;
        if (query.proType === '1') {
            result = await saveAgencyPermit(params);
        } else {
            result = await proAltSaveAgencyPermit(params);
        }
        const {data, code, msg} = result;
        if (code === 200) {
            globalProxy.$message({message: `修改成功！`, type: "success"});
            handleSearch();
        } else {
            globalProxy.$message({message: `${msg}`, type: "error"});
        }
    }
    editable.value = false;
};

// ----- 左侧树操作
// 是否显示左侧面板
const isAside = ref(false);
// 树节点点击触发
const handleAdNodeClick = (data) => {
    const {id, code, name, parentId, leaf} = data;
    queryParams.agId = id;
    queryParams.adCode = code;
    handleSearch();
};

//取消编辑并还原数据
const handleClose = async () => {
    await grProjApply.value.revertData();
    editable.value = false;
};

const handleEdit = () => {
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
