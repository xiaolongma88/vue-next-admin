<template>
  <div class="system-user-dialog-container" :key="state.componentkey">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="state.isShowId">
            <el-form-item label="账户ID">
              <el-input v-model="state.ruleForm.userId" placeholder="请输入账户ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="账户名称">
              <el-input v-model="state.ruleForm.userName" placeholder="请输入账户名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户昵称">
              <el-input v-model="state.ruleForm.userNickname" placeholder="请输入用户昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="关联角色">
              <el-select v-model="state.ruleForm.role" placeholder="请选择" clearable class="w100">
                <el-option v-for="item in state.allRoles"
                           :key="item.type"
                           :label="item.name"
                           :value="item.type"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="手机号">
              <el-input v-model="state.ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="邮箱">
              <el-input v-model="state.ruleForm.email" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="菜单权限">
              <el-tree ref="treeRef" :data="state.menuData" node-key="label" :props="state.menuProps" @check="handleNodeClick"   show-checkbox class="menu-data-tree" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="账户密码">
              <el-input v-model="state.ruleForm.password" placeholder="请输入" type="password" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户状态">
              <el-switch v-model="state.ruleForm.status" inline-prompt active-text="启" inactive-text="禁"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户描述">
              <el-input v-model="state.ruleForm.describe" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
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

<script setup lang="ts" name="systemUserDialog">
import {nextTick,onMounted, reactive, ref, watch} from 'vue';
import {useRoutesList} from '@/stores/routesList'
import {ElMessage, ElTree} from 'element-plus'
import {useRoleApi} from '@/api/role/index'
import {useUserApi} from '@/api/user/index'

const stores = useRoutesList();

const treeRef = ref<InstanceType<typeof ElTree>>()

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const userDialogFormRef = ref();
const state = reactive({
  ruleForm: {
    userId:'',
    userName: '', // 账户名称
    userNickname: '', // 用户昵称
    role: '', // 关联角色
    phone: '', // 手机号
    email: '', // 邮箱
    password: '', // 账户密码
    menuAuth: '', // 菜单权限
    status: true, // 用户状态
    describe: '', // 用户描述
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  menuData:[],
  menuProps: {
    children: 'children',
    label: 'label',
  },
  checked:[],
  allRoles:[],
  menuLabel_name:[],
  isShowId:true,
  componentkey:0,
  edit:{
    editRole:'',
    editMenu:''
  }

});

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
  state.menuData = []
  let routesList = Object.values(stores.routesList)
  for (let item of routesList) {
    const{name,meta,children} = item
    const childrens = allChildren(children)
    state.menuLabel_name.push({'label':meta.title,'name':name})
    state.menuData.push({'label':meta.title,'children':childrens})
  }
}
const initChecked=(role)=>{
  state.checked = []
  let roleMenu ;
  let map = new Map()
  if(state.dialog.type=='edit'){
    roleMenu = state.edit.editMenu.split(",")
  }
  else{
    for (let item of state.allRoles) {
      if(item.type == role){
        roleMenu = item.menuAuth.split(",")
      }
    }
  }
  for (let item of state.menuLabel_name) {
    treeRef.value.setChecked(item.label,false,true)
    map.set(item.name,item.label)
  }
  for (const item of roleMenu) {
    if(item==null) continue
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

function getAllRole(){
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
function parse_label_name(checked){
  let map = new Map()
  for (let item of state.menuLabel_name) {
    map.set(item.label,item.name)
  }
  for (const checkedEl of checked) {
    state.ruleForm.menuAuth+=','+map.get(checkedEl)
  }

}

function addUser(){
  return new Promise((resolve, reject) => {
    useUserApi().addUser(state.ruleForm)
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
function editUser(){
  return new Promise((resolve, reject) => {
    useUserApi().editUser(state.ruleForm)
        .then((res) => {
          const { status, data, msg } = res;
          if (status === 200) {
            ElMessage.success('修改成功')
            resolve(data);
          } else {
            ElMessage.error('修改失败:'+msg)
            reject(msg);
          }
        })
        .catch((error) => {
          reject(error);
        });
  });
}

// 打开弹窗
const openDialog = async (type: string, row) => {
  state.dialog.type=type
  if (type === 'edit') {
    state.isShowId=false
    await getAllRole()
    state.dialog.title = '修改用户';
    state.dialog.submitTxt = '修 改';
    state.componentkey +=1;
    state.edit.editRole  = row.role
    state.edit.editMenu = row.menuAuth
    await nextTick(() => {
      state.ruleForm = row;
      getMenuData();
    });
    setTimeout(()=>{
      initChecked(state.edit.editRole)
    },100)
  } else {
    state.isShowId=true
    state.dialog.title = '新增用户';
    getMenuData();
    state.dialog.submitTxt = '新 增';
    await getAllRole()
    // 清空表单，此项需加表单验证才能使用
    // nextTick(() => {
    // 	userDialogFormRef.value.resetFields();
    // });
  }
  state.dialog.isShowDialog = true;
};

// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
  state.checked = []
  state.menuData = []
  state.ruleForm ={userId:'',userName:'',userNickname:'',role:'',phone:'',email:'',password:'',menuAuth:'',status:true,describe:''}
};
// 取消
const onCancel = () => {
  closeDialog();
};
// 提交
const onSubmit = () => {
  parse_label_name(state.checked)
  if (state.dialog.type === 'add') {
    addUser()
  }
  if (state.dialog.type === 'edit') {
    editUser()
  }
  closeDialog();
  setTimeout(() => {
    emit('refresh');
  }, 500);
};

watch(
    ()=>state.ruleForm.role,
    ()=>{
      if(state.ruleForm.role.length!=0){
        initChecked(state.ruleForm.role)
      }
    }
)
// 暴露变量
defineExpose({
  openDialog,
});
</script>
