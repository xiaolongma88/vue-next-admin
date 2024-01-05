<template>
  <div class="panel-tab__content">
    <el-table :data="dataList"
      max-height="240"
      border
      fit>
      <el-table-column label="校验类型"
        width="85px"
        align="center"
        show-overflow-tooltip
        :formatter="(row)=>handleCheckTypeOptions(row)">
      </el-table-column>
      <el-table-column label="校验条件"
        align="center"
        prop="label"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="60px">
        <template v-slot="{ row, $index }">
          <!-- <el-button link
            @click="openAttributesForm(row, $index)">编辑</el-button>
          <el-divider direction="vertical" /> -->
          <el-button link
            type="danger"
            @click="removeAttributes(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button type="primary"
        :icon="Plus"
        @click="openAttributesForm(null, -1)">添加条件配置</el-button>
    </div>
    <vxe-modal v-model="propertyFormModelVisible"
      title="条件配置"
      width="40%"
      height="50%"
      resize
      mask-closable
      show-footer
      show-zoom
      destroyOnClose
      @hide="propertyFormModelVisible = false"
      @close="propertyFormModelVisible = false">
      <el-form :model="propertyForm"
        label-width="100px"
        ref="propertiesRef"
        @submit.prevent>
        <el-form-item label="校验类型："
          prop="name"
          :rules="[{ required: true, trigger: ['blur', 'change'],message:'请选择校验类型' }]">
          <el-select v-model="propertyForm.name"
            style="width: 100%"
            placeholder="请选择校验类型"
            clearable>
            <el-option v-for="item in checkTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="校验条件："
          prop="value"
          :rules="[{ required: true, trigger: ['blur', 'change'], message:'请选择校验条件'}]">
          <el-tree-select v-model="propertyForm.value"
            :data="treeData"
            :props="defaultProps"
            placeholder="请选择校验条件"
            default-expand-all />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary"
          @click="saveAttribute()">确定</el-button>
        <el-button @click="propertyFormModelVisible = false">取消</el-button>
      </template>
    </vxe-modal>
  </div>
</template>
<script>

import { Plus } from '@element-plus/icons-vue'
import { useWorkflowApi } from '@/api/index';
const { postValidationList } = useWorkflowApi()
export default {
  name: "ElementProperties",
  setup() {
    return {
      Plus
    }
  },
  props: {
    id: String,
    type: String
  },
  inject: {
    prefix: "prefix",
    width: "width"
  },
  data() {
    return {
      elementPropertyList: [],
      propertyForm: {},
      editingPropertyIndex: -1,
      propertyFormModelVisible: false,
      checkTypeOptions: [
        {
          label: "送审",
          value: '1'
        },
        {
          label: "审核",
          value: '2'
        },
        {
          label: "撤销",
          value: '3'
        },
        {
          label: "退回",
          value: '4'
        },
      ],
      checkConditionOptions: [
        {
          label: "审核条件",
          value: 1
        },
        {
          label: "撤销条件",
          value: 2
        },
        {
          label: "退回条件",
          value: 3
        },
      ],
      dataList: [],
      item: undefined,
      treeData: [],
      defaultProps: { // 默认
        children: 'children',
        label: 'name',
        value: 'id'
      },
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.resetAttributesList();
      }
    },
  },
  methods: {
    async getTreeData() {
      const { data } = await postValidationList({})
      this.treeData = data
    },
    handleCheckTypeOptions(row) {
      let title = ''
      this.checkTypeOptions.forEach((item) => {
        if (item.value === row.name) {
          title = item.label
        }
      })
      return title
    },
    handleCheckConditionOptions(val) {
      this.dataList = []
      if (val && val.length) {
        let obj = {}
        val.forEach((element, index) => {
          this.handleFindItem(this.treeData, element)
          if (this.item) {
            obj = {
              ...element,
              label: this.item.name
            }
            this.dataList.push(obj)
          }
        })
      }
    },
    // 循环遍历寻找
    handleFindItem(array, row) {
      for (const key in array) {
        if (Object.hasOwnProperty.call(array, key)) {
          const item = array[key];
          if (item.id === row.value) {
            this.item = item
            break
          } else {
            if (item.children && item.children.length > 0) {
              this.handleFindItem(item.children, row)
            }
          }
        }
      }
    },
    async resetAttributesList() {
      await this.getTreeData()
      this.$nextTick(() => (this.propertyForm = {}));
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.otherExtensionList = []; // 其他扩展配置
      this.bpmnElementProperties =
        this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => {
          if (ex.$type !== `${this.prefix}:Properties`) {
            this.otherExtensionList.push(ex);
          }
          return ex.$type === `${this.prefix}:Properties`;
        }) ?? [];

      // 保存所有的 扩展属性字段
      this.bpmnElementPropertyList = this.bpmnElementProperties.reduce((pre, current) => pre.concat(current.values), []);
      // 复制 显示
      this.elementPropertyList = JSON.parse(JSON.stringify(this.bpmnElementPropertyList ?? []));
      this.handleCheckConditionOptions(this.elementPropertyList)
    },
    openAttributesForm(attr, index) {
      this.editingPropertyIndex = index;
      this.propertyForm = index === -1 ? {} : JSON.parse(JSON.stringify(attr));
      this.propertyFormModelVisible = true;
      this.$nextTick(() => {
        if (this.$refs["attributeFormRef"]) this.$refs["attributeFormRef"].clearValidate();
      });
    },
    removeAttributes(attr, index) {
      this.$confirm("确认移除该检验条件配置吗？", "提示", {
        confirmButtonText: "确 认",
        cancelButtonText: "取 消"
      })
        .then(() => {
          this.elementPropertyList.splice(index, 1);
          this.dataList.splice(index, 1)
          this.bpmnElementPropertyList.splice(index, 1);
          // 新建一个属性字段的保存列表
          const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:Properties`, {
            values: this.bpmnElementPropertyList
          });
          this.updateElementExtensions(propertiesObject);
          this.resetAttributesList();
        })
        .catch(() => console.info("操作取消"));
    },
    async saveAttribute() {
      let validateStatus = await this.$refs["propertiesRef"].validate();
      if (!validateStatus) return; // 验证不通过直接返回
      const { name, value } = this.propertyForm;
      if (this.editingPropertyIndex !== -1) {
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.bpmnElementPropertyList[this.editingPropertyIndex], {
          name,
          value
        });
      } else {
        let isStop = false
        if (this.bpmnElementPropertyList && this.bpmnElementPropertyList.length > 0) {
          this.bpmnElementPropertyList.forEach((element) => {
            if ((element.name === this.propertyForm.name) && (element.value === this.propertyForm.value)) {
              isStop = true
              return
            }
          });
          if (!isStop) {
            // 新建属性字段
            const newPropertyObject = window.bpmnInstances.moddle.create(`${this.prefix}:Property`, { name, value });
            // 新建一个属性字段的保存列表
            const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:Properties`, {
              values: this.bpmnElementPropertyList.concat([newPropertyObject])
            });
            this.updateElementExtensions(propertiesObject);
          }
        } else {
          // 新建属性字段
          const newPropertyObject = window.bpmnInstances.moddle.create(`${this.prefix}:Property`, { name, value });
          // 新建一个属性字段的保存列表
          const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:Properties`, {
            values: this.bpmnElementPropertyList.concat([newPropertyObject])
          });
          this.updateElementExtensions(propertiesObject);
        }

      }
      this.propertyFormModelVisible = false;
      this.resetAttributesList();
    },
    updateElementExtensions(properties) {
      const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
        values: this.otherExtensionList.concat([properties])
      });
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        extensionElements: extensions
      });
    }
  }
};
</script>
