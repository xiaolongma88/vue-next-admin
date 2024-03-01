<template>
  <el-scrollbar height="1000px">
    <el-button type="success" :icon="ArrowLeft" class="close" @click="backFront"> 返回 </el-button>
    <el-descriptions
      title="土地资产信息卡"
      :column="2"
      :size="size"
      border
      class="info"
  >
    <el-descriptions-item label="基本信息" span="3" label-class-name="sub-title" class-name="sub-title"></el-descriptions-item>
      <el-descriptions-item label="资产编号">kooriookami</el-descriptions-item>
      <el-descriptions-item label="单位会计科目">18100000000</el-descriptions-item>
      <el-descriptions-item label="资产分类" >Suzhou</el-descriptions-item>
      <el-descriptions-item label="资产名称">
        <el-tag size="small">School</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="数量/面积">No.1188</el-descriptions-item>
      <el-descriptions-item label="数量计量单位">No.1188</el-descriptions-item>
      <el-descriptions-item label="项目代码">001-01-00</el-descriptions-item>
      <el-descriptions-item label="采购组织形式">竞标</el-descriptions-item>
      <el-descriptions-item label="取得方式">test</el-descriptions-item>
      <el-descriptions-item label="取得日期">2024-01-01</el-descriptions-item>
      <el-descriptions-item label="资产用途">自用</el-descriptions-item>
      <el-descriptions-item label="投入使用日期">2024-05-18</el-descriptions-item>
      <el-descriptions-item label="配置批准单位" span="5" >test</el-descriptions-item>
    <el-descriptions-item label="财务信息" span="5" label-class-name="sub-title" class-name="sub-title"></el-descriptions-item>
      <el-descriptions-item label="价值类型">有形</el-descriptions-item>
      <el-descriptions-item label="经费来源" >
        <el-text class="mx-1">财政拨款:50000                非财政拨款:50000</el-text>
      </el-descriptions-item>
      <el-descriptions-item label="均价/单价">500</el-descriptions-item>
      <el-descriptions-item label="财务入账状态">已转结</el-descriptions-item>
      <el-descriptions-item label="财务入账状态">已转结</el-descriptions-item>
      <el-descriptions-item label="记账日期">2024-01-01</el-descriptions-item>
      <el-descriptions-item label="记账凭证号">1001202405186077</el-descriptions-item>
      <el-descriptions-item label="折旧/摊销状态">已折旧</el-descriptions-item>
      <el-descriptions-item label="折旧/摊销方法">转让</el-descriptions-item>
      <el-descriptions-item label="折旧/摊销年限(月)">2024-01-01</el-descriptions-item>
      <el-descriptions-item label="折旧/摊销额(月)">10000</el-descriptions-item>
      <el-descriptions-item label="残值率">73%</el-descriptions-item>
      <el-descriptions-item label="已提折旧/摊销月数">7000</el-descriptions-item>
      <el-descriptions-item label="累计折旧/摊销（元）">7000</el-descriptions-item>
      <el-descriptions-item label="净值（元）">9000</el-descriptions-item>
      <el-descriptions-item label="财务负责人">7000</el-descriptions-item>
    <el-descriptions-item label="使用信息" span="5" label-class-name="sub-title" class-name="sub-title"></el-descriptions-item>
      <el-descriptions-item label="资产状态">使用中</el-descriptions-item>
      <el-descriptions-item label="使用责任主体">xx集团</el-descriptions-item>
      <el-descriptions-item label="使用部门">xx部</el-descriptions-item>
      <el-descriptions-item label="管理部门">xx部</el-descriptions-item>
      <el-descriptions-item label="使用人">张三</el-descriptions-item>
      <el-descriptions-item label="管理人">李四</el-descriptions-item>
      <el-descriptions-item label="是否共享共用">否</el-descriptions-item>
      <el-descriptions-item label="存放地点">xx市xx区xx街xxxx</el-descriptions-item>
      <el-descriptions-item label="照片" span="5">
        <img src='https://store.is.autonavi.com/showpic/1d58380ce823596c1ae57d7c9d8a9658' class="img"/>
      </el-descriptions-item>
      <el-descriptions-item label="备注" span="5" >测试测试测试测试测试</el-descriptions-item>
    <el-descriptions-item label="特性信息" span="5" label-class-name="sub-title" class-name="sub-title"></el-descriptions-item>
      <el-descriptions-item label="权属性质">xx公司所有</el-descriptions-item>
      <el-descriptions-item label="产权形式">股权</el-descriptions-item>
      <el-descriptions-item label="权属证明"><a>点击下载查看</a></el-descriptions-item>
      <el-descriptions-item label="权属证号">GS211202405181990</el-descriptions-item>
      <el-descriptions-item label="发证日期">2024-01-01</el-descriptions-item>
      <el-descriptions-item label="权属人">xxx</el-descriptions-item>
      <el-descriptions-item label="权属面积">100平方</el-descriptions-item>
      <el-descriptions-item label="使用权类型">临时</el-descriptions-item>
      <el-descriptions-item label="独用面积">50</el-descriptions-item>
      <el-descriptions-item label="分摊面积">50</el-descriptions-item>
      <el-descriptions-item label="坐落位置" span="5">xx省xx市xx区xx街xxxx</el-descriptions-item>
      <el-descriptions-item label="在用价值（元）">7000</el-descriptions-item>
      <el-descriptions-item label="在用面积">100</el-descriptions-item>
      <el-descriptions-item label="出借价值（元）">7000</el-descriptions-item>
      <el-descriptions-item label="出借面积">50</el-descriptions-item>
      <el-descriptions-item label="出租价值（元）">12350</el-descriptions-item>
      <el-descriptions-item label="出租面积" span="5">100</el-descriptions-item>
      <el-descriptions-item label="闲置价值（元）">7000</el-descriptions-item>
      <el-descriptions-item label="闲置面积">100</el-descriptions-item>
      <el-descriptions-item label="待处置（待报废、毁损等）价值（元）">7000</el-descriptions-item>
      <el-descriptions-item label="待处置（待报废、毁损等）面积">700</el-descriptions-item>
    <el-descriptions-item label="处置信息" span="5" label-class-name="sub-title" class-name="sub-title"></el-descriptions-item>
      <el-descriptions-item label="处置形式">拍卖</el-descriptions-item>
      <el-descriptions-item label="处置渠道">xx拍卖会</el-descriptions-item>
      <el-descriptions-item label="处置时间">2024-01-01</el-descriptions-item>
      <el-descriptions-item label="处置收益">181990</el-descriptions-item>
  </el-descriptions>
  </el-scrollbar>
</template>

<script setup lang="ts" name="pagesDynamicForm">
import { reactive, ref,onMounted } from 'vue';
import {ArrowLeft, Close} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route  = useRoute();
// 定义变量内容
const size = ref('')
const state = reactive({
  landId:route.query.id
});

const backFront = ()=>{
  router.back()
}
onMounted(() => {

});
</script>
<style scoped>
.img {
  width: 20%;
}
.info {
  margin: 15px;
}
.close {
  position: absolute;
  margin-left: 95%;

}
:deep(.sub-title) {
  background: var(--el-color-success-light-9) !important;
}
.el-descriptions {
  margin-top: 20px;
}
</style>