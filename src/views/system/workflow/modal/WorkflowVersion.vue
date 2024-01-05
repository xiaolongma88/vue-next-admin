<!--
 * @Author: ljc
 * @Date: 2023-04-06 19:53:27
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-26 10:28:27
 * @Description: 工作流版本发布
-->
<template>
  <vxe-modal v-model="versionModal.isShow"
    width="80%"
    height="70%"
    title="版本控制"
    resize
    mask-closable
    show-footer
    show-zoom
    destroyOnClose
    @hide="handleHide"
    @close="handleHide">
    <template #default>
      <rk-grid ref="workflowVersionRef"
        keyField="attachmentId"
        style="width: 100%;"
        :dataUrl="'/process/versionPage'"
        boxConfig
        :toolbarConfig="false"
        :params="{processId:processId}"
        :pagerConfig="true"
        :columns="columns">
        <template #operation="{ row }">
          <div style="display: flex; justify-content: space-between;">
            <el-button type="primary"
              link
              :disabled="!!row.isMaster"
              @click="handleOperation('master', row)">设为主版本</el-button>
            <el-button type="primary"
              link
              @click="handleOperation('preview', row)">预览</el-button>
            <el-button type="primary"
              link
              @click="handleOperation('info', row)">设计</el-button>
            <el-button type="primary"
              link
              @click="handleOperation('downLoad', row)">导出</el-button>
            <el-button type="danger"
              link
              @click="handleOperation('delete', row)">删除</el-button>
          </div>
        </template>
        <template #status="{ row }">
          <span v-if="row.isMaster == 1"
            style="font-size: 18px; color: #409EFC;">✓</span>
          <span v-else
            style="font-size: 18px; color: gray;">-</span>
        </template>
        <template #revisionStatus="{ row }">
          <el-tag type="info"
            class="mx-1"
            effect="plain">
            {{ row.revision }}
          </el-tag>
        </template>
      </rk-grid>
    </template>
    <template #footer>
      <el-button @click="handleHide">关闭</el-button>
    </template>
  </vxe-modal>
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
</template>
<script  setup>
import { useWorkflowApi } from '@/api/index';
import { getCurrentInstance, reactive, ref } from 'vue'
import WorkflowPreview from './WorkflowPreview.vue'
import { downloadFunc, setEncoded } from "@/components/bpmn/utils/utils.js";
import RkWorkflowDrawer from '@/components/workflow/RkWorkflowDrawer.vue'
import BpmnDesigner from '@/components/bpmn/view/BpmnDesigner.vue'
import { ElLoading } from 'element-plus'
import { RkConfirmBox } from '@/components/message-box/index.js'
const { getProcessVersionPage, postProcessSetMaster, getProcessDownLoad, getProcessInfo, getProcessPreview, postProcessDelete, postProcessSave } = useWorkflowApi();

const props = defineProps({
  versionModal: {
    type: Object,
    default: {}
  },
  processId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(
  ['refresh']
)
const { appContext } = getCurrentInstance();
const globalProxy = appContext.config.globalProperties;
let loading = null
const workflowVersionRef = ref(null)
const vProcessDesignerRef = ref(null)
const rkWorkflowDrawerRef = ref(null)
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
const columns = ref([
  { field: "isMaster", title: "是否主版本", width: 150, align: 'center', slots: { default: 'status' } },
  {
    field: "revision", title: "版本号", width: 100, align: 'center', slots: { default: 'revisionStatus' }
  },
  { field: "createTime", title: "创建时间", align: 'center' },
  { field: "type", title: "操作", align: 'center', width: 300, slots: { default: 'operation' } }
])
/**按钮操作方法 */
const handleOperation = async (type, row) => {
  if (type === 'master') { // 设为主版本
    const { versionId, processId } = row
    const params = {
      versionId,
      processId
    }
    const loading = ElLoading.service({ fullscreen: true })
    const result = await postProcessSetMaster(params)
    const { data, code, msg } = result
    if (code === 200) {
      loading.close()
      globalProxy.$message({ message: "设为主版本成功！", type: "success" });
      handleSearch()
      emit('refresh')
    } else {
      globalProxy.$message({ message: msg ?? '业务失败！', type: "error" });
      console.error(msg)
    }

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
      console.error(msg)
    }
  } else if (type === 'info') { // 设计
    const { versionId, processId } = row
    const loading = ElLoading.service({ fullscreen: true })
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
      loading.close()
      console.error(msg)
      globalProxy.$message({ message: msg ?? '业务失败！', type: "error" });
    }
  }
  else if (type === 'delete') { // 删除
    const { versionId } = row
    const params = { versionIds: versionId }
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
          emit('refresh')
          handleSearch()
        } else {
          loading.close()
          console.error(msg)
          globalProxy.$message({ message: msg ?? '业务失败！', type: "error" });
        }
      },
      onCancel: function () {
      }
    })
  } else if (type === 'downLoad') { // 导出BPMN
    const { versionId, processName } = row
    const params = {
      versionId
    }
    const result = await getProcessDownLoad(params)
    const { data, code, msg } = result
    if (code === 200) {
      globalProxy.$message({ message: '文件正在导出中，请稍后！', type: "info" })
      if (data) {
        let { href, filename } = setEncoded('BPMN'.toUpperCase(), processName, data);
        downloadFunc(href, filename);
      } else {
        globalProxy.$message({ message: "数据为空不能导出！", type: "warning" });
      }
    } else {
      console.error(msg)
      loading.close()
      globalProxy.$message({ message: msg ?? '业务失败！', type: "error" });
    }
  }
}
/**重新获取数据 */
const handleSearch = () => {
  workflowVersionRef.value.searchEvent()
}
/**取消弹框 */
const handleHide = () => {
  props.versionModal.isShow = false
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
const handleVaildate = async () => {
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


</script>
<style lang="scss" scoped>
.workflow-container {
	height: 100%;

	.vxe-modal--content {
		padding-top: 0 !important;
	}
}
</style>