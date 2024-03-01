<template>
  <div class="system-user-container layout-padding" :key="state.componentKey">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入名称" v-model="state.search" style="max-width: 180px"> </el-input>
        <el-button size="default" type="primary" class="ml10"  @click="search(state.search)">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增
        </el-button>
      </div>
      <el-scrollbar>
        <AsideLink :to="state.routerInfo">test</AsideLink>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%" ref="tableRef" @row-dblclick="rowClick">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="landId" label="编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="landName" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="classify" label="分类" show-overflow-tooltip></el-table-column>
        <el-table-column prop="number_area" label="数量面积" show-overflow-tooltip></el-table-column>
        <el-table-column prop="obtainMethod" label="取得方式" show-overflow-tooltip></el-table-column>
        <el-table-column prop="use" label="资产用途" show-overflow-tooltip></el-table-column>
        <el-table-column prop="subject" label="单位会计科目" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectCode" label="项目代码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="purOrgFormat" label="采购组织形式" show-overflow-tooltip></el-table-column>
        <el-table-column prop="obtDate" label="取得日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="useDate" label="投入使用日期" show-overflow-tooltip></el-table-column>
        <el-table-column  label="详细信息" show-overflow-tooltip><AsideLink to="land/info">点击查看</AsideLink></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button  size="small" text type="primary" @click="onOpenEdit(scope.row)"
            >修改</el-button>
            <el-button  size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-scrollbar>
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
import {reactive, onMounted, ref, watch} from 'vue';
import { ElMessageBox, ElMessage} from 'element-plus';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';
import {storeToRefs} from "pinia";
import {useRoute, useRouter} from "vue-router";
import AsideLink from '@/layout/navMenu/asideLink.vue';
import {data} from './mock'
// 引入组件
const storesTagsViewRoutes = useTagsViewRoutes();
const { tagsViewRoutes } = storeToRefs(storesTagsViewRoutes);
const info = () => import('./info.vue');
const dialog = () => import('./dialog.vue')
// 定义变量内容
const route = useRoute();
const router = useRouter();
const userDialogRef = ref();
const tableRef  = ref();
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
  search:'',
  all : [],
  componentKey:0,
  tagsViewList:[],
  routerInfo:''
});
const rowClick= (row, column, event) => {
  router.addRoute({path: '/card/land/info', component: info})
  router.push({path: '/card/land/info', query: {id: row.landId}});
}
function getAll(){
  state.all = data
  /*return new Promise((resolve, reject) => {
    useUserApi().getAllUser()
        .then((res) => {
          const { status, data, msg } = res;
          if (status === 200) {
            state.all = JSON.parse(data.users)
            resolve(data);
          } else {
            reject(msg);
          }
        })
        .catch((error) => {
          reject(error);
        });
  });*/
}
// 查询
const search=(val)=>{
  const data = []
  for(let item of state.all){
    if(item.landName==val){
      const {landId,landName,classify,number_area,obtainMethod,use,subject,projectCode,purOrgFormat,obtDate,useDate} = item
      data.push({
        landId:landId,
        landName:landName,
        classify:classify,
        number_area:number_area,
        obtainMethod:obtainMethod,
        use:use,
        subject:subject,
        projectCode:projectCode,
        purOrgFormat:purOrgFormat,
        obtDate:obtDate,
        useDate:useDate
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
  await getAll();
  for (let item of state.all) {
    const {landId,landName,classify,number_area,obtainMethod,use,subject,projectCode,purOrgFormat,obtDate,useDate} = item
    data.push({
      landId:landId,
      landName:landName,
      classify:classify,
      number_area:number_area,
      obtainMethod:obtainMethod,
      use:use,
      subject:subject,
      projectCode:projectCode,
      purOrgFormat:purOrgFormat,
      obtDate:obtDate,
      useDate:useDate
    });
  }
  state.tableData.data = data;
  state.tableData.total = state.tableData.data.length;
  setTimeout(() => {
    state.tableData.loading = false;
  }, 500);
};
const deleteOne = (userId)=>{
  /*return new Promise((resolve, reject) => {
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
  });*/
}
// 打开新增用户弹窗
const onOpenAdd = (type: string) => {
  router.push({path: '/card/land/dialog', query: {operation: 'add'}});
};
// 打开修改
const onOpenEdit = (row) => {
  router.push({path: '/card/land/dialog', query: {operation: 'edit',id: row.landId}});
};
// 删除
const onRowDel = (row) => {
  const {landId}= row.landId
  ElMessageBox.confirm(`此操作将永久删除：“${row.landName}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
        deleteOne(landId)
        setTimeout(()=>{
          getTableData()
        },500)
        state.componentKey+=1
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
  router.addRoute({path: '/card/land/info', component: info})
  router.addRoute({path: '/card/land/dialog', component: dialog})
  getTableData();
});
//检测查询用户框
watch(
    () => state.search,
    ()=>{
      if(state.search==''){
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
