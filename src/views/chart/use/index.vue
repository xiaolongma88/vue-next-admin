<template>
	<div class="chart-scrollbar layout-padding">
		<div class="chart-warp layout-padding-auto layout-padding-view">
			<div class="chart-warp-bottom">
				<!-- 左边 -->
				<div class="big-data-down-left">
					<div class="flex-warp-item-one" >
						<div class="flex-warp-item-box">
              <div style="height: 100%" ref="chartsLeftOneRef"></div>
						</div>
					</div>
					<div class="flex-warp-item-two">
						<div class="flex-warp-item-box">
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
          <div class="big-data-down-center-two">
            <div class="big-data-down-center-two-content">
              <div style="height: 100%" ref="chartsCenterTwoRef"></div>
            </div>
          </div>
				</div>
<!--右边-->
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

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import * as echarts from 'echarts';


// 定义变量内容
const chartsCenterOneRef = ref();
const chartsCenterTwoRef = ref();
const chartsRightOneRef = ref();
const chartsLeftOneRef = ref()
const chartsRightTwoRef = ref()
const chartsLeftTwoRef = ref()
const state = reactive({
	myCharts: [] ,
});

// 初始化
const initChartsCenterOne = () => {
  const option = {
    title: [
      {
        text: '2023',
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十一月','十二月']
    },
    series: [
      {
        name: '使用',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [320, 302, 301, 334, 390, 330, 320,220,330,349,350,310]
      },
      {
        name: '空闲',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210,110,120,250,240,300]
      },
      {
        name: '维护',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [20, 12, 21, 34, 90, 30, 30,50,40,60,70,35]
      },
    ]
  };
  const myChart = echarts.init(chartsCenterOneRef.value);
  myChart.setOption(option);
};
const initChartsCenterTwo = ()=>{
  const myChart = echarts.init(chartsCenterTwoRef.value);
  const app = {
    configParameters:{},
    config:{
      rotate:0,
      position:'',
      distance:0,
      align:'',
      verticalAlign:'',
    }
  };
  const posList = [
    'left',
    'right',
    'top',
    'bottom',
    'inside',
    'insideTop',
    'insideLeft',
    'insideRight',
    'insideBottom',
    'insideTopLeft',
    'insideTopRight',
    'insideBottomLeft',
    'insideBottomRight'
  ];
  app.configParameters = {
    rotate: {
      min: -90,
      max: 90
    },
    align: {
      options: {
        left: 'left',
        center: 'center',
        right: 'right'
      }
    },
    verticalAlign: {
      options: {
        top: 'top',
        middle: 'middle',
        bottom: 'bottom'
      }
    },
    position: {
      options: posList.reduce(function (map, pos) {
        map[pos] = pos;
        return map;
      }, {})
    },
    distance: {
      min: 0,
      max: 100
    }
  };
  app.config = {
    rotate: 90,
    align: 'left',
    verticalAlign: 'middle',
    position: 'insideBottom',
    distance: 15,
  };
  const labelOption = {
    show: true,
    position: app.config.position,
    distance: app.config.distance,
    align: app.config.align,
    verticalAlign: app.config.verticalAlign,
    rotate: app.config.rotate,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
      name: {}
    }
  };
  const option = {
    title: [
      {
        text: '历年趋势',
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['使用', '空闲', '维护']
    },

    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['2019', '2020', '2021', '2022', '2023']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '使用',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: [320, 332, 301, 334, 390]
      },
      {
        name: '空闲',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290]
      },
      {
        name: '维护',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: [150, 232, 201, 154, 190]
      },
    ]
  };
  myChart.setOption(option);
}
const initChartsRightOne = () => {
	const myChart = echarts.init(chartsRightOneRef.value);
	const option = {
    title: [
      {
        text: '状态趋势',
        left:'center'
      },
    ],
		grid: {
			top: 15,
			right: 15,
			bottom: 20,
			left: 30,
		},
		tooltip: {
			trigger: 'axis',
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['7月', '8月', '9月', '10月', '11月', '12月', '1月'],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: '使用',
				type: 'line',
				stack: '总量',
				data: [50, 32, 40, 74, 90, 63, 91],
			},
			{
				name: '空闲',
				type: 'line',
				stack: '总量',
				data: [32, 42, 51, 34, 20, 10, 20],
			},
			{
				name: '维护',
				type: 'line',
				stack: '总量',
				data: [12, 22, 18, 14, 20, 15, 20],
			},
		],
	};
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
const initEchartsLeftOne =()=>{
  const myChart = echarts.init(chartsLeftOneRef.value);
  const option = {
    title: [
      {
        text: '当前资产状态比',
      },
    ],
    angleAxis: {},
    radiusAxis: {
      type: 'category',
      data: ['房产', '门店', '期权', '家具','电器'],
      z: 10
    },
    polar: {},
    series: [
      {
        type: 'bar',
        data: [1, 2, 3, 4,5],
        coordinateSystem: 'polar',
        name: '使用',
        stack: 'a',
        emphasis: {
          focus: 'series'
        }
      },
      {
        type: 'bar',
        data: [2, 4, 6, 8,5],
        coordinateSystem: 'polar',
        name: '空闲',
        stack: 'a',
        emphasis: {
          focus: 'series'
        }
      },
      {
        type: 'bar',
        data: [1, 2, 3, 4,10],
        coordinateSystem: 'polar',
        name: '维护',
        stack: 'a',
        emphasis: {
          focus: 'series'
        }
      }
    ],
    legend: {
      show: true,
      data: ['使用', '空闲', '维护']
    }
  };
  myChart.setOption(option);
  state.myCharts.push(myChart);
}
const initEchartsLeftTwo =()=>{
  const data = [
    {
      name: '房产',
      value: 70
    },
    {
      name: '门店',
      value: 68
    },
    {
      name: '期权',
      value: 48
    },
    {
      name: '家具',
      value: 40
    },
    {
      name: '电器',
      value: 32
    },
    {
      name: 'IT',
      value: 27
    },
  ];
  const option = {
    title: [
      {
        text: '当前状态资产比',
        left: 'center'
      },
      {
        subtext: '空闲',
        left: '16.67%',
        top: '75%',
        textAlign: 'center'
      },
      {
        subtext: '使用',
        left: '50%',
        top: '75%',
        textAlign: 'center'
      },
      {
        subtext: '维护',
        left: '83.33%',
        top: '75%',
        textAlign: 'center'
      }
    ],
    series: [
      {
        type: 'pie',
        radius: '25%',
        center: ['50%', '50%'],
        data: data,
        label: {
          position: 'outer',
          alignTo: 'none',
          bleedMargin: 5
        },
        left: 0,
        right: '66.6667%',
        top: 0,
        bottom: 0
      },
      {
        type: 'pie',
        radius: '25%',
        center: ['50%', '50%'],
        data: data,
        label: {
          position: 'outer',
          alignTo: 'labelLine',
          bleedMargin: 5
        },
        left: '33.3333%',
        right: '33.3333%',
        top: 0,
        bottom: 0
      },
      {
        type: 'pie',
        radius: '25%',
        center: ['50%', '50%'],
        data: data,
        label: {
          position: 'outer',
          alignTo: 'edge',
          margin: 20
        },
        left: '66.6667%',
        right: 0,
        top: 0,
        bottom: 0
      }
    ]
  };
  const myChart = echarts.init(chartsLeftTwoRef.value);
  myChart.setOption(option);
  state.myCharts.push(myChart);
}
const initChartsRightTwo = ()=>{
  const myChart = echarts.init(chartsRightTwoRef.value);
  const option = {
    title: {
      text: '历年资产使用占比',
      top: 10,
      left: 10
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll',
      bottom: 10,
      data: (function () {
        const list = [];
        for (let i = 1; i <= 24; i++) {
          list.push(i + 2000 + '');
        }
        return list;
      })()
    },
    visualMap: {
      top: 'middle',
      right: 10,
      color: ['red', 'yellow'],
      calculable: true
    },
    radar: {
      indicator: [
        { text: '房产', max: 400 },
        { text: '门店', max: 400 },
        { text: '股票', max: 400 },
        { text: '期权', max: 400 },
        { text: '电器', max: 400 },
        { text: '家具', max: 400 },
        { text: 'IT', max: 400 }
      ]
    },
    series: (function () {
      const series = [];
      for (let i = 1; i <= 28; i++) {
        series.push({
          type: 'radar',
          symbol: 'none',
          lineStyle: {
            width: 1
          },
          emphasis: {
            areaStyle: {
              color: 'rgba(0,250,0,0.3)'
            }
          },
          data: [
            {
              value: [
                (40 - i) * 10,
                (38 - i) * 4 + 60,
                i * 5 + 10,
                i * 9,
                (i * i) / 2,
                (i * i*i) / 120,
                (i * i) / 3,
              ],
              name: i + 2000 + ''
            }
          ]
        });
      }
      return series;
    })()
  };
  myChart.setOption(option);
}

// 页面加载时
onMounted(() => {
  initEchartsLeftOne();
  initEchartsLeftTwo();
	initChartsCenterOne();
  initChartsCenterTwo();
	initChartsRightOne()
  initChartsRightTwo();
});

</script>

<style scoped lang="scss">
@import './chart.scss';
</style>
