
<template>
  <div class="panel-tab__content">
    <el-form @submit.prevent
      :rules="rules"
      ref="ruleFormRef"
      :model="elementBaseInfo">
      <el-form-item :label="elementBaseInfo.$type === 'bpmn:Process'?'流程标识':'节点标识'"
        prop="id"
        label-width="80">
        <el-input v-model="elementBaseInfo.id"
          :disabled="idEditDisabled"
          clearable
          @change="updateBaseInfo('id')" />
      </el-form-item>
      <el-form-item :label="elementBaseInfo.$type === 'bpmn:Process'?'流程名称':'节点名称'"
        :prop="(elementBaseInfo.$type ==='bpmn:SequenceFlow' || elementBaseInfo.$type ==='bpmn:ExclusiveGateway' || elementBaseInfo.$type ==='bpmn:EventBasedGateway' || elementBaseInfo.$type ==='bpmn:InclusiveGateway' || elementBaseInfo.$type ==='bpmn:ComplexGateway'|| elementBaseInfo.$type ==='bpmn:ParallelGateway')
         ? '' : 'name'"
        label-width="80">
        <el-input v-model="elementBaseInfo.name"
          clearable
          @change="updateBaseInfo('name')" />
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item label="流程描述"
          label-width="80">
          <el-input v-model="elementBaseInfo.versionTag"
            :autosize="{ minRows: 4, maxRows: 6 }"
            clearable
            type="textarea"
            placeholder="请输入流程描述"
            maxlength="60"
            show-word-limit
            @change="updateBaseInfo('versionTag')" />
        </el-form-item>
        <!-- <el-form-item label="可执行">
          <el-switch v-model="elementBaseInfo.isExecutable"
            active-text="是"
            inactive-text="否"
            @change="updateBaseInfo('isExecutable')" />
        </el-form-item> -->
      </template>
      <el-form-item v-if="elementBaseInfo.$type === 'bpmn:SubProcess'"
        label="状态">
        <el-switch v-model="elementBaseInfo.isExpanded"
          active-text="展开"
          inactive-text="折叠"
          @change="updateBaseInfo('isExpanded')" />
      </el-form-item>
      <!-- SequenceFlow -->
    </el-form>
  </div>
</template>
<script>
export default {
  name: "ElementBaseInfo",
  props: {
    businessObject: Object,
    type: String,
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      settingName: '条件设置',
      elementBaseInfo: {},
      rules: {
        name: [
          { required: true, message: '此项为必填项！', trigger: ['blur', 'change'], },
        ],
        id: [
          { required: true, message: '此项为必填项！', trigger: ['blur', 'change'], },
        ],
      },
    };
  },
  watch: {
    businessObject: {
      immediate: false,
      handler: function (val) {
        if (val) {
          this.resetForm();
          this.$nextTick(() => this.resetBaseInfo());
        }
      }
    },
  },
  methods: {
    resetBaseInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement || {};
      this.elementBaseInfo = JSON.parse(JSON.stringify(this.bpmnElement.businessObject));
      if (this.elementBaseInfo && this.elementBaseInfo.$type === "bpmn:SubProcess") {
        this.elementBaseInfo["isExpanded"] = this.elementBaseInfo.di?.isExpanded
      }
      if (this.elementBaseInfo && this.elementBaseInfo.$type === "bpmn:StartEvent") {
        if (!(this.elementBaseInfo.name)) {
          this.elementBaseInfo.name = '开始'
          this.updateBaseInfo('name')
        }
      }
      if (this.elementBaseInfo && this.elementBaseInfo.$type === "bpmn:EndEvent") {
        if (!(this.elementBaseInfo.name)) {
          this.elementBaseInfo.name = '结束'
          this.updateBaseInfo('name')
        }
      }
    },
    updateBaseInfo(key) {
      if (key === "id") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: `${this.elementBaseInfo[key]}_di` }
        });
        return;
      }
      if (key === "isExpanded") {
        window?.bpmnInstances?.modeling.toggleCollapse(this.bpmnElement);
        return;
      }
      const attrObj = Object.create(null);
      attrObj[key] = this.elementBaseInfo[key];
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj);
    },
    /**
* 表单校验
*/
    async submitForm() {
      if (!this.$refs.ruleFormRef) return
      await this.$refs.ruleFormRef.validate((valid, fields) => {
        if (valid) {
          console.log(fields)
          console.log('submit!')
        } else {
          console.log('error submit!', fields)
        }
      })
    },
    /**
* 清空表单
*/
    resetForm() {
      if (!this.$refs.ruleFormRef) return
      this.$refs.ruleFormRef.resetFields()
    },

  },
  beforeUnmount() {
    this.bpmnElement = null;
  },
};
</script>
