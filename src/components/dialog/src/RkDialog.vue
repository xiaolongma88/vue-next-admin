<template>
  <vxe-modal ref="rkModalRef"
    v-model="value"
    :id="id"
    :title="title"
    :width="width"
    :height="height"
    :resize="resize"
    :zIndex="zIndex"
    :loading="loading"
    :transfer="transfer"
    :position="position"
    :showZoom="showZoom"
    :className="className"
    :draggable="draggable"
    :showClose="showClose"
    :showHeader="showHeader"
    :showFooter="showFooter"
    :fullscreen="fullscreen"
    :maskClosable="maskClosable"
    :destroyOnClose="destroyOnClose"
    :beforeHideMethod="beforeHideMethod"
    @show="emitShow"
    @hide="emitHide"
    @close="emitClose">
    <template #title>
      <template v-if="$slots.title">
        <slot name="title"></slot>
      </template>
      <template v-else>
        <span class="vxe-modal--title">{{ title }}</span>
      </template>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template #footer>
      <template v-if="showFooter">
        <template v-if="$slots.footer">
          <slot name="footer"></slot>
        </template>
        <template v-else>
          <el-button type="primary"
            @click="emitConfirm">确定</el-button>
          <el-button @click="emitCancel">取消</el-button>
        </template>
      </template>
    </template>
  </vxe-modal>
</template>
/**
 * 通用弹窗组件
 *
 */
<script setup name="RkModal">
import { ref, watch } from "vue"

const props = defineProps({
  // 设置唯一的 id，可用于防止重复弹窗
  id: { type: [String, Number] },
  // 距离顶部的偏移量
  top: { type: [String, Number], default: 100 },
  // 窗口的标题
  title: { type: [String], default: '消息提示' },
  // 窗口的宽度
  width: { type: [String, Number], default: '50%' },
  // 窗口的高度
  height: { type: [String, Number], default: '50%' },
  // 自定义堆叠顺序
  zIndex: { type: [Number], default: 1008 },
  // 是否允许窗口边缘拖动调整窗口大小
  resize: { type: [Boolean], default: true },
  // 是否显示
  visible: [Boolean],
  // 是否加载中
  loading: { type: [Boolean], default: false },
  // 是否加载中
  transfer: { type: [Boolean], default: false },
  // 给窗口附加 className
  className: { type: [String] },
  // 是否显示最大化与还原按钮
  showZoom: { type: [Boolean], default: true },
  // 是否启用窗口拖动
  draggable: { type: [Boolean], default: true },
  // 是否显示关闭按钮
  showClose: { type: [Boolean], default: true },
  // 是否显示标题栏
  showHeader: { type: [Boolean], default: true },
  // 是否显示底部栏
  showFooter: { type: [Boolean], default: true },
  // 窗口打开时自动最大化显示
  fullscreen: { type: [Boolean], default: false },
  // 是否允许点击遮罩层关闭窗口
  maskClosable: { type: [Boolean], default: true },
  // 关闭前的回调
  beforeOnClose: [Function, Promise],
  // 在窗口关闭时销毁内容
  destroyOnClose: { type: [Boolean], default: false },
}
)
const emit = defineEmits(['open', 'hide', 'update:visible', 'close', 'confirm', 'cancel'])
const rkModalRef = ref('')
const value = ref(props.visible || false)

watch(() => props.visible, (newValue) => {
  value.value = newValue
}, { deep: true, immediate: false })
let position = computed(() => {
  const top = props.top
  if (props.fullscreen) {
    return ''
  } else {
    if (top === 0 || top === null || top === 'auto') {
      return ''
    } else {
      return {
        top
      }
    }
  }

});
// watch(() => props.fullscreen, (newValue) => {
//   if (newValue) {
//     props.top = 0
//   }
// }, { deep: true, immediate: true })

const emitShow = (params) => {
  emit('open', params)
}
const emitHide = (params) => {
  emit('hide', params)
  emit('update:visible', false)
}
const emitClose = (params) => {
  emit('close', params)
}
const emitConfirm = (params) => {
  emit('confirm', params)
  emitClose(params)
}
const emitCancel = (params) => {
  emit('cancel', params)
  emitClose(params)
}
const beforeHideMethod = () => {
  const beforeOnClose = props.beforeOnClose
  let flag = true
  if (beforeOnClose) {
    flag = beforeOnClose()
    flag = (flag == undefined) ? true : flag
  }
  if (!flag) {
    return new Error()
  }
}
const open = () => {
  rkModalRef.value.open()
}
const close = () => {
  rkModalRef.value.close()
}
// 对外暴露方法
defineExpose({
  open,
  close
})
</script>
<style lang="scss" scoped>

</style>