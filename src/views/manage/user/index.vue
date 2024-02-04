<template>
  <div class="system-user-container layout-padding" :key="state.componentkey">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入用户名称" v-model="state.userName" style="max-width: 180px"> </el-input>
        <el-button size="default" type="primary" class="ml10"  @click="searchUser(state.userName)">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddUser('add')">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增用户
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="userId" label="账户ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userName" label="账户名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userNickname" label="用户昵称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="role" label="关联角色" show-overflow-tooltip></el-table-column>
<!--        <el-table-column prop="department" label="部门" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="用户状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="describe" label="用户描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="menuAuth" label="菜单权限" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onOpenEditUser('edit', scope.row)"
            >修改</el-button
            >
            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
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
    </el-card>
    <UserDialog ref="userDialogRef" @refresh="getTableData()" />
  </div>
</template>

<script setup lang="ts" name="systemUser">
import {defineAsyncComponent, reactive, onMounted, ref, watch} from 'vue';
import { ElMessageBox, ElMessage} from 'element-plus';
import {useUserApi} from '@/api/user'

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/src/views/manage/user/dialog.vue'));

// 定义变量内容
const userDialogRef = ref();
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
    },
  },
  userName:'',
  allUser : [],
  componentkey:0
});

function getAllUser(){
  return new Promise((resolve, reject) => {
    useUserApi().getAllUser()
        .then((res) => {
          const { status, data, msg } = res;
          if (status === 200) {
            state.allUser = JSON.parse(data.users)
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
// 查询用户
const searchUser=(username)=>{
  const data = []
  for(let item of state.allUser){
    const {nickName,notice} = item
    if(item.userName==username){
      data.push({
        userId:item.userId,
        userName: item.userName,
        userNickname: nickName,
        role: item.role?item.role:'没有角色',
        //department: item.depart?item.depart:['vueNextAdmin', 'IT外包服务'],
        phone: item.phone,
        email: item.email,
        /*sex: '女',*/
        password: item.password,
        overdueTime: item.overdueTime?item.overdueTime:new Date(),
        status: item.status,
        describe: notice,
        menuAuth:item.menuAuth,
        createTime: item.createTime?item.createTime: new Date().toLocaleString(),
      });
    }
  }
  state.tableData.data = data;
  state.tableData.total = state.tableData.data.length;
}
// 初始化表格数据
const getTableData = async () => {
  state.tableData.loading = true;
  const data = [];
  await getAllUser();
  for (let item of state.allUser) {
    const {userName,nickName,role,depart,phone,email,password,status,notice,menuAuth} = item
    data.push({
      userId:item.userId,
      userName: userName,
      userNickname: nickName,
      role: role?item.role:'没有角色',
      department: depart?depart:['vueNextAdmin', 'IT外包服务'],
      phone: phone,
      email: email,
      /*sex: '女',*/
      password: password,
      //overdueTime: item.overdueTime?item.overdueTime:new Date(),
      status: status,
      describe: notice,
      menuAuth: menuAuth,
      //createTime: item.createTime?item.createTime: new Date().toLocaleString(),
    });
  }
  state.tableData.data = data;
  state.tableData.total = state.tableData.data.length;
  setTimeout(() => {
    state.tableData.loading = false;
  }, 500);
};
const deleteOne = (userId)=>{
  return new Promise((resolve, reject) => {
    useUserApi().deleteOne(userId)
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
// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
  userDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditUser = (type, row) => {
  userDialogRef.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row) => {
  const {userId}= row
  ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.userName}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
        deleteOne(userId)
        setTimeout(()=>{
          getTableData()
        },500)
        state.componentkey+=1
      })
      .catch(() => {

      });
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
//检测查询用户框
watch(
    () => state.userName,
    ()=>{
      if(state.userName==''){
        getTableData()
      }
    }
)

</script>

<style scoped lang="scss">
.system-user-container {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    .el-table {
      flex: 1;
    }
  }
}
</style>
