<template>
  <div class="system-role-container layout-padding" :key="state.componentkey">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="system-user-search mb15">
        <el-input v-model="state.tableData.param.search" size="default" placeholder="请输入角色名称" style="max-width: 180px"> </el-input>
        <el-button size="default" type="primary" class="ml10" @click="searchRole(state.tableData.param.search)">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddRole('add')">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增角色
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="id" label="角色Id"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="角色标识" show-overflow-tooltip></el-table-column>
        <el-table-column prop="menuAuth" label="菜单权限" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="角色状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="notice" label="角色描述" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button :disabled="scope.row.roleName === '超级管理员'" size="small" text type="primary" @click="onOpenEditRole('edit', scope.row)"
            >修改</el-button
            >
            <el-button :disabled="scope.row.roleName === '超级管理员'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          v-model:current-page="state.tableData.param.pageNum"
          background
          v-model:page-size="state.tableData.param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.tableData.total"
      >
      </el-pagination>
    </div>
    <RoleDialog ref="roleDialogRef" @refresh="getTableData()" />
  </div>
</template>

<script setup lang="ts" name="systemRole">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import  {useRoleApi} from '@/api/role'

// 引入组件
const RoleDialog = defineAsyncComponent(() => import('/@/views/manage/role/dialog.vue'));

// 定义变量内容
const roleDialogRef = ref();
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      search: '',
      pageNum: 1,
      pageSize: 10,
    },
  },
  allRoles:[],
  componentkey:0
});
const searchRole=(roleName)=>{
  const data = []
  for (let item of state.allRoles) {
    const {id, name, type, menuAuth, notice, status} = item
    if(name==roleName){
      data.push({
        id: id,
        name: name,
        role: type,
        notice: notice,
        menuAuth: menuAuth,
        status: status,
      });
    }
  }
  state.tableData.data = data;
  state.tableData.total = state.tableData.data.length;
  setTimeout(() => {
    state.tableData.loading = false;
  }, 500);
}
function getAllUser(){
  return new Promise((resolve, reject) => {
    useRoleApi().getAllRole()
        .then((res) => {
          const { status, data, msg } = res;
          if (status === 200) {
            state.allRoles = JSON.parse(data.roles)
            resolve(data);
          } else {
            reject(msg);
          }
        })
        .catch((error) => {
          reject(error);
        });
  });
}
// 初始化表格数据
const getTableData = async () => {
  state.tableData.loading = true;
  const data = [];
  await getAllUser()
  for (let item of state.allRoles) {
    const {id, name, type, menuAuth, notice, status} = item
    data.push({
      id: id,
      name: name,
      type: type,
      notice: notice,
      menuAuth: menuAuth,
      status: status,
    });
  }
  state.tableData.data = data;
  state.tableData.total = state.tableData.data.length;
  setTimeout(() => {
    state.tableData.loading = false;
  }, 500);
};
// 打开新增角色弹窗
const onOpenAddRole = (type: string) => {
  roleDialogRef.value.openDialog(type);
};
// 打开修改角色弹窗
const onOpenEditRole = (type: string, row: Object) => {
  roleDialogRef.value.openDialog(type, row);
};
// 删除角色
const deleteOne = (roleId)=>{
  return new Promise((resolve, reject) => {
    useRoleApi().deleteOne(roleId)
        .then((res) => {
          const { status, data, msg } = res;
          if (status === 200) {
            ElMessage.success('删除成功');
            resolve(data);
          } else {
            ElMessage.error(msg);
            reject(msg);
          }
        })
        .catch((error) => {
          ElMessage.error('删除失败');
          reject(error);
        });
  });
}
const onRowDel = (row) => {
  const {id} = row
  ElMessageBox.confirm(`此操作将永久删除角色名称：“${row.roleName}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        deleteOne(id)
        setTimeout(()=>{
          getTableData()
        },500)
        state.componentkey+=1
      })
      .catch(() => {});
};
// 分页改变
const onHandleSizeChange = (val: number) => {
  state.tableData.param.pageSize = val;
  getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNum = val;
  getTableData();
};
// 页面加载时
onMounted(() => {
  getTableData();

});
</script>

<style scoped lang="scss">
.system-role-container {
  .system-role-padding {
    padding: 15px;
    .el-table {
      flex: 1;
    }
  }
}
</style>
