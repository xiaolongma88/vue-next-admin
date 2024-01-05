
<template>
  <div class="panel-tab__content">
    <el-form label-width="100px"
      @submit.prevent>
      <!-- <el-form-item label="启动流程权限">
        <el-select v-model="processValue"
          placeholder="请选择启动流程权限"
          @change="updateDocumentation"
          @blur="updateDocumentation">
          <el-option v-for="item in processList"
            :key="item.label"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="指定角色"
        label-width="80px"
        :rules="[
        {
          required: true,
          message: '请选择指定角色',
          trigger: ['blur', 'change'],
        },
      ]">
        <el-select v-model="permissionInfo.candidateGroups"
          placeholder="请选择指定角色"
          multiple
          filterable
          placement="bottom-end"
          @change="updatePermissionInfo('candidateGroups')"
          @blur="updatePermissionInfo('candidateGroups')">
          <el-option v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId" />
        </el-select>
      </el-form-item>
      <el-form-item label="候选人"
        label-width="80px">
        <el-input v-model="permissionInfo.assignee"
          allowClear
          @change="() => updatePermissionInfo('assignee')"
          @blur="() => updatePermissionInfo('assignee')" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { useWorkflowApi } from '@/api/index';
export default {
  name: "ElementPermission",
  props: {
    businessObject: Object,
    prefix: {
      type: String,
      default: "camunda"
    },
  },
  data() {
    return {
      permissionInfo: {
        candidateGroups: [],
        assignee: ''
      },
      roleList: [],
    };
  },
  watch: {
    businessObject: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.$nextTick(() => this.resetPermissionInfo());
        }
      }
    }
  },
  mounted() {
    this.getProcessRoleListData()
  },
  methods: {
    /**
  *  获取角色列表数据
  */
    async getProcessRoleListData() {
      const result = await useWorkflowApi().getProcessRoleList({})
      const { data, code, msg } = result
      if (code === 200) {
        this.roleList = data || []
      } else {
        console.error(msg)
      }
    },
    /**
   *  重置方法
   */
    resetPermissionInfo() {
      const candidateGroupskey = 'candidateGroups'
      const assigneeKey = 'assignee'
      this.bpmnElement = window?.bpmnInstances?.bpmnElement || {};
      if (this.bpmnElement.businessObject?.$attrs) {
        const permissionInfo = JSON.parse(JSON.stringify(this.bpmnElement.businessObject));
        const candidateGroupsStr = permissionInfo[candidateGroupskey] ?? ''
        if (candidateGroupsStr && candidateGroupsStr !== '') {
          const candidateGroups = candidateGroupsStr.split(',')
          this.permissionInfo = {
            candidateGroups
          }
        } else {
          this.permissionInfo = {
            candidateGroups: []
          }
        }
        const assigneeStr = permissionInfo[assigneeKey] ?? ''
        if (assigneeStr && assigneeStr != '') {
          this.permissionInfo = {
            ...this.permissionInfo,
            assignee: assigneeStr
          }
        } else {
          this.permissionInfo = {
            ...this.permissionInfo,
            assignee: ''

          }
        }
      }
    },
    /**
     *  切换角色方法
     */
    updatePermissionInfo(key) {
      const candidateGroupskey = `${this.prefix}:` + key
      console.log(candidateGroupskey)
      const attrObj = Object.create(null);
      if (key === 'candidateGroups') {
        const candidateGroups = this.permissionInfo[key] || [];
        const candidateGroupsStr = candidateGroups.join(',')
        attrObj[candidateGroupskey] = candidateGroupsStr
      } else if (key === 'assignee') {
        const assignee = this.permissionInfo[key] || [];
        attrObj[candidateGroupskey] = assignee
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj);
    }
  },
  beforeUnmount() {
    this.bpmnElement = null;
  }
};
</script>
