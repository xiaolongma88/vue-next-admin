<script setup>
import {defineAsyncComponent, onMounted, onUnmounted, reactive, watch} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import {shallowRef} from '@vue/reactivity'
import {useRouter} from "vue-router";


const router = useRouter();
const detail = ()=>import('./detail.vue')
let map = shallowRef(null);
const state = reactive({
  options: {
    hideWithoutStyle: false,//是否隐藏设定区域外的楼块
    areas: []
  },
  cardList:[
    {
      img: "http://www.cnjnjg.com/uploadfile/2023/0521/20230521092637273.jpg",
      status:1,
      value:199999,
      id:'GS123220200101123',
      assetName:'龙奥大厦',
      assetAddr:'济南市历下区龙鼎大道1号',
      position:[117.120168,36.650094],
      area:[[117.116831,36.65405], [117.116831,36.650099], [117.12344,36.650091], [117.123418,36.654041]]
    },
    {
      img: "https://pcdn.huanyule.com/public/uploads/202001/16/A7XIWYGMSP.jpg",
      status:1,
      value:199999,
      id:'GS1232202001011235',
      assetName:'奥体中心体育馆',
      assetAddr:'济南市历下区经十东路',
      position:[117.120308,36.656973],
      area:[[117.111488,36.659285],[117.111456,36.657856],[117.113441,36.654215],[117.127238,36.654267],[117.12889,36.657111],[117.129083,36.659693]]
    },
    {
      img:'https://pic4.ajkimg.com/display/xinfang/7126f4caa577b5c1a227fc4687e92548/412x297x50c@2x.jpg?t=5',
      status:1,
      value:199999,
      id:'GS1232202001011236',
      assetName:'凤凰国际北区8号楼',
      assetAddr:'济南市历城区华奥路与椒山路交叉口西南200米',
      position: [117.162133,36.653077],
      area:[[117.161844,36.653274],[117.161838,36.652922],[117.162353,36.652879],[117.162402,36.653262]]
    },
    {
      img:'https://pic4.ajkimg.com/display/xinfang/7e753af31a37d72e6391dde6b77c3aaa/500x500c.jpg?t=1',
      assetName:'济南龙奥公寓',
      assetAddr:'济南市历城区龙奥北路海信龙奥九号4号楼',
      id:'GS1232202001011237',
      status: 1,
      value:199999,
      position:[117.13791,36.654457],
      area:[[117.137631,36.655202],[117.137647,36.654431],[117.138425,36.654479],[117.138376,36.655185]]
    },
    {
      img:'https://pic1.ajkimg.com/display/ajk/e6faf2c70fe7af46373de55a5a1210fd/800x600.jpg',
      assetName:'东城逸家逸秀园2区4号楼',
      assetAddr:'济南市历城区舜义路1069号',
      id:'GS1232202001011238',
      status: 1,
      value:199999,
      position:[117.136113,36.652092],
      area:[[117.135818,36.652256],[117.135867,36.651864],[117.136462,36.65183],[117.136494,36.652312]]
    },
    {
      img:'https://store.is.autonavi.com/showpic/c8898e6d55cca2c0137daba5406d18f7?type=pic',
      assetName:'城投济南环贸中心',
      assetAddr:'济南市历下区高新经十路与舜义路交汇处东南侧',
      id:'GS1232202001011239',
      status: 1,
      value:199999,
      position:[117.135223,36.65774],
      area:[[117.133984,36.657085],[117.133152,36.655282],[117.137208,36.655295],[117.137149,36.657412]]
    },
    {
      img:'https://store.is.autonavi.com/showpic/001256b0ce1120163940bc65ddbe85d7?type=pic',
      assetName:'万科金域国际天泰家园',
      assetAddr:'济南市历下区经十东路与舜华路交汇处',
      id:'GS1232202001011240',
      status: 1,
      value:199999,
      position:[117.13771,36.662099],
      area:[[117.135983,36.662142],[117.136895,36.660696],[117.138209,36.661303],[117.137109,36.662959],[117.136729,36.663093]]
    },
    {
      img:'https://store.is.autonavi.com/showpic/1d58380ce823596c1ae57d7c9d8a9658',
      assetName:'济高控股大厦',
      assetAddr:'济南市历城区舜泰路与舜泰中路交叉口东南40米',
      id:'GS1232202001011241',
      status: 1,
      value:199999,
      position:[117.14464,36.663764],
      area:[[117.144355,36.664233],[117.144511,36.663639],[117.145525,36.664268],[117.145117,36.66481]]
    }
  ],
  currentCard:{},
  map:Object,
  markerList:[],
  showInfo:false,
  focusOn:[],
  refKeyOne:0,
  refKeyTwo:0
});



onMounted(() => {
  router.addRoute({path: '/chart/map/detail', component: detail})
  AMapLoader.load({
    key: "ea71a4ff34d1b73237b49c212a04c8a7", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      //初始化配置
      const buildingLayer = new AMap.Buildings({zIndex:130,merge:false,sort:false,zooms:[17,20]});
      map = new AMap.Map("container", {
        pitch: 50,
        zooms: [2, 20],
        rotateEnable: true,
        pitchEnable: true,
        viewMode: "3D",
        zoom: 17,
        center: [117.12013,36.652066],
        mapStyle:'amap://styles/light',
        layers:[
          new AMap.TileLayer(),
          buildingLayer,
        ]
      });
      state.map=map
      // 设置覆盖物
      setMarker()
      setAreas(buildingLayer)
      //绑定事件
      map.on('click', clickHandler);
      map.on('mapmove', mapMove);
    })
    .catch((e) => {
      console.log(e);
    });

});

const setMarker=()=>{
  state.markerList=[]
  for (const item of state.cardList) {
    const marker = new AMap.Marker({
      position: new AMap.LngLat(item.position[0],item.position[1]),
    });
    marker.on('click', clickHandler);
    state.markerList.push(marker)
  }
  state.map.add(state.markerList)

}
const setAreas=(buildingLayer)=>{
  for (const item of state.cardList) {
    const area={
      rejectTexture: true,//是否屏蔽自定义地图的纹理
      color1: 'ffffff00',//楼顶颜色
      color2: 'ffffcc00',//楼面颜色
      path:item.area
    }
    state.options.areas.push(area)
  }
  buildingLayer.setStyle(state.options);
  for (let i=0;i<state.options.areas.length;i++){
    new AMap.Polygon({
      bubble:true,
      fillOpacity:0.4,
      strokeWeight:1,
      path:state.options.areas[i].path,
      map:map
    })
  }

}
const clickHandler = (e)=> {
  const position = [e.target.w.position.lng,e.target.w.position.lat]
  let card = {}
  for (const item of state.cardList) {
    for(let i =0;i<position.length;i++){
      if(position[i]===item.position[i]){
        card = item;
      }
    }
  }
  router.push({path: '/chart/map/detail', query: {id: card.id}});
};
const mapMove=()=>{
  state.showInfo = false
}
const cardClick=(card)=>{
  state.focusOn = card.position
  state.showInfo = true
  state.refKeyOne+=1

  state.currentCard =card
}
const showCard=()=>{
  state.showInfo = false
  state.refKeyTwo +=1
}
watch(
    ()=>state.focusOn,
    ()=>{
      state.map.setCenter(state.focusOn)
    }
)

onUnmounted(() => {
  map?.destroy();

});
</script>

<template>
  <div id="container"></div>
  <div class="floating-cards" v-if="!state.showInfo" :key="state.refKeyTwo">
    <el-scrollbar height="800px" >
      <p v-for="(item, index) in state.cardList" :key="item.assetName">
        <el-card :body-style="{ padding: '0' }" class="card" @click="cardClick(item)">
          <div class="card-top">
            <img :src='item.img' class="image"/>
            <div style="padding: 5px 5px 5px 10px;display: flex;flex-direction: column;" >
              <el-text class="mx-1 item" >{{item.assetName}}</el-text>
              <el-text class="mx-1 value" size="small" style="text-align: left;color: red;">估值:{{item.value}}</el-text>
            </div>
          </div>
          <div class="bottom">
            <el-text class="mx-1 addr" type="info">{{item.assetAddr}}</el-text>
            <el-tag class="ml-2" type="success">使用中</el-tag>
          </div>
        </el-card>
      </p>
    </el-scrollbar>

  </div>
  <div class="floating-info" v-if="state.showInfo" :key="state.refKeyOne">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="state.currentCard.img" class="info-image"/>
        <div style="padding: 5px 5px 5px 10px;display: flex;flex-direction: column;" >
          <div>
            <el-text class="mx-1 item" >{{state.currentCard.assetName}}</el-text>
            <el-tag class="ml-2" type="success">使用中</el-tag>
          </div>

          <el-text class="mx-1" size="small">子资产：test1,test2,test3,test4,test3,test4,test5,test6,test7</el-text>
          <div class="bottom">
            <el-text class="mx-1" type="info">{{state.currentCard.assetAddr}}</el-text>
            <el-button type="primary" :icon="ArrowLeft" @click="showCard()">返回</el-button>
          </div>
        </div>
      </el-card>
  </div>

</template>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}
.floating-cards {
  position: absolute;
  margin-top: 5px;
  margin-left: 83.2%;
  width: 250px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  z-index: 1000;
}
.floating-info {
  position: absolute;
  margin-top: 5px;
  margin-left: 80%;
  width: 300px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  z-index: 1000;
}


.image {
  width: 40%;
  display: block;
}
.card{
  display: flex;
  flex-direction: column;

}
.card-top{
  display: flex;
}
.item{
  margin: 5px;
}
.bottom {
  padding: 0 5px 0 0;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.addr {
  padding: 5px;
  font-size:12px;
}
.info-image {
  width: 100%;
  display: block;
}
</style>
