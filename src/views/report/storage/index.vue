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
  const data = [];
  let startIndex = 1;
  const years = ['2018','2019','2020','2021','2022'];
  let startYear = years[startIndex]
  for (let i = 0; i < 7; ++i) {
    data.push(Math.round(Math.random() * 200));
  }
  const option = {
    xAxis: {
      max: 'dataMax'
    },
    yAxis: {
      type: 'category',
      data: ['房产', '门店', '股票', '期权', '家具','电器','IT'],
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      max: 6 // only the largest 3 bars will be displayed
    },
    series: [
      {
        realtimeSort: true,
        name: '存量',
        type: 'bar',
        data: data,
        color:'skyblue',
        label: {
          show: true,
          position: 'right',
          valueAnimation: true
        }
      }
    ],
    legend: {
      show: true
    },
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
    graphic: {
      elements: [
        {
          type: 'text',
          right: 160,
          bottom: 0,
          style: {
            text: state.year,
            font: 'bolder 40px monospace',
            fill: 'rgba(100, 100, 100, 0.25)'
          },
          z: 100
        }
      ]
    }
  };
  myChart.setOption(option);
  function run() {
    state.year +=1;
    for (let i = 0; i < data.length; ++i) {
      if (Math.random() > 0.9) {
        data[i] += Math.round(Math.random() * 2000);
      } else {
        data[i] += Math.round(Math.random() * 200);
      }
    }
    myChart.setOption({
      series: [
        {
          type: 'bar',
          data
        }
      ],
      graphic: {
        elements: [
          {
            type: 'text',
            right: 160,
            bottom: 0,
            style: {
              text: state.year,
              font: 'bolder 40px monospace',
              fill: 'rgba(100, 100, 100, 0.25)'
            },
            z: 100
          }
        ]
      }
    });
  }
  setTimeout(function () {
    run();
  }, 0);
  setInterval(function () {
    run();
  }, 3000);
};
const initChartsRightOne = () => {
  const myChart = echarts.init(chartsRightOneRef.value)
  const option = {
    legend: {
      data: ['房产', '门店', '股票', '期权', '其他']
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        animation: false,
        label: {
          position: 'right',
          formatter: '{b}'
        },
        draggable: true,
        data: data3.nodes.map(function (node, idx) {
          node.id = idx;
          return node;
        }),
        categories: data3.categories,
        force: {
          edgeLength: 5,
          repulsion: 20,
          gravity: 0.2
        },
        edges: data3.links
      }
    ]
  };
  myChart.setOption(option);
};

const initEchartsLeftOne = async ()=> {
  const myChart = echarts.init(chartsLeftOneRef.value)
  const app = {
    count:0
  };
  const categories = (function () {
    let now = new Date();
    let res = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    let len = 10;
    return res;
  })();
  const categories2 = (function () {
    let res = [];
    let len = 10;
    while (len--) {
      res.push(10 - len - 1);
    }
    return res;
  })();
  const data = (function () {
    let res = [];
    let len = 10;
    while (len--) {
      res.push(Math.round(Math.random() * 1000));
    }
    return res;
  })();
  const data2 = (function () {
    let res = [];
    let len = 0;
    while (len <= 11) {
      res.push(+(Math.random() * 10 + 5).toFixed(1));
      len++;
    }
    return res;
  })();
  const option = {
    title: {
      text: '资产库存'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#283b56'
        }
      }
    },
    legend: {},
    dataZoom: {
      show: false,
      start: 0,
      end: 100
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        data: categories
      },
      {
        type: 'category',
        boundaryGap: true,
        data: categories2
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        name: 'Num',
        max: 30,
        min: 0,
        boundaryGap: [0.2, 0.2]
      },
      {
        type: 'value',
        scale: true,
        name: 'Value',
        max: 1200,
        min: 0,
        boundaryGap: [0.2, 0.2]
      }
    ],
    series: [
      {
        name: '库存总量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data
      },
      {
        name: '库存总价值',
        type: 'line',
        data: data2
      }
    ]
  };
  app.count = 11;
  myChart.setOption(option);
  setInterval(() => {
    if(state.axisData>12)
      state.axisData=1
    data.shift();
    data.push(Math.round(Math.random() * 1000));
    data2.shift();
    data2.push(+(Math.random() * 10 + 5).toFixed(1));
    categories.shift();
    categories.push(state.axisData+'月');
    categories2.shift();
    categories2.push(app.count++);
    myChart.setOption({
      xAxis: [
        {
          data: categories
        },
        {
          data: categories2
        }
      ],
      series: [
        {
          data: data
        },
        {
          data: data2
        }
      ]
    });
    state.axisData+=1
  }, 2100);

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
