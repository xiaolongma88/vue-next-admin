<template>
  <div class="form-adapt-container layout-pd">
    <el-scrollbar height="1000px">
      <el-button type="success" :icon="ArrowLeft" class="close" @click="backFront"> 返回 </el-button>
      <el-card shadow="hover" header="土地资产信息卡片" >
        <el-text class="mx-1" type="success" size="large">基本信息</el-text>
        <el-form :model="state.form" size="default" label-width="100px" class="mt35 mb35">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="编号">
                <el-input v-model="state.form.basic.id" placeholder="请输入编号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="分类">
                <el-select v-model="state.form.basic.classify" placeholder="请选择分类" clearable class="w100">
                  <el-option label="计算机 / 互联网 / 通信" value="1"></el-option>
                  <el-option label="生产 / 工艺 / 制造" value="2"></el-option>
                  <el-option label="医疗 / 护理 / 制药" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="资产名称">
                <el-input v-model="state.form.basic.name" placeholder="请输入资产名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="数量/面积">
                <el-input v-model="state.form.basic.nu_area"  placeholder="请输入数量/面积" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="项目代码">
                <el-input v-model="state.form.basic.projectCode" placeholder="请输入项目代码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="数量计量单位">
                <el-input  placeholder="请输入数量计量单位" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="采购组织形式">
                <el-input v-model="state.form.basic.orgFoam" placeholder="请输入采购组织形式" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="取得方式">
                <el-input v-model="state.form.basic.obMethod" placeholder="请输入取得方式" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="取得日期">
                <el-input v-model="state.form.basic.obDate" placeholder="请输入取得日期" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="资产用途">
                <el-input v-model="state.form.basic.use" placeholder="请输入资产用途" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="投入使用日期">
                <el-input v-model="state.form.basic.useDate" placeholder="请输入投入使用日期" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="配置批准单位">
                <el-input v-model="state.form.basic.passOrg" placeholder="请输入配置批准单位" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-text class="mx-1" type="success" size="large"   >财务信息</el-text>
        <el-form :model="state.form" size="default" label-width="100px" class="mt35 mb35">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="价值类型">
                <el-input v-model="state.form.finance.classify" placeholder="价值类型" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="30" :sm="15" :md="10" :lg="8" :xl="5" class="mb20">
              <el-form-item label="经费来源">
                <el-form label-width="120px">
                  <el-form-item label="财政拨款">
                    <el-input v-model="state.form.finance.finAllocation" placeholder="请输入金额（元）" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="非财政拨款" >
                    <el-input v-model="state.form.finance.allocation" placeholder="请输入金额（元）" clearable></el-input>
                  </el-form-item>
                </el-form>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="资产原值">
                <el-input v-model="state.form.finance.originalValue" placeholder="请输入金额（元）" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="财务入账状态">
                <el-input v-model="state.form.finance.recordedStatus"  placeholder="请输入财务入账状态" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="记账日期">
                <el-date-picker
                    type="date"
                    v-model="state.form.finance.recordedDate"
                    placeholder="选择日期"
                    size="default"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="记账凭证号">
                <el-input v-model="state.form.finance.recordedId"  placeholder="请输入记账凭证号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="折旧/摊销状态">
                <el-input v-model="state.form.finance.otherStatus" placeholder="请输入折旧/摊销状态" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="折旧/摊销方法">
                <el-input v-model="state.form.finance.otherMethod" placeholder="请输入折旧/摊销方法" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="折旧/摊销年限">
                <el-input v-model="state.form.finance.otherTime" placeholder="请输入年限(月)" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="月折旧/摊销额">
                <el-input v-model="state.form.finance.otherValue" placeholder="请输入金额（元）" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="净值">
                <el-input v-model="state.form.finance.netValue" placeholder="请输入金额（元）" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="财务负责人">
                <el-input v-model="state.form.finance.header" placeholder="请输入姓名" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-text class="mx-1" type="success" size="large">使用信息</el-text>
        <el-form :model="state.form" size="default" label-width="100px" class="mt35 mb35">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="资产状态">
                <el-input v-model="state.form.utilize.status" placeholder="请输入资产状态" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="使用责任主体">
                <el-input v-model="state.form.utilize.main" placeholder="请输入使用责任主体" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="使用部门">
                <el-input v-model="state.form.utilize.depart" placeholder="请输入使用部门" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="管理部门">
                <el-input v-model="state.form.utilize.management"  placeholder="请输入管理部门" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="使用人">
                <el-input v-model="state.form.utilize.user" placeholder="请输入姓名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="管理人">
                <el-input v-model="state.form.utilize.manager" placeholder="请输入管理人" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="是否共享共用">
                <el-select v-model="state.form.utilize.isShare" placeholder="请选择" clearable class="w100">
                  <el-option label="是" value=true></el-option>
                  <el-option label="否" value=false></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="124" :sm="52" :md="38" :lg="26" :xl="20" class="mb20">
              <el-form-item label="照片">
                <el-upload
                    v-if="state.method=='add'"
                    class="upload-demo"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    multiple
                    :limit="3"
                >
                  <el-button type="primary">上传</el-button>
                </el-upload>
                <div v-else v-for="(item) in state.form.utilize.img">
                  <img :src="item">
                </div>

              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="备注">
                <el-input v-model="state.form.utilize.remark" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-text class="mx-1" type="success" size="large">特性信息</el-text>
        <el-form :model="state.form" size="default" label-width="100px" class="mt35 mb35">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="权属性质">
                <el-input v-model="state.form.features.quality" placeholder="请输入权属性质" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="产权形式">
                <el-select v-model="state.form.features.format" placeholder="请选择" clearable class="w100">
                  <el-option label="计算机 / 互联网 / 通信" value="1"></el-option>
                  <el-option label="生产 / 工艺 / 制造" value="2"></el-option>
                  <el-option label="医疗 / 护理 / 制药" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="权属证明">
                <el-upload
                    v-if="state.method=='add'"
                    class="upload-demo"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    multiple
                    :limit="3"
                >
                  <el-button type="primary">上传</el-button>
                </el-upload>
                <a v-else :href="state.form.features.certificate">点击下载查看</a>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="权属证号">
                <el-input v-model="state.form.features.certificateId" placeholder="请输入权属证号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="发证日期">
                <el-input v-model="state.form.features.certificateDate" placeholder="请输入发证日期" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="权属人">
                <el-input v-model="state.form.features.owner" placeholder="请输入姓名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="权属面积">
                <el-input v-model="state.form.features.ownerArea" placeholder="请输入面积" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="使用权类型">
                <el-input v-model="state.form.features.usufructClssify" placeholder="请选择" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="独用面积">
                <el-input v-model="state.form.features.singleUseArea" placeholder="请输入面积" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="分摊面积">
                <el-input v-model="state.form.features.apportionArea" placeholder="请输入面积" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="坐落位置">
                <el-input v-model="state.form.features.address" placeholder="请输入地址" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="在用价值">
                <el-input v-model="state.form.features.useValue" placeholder="请输入金额（元）" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="在用面积">
                <el-input v-model="state.form.features.useArea" placeholder="请输入面积" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="出借价值">
                <el-input v-model="state.form.features.lendValue" placeholder="请输入金额（元）" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="出借面积">
                <el-input v-model="state.form.features.lendArea" placeholder="请输入面积" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="出租价值">
                <el-input v-model="state.form.features.hireValue" placeholder="请输入金额（元）" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="出租面积">
                <el-input v-model="state.form.features.hireArea" placeholder="请输入面积" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="闲置价值">
                <el-input v-model="state.form.features.idleValue" placeholder="请输入金额（元）" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="闲置面积">
                <el-input v-model="state.form.features.idleArea" placeholder="请输入面积" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="待处置价值">
                <el-input v-model="state.form.features.disposeValue" placeholder="请输入金额（元）" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="待处置面积">
                <el-input v-model="state.form.features.disposeArea" placeholder="请输入面积" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-text class="mx-1" type="success" size="large">处置信息</el-text>
        <el-form :model="state.form" size="default" label-width="100px" class="mt35 mb35">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="处置形式">
                <el-select v-model="state.form.disposal.format" placeholder="请选择" clearable class="w100">
                  <el-option label="计算机 / 互联网 / 通信" value="1"></el-option>
                  <el-option label="生产 / 工艺 / 制造" value="2"></el-option>
                  <el-option label="医疗 / 护理 / 制药" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="处置渠道">
                <el-input v-model="state.form.disposal.channel" placeholder="请输入处置渠道" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="处置时间">
                <el-input v-model="state.form.disposal.date"  placeholder="请输入处置时间" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
              <el-form-item label="处置收益">
                <el-input v-model="state.form.disposal.benefit" placeholder="请输入处置收益" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item>
            <el-button type="primary">
              <el-icon><Plus /></el-icon>
              添加
            </el-button>
          </el-form-item>
        </el-col>
      </el-card>
    </el-scrollbar>

  </div>
</template>

<script setup lang="ts" name="pagesListAdapt">
import {onMounted, reactive} from 'vue';
import {ArrowLeft, Plus} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import {data1} from './mock'
// 定义变量内容
const router = useRouter();
const route  = useRoute();
const state = reactive({
  form: {
    basic:{
      id:0,
      classify:'',
      unitSub:'',
      name:'',
      nu_area:'',
      projectCode:'',
      unit:'',
      orgFoam:'',
      obMethod:'',
      obDate:'',
      use:'',
      useDate:'',
      passOrg:''
    },
    finance:{
      classify:'',
      finAllocation:0,
      allocation:0,
      originalValue:0,
      price:0,
      recordedStatus:'',
      recordedDate:'',
      recordedId:'',
      otherStatus:'',
      otherMethod:'',
      otherTime:'',
      otherValue:0,
      residualValueRate:'',
      otherHad:'',
      otherTotal:0,
      netValue:0,
      header:''
    },
    utilize:{
      status:'',
      main:'',
      depart:'',
      management:'',
      user:'',
      manager:'',
      isShare:false,
      img:[],
      remark:''
    },
    features:{
      quality:'',
      format:'',
      certificate:'',
      certificateId:'',
      certificateDate:'',
      owner:'',
      ownerArea:0,
      usufructClssify:'',
      singleUseArea:0,
      apportionArea:0,
      address:'',
      useValue:0,
      useArea:0,
      lendValue:0,
      lendArea:0,
      hireValue:0,
      hireArea:0,
      idleValue:0,
      idleArea:0,
      disposeValue:0,
      disposeArea:0
    },
    disposal:{
      format:'',
      channel:'',
      date:'',
      benefit:''
    }
  },
  method:route.query.operation,
  landId:route.query.id
});

const backFront = ()=>{
  router.back()
}
const getFormData = () => {
  if(state.method=='edit'){
    state.form = data1[0]
  }
}
onMounted(() => {
  getFormData()
});
</script>
<style>
.close {
  position: absolute;
  margin-left: 95%;

}
</style>