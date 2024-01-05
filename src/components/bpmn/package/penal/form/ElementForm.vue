<template>
  <div class="panel-tab__content">
    <div class="element-property list-property">
      <el-table :data="taskFormList"
        max-height="240"
        border
        fit>
        <el-table-column label="编码"
          prop="code"
          align="center"
          min-width="80px"
          show-overflow-tooltip />
        <el-table-column label="名称"
          prop="formName"
          align="center"
          min-width="80px"
          show-overflow-tooltip />
        <el-table-column label="操作"
          align="center"
          width="90px">
          <template v-slot="{ $index }">
            <el-button link
              style="color: #ff4d4f"
              @click="removeForm(record, $index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="element-drawer__button">
      <el-button type="primary"
        @click="openFormDialog()">设置表单</el-button>
    </div>
    <vxe-modal v-model="formListDialogVisible"
      :title="optionModelTitle"
      width="80%"
      height="70%"
      resize
      mask-closable
      show-footer
      show-zoom
      destroyOnClose
      @hide="handleHide"
      @close="handleHide">
      <!-- <el-form :inline="true"
        :model="searchForm"
        style="text-align: right;"
        @submit.prevent>
        <el-form-item label="流程标识">
          <el-input v-model="searchForm.name"
            placeholder="表单名称"
            clearable />
        </el-form-item>
        <el-form-item label="默认类别">
          <el-select v-model="searchForm.type"
            style="width: 180px"
            placeholder="表单类别">
            <el-option value="默认类别">默认类别</el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 0px;">
          <el-button type="primary"
            @click="onSubmit()">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="formList"
        height="250"
        border
        highlight-current-row
        style="width: 100%"
        @current-change="handleSelectionChange">
        <el-table-column property="name"
          label="名称"
          width="120" />
        <el-table-column property="type"
          label="类型"
          width="120" />
        <el-table-column property="des"
          label="描述" />
        <el-table-column label="Operations"
          fixed="right">
          <template #default="scope">
            <el-button @click="handlePreview(scope.$index, scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table> -->
      <vxe-grid v-bind="gridOptions"
        ref="elementTableRef"
        @radioChange="handleSelectionChange">
        <template #operation="{ row }">
          <el-button type="primary"
            link
            @click="handlePreview(row)">预览</el-button>
        </template>
      </vxe-grid>
      <template #footer>
        <el-button type="primary"
          @click="handleSureForm()">确定</el-button>
        <el-button @click="handleHide">取消</el-button>
      </template>
    </vxe-modal>
  </div>
</template>
<script>

import { useWorkflowApi }  from '@/api/index';
const { getProcessFormPage } = useWorkflowApi()
export default {
  name: 'ElementTableForm',
  props: {
    id: String,
    type: String
  },
  inject: {
    prefix: 'prefix',
    width: 'width'
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.$nextTick(() => this.resetFormList());
      }
    }
  },
  data() {
    return {
      searchForm: {},
      formKey: "",
      businessKey: "",
      optionModelTitle: "表单列表",
      taskFormList: [],
      formFieldForm: {},
      selectForms: [],
      selectFormIds: [],
      formFieldIndex: -1, // 编辑中的字段， -1 为新增
      formListDialogVisible: false,
      /** 表单配置*/
      gridOptions: {
        border: true,
        size: 'small',
        height: 'auto',
        showOverflow: true,
        rowConfig: {
          isHover: true,
          isCurrent: true,
          keyField: 'columnName'
        },
        exportConfig: {},
        columnConfig: {
          resizable: true
        },
        pagerConfig: {
          layouts: ['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total'],
          border: true,
          pageSize: 15,
          pageSizes: [15, 20, 50, 100],
          background: true
        },
        proxyConfig: {
          form: true, // 启用表单代理,
          props: { result: 'result', total: 'total' },
          ajax: {
            query: ({ page }) => {
              // return this.getProcessFormPageData(page)
            }
          }
        },
        columns: [
          { type: 'radio', width: 50 },
          { field: "code", title: "编码", align: 'left', headerAlign: 'center' },
          { field: "formName", title: "名称", align: 'left', headerAlign: 'center' },
          { field: "remark", title: "描述", align: 'left', headerAlign: 'center' },
          // { field: "type", title: "操作", width: 100, align: 'center', slots: { default: 'operation' } }
        ],
      },
    }
  },
  methods: {
    // onSubmit() {
    //   console.log('查询表单');
    // },
    /**重置bpmn绑定参数 */
    resetFormList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.otherExtensions = []; // 其他扩展配置
      this.bpmnElementForms =
        this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => {
          if (ex.$type !== `${this.prefix}:Forms`) {
            this.otherExtensions.push(ex);
          }
          return ex.$type === `${this.prefix}:Forms`;
        }) ?? [];
      // 保存所有的 扩展属性字段
      this.bpmnElementFormList = this.bpmnElementForms.reduce((pre, current) => pre.concat(current.values), []);
      const taskList = []
      this.taskFormList = this.bpmnElementFormList.map((current) => {
        taskList.push(current.$attrs)
      });
      this.taskFormList = taskList
    },
    /**打开表单列表 */
    openFormDialog() {
      this.formListDialogVisible = true;
    },
    /**获取表单列表数据 */
    getProcessFormPageData(page) {
      return new Promise(resolve => {
        const params = {
          page: page.currentPage,
          pageSize: page.pageSize
        }
        setTimeout(() => {
          getProcessFormPage(params).then((res) => {
            const { code, data: { rows, records }, msg } = res
            if (code == 200) {
              resolve({ total: records, result: rows })
              const elementTableRef = this.$refs.elementTableRef
              if (elementTableRef && this.taskFormList) {
                elementTableRef.setRadioRow(this.taskFormList[0])
              }
            } else {
              resolve({})
              console.error("err", msg);
            }
          }).catch((err) => {
            resolve({})
            console.error("err", err);
          })
        }, 100)
      })
    },
    /**预览 */
    handlePreview(row) {

    },
    /**确定 */
    handleSureForm() {
      let newSelect = [];
      const models = JSON.parse(JSON.stringify(this.selectForms));
      // 多选
      // models.forEach(item => {
      //   let exit = this.taskFormList.findIndex(exitItem => exitItem.formId === item.formId) > -1
      //   if (!exit) {
      //     newSelect.push(item)
      //   }
      // })
      // this.taskFormList = this.taskFormList.concat(newSelect);

      // 单选
      models.forEach(item => {
        newSelect.push(item)
      })
      this.taskFormList = newSelect;
      let newFormsObjects = [];
      newSelect.forEach(f => {
        const from = window.bpmnInstances.moddle.create(`${this.prefix}:Form`, f)
        newFormsObjects.push(from);
      });
      // 新建一个属性字段的保存列表
      const formsObject = window.bpmnInstances.moddle.create(`${this.prefix}:Forms`, {
        values: this.bpmnElementFormList.concat(newFormsObjects)
      });
      this.updateElementExtensions(formsObject);
      this.formListDialogVisible = false;
      // this.resetFormList();
    },
    /**取消 */
    handleHide() {
      this.formListDialogVisible = false;
    },
    /**删除 */
    removeForm(attr, index) {
      this.taskFormList.splice(index, 1);
      this.bpmnElementFormList.splice(index, 1);
      this.selectForms.splice(index, 1);
      // 新建一个属性字段的保存列表
      const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:Forms`, {
        values: this.bpmnElementFormList
      });
      this.updateElementExtensions(propertiesObject);
      this.resetFormList();
    },
    handleSelectionChange({ newValue }) {
      newValue._X_ROW_KEY = undefined
      const selectRow = newValue
      const model = JSON.parse(JSON.stringify(selectRow));
      const models = []
      models.push(model)
      this.selectForms = models;
      // this.selectFormIds = selectedRowKeys;
    },
    openFieldForm(field, index) {
      this.formFieldIndex = index;
    },
    updateElementExtensions(properties) {
      const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
        values: this.otherExtensions.concat([properties])
      });
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        extensionElements: extensions
      });
    }
  }
}
</script>
<style lang="sass" >
</style>
