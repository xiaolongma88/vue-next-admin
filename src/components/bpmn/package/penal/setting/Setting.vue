

<template>
  <div class="panel-tab__content">
    <el-form label-width="80px"
      @submit.prevent>
      <el-form-item label="条件设置">
        <el-input v-model="settingName"
          clearable
          @change="updateSetInfo()" />
      </el-form-item>
    </el-form>
  </div>
</template>
  <script>
export default {
  name: "Setting",
  props: {
    businessObject: Object,
    type: String,
  },
  data() {
    return {
      settingName: '',
    };
  },
  watch: {
    businessObject: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.$nextTick(() => this.resetSetInfo());
        }
      }
    }
  },
  methods: {
    resetSetInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement || {};
      const settingName = this.bpmnElement.businessObject.conditionExpression?.body ?? ''
      this.settingName = settingName
    },
    updateSetInfo() {
      let conditionExpression = null;
      if (this.settingName && this.settingName.length) {
        conditionExpression = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: this.settingName });
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, { conditionExpression });
    }
  },
  beforeUnmount() {
    this.bpmnElement = null;
  }
};
  </script>
  