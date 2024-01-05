<!--
 * @Author: songdeyuan
 * @Date: 2023-04-25 15:00:24
 * @LastEditors: g05047
 * @LastEditTime: 2023-10-27 11:29:02
 * @Description: 备选项目申报添加项目弹框
-->
<template>
  <div v-if="dialogType===0">
    <rk-dialog width="1036"
      height="420"
      :title="title"
      :visible="localVisible"
      :destroyOnClose="true"
      @close="localVisible = false"
      :maskClosable="false">
      <rk-container :="{isFooter:false, isAside:false, isHeader:false}">
        <template #main>
          <div style="margin: 10px">
            <span style="color: red">*</span>注意事项
          </div>
          <div class="text-content">
            <p>1.排序规则：自动排序会从【已排序】的尾号自动向后追加，如果是第一次排序，将从1开始追加。</p>
            <p>2.操作步骤：勾选您需要排序的项目，点击自动排序。</p>
            <p>4.生成自动排序结果后可以手动修改制定项目的序号，请注意排序号不可重复，排序号最大值不可超过所有项目总数!</p>
            <p>5.自动排序完成之后需要手动点击【保存】按钮，排序结果才会入库永久保存，保存之后点击【已分配】进行查看排序结果和下一步操作</p>
          </div>
        </template>
      </rk-container>
      <template #footer>
        <el-button type="primary"
          @click="handleConfirm">确定
        </el-button>
        <el-button @click="handleClose">取消</el-button>
      </template>
    </rk-dialog>
  </div>
  <div v-else>
    <rk-dialog width="680"
      height="260"
      :title="title"
      :visible="localVisible"
      :destroyOnClose="true"
      @close="localVisible = false"
      :maskClosable="false">
      <rk-container :="{isFooter:false, isAside:false, isHeader:false}">
        <template #main>
          <div style="margin: 10px">
            <span style="color: red">*</span>注意事项:
          </div>
          <div class="text-content">
            <p>1.点击确认之后选中项目排序将不可进行修改</p>
            <p>2.排序确认之后专家将可以对项目进行评分</p>
          </div>
        </template>
      </rk-container>
      <template #footer>
        <el-button type="primary"
          @click="handleConfirm">确定
        </el-button>
        <el-button @click="handleClose">取消</el-button>
      </template>
    </rk-dialog>
  </div>
</template>

<script setup>
import { useNamespace } from "element-plus";
import { COMMON_STOP_OPEN_ENUMS } from '@/enums/enums-common.js'
import { reactive, ref, watch } from "vue"

const ns = useNamespace("page", ref("rk"));

const emits = defineEmits(['update:visible']);


const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  ok: {
    type: Function,
    default: () => {

    }
  },
  cancel: {
    type: Function,
    default: () => {

    }
  },
  dialogType: {
    type: Number,
    default: 0
  }
})

const localVisible = ref(props.visible)

watch(localVisible, (v) => {
  emits('update:visible', v)
})

watch(() => props.visible, (v) => {
  localVisible.value = v
})

const form = reactive({
  name: ""
})
const title = ref('添加项目')

const handleClose = () => {
  localVisible.value = false
  props.cancel()
}
/** 确认提交 */
const handleConfirm = () => {
  props.ok()
}
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

