
<!--审核意见弹窗-->
<template>
  <div>
    <rk-dialog width="480"
      height="240"
      :title="title"
      :visible="localVisible"
      :destroyOnClose="true"
      @close="localVisible = false"
      :maskClosable="false">
      <div>
        <el-form-item label="审核意见">
          <el-input type="textarea"
            rows="4"
            placeholder="请输入审核意见内容"
            v-model="note" />
        </el-form-item>
      </div>
      <template #footer>
        <el-button type="primary"
          @click="ok(note)">确定
        </el-button>
        <el-button @click="localVisible=false">取消</el-button>
      </template>
    </rk-dialog>
  </div>
</template>

<script setup>
import { useNamespace } from "element-plus";
import { COMMON_STOP_OPEN_ENUMS } from '@/enums/enums-common.js'

const ns = useNamespace("page", ref("rk"));

const emits = defineEmits(['update:visible']);

const note = ref("同意")

const props = defineProps({
  visible: {
    type: Boolean,
  },
  ok: {
    type: [Promise, Function],
    default: () => {
      return new Promise(resolve => resolve())
    }
  },
  cancel: {
    type: Promise,
    default: () => {
      return new Promise(resolve => resolve())
    }
  }
})
const localVisible = ref(props.visible)
watch(localVisible, (v) => {
  emits('update:visible', v)
})

watch(() => props.visible, (v) => {
  localVisible.value = v
})

const title = ref('审核意见')
</script>

<style lang="scss" scoped>
.text-content {
	height: 210px;
	background-color: #e6e6e6;
	color: black;
	border: 1px solid #e5e5e5;
	width: 98%;
	margin: 0 auto;

	& > p {
		margin: 10px 0;
	}
}
</style>
