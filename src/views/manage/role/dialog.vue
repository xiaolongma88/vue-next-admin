<template>
  <div class="system-role-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="roleDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色名称">
              <el-input v-model="state.ruleForm.name" placeholder="请输入角色名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色标识">
              <template #label>
                <el-tooltip effect="dark" content="用于 `router/route.ts` meta.roles" placement="top-start">
                  <span>角色标识</span>
                </el-tooltip>
              </template>
              <el-input v-model="state.ruleForm.type" placeholder="请输入角色标识" clearable></el-input>
            </el-form-item>
          </el-col>>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色状态">
              <el-switch v-model="state.ruleForm.status" inline-prompt active-text="启" inactive-text="禁"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="角色描述">
              <el-input v-model="state.ruleForm.notice" type="textarea" placeholder="请输入角色描述" maxlength="150"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="菜单权限">
              <el-tree node-key="label" :data="state.menuData" :props="state.menuProps" @check="handleNodeClick" :default-checked-keys="state.checked" show-checkbox class="menu-data-tree" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemRoleDialog">
import {onMounted, reactive, ref} from 'vue';
import {ElMessage, ElTree} from "element-plus";
import {useRoutesList} from '@/stores/routesList'
import  {useRoleApi} from '@/api/role'

const stores = useRoutesList();
const treeRef = ref<InstanceType<typeof ElTree>>()
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const roleDialogFormRef = ref();
const state = reactive({
  ruleForm: {
    name: '', // 角色名称
    type: '', // 角色标识
    menuAuth: '',
    status: true, // 角色状态
    notice: '', // 角色描述
  },
  menuData: [] ,
  menuProps: {
    children: 'children',
    label: 'label',
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  checked:[],
  menuLabel_name:[],
  roleMenu:[]
});
const addRole=()=>{
  return new Promise((resolve, reject) => {
    useRoleApi().addRole(state.ruleForm)
        .then((res) => {
          const { status, data, msg } = res;
          if (status === 200) {
            ElMessage.success('添加成功');
            resolve(data);
          } else {
            ElMessage.error('添加失败：'+msg)
            reject(msg);
          }
        })
        .catch((error) => {
          reject(error);
        });
  });
}
const editRole=()=>{
  return new Promise((resolve, reject) => {
    useRoleApi().roleSave(state.ruleForm)
        .then((res) => {
          const { status, data, msg } = res;
          if (status === 200) {
            ElMessage.success('修改成功');
            resolve(data);
          } else {
            ElMessage.error('修改失败：'+msg)
            reject(msg);
          }
        })
        .catch((error) => {
          reject(error);
        });
  });
}
const initChecked=()=>{
  state.checked = []
  let map = new Map()
  for (let item of state.menuLabel_name) {
    map.set(item.name,item.label)
  }
  for (const item of state.roleMenu) {
    if (item.length == 0) continue
    state.checked.push(map.get(item))
  }
  for (const checkedElement of state.checked) {
    treeRef.value.setChecked(checkedElement,true,false)
  }
}
const handleNodeClick = (data1,data2) => {
  state.checked=[]
  for (const data2El of data2.checkedNodes) {
    state.checked.push(data2El.label)
  }
}
// 打开弹窗
const openDialog = (type: string, row) => {
  state.dialog.type=type
  if (type === 'edit') {
    state.ruleForm = row;
    state.dialog.title = '修改角色';
    state.dialog.submitTxt = '修 改';
    state.roleMenu = row.menuAuth.split(",")
    setTimeout(()=>{
      initChecked()
    },100)

  } else {
    state.dialog.title = '新增角色';
    state.dialog.submitTxt = '新 增';

  }
  state.dialog.isShowDialog = true;
  getMenuData();
};
// 关闭弹窗
const closeDialog = () => {
  state.checked = []
  state.menuData = []
  state.dialog.isShowDialog = false;
  state.ruleForm= {name: '', type: '', menuAuth: '',status: true, notice: ''}
};
// 取消
const onCancel = () => {
  closeDialog();
};
// 提交
const onSubmit = () => {
  parse_label_name(state.checked)
  if (state.dialog.type === 'add') {
    addRole()
  }
  if (state.dialog.type === 'edit') {
    editRole()
  }
  closeDialog();
  setTimeout(() => {
    emit('refresh');
  }, 500);
};
// 获取菜单结构数据
function parse_label_name(checked){
  let map = new Map()
  for (let item of state.menuLabel_name) {
    map.set(item.label,item.name)
  }
  for (const checkedEl of checked) {
    state.ruleForm.menuAuth+=','+map.get(checkedEl)
  }

}
function allChildren(children) {
  let childrens = []
  if(children==null)
    return []
  for (const item of children) {
    const {name,meta,children} = item;
    state.menuLabel_name.push({'label':meta.title,'name':name})
    if(children==null) {
      childrens.push({'label': meta.title, 'children': []})
      continue
    }
    childrens.push({'label':meta.title,'children':childrens})
  }
  return childrens
}
const getMenuData=()=>{
  let routesList = Object.values(stores.routesList)
  for (let item of routesList) {
    const{name,meta,children} = item
    const childrens = allChildren(children)
    state.menuLabel_name.push({'label':meta.title,'name':name})
    state.menuData.push({'label':meta.title,'children':childrens})
  }
}
onMounted(()=>{
  initChecked()
})
// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
  .menu-data-tree {
    width: 100%;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    padding: 5px;
  }
}
</style>
