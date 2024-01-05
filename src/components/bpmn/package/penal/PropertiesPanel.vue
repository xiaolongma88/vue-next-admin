
<template>
  <div class="process-panel__container"
    :style="{ width: `${panelW}px` }">
    <div class="process-pane-expand"
      ref="processShowView">
      <!-- <el-button ref="showBtn"
        :icon="ArrowLeftBold"
        @click="showBtnClick"></el-button> -->
    </div>
    <el-tabs v-model="activeBaseName">
      <el-tab-pane label="基础设置"
        name="基础设置">
        <element-base-info ref="elementBaseInfoRef"
          :id-edit-disabled="idEditDisabled"
          :business-object="elementBusinessObject"
          :type="elementType" />
      </el-tab-pane>
    </el-tabs>

    <el-tabs v-if="elementType === 'UserTask'"
      v-model="activePermissionName">
      <el-tab-pane label="权限设置"
        name="权限设置">
        <element-permission :business-object="elementBusinessObject"
          :prefix="prefix"></element-permission>
      </el-tab-pane>
    </el-tabs>
    <template v-if="this.preType ==='bpmn:ExclusiveGateway'">
      <el-tabs v-if="elementType == 'SequenceFlow'"
        v-model="activeSettingName">
        <el-tab-pane label="条件设置"
          name="条件设置">
          <setting :business-object="elementBusinessObject"
            :type="elementType"></setting>
        </el-tab-pane>
      </el-tabs>
    </template>

    <!-- <el-tabs v-if="elementType === 'Process'"
      v-model="activeFormName">
      <el-tab-pane label="表单设置"
        name="表单设置">
        <element-table-form :id="elementId"
          :type="elementType"></element-table-form>
      </el-tab-pane>
    </el-tabs> -->

    <el-tabs v-if="elementType.indexOf('Task') !== -1 || elementType === 'SubProcess'"
      v-model="multiinstanceName">
      <el-tab-pane label="多实例"
        name="多实例">
        <element-multi-instance :business-object="elementBusinessObject"
          :type="elementType" />
      </el-tab-pane>
    </el-tabs>

    <el-tabs v-if="elementType === 'UserTask'"
      v-model="checkControlName">
      <el-tab-pane label="校验条件配置"
        name="校验条件配置">
        <element-properties :id="elementId"
          :type="elementType" />
      </el-tab-pane>
    </el-tabs>
    <!-- <el-collapse-item name="multiInstance"
      v-if="elementType.indexOf('Task') !== -1"
      key="multiInstance">
     
    </el-collapse-item> -->

    <!-- <el-tabs v-model="activeMonitorName">
      <el-tab-pane label="执行监听器"
        name="执行监听器">
        <element-listeners :id="elementId"
          :type="elementType" />
      </el-tab-pane>
    </el-tabs>

    <el-tabs v-if="elementType === 'UserTask'"
      v-model="activeUserTaskName">
      <el-tab-pane label="任务监听器"
        name="任务监听器">
        <user-task-listeners :id="elementId"
          :type="elementType" />
      </el-tab-pane>
    </el-tabs> -->

    <!-- <el-collapse-item name="condition"
      v-if="formVisible"
      key="form">
      <template #title>

        <div class="panel-tab__title"><el-icon>
            <list />
          </el-icon>表单</div>
      </template>
      <element-form :id="elementId"
        :type="elementType" />
    </el-collapse-item>  -->

    <!-- <el-collapse v-model="activeTab">
      <el-collapse-item name="condition"
        v-if="elementType === 'Process'"
        key="message">
        <template #title>
          <div class="panel-tab__title"><el-icon>
              <comment />
            </el-icon>消息与信号</div>
        </template>
        <signal-and-massage />
      </el-collapse-item>
      <el-collapse-item name="condition"
        v-if="conditionFormVisible"
        key="condition">
        <template #title>
          <div class="panel-tab__title"><el-icon>
              <promotion />
            </el-icon>流转条件</div>
        </template>
        <flow-condition :business-object="elementBusinessObject"
          :type="elementType" />
      </el-collapse-item>

      <el-collapse-item name="task"
        v-if="elementType.indexOf('Task') !== -1"
        key="task">
        <template #title>
          <div class="panel-tab__title"><el-icon>
              <checked />
            </el-icon>任务</div>
        </template>
        <element-task :id="elementId"
          :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="multiInstance"
        v-if="elementType.indexOf('Task') !== -1"
        key="multiInstance">
        <template #title>
          <div class="panel-tab__title"><el-icon><help-filled /></el-icon>多实例</div>
        </template>
        <element-multi-instance :business-object="elementBusinessObject"
          :type="elementType" />
      </el-collapse-item>

      <el-collapse-item name="extensions"
        key="extensions">
        <template #title>

          <div class="panel-tab__title"><el-icon><circle-plus /></el-icon>扩展属性</div>
        </template>
        <element-properties :id="elementId"
          :type="elementType" />
      </el-collapse-item>
    </el-collapse> -->
  </div>
</template>
<script>
import {
  ArrowLeftBold
} from '@element-plus/icons-vue'
import ElementBaseInfo from "./base/ElementBaseInfo.vue";
import ElementTask from "./task/ElementTask.vue";
import ElementMultiInstance from "./multi-instance/ElementMultiInstance.vue";
import FlowCondition from "./flow-condition/FlowCondition.vue";
import SignalAndMassage from "./signal-message/SignalAndMessage.vue";
import ElementListeners from "./listeners/ElementListeners.vue";
import ElementProperties from "./properties/ElementProperties.vue";
import ElementTableForm from "./form/ElementForm.vue";
import UserTaskListeners from "./listeners/UserTaskListeners.vue";
import Log from "../Log";
import ElementPermission from './permission/ElementPermission.vue';
import Setting from './setting/Setting.vue';
/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
export default {
  name: "MyPropertiesPanel",
  setup() {
    return {
      ArrowLeftBold
    }
  },
  components: {
    UserTaskListeners,
    ElementTableForm,
    ElementProperties,
    ElementListeners,
    SignalAndMassage,
    FlowCondition,
    ElementMultiInstance,
    ElementTask,
    ElementBaseInfo,
    ElementPermission,
    Setting
  },
  componentName: "MyPropertiesPanel",
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: "camunda"
    },
    width: {
      type: Number,
      default: 450
    },
    idEditDisabled: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width
    };
  },
  data() {
    return {
      activeBaseName: '基础设置',
      activePermissionName: '权限设置',
      activeMonitorName: '执行监听器',
      activeUserTaskName: '任务监听器',
      activeFormName: '表单设置',
      activeSettingName: '条件设置',
      multiinstanceName: '多实例',
      checkControlName: '校验条件配置',

      // 父节点类型
      preType: '',
      isShow: false,
      panelW: this.width,
      activeTab: "base",
      elementId: "",
      elementType: "",
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
      conditionFormVisible: false, // 流转条件设置
      formVisible: false // 表单配置
    };
  },
  watch: {
    elementId: {
      handler() {
        this.activeTab = "base";
      }
    }
  },
  created() {
    this.initModels();
  },
  mounted() {
    // this.initShowFrame()
    // window.onresize = () => {
    //   return (() => {
    //     this.$nextTick(() => {
    //       this.initShowFrame()
    //     })
    //   })()
    // }
  },
  methods: {
    // 获取基础设置的校验
    async handleElementBaseInfoValidate() {
      const validate = await this.$refs.elementBaseInfoRef.submitForm()
      console.log(validate)
      return validate
    },

    initShowFrame() {
      this.panelW = this.isShow ? 0 : 450
      this.$nextTick(() => {
        const processShowView = this.$refs.processShowView
        const screenW = document.body.clientWidth//获取屏幕宽度
        const showViewL = screenW - this.panelW + processShowView.clientWidth
        processShowView.style.left = this.isShow ? (screenW - processShowView.clientWidth + 'px') : (showViewL + 'px')
      })
    },
    showBtnClick() {
      this.isShow = !this.isShow
      this.initShowFrame()
    },
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      window.bpmnInstances = {
        modeler: this.bpmnModeler,
        modeling: this.bpmnModeler.get("modeling"),
        moddle: this.bpmnModeler.get("moddle"),
        eventBus: this.bpmnModeler.get("eventBus"),
        bpmnFactory: this.bpmnModeler.get("bpmnFactory"),
        elementFactory: this.bpmnModeler.get("elementFactory"),
        elementRegistry: this.bpmnModeler.get("elementRegistry"),
        replace: this.bpmnModeler.get("replace"),
        selection: this.bpmnModeler.get("selection")
      };
      this.getActiveElement();
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      this.initFormOnChanged(null);
      this.bpmnModeler.on("import.done", e => {
        this.initFormOnChanged(null);
      });
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        this.initFormOnChanged(newSelection[0] || null);
      });
      this.bpmnModeler.on("element.changed", ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.elementId) {
          this.initFormOnChanged(element);
        }
      });
    },
    // 初始化数据
    initFormOnChanged(element) {
      let activatedElement = element;
      if (!activatedElement) {
        activatedElement =
          window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Process") ??
          window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Collaboration");
      }
      if (!activatedElement) return;
      Log.printBack(`select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`);
      Log.prettyInfo("businessObject", activatedElement.businessObject);
      window.bpmnInstances.bpmnElement = activatedElement;
      this.bpmnElement = activatedElement;
      this.elementId = activatedElement.id;
      this.elementType = activatedElement.type.split(":")[1] || "";
      this.elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject));
      this.preType = this.bpmnElement.businessObject.sourceRef?.$type ?? ''
      this.conditionFormVisible = !!(
        this.elementType === "SequenceFlow" &&
        activatedElement.source &&
        activatedElement.source.type.indexOf("StartEvent") === -1
      );
      this.formVisible = this.elementType === "UserTask" || this.elementType === "StartEvent";
    },
    beforeUnmount() {
      window.bpmnInstances = null;
    }
  }
};
</script>
<style scoped>
.process-pane-expand {
  width: 60px;
  position: fixed;
  left: 0;
  top: 50%;
}
</style>
