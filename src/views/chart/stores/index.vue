<template>
	<div class="chart-scrollbar layout-padding">
		<div class="chart-warp layout-padding-auto layout-padding-view">
<!--			<div class="chart-warp-top">-->
<!--				<ChartHead />-->
<!--			</div>-->
			<div class="chart-warp-bottom">
				<!-- 左边 -->
				<div class="big-data-down-right">
					<div class="flex-warp-item" >
            <div class="flex-title">年库存总量趋势</div>
						<div class="flex-warp-item-box">
              <div style="height: 100%" ref="chartsLeftOneRef"></div>
						</div>
					</div>
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-title">年库存类别趋势</div>
							<div class="flex-content">
								<div style="height: 100%" ref="chartsLeftTwoRef"></div>
							</div>
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
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
              <div style="height: 100%" ref="chartsRightTwoRef"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="chartIndex">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import {res} from './mock'
// 引入组件
defineAsyncComponent(() => import('/@/views/chart/stores/head.vue'));
// 定义变量内容
const chartsCenterOneRef = ref();
const chartsRightOneRef = ref();
const chartsLeftOneRef = ref()
const chartsRightTwoRef = ref()
const chartsLeftTwoRef = ref()
const state = reactive({
	myCharts: [] ,
});

// 初始化中间图表1
const initChartsCenterOne = () => {
	const myChart = echarts.init(chartsCenterOneRef.value);
	const option = {
    title: {
      text: '当前库存各类别总量',
      left: 'center'
    },
    legend: {
      top: 'bottom'
    },
    toolbox: {
      show: true,
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [50, 250],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          { value: 40, name: '房产' },
          { value: 38, name: '门店' },
          { value: 32, name: '股票' },
          { value: 30, name: '期权' },
          { value: 28, name: '电器' },
          { value: 26, name: '家具' },
          { value: 22, name: 'IT' },
          { value: 18, name: '大宗商品' }
        ]
      }
    ]
  };
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
const initChartsRightOne = () => {
  const myChart = echarts.init(chartsRightOneRef  .value);
  const countries = [
    '房产',
    '门店',
    '股票',
    '期权',
    '家具',
    '电器',
    'IT',
  ];
  const datasetWithFilters = [];
  const seriesList = [];
  echarts.util.each(countries, function (country) {
    const datasetId = 'dataset_' + country;
    datasetWithFilters.push({
      id: datasetId,
      fromDatasetId: 'dataset_raw',
      transform: {
        type: 'filter',
        config: {
          and: [
            { dimension: 'Year', gte: 2000 },
            { dimension: 'Country', '=': country }
          ]
        }
      }
    });
    seriesList.push({
      type: 'line',
      datasetId: datasetId,
      showSymbol: false,
      name: country,
      endLabel: {
        show: true,
        formatter: function (params) {
          return params.value[3] + ': ' + params.value[0];
        }
      },
      labelLayout: {
        moveOverlap: 'shiftY'
      },
      emphasis: {
        focus: 'series'
      },
      encode: {
        x: 'Year',
        y: 'Income',
        label: ['Country', 'Income'],
        itemName: 'Year',
        tooltip: ['Income']
      }
    });
  });
  const option = {
    animationDuration: 10000,
    dataset: [
      {
        id: 'dataset_raw',
        source: res
      },
      ...datasetWithFilters
    ],
    title: {
      text: '历年库存动态'
    },
    tooltip: {
      order: 'valueDesc',
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      nameLocation: 'middle'
    },
    yAxis: {
      name: 'num'
    },
    grid: {
      right: 70,
      bottom:30
    },
    series: seriesList
  };
  myChart.setOption(option);
};

// 批量设置 echarts resize
const initEchartsLeftOne =()=>{
  const series = [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      stack: 'a',
      name: 'a'
    },
    {
      data: [10, 46, 64, '-', 0, '-', 0],
      type: 'bar',
      stack: 'a',
      name: 'b'
    },
    {
      data: [30, '-', 0, 20, 10, '-', 0],
      type: 'bar',
      stack: 'a',
      name: 'c'
    },
    {
      data: [30, '-', 0, 20, 10, '-', 0],
      type: 'bar',
      stack: 'b',
      name: 'd'
    },
    {
      data: [10, 20, 150, 0, '-', 50, 10],
      type: 'bar',
      stack: 'b',
      name: 'e'
    }
  ];
  const stackInfo = {};
  for (let i = 0; i < series[0].data.length; ++i) {
    for (let j = 0; j < series.length; ++j) {
      const stackName = series[j].stack;
      if (!stackName) {
        continue;
      }
      if (!stackInfo[stackName]) {
        stackInfo[stackName] = {
          stackStart: [],
          stackEnd: []
        };
      }
      const info = stackInfo[stackName];
      const data = series[j].data[i];
      if (data && data !== '-') {
        if (info.stackStart[i] == null) {
          info.stackStart[i] = j;
        }
        info.stackEnd[i] = j;
      }
    }
  }
  for (let i = 0; i < series.length; ++i) {
    const data = series[i].data;
    const info = stackInfo[series[i].stack];
    for (let j = 0; j < series[i].data.length; ++j) {
      // const isStart = info.stackStart[j] === i;
      const isEnd = info.stackEnd[j] === i;
      const topBorder = isEnd ? 20 : 0;
      const bottomBorder = 0;
      data[j] = {
        value: data[j],
        itemStyle: {
          borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
        }
      };
    }
  }
  const option = {
    xAxis: {
      type: 'category',
      data: ['2017', '2018', '2019', '2020', '2021', '2022', '2023']
    },
    yAxis: {
      type: 'value'
    },
    series: series
  };
  const myChart = echarts.init(chartsLeftOneRef.value);
  myChart.setOption(option);
  state.myCharts.push(myChart);
}
const initEchartsLeftTwo =()=>{
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['2017', '2018', '2019', '2020', '2021', '2022', '2023']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        label: {
          show: true,
          position: 'top'
        },
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  };
  const myChart = echarts.init(chartsLeftTwoRef.value);
  myChart.setOption(option);
}
const initChartsRightTwo = ()=>{
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['7月', '8月', '9月', '10月', '11月', '12月', '1月']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Email',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Search Engine',
        type: 'bar',
        data: [862, 1018, 964, 1026, 1679, 1600, 1570],
        emphasis: {
          focus: 'series'
        },
        markLine: {
          lineStyle: {
            type: 'dashed'
          },
          data: [[{ type: 'min' }, { type: 'max' }]]
        }
      },
      {
        name: 'Baidu',
        type: 'bar',
        barWidth: 5,
        stack: 'Search Engine',
        emphasis: {
          focus: 'series'
        },
        data: [620, 732, 701, 734, 1090, 1130, 1120]
      },
      {
        name: 'Google',
        type: 'bar',
        stack: 'Search Engine',
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 290, 230, 220]
      },
      {
        name: 'Bing',
        type: 'bar',
        stack: 'Search Engine',
        emphasis: {
          focus: 'series'
        },
        data: [60, 72, 71, 74, 190, 130, 110]
      },
      {
        name: 'Others',
        type: 'bar',
        stack: 'Search Engine',
        emphasis: {
          focus: 'series'
        },
        data: [62, 82, 91, 84, 109, 110, 120]
      }
    ]
  };

  const myChart = echarts.init(chartsRightTwoRef.value);
  myChart.setOption(option);
}

// 页面加载时
onMounted(() => {
  initEchartsLeftOne();
  initEchartsLeftTwo();
	initChartsCenterOne();
	initChartsRightOne()
  initChartsRightTwo();
});
// 由于页面缓存原因，keep-alive

// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
</script>

<style scoped lang="scss">
@import './chart.scss';
</style>
