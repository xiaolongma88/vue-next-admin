<!--
 * @Author: ljc
 * @Date: 2023-04-06 15:08:38
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-26 10:25:16
 * @Description: 工作流管理
-->
<template>
  <RkContainer :isFooter="false"
    :isAside="false">
    <template #header_left></template>
    <template #header_right>
      <el-button type="primary"
        @click="handleOperation('add')">新建</el-button>
      <el-button @click="handleOperation('deploy')">发布</el-button>
      <el-button type="danger"
        @click="handleOperation('delete')">删除</el-button>
    </template>
    <template #main>
      <rk-grid ref="workflowRef"
        title="工作流管理"
        keyField="attachmentId"
        style="width: 100%;"
        :dataUrl="'/process/page'"
        boxConfig
        :toolbarConfig="true"
        :params="workflowParams"
        :pagerConfig="true"
        :columns="columns">
        <template #toolbar_title_buttons>
          <el-input placeholder="请输入工作流名称"
            v-model="workflowParams.name"
            style="width: 250px;"
            @input="handleSearch"
            clearable>
          </el-input>
          <!-- <el-button type="primary"
            @click="handleOperation('search')">查询</el-button>
          <el-button style="margin-right: 12px;"
            @click="handleOperation('reset')">重置</el-button> -->
        </template>
        <template #operation="{ row }">
          <div style="display: flex; justify-content: space-between;">
            <el-button type="primary"
              link
              @click="handleOperation('preview',row)">预览</el-button>
            <el-button type="primary"
              link
              @click="handleOperation('info',row)">设计</el-button>
            <el-dropdown>
              <el-button type="primary"
                link>
                更多
                <el-icon><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleOperation('version',row)">版本管理</el-dropdown-item>
                  <el-dropdown-item @click="handleOperation('downLoad',row)">导出BPMN</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <template #revisionStatus="{ row }">
          <el-tag type="info"
            class="mx-1"
            effect="plain">
            {{row.revision}}
          </el-tag>
        </template>
      </rk-grid>
    </template>
    <workflow-version :versionModal="versionModal"
      :processId="processId"
      @refresh="handleSearch"></workflow-version>
    <workflow-preview :previewModal="previewModal"></workflow-preview>
    <rk-workflow-drawer ref="rkWorkflowDrawerRef">
      <template #workflow>
        <bpmn-designer ref="vProcessDesignerRef"
          :processModel="processModel"></bpmn-designer>
      </template>
      <template #footer>
        <el-button type="primary"
          @click="handleConfirmEvent('save')">保存</el-button>
        <el-button type="primary"
          @click="handleConfirmEvent('release')">保存并形成版本</el-button>
        <el-button type="danger"
          @click="handleCloseAlert">关闭</el-button>
      </template>
    </rk-workflow-drawer>
  </RkContainer>
</template>

<script  setup>
import { ref, getCurrentInstance, reactive } from 'vue'
import { useWorkflowApi } from '@/api/index';
import { downloadFunc, setEncoded } from "@/components/bpmn/utils/utils.js";
import WorkflowVersion from './modal/WorkflowVersion.vue'
import WorkflowPreview from './modal/WorkflowPreview.vue'
import RkWorkflowDrawer from '@/components/workflow/RkWorkflowDrawer.vue'
import BpmnDesigner from '@/components/bpmn/view/BpmnDesigner.vue'
import { ElLoading } from 'element-plus'
import { RkConfirmBox } from '@/components/message-box/index.js'
import { COMMON_WORKFLOW_STATUS_ENUMS } from '@/enums/enums-common.js'
import { ArrowDown } from '@element-plus/icons-vue'

const { getProcessDownLoad, getProcessInfo, getProcessPage, getProcessPreview, postProcessDelete, postProcessDeploy, postProcessSave } = useWorkflowApi();
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
let loading = null
let workflowParams = reactive({
  name: undefined
})
const versionModal = reactive({
  isShow: false
})
const previewModal = reactive({
  isShow: false,
  processName: null,
  processSrc: null
})
const processModel = reactive({
  xmlData: null,
  newVersion: 1,
  processId: null,
  versionId: null
})
const vProcessDesignerRef = ref(null)
const rkWorkflowDrawerRef = ref(null)
const processId = ref(null)
const workflowRef = ref('')
const columns = ref([
  { field: "status", title: "状态", width: 100, align: 'center', cellRender: { name: 'enumsRender', enumName: 'COMMON_WORKFLOW_STATUS_ENUMS', isTag: true } },
  { field: "processName", title: "工作流名称", align: 'left', headerAlign: 'center' },
  { field: "key", title: "标识", width: 200, align: 'left', headerAlign: 'center' },
  { field: "revision", title: "主版本号", width: 100, align: 'center', slots: { default: 'revisionStatus' } },
  { field: "createUser", title: "创建人", width: 100, align: 'center' },
  { field: "createTime", title: "创建时间", width: 200, align: 'center' },
  { field: "type", title: "操作", width: 150, align: 'center', slots: { default: 'operation' } }
])

/**重新获取数据 */
const handleSearch = (type = 'search') => {
  if (type === 'reset') {
    workflowParams.name = undefined
    workflowRef.value.resetEvent()
  } else {
    workflowRef.value.searchEvent()
  }
}
/**按钮操作方法 */
const handleOperation = async (type, row) => {
  if (type === 'search') {
    handleSearch()
  } else if (type === 'reset') {
    handleSearch(type)
  } else if (type === 'add') { // 新建
    processModel.newVersion = 1
    processModel.processId = null
    processModel.versionId = null
    processModel.xmlData = null
    rkWorkflowDrawerRef.value.handleOpen()
  } else if (type === 'preview') { // 预览
    const { versionId, processName } = row
    const params = {
      versionId,
    }
    const loading = ElLoading.service({ fullscreen: true })
    const result = await getProcessPreview(params)
    const { data, code, msg } = result
    if (code === 200) {
      if (data) {
        loading.close()
        previewModal.isShow = true
        previewModal.processName = processName ?? ''
        previewModal.processSrc = data ?? ''
      } else {
        loading.close()
        globalProxy.$message({ message: "数据为空不能预览！", type: "warning" });
      }
    } else {
      loading.close()
      globalProxy.$message({ message: msg ?? '业务失败！', type: "error" });
      console.error(msg)
    }
  } else if (type === 'info') { // 设计
    const loading = ElLoading.service({ fullscreen: true })
    const { versionId, processId } = row
    const result = await getProcessInfo({ versionId })
    const { data, code, msg } = result
    if (code === 200) {
      loading.close()
      processModel.newVersion = 0
      processModel.processId = processId
      processModel.versionId = versionId
      processModel.xmlData = data
      rkWorkflowDrawerRef.value.handleOpen()
    } else {
      globalProxy.$message({ message: msg ?? '业务失败！', type: "error" });
      loading.close()
      console.error(msg)
    }
  } else if (type === 'deploy' || type === 'delete') { // 发布 和删除
    const seleRows = workflowRef.value.getCheckboxRecords()
    if (seleRows.length == 0 || !seleRows) {
      globalProxy.$message({ message: "请至少选择一条数据进行操作！", type: "warning", duration: 0 });
      return
    }
    const versionArray = []
    seleRows.forEach(element => {
      versionArray.push(element.versionId)
    });
    const versionIds = versionArray.join(',')
    const params = { versionIds }
    if (type === 'deploy') { // 发布
      const loading = ElLoading.service({ fullscreen: true })
      const result = await postProcessDeploy(params)
      const { data, code, msg } = result
      if (code === 200) {
        loading.close()
        globalProxy.$message({ message: "发布成功！", type: "success" });
        handleSearch()
      } else {
        loading.close()
        globalProxy.$message({ message: msg ?? '业务失败！', type: "error" });
        console.error(msg)
      }
    } else if (type === 'delete') { // 删除
      RkConfirmBox({
        title: '提示',
        content: `您确定要删除吗？`,
        onSubmit: async function () {
          const loading = ElLoading.service({ fullscreen: true })
          const result = await postProcessDelete(params)
          const { data, code, msg } = result
          if (code === 200) {
            loading.close()
            globalProxy.$message({ message: "删除成功！", type: "success" });
            handleSearch()
          } else {
            loading.close()
            globalProxy.$message({ message: msg ?? '业务失败！', type: "error" });
          }
        },
        onCancel: function () {
        }
      })
    }
  } else if (type === 'version') { // 版本管理
    handleVersionMangement(row)
  } else if (type === 'downLoad') { // 导出BPMN
    const { versionId, processName } = row
    const params = {
      versionId
    }
    const result = await getProcessDownLoad(params)
    const loading = ElLoading.service({ fullscreen: true })
    const { data, code, msg } = result
    if (code === 200) {
      globalProxy.$message({ message: '文件正在导出中，请稍后！', type: "info" })
      if (data) {
        let { href, filename } = setEncoded('BPMN'.toUpperCase(), processName, data);
        downloadFunc(href, filename);
        loading.close()
      } else {
        loading.close()
        globalProxy.$message({ message: "数据为空不能导出！", type: "warning" });
      }
    } else {
      globalProxy.$message({ message: msg ?? '业务失败！', type: "error" });
      loading.close()
      console.error(msg)
    }
  }
}

/** 版本管理*/
const handleVersionMangement = (row) => {
  const { processId: workflowId } = row
  versionModal.isShow = true
  processId.value = workflowId
}
const handleClose = () => {
  processModel.xmlData = ''
  rkWorkflowDrawerRef.value.handleClose()
}
/** 工作流关闭*/
const handleCloseAlert = () => {
  RkConfirmBox({
    title: '提示',
    content: '关闭后所有未保存的数据将会清空，请谨慎操作！',
    onSubmit: function () {
      handleClose()
    },
    onCancel: function () {
    }
  })
}

/** 保存和保存并形成版本方法*/
const handleConfirmEvent = async (type) => {
  const isVaildate = await handleVaildate()
  if (isVaildate) { // 校验通过
    loading = ElLoading.service({
      lock: true,
      text: 'Loading',
    })
    if (type === 'release') { // 发布
      processModel.newVersion = 1
      await handleSaveData(type)
    } else if (type === 'save') { // 保存
      processModel.newVersion = 0
      await handleSaveData(type)
    }
  }
}
/** 工作流校验*/
const handleVaildate = async (type) => {
  const { msgArry } = await vProcessDesignerRef.value.handleSaveData()
  if (msgArry.length > 0) {
    const msg = msgArry.join(',')
    globalProxy.$message({ message: msg + '！', type: "warning" });
    return false
  }
  return true
}
/** 工作流保存*/
const handleSaveData = async (type) => {
  const { files } = await vProcessDesignerRef.value.handleSaveData()
  const bpmnFile = files[0]
  const imgFile = files[1]
  const newVersion = processModel.newVersion
  const processId = processModel.processId
  const versionId = processModel.versionId
  const params = {
    bpmnFile,
    imgFile,
    newVersion,
    processId,
    versionId
  }
  const result = await postProcessSave(params)
  const { code, msg, data } = result
  if (code === 200) {
    globalProxy.$message({ message: msg ?? '业务成功', type: "success" });
    processModel.processId = data.processId ?? undefined
    processModel.versionId = data.versionId ?? undefined
    loading.close()
    handleSearch()
    if (type === 'release') {
      handleClose()
    }
  } else {
    globalProxy.$message({ message: msg ?? '业务失败', type: "error" });
    loading.close()
    console.error(msg)
  }
}

</script>
<style lang="scss" scoped>
.workflow-container {
  height: 100%;
}
</style>