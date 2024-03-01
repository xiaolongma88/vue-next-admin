<template>
  <el-scrollbar height="1400" :always="false" >
    <div class="chart-scrollbar layout-padding">
      <div class="chart-warp layout-padding-auto layout-padding-view">
        <div class="chart-warp-top">
          <!-- 左边 -->
          <div class="big-data-down-right">
            <div class="flex-warp-item" >
              <div class="flex-warp-item-box">
                <div style="height: 100%" ref="chartsLeftOneRef" ></div>
              </div>
            </div>
          </div>
          <!-- 中间 -->
          <div class="big-data-down-center">
            <div class="big-data-down-center-one">
              <div class="big-data-down-center-one-content">
                <div style="height: 100%" ref="chartsCenterOneRef"></div>
              </div>
            </div>
          </div>

          <!-- 右边 -->
          <div class="big-data-down-right">
            <div class="flex-warp-item">
              <div class="flex-warp-item-box">
                <div class="flex-content">
                  <div style="height: 100%" ref="chartsRightOneRef"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chart-warp-bottom">
          <storesTable></storesTable>
        </div>
      </div>
    </div>
  </el-scrollbar>

</template>

<script setup lang="ts" name="chartIndex">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
import * as echarts from 'echarts';

import {data3} from './mock'
const storesTable = defineAsyncComponent(() => import('./storesTable.vue'))

// 定义变量内容
const chartsCenterOneRef = ref();
const chartsRightOneRef = ref();
const chartsLeftOneRef = ref()
const state = reactive({
	myCharts: [] ,
  axisData:1,
  year:2015
});

// 初始化
const initChartsCenterOne = () => {
  const myChart = echarts.init(chartsCenterOneRef.value)
  function randomData() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        Math.round(value)
      ]
    };
  }
  let data = [];
  let now = new Date(1997, 9, 3);
  let oneDay = 24 * 3600 * 1000;
  let value = Math.random() * 1000;
  for (let i = 0; i < 1000; i++) {
    data.push(randomData());
  }
  const option = {
    title: {
      text: '使用量变化'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0];
        var date = new Date(params.name);
        return (
            date.getDate() +
            '/' +
            (date.getMonth() + 1) +
            '/' +
            date.getFullYear() +
            ' : ' +
            params.value[1]
        );
      },
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        showSymbol: false,
        data: data
      }
    ]
  };
  myChart.setOption(option)
  setInterval(function () {
    for (let i = 0; i < 5; i++) {
      data.shift();
      data.push(randomData());
    }
    myChart.setOption({
      series: [
        {
          data: data
        }
      ]
    });
  }, 1000);
};
const initChartsRightOne = () => {
  const myChart = echarts.init(chartsRightOneRef.value)

  const option ={}
  myChart.setOption(option);
};

const initEchartsLeftOne = async ()=> {
  const myChart = echarts.init(chartsLeftOneRef.value)
  let base = +new Date(1968, 9, 3);
  let oneDay = 24 * 3600 * 1000;
  let date = [];
  let data = [Math.random() * 300];
  for (let i = 1; i < 20000; i++) {
    var now = new Date((base += oneDay));
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'center',
      text: '维修次数'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 10
      },
      {
        start: 0,
        end: 10
      }
    ],
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(255, 70, 131)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 158, 68)'
            },
            {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }
          ])
        },
        data: data
      }
    ]
  };
  myChart.setOption(option);

}

const initEchartsLeftTwo =()=>{

}
const initChartsRightTwo = ()=>{

}

// 页面加载时
onMounted(() => {
  initEchartsLeftOne();
  initEchartsLeftTwo();
	initChartsCenterOne();
	initChartsRightOne()
  initChartsRightTwo();
})
// 由于页面缓存原因，keep-alive

// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
</script>

<style scoped lang="scss">
@import './chart.scss';
</style>
