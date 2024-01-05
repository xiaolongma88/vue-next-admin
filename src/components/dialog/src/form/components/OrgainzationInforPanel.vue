<!--
 * @Author: ljc
 * @Date: 2023-04-13 16:10:48
 * @LastEditors: g05047
 * @LastEditTime: 2023-06-07 10:05:18
 * @Description: 机构信息渲染弹窗
-->
<template>
  <div class="common-proj-filling-wrapper">
    <div class="common-proj-filling-header">
      <div class="header-item right">
        <el-button type="primary"
          @click="handleConfirm">确定</el-button>
        <el-button type="danger"
          @click="handleClose">取消</el-button>
      </div>
    </div>
    <div class="common-proj-filling-body">
      <div class="filling-body-center">
        <RkFormRender ref="rkFormRenderRef"
          :="$attrs"
          v-bind="props"
          :formData="echoFormData"
          @loaded="renderBusiFormLoaded" />
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import XEUtils from 'xe-utils'
import RkUtils from '@/utils/rk-utils.js'
import { RkFormRender } from '@/components/designer';
import { AgencyProps } from '../cfg/common-props'
import { ElMessage, ElLoading } from "element-plus"
import { useAgencyApi } from '@/api'
import { FILL_FORM_TYPE_CONFIG } from '@/components/designer/cfg/rk-form-conf.js'

const { saveThirdAgency, getAgencyByAgencyId } = useAgencyApi()
const emits = defineEmits([
  'close',
  'loaded',
  'confirm',
])

const props = defineProps({
  ...AgencyProps
})
// 提交的参数-也是传递的参数
const submitParams = ref({})
// 是否加载中
const loading = ref(false)
// 表单回显数据
const echoFormData = ref({})
// 加载中遮罩
const openLoading = ref()
// 表单渲染模板引用对象
const rkFormRenderRef = ref()
/**
 * 加载表单信息
 * @param {Object} config 参数配置
 */
const loadData = async (config) => {
  if (config.buttonCode === FILL_FORM_TYPE_CONFIG.ADD.value) {
    config.agencyId = ''
  }
  echoFormData.value = config
  loading.value = true
  submitParams.value = config
  openLoading.value = ElLoading.service({ fullscreen: true, text: '加载中......' })
  if (config.buttonCode !== FILL_FORM_TYPE_CONFIG.ADD.value) {
    const { data } = await getAgencyByAgencyId(config).catch(err => {
      openLoading.value.close()
      loading.value = false
    })
    openLoading.value.close()
    if (data) {
      echoFormData.value = { ...echoFormData.value, ...data }
    }
  } else {
    // PRD_THIRD_AGENCY.TYPE
    // 基本信息-机构类型
    openLoading.value.close()
    echoFormData.value['TYPE'] = config['organizationType']
  }
}

const handleClose = () => {
  emitClose()
}
const handleConfirm = async () => {
  const { validateFormData } = rkFormRenderRef.value
  const valid = await validateFormData()
  if (valid) {
    handleSave(props.buttonCode, () => { emitConfirm() })
  }
}
const handleSave = async (buttonCode, callback) => {
  const { getRenderFormData } = rkFormRenderRef.value
  getRenderFormData().then((params) => {
    const { dataArray, slotsData } = params
    const result = {
      buttonCode, data: dataArray, ...submitParams.value, ...slotsData
    }
    const saveLoading = ElLoading.service({ fullscreen: true, text: '信息正在保存中......' })
    saveThirdAgency(result).then(res => {
      const { code, data, msg } = res
      if (code === 200) {
        callback()
        ElMessage.success('保存成功！')
      } else {
        ElMessage.error(msg)
      }
    }).finally(() => {
      saveLoading.close()
    })
  })
}

// ----- 表单渲染相关内容
const renderBusiFormLoaded = () => {
  loading.value = false
  emitLoaded()
}

const emitClose = () => {
  emits('close')
}
const emitLoaded = () => {
  emits('loaded')
}
const emitConfirm = () => {
  emits('confirm')
}
loadData(XEUtils.clone(props, true))

  </script>
  
  
  <style lang="scss" scoped>
</style>
  