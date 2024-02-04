<template>
	<div class="chart-scrollbar layout-padding">
		<div class="chart-warp layout-padding-auto layout-padding-view">
			<div class="chart-warp-bottom">
				<!-- 左边 -->
				<div class="big-data-down-left">
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-content">
                <div style="height: 100%" ref="chartsLeftOneRef"></div>
							</div>
						</div>
					</div>
					<div class="flex-warp-item">
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
              <div class="flex-title">租期到期提醒</div>
              <el-carousel :interval="1500" type="card" height="200px" :autoplay="true">
                <el-carousel-item v-for="item in state.cardList" :key="item.assetName">
                  <el-card style="width: 100%;height: 100%;display: flex;flex-direction: column;margin:  0" >
                    <div style="display: flex;">
                      <img :src='item.img' style="width: 40%;height:  40%; display: block;"/>
                      <div style="padding: 5px 5px 5px 10px;display: flex;flex-direction: column;" >
                        <el-text class="mx-1 item" >{{item.assetName}}</el-text>
                        <el-text class="mx-1 value" size="small" style="text-align: left;color: red;">估值:{{item.value}}</el-text>
                      </div>
                    </div>
                    <div class="bottom">
                      <el-text class="mx-1 addr" type="info">{{item.assetAddr}}</el-text>
                    </div>
                  </el-card>
                </el-carousel-item>
              </el-carousel>
              <el-scrollbar ref="scrollbarRef" height="55%" :always="false" @scroll="scroll">
                <div ref="innerRef">
                  <p v-for="item in state.allLists" :key="item" class="scrollbar-demo-item">
                    {{ item.assetName }}<span style="color: red;margin-left: 20px">租期到期时间:{{item.date}}</span>
                  </p>
                </div>
              </el-scrollbar>
						</div>
					</div>
					<div class="big-data-down-center-two">
						<div class="flex-warp-item-box">
							<div class="flex-title">
								<span>设备监测</span>
								<span class="flex-title-small">单位：次</span>
							</div>
							<div class="flex-content">
								<div class="flex-content-left">
									<div class="monitor-item" v-for="(v, k) in state.chartData4List" :key="k">
										<div class="monitor-wave">
											<div class="monitor-z-index">
												<div class="monitor-item-label">{{ v.label }}</div>
											</div>
										</div>
									</div>
								</div>
								<div class="flex-content-right">
									<div style="height: 100%" ref="chartsMonitorRef"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 右边 -->
				<div class="big-data-down-right">
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-title">
								<span>故障统计</span>
								<span class="flex-title-small">单位：次</span>
							</div>
							<div class="flex-content">
								<div style="height: 100%" ref="chartsSevenDaysRef"></div>
							</div>
						</div>
					</div>
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-title">设备状态统计</div>
							<div class="flex-content">
								<div class="task">
									<div class="task-item task-first-item">
										<div class="task-item-value task-first">25</div>
										<div class="task-item-label">待办任务</div>
									</div>
									<div class="task-item">
										<div class="task-item-box task1">
											<div class="task-item-value">12</div>
											<div class="task-item-label">保养</div>
										</div>
									</div>
									<div class="task-item">
										<div class="task-item-box task2">
											<div class="task-item-value">3</div>
											<div class="task-item-label">维修</div>
										</div>
									</div>
									<div class="task-item">
										<div class="task-item-box task3">
											<div class="task-item-value">5</div>
											<div class="task-item-label">更换</div>
										</div>
									</div>
								</div>
								<div class="progress">
									<div class="progress-item">
										<span>维修率</span>
										<div class="progress-box">
											<el-progress :percentage="70" color="#43bdf0"></el-progress>
										</div>
									</div>
									<div class="progress-item">
										<span>故障率</span>
										<div class="progress-box">
											<el-progress :percentage="36" color="#43bdf0"></el-progress>
										</div>
									</div>
									<div class="progress-item">
										<span>更换</span>
										<div class="progress-box">
											<el-progress :percentage="91" color="#43bdf0"></el-progress>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="flex-warp-item">
						<div class="flex-warp-item-box">
							<div class="flex-title">
								<span>更换设备量记录</span>
								<span class="flex-title-small">单位：件</span>
							</div>
							<div class="flex-content">
								<div style="height: 100%" ref="chartsInvestmentRef"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="chartIndex">
import { reactive, onMounted, watch, nextTick, onActivated, ref } from 'vue';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { skyList, dBtnList, chartData4List } from '@/views/chart/EWarn/chart';
import { ElScrollbar } from 'element-plus'

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
// 定义变量内容
const chartsLeftOneRef = ref()
const chartsCenterOneRef = ref();
const chartsSevenDaysRef = ref();
const chartsLeftTwoRef = ref();
const chartsMonitorRef = ref();
const chartsInvestmentRef = ref();
const storesTagsViewRoutes = useTagsViewRoutes();
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);

const value = ref(0)
const max = ref(0)
const innerRef = ref<HTMLDivElement>()

const state = reactive({
	skyList,
	dBtnList,
	chartData4List,
	myCharts: [],
  cardList:[
    {
      img: "http://www.cnjnjg.com/uploadfile/2023/0521/20230521092637273.jpg",
      status:1,
      value:199999,
      assetName:'龙奥大厦',
      assetAddr:'济南市历下区龙鼎大道1号',
      position:[117.120168,36.650094],
      area:[[117.116831,36.65405], [117.116831,36.650099], [117.12344,36.650091], [117.123418,36.654041]]
    },
    {
      img: "https://pcdn.huanyule.com/public/uploads/202001/16/A7XIWYGMSP.jpg",
      status:1,
      value:199999,
      assetName:'奥体中心体育馆',
      assetAddr:'济南市历下区经十东路',
      position:[117.120308,36.656973],
      area:[[117.111488,36.659285],[117.111456,36.657856],[117.113441,36.654215],[117.127238,36.654267],[117.12889,36.657111],[117.129083,36.659693]]
    },
    {
      img:'https://pic4.ajkimg.com/display/xinfang/7126f4caa577b5c1a227fc4687e92548/412x297x50c@2x.jpg?t=5',
      status:1,
      value:199999,
      assetName:'凤凰国际北区8号楼',
      assetAddr:'济南市历城区华奥路与椒山路交叉口西南200米',
      position: [117.162133,36.653077],
      area:[[117.161844,36.653274],[117.161838,36.652922],[117.162353,36.652879],[117.162402,36.653262]]
    },
    {
      img:'https://pic4.ajkimg.com/display/xinfang/7e753af31a37d72e6391dde6b77c3aaa/500x500c.jpg?t=1',
      assetName:'济南龙奥公寓',
      assetAddr:'济南市历城区龙奥北路海信龙奥九号4号楼',
      status: 1,
      value:199999,
      position:[117.13791,36.654457],
      area:[[117.137631,36.655202],[117.137647,36.654431],[117.138425,36.654479],[117.138376,36.655185]]
    },
    {
      img:'https://pic1.ajkimg.com/display/ajk/e6faf2c70fe7af46373de55a5a1210fd/800x600.jpg',
      assetName:'东城逸家逸秀园2区4号楼',
      assetAddr:'济南市历城区舜义路1069号',
      status: 1,
      value:199999,
      position:[117.136113,36.652092],
      area:[[117.135818,36.652256],[117.135867,36.651864],[117.136462,36.65183],[117.136494,36.652312]]
    }
  ],
  allLists:[
    {
      img: "http://www.cnjnjg.com/uploadfile/2023/0521/20230521092637273.jpg",
      status:1,
      date:'2024-2-24',
      value:199999,
      assetName:'龙奥大厦',
      assetAddr:'济南市历下区龙鼎大道1号',
      position:[117.120168,36.650094],
      area:[[117.116831,36.65405], [117.116831,36.650099], [117.12344,36.650091], [117.123418,36.654041]]
    },
    {
      img: "https://pcdn.huanyule.com/public/uploads/202001/16/A7XIWYGMSP.jpg",
      status:1,
      date:'2024-2-24',
      value:199999,
      assetName:'奥体中心体育馆',
      assetAddr:'济南市历下区经十东路',
      position:[117.120308,36.656973],
      area:[[117.111488,36.659285],[117.111456,36.657856],[117.113441,36.654215],[117.127238,36.654267],[117.12889,36.657111],[117.129083,36.659693]]
    },
    {
      img:'https://pic4.ajkimg.com/display/xinfang/7126f4caa577b5c1a227fc4687e92548/412x297x50c@2x.jpg?t=5',
      status:1,
      value:199999,
      date:'2024-2-24',
      assetName:'凤凰国际北区8号楼',
      assetAddr:'济南市历城区华奥路与椒山路交叉口西南200米',
      position: [117.162133,36.653077],
      area:[[117.161844,36.653274],[117.161838,36.652922],[117.162353,36.652879],[117.162402,36.653262]]
    },
    {
      img:'https://pic4.ajkimg.com/display/xinfang/7e753af31a37d72e6391dde6b77c3aaa/500x500c.jpg?t=1',
      assetName:'济南龙奥公寓',
      assetAddr:'济南市历城区龙奥北路海信龙奥九号4号楼',
      status: 1,
      value:199999,
      date:'2024-2-24',
      position:[117.13791,36.654457],
      area:[[117.137631,36.655202],[117.137647,36.654431],[117.138425,36.654479],[117.138376,36.655185]]
    },
    {
      img:'https://pic1.ajkimg.com/display/ajk/e6faf2c70fe7af46373de55a5a1210fd/800x600.jpg',
      assetName:'东城逸家逸秀园2区4号楼',
      assetAddr:'济南市历城区舜义路1069号',
      status: 1,
      value:199999,
      date:'2024-2-24',
      position:[117.136113,36.652092],
      area:[[117.135818,36.652256],[117.135867,36.651864],[117.136462,36.65183],[117.136494,36.652312]]
    },
    {
      img:'https://store.is.autonavi.com/showpic/c8898e6d55cca2c0137daba5406d18f7?type=pic',
      assetName:'城投济南环贸中心',
      assetAddr:'济南市历下区高新经十路与舜义路交汇处东南侧',
      status: 1,
      value:199999,
      date:'2024-2-24',
      position:[117.135223,36.65774],
      area:[[117.133984,36.657085],[117.133152,36.655282],[117.137208,36.655295],[117.137149,36.657412]]
    },
    {
      img:'https://store.is.autonavi.com/showpic/001256b0ce1120163940bc65ddbe85d7?type=pic',
      assetName:'万科金域国际天泰家园',
      assetAddr:'济南市历下区经十东路与舜华路交汇处',
      status: 1,
      value:199999,
      date:'2024-2-24',
      position:[117.13771,36.662099],
      area:[[117.135983,36.662142],[117.136895,36.660696],[117.138209,36.661303],[117.137109,36.662959],[117.136729,36.663093]]
    },
    {
      img:'https://store.is.autonavi.com/showpic/1d58380ce823596c1ae57d7c9d8a9658',
      assetName:'济高控股大厦',
      assetAddr:'济南市历城区舜泰路与舜泰中路交叉口东南40米',
      status: 1,
      date:'2024-2-24',
      value:199999,
      position:[117.14464,36.663764],
      area:[[117.144355,36.664233],[117.144511,36.663639],[117.145525,36.664268],[117.145117,36.66481]]
    }
  ]
});
const scroll = ({ scrollTop }) => {
  value.value = scrollTop
}
const inputSlider = () => {
  let value = 0;
  setInterval(()=>{
    value+=1
    if(value>(max.value+100)){
      value=0
      scrollbarRef.value!.setScrollTop(value)
    }
    scrollbarRef.value!.setScrollTop(value)
  },10)

}
const initChartsLeftOne = ()=>{
  const myChart = echarts.init(chartsLeftOneRef.value);
  const gaugeData = [
    {
      value: 20,
      name: '房产',
      title: {
        offsetCenter: ['-40%', '80%']
      },
      detail: {
        offsetCenter: ['-40%', '95%']
      }
    },
    {
      value: 40,
      name: '门店',
      title: {
        offsetCenter: ['0%', '80%']
      },
      detail: {
        offsetCenter: ['0%', '95%']
      }
    },
    {
      value: 60,
      name: '期权',
      title: {
        offsetCenter: ['40%', '80%']
      },
      detail: {
        offsetCenter: ['40%', '95%']
      }
    }
  ];
  const option = {
    title: {
      text: '资产库存预警',
    },
    series: [
      {
        type: 'gauge',
        anchor: {
          show: true,
          showAbove: true,
          size: 18,
          itemStyle: {
            color: '#FAC858'
          }
        },
        pointer: {
          icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
          width: 8,
          length: '80%',
          offsetCenter: [0, '8%']
        },
        progress: {
          show: true,
          overlap: true,
          roundCap: true
        },
        axisLine: {
          roundCap: true
        },
        data: gaugeData,
        title: {
          fontSize: 14
        },
        detail: {
          width: 40,
          height: 14,
          fontSize: 14,
          color: '#fff',
          backgroundColor: 'inherit',
          borderRadius: 3,
          formatter: '{value}%'
        }
      }
    ]
  };
  /*setInterval(function () {
    gaugeData[0].value = +(Math.random() * 100).toFixed(2);
    gaugeData[1].value = +(Math.random() * 100).toFixed(2);
    gaugeData[2].value = +(Math.random() * 100).toFixed(2);
    myChart.setOption({
      series: [
        {
          data: gaugeData
        }
      ]
    });
  }, 2000);*/
  myChart.setOption(option);
  state.myCharts.push(myChart);
}
// 初始化中间图表1
const initChartsCenterOne = () => {

};
// 初始化近7天产品追溯扫码统计
const initChartsSevenDays = () => {
	const myChart = echarts.init(chartsSevenDaysRef.value);
	const option = {
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
				name: '电脑',
				type: 'line',
				stack: '总量',
				data: [12, 32, 11, 34, 90, 23, 21],
			},
			{
				name: '冰箱',
				type: 'line',
				stack: '总量',
				data: [22, 82, 91, 24, 90, 30, 30],
			},
			{
				name: '洗衣机',
				type: 'line',
				stack: '总量',
				data: [50, 32, 18, 14, 90, 30, 50],
			},
		],
	};
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
// 初始化近30天预警总数
const initChartsLeftTwo = () => {
	const myChart = echarts.init(chartsLeftTwoRef.value);
  const layouts = [
    [[0, 0]],
    [
      [-0.25, 0],
      [0.25, 0]
    ],
    [
      [0, -0.2],
      [-0.2, 0.2],
      [0.2, 0.2]
    ],
    [
      [-0.25, -0.25],
      [-0.25, 0.25],
      [0.25, -0.25],
      [0.25, 0.25]
    ]
  ];
  const pathes = [
    'M936.857805 523.431322c0 0-42.065715-68.89513-88.786739-68.89513-46.68416 0-95.732122 71.223091-95.732122 71.223091s-44.28544-72.503296-93.440922-71.152538c-35.565466 0.977306-62.89705 30.882406-79.124275 64.06615L579.773747 790.800797c-3.253248 37.391565-5.677568 50.904371-12.002816 69.63497-6.651802 19.698688-19.544883 35.227341-31.650099 45.909606-14.30231 12.621414-29.59831 22.066586-45.854208 27.424563-16.28969 5.362074-30.098739 6.496973-51.536794 6.496973-19.498906 0-36.95104-2.963456-52.395418-8.850534-15.410586-5.887078-28.420403-14.313984-39.034573-25.246003-10.613146-10.930995-18.757939-24.08151-24.435507-39.525171-5.676544-15.443763-8.532685-40.195482-8.532685-59.270963l0-26.232454 74.435273 0c0 24.644301-0.17705 64.452915 8.81408 77.006848 9.02697 12.515021 22.756147 18.092032 41.148826 18.791014 16.728678 0.636518 30.032179-8.061645 30.032179-8.061645s11.922022-10.5472 14.992077-19.756954c2.674995-8.025805 3.565363-22.180147 3.565363-22.180147s2.080461-21.789286 2.080461-34.234675L489.399906 514.299369c-16.678502-18.827776-43.801395-61.938688-82.756096-60.927693-54.699008 1.419366-100.422144 70.059622-100.422144 70.059622s-56.065126-70.059622-93.440922-70.059622c-37.376717 0-91.077939 70.059622-91.077939 70.059622S105.343488 156.737741 476.742042 119.363584l53.70327-74.714624 51.373056 74.714624C964.889395 142.740992 936.857805 523.431322 936.857805 523.431322z',
    'M533.504 268.288q33.792-41.984 71.68-75.776 32.768-27.648 74.24-50.176t86.528-19.456q63.488 5.12 105.984 30.208t67.584 63.488 34.304 87.04 6.144 99.84-17.92 97.792-36.864 87.04-48.64 74.752-53.248 61.952q-40.96 41.984-85.504 78.336t-84.992 62.464-73.728 41.472-51.712 15.36q-20.48 1.024-52.224-14.336t-69.632-41.472-79.872-61.952-82.944-75.776q-26.624-25.6-57.344-59.392t-57.856-74.24-46.592-87.552-21.504-100.352 11.264-99.84 39.936-83.456 65.536-61.952 88.064-35.328q24.576-5.12 49.152-1.536t48.128 12.288 45.056 22.016 40.96 27.648q45.056 33.792 86.016 80.896z',
    'M741.06368 733.310464c8.075264-29.262438 20.615373-40.632422 14.64105-162.810061C966.089728 361.789952 967.93897 72.37847 967.855002 54.693683c0.279347-0.279347 0.418509-0.419533 0.418509-0.419533s-0.17705-0.00512-0.428749-0.00512c0-0.251699 0-0.428749 0-0.428749s-0.139162 0.14633-0.418509 0.425677c-17.695744-0.083866-307.10784 1.760051-515.833958 212.142592-122.181632-5.984256-133.55305 6.563533-162.815693 14.644531C235.35063 295.798886 103.552614 436.975309 90.630758 486.076621c-12.921856 49.105408 39.634227 56.859034 58.579558 58.581197 18.953421 1.724314 121.471386-9.475789 130.09111 4.309094 0 0 16.367411 11.200102 17.226035 41.346662 0.850432 29.796659 15.173222 71.354163 37.123994 97.267302-0.028672 0.027648-0.05632 0.054272-0.083866 0.074752 0.158618 0.13097 0.316211 0.261939 0.474829 0.390861 0.129946 0.149402 0.261939 0.319283 0.393011 0.468685 0.019456-0.019456 0.04608-0.049152 0.075776-0.075674 25.918362 21.961216 67.477504 36.272128 97.269248 37.122458 30.149837 0.859546 41.354547 17.234534 41.354547 17.234534 13.779354 8.608051 2.583962 111.122842 4.302131 130.075546 1.727386 18.95168 9.477222 71.498445 58.579558 58.576077C585.12896 918.526771 726.311117 786.734182 741.06368 733.310464zM595.893555 426.206003c-39.961702-39.965184-39.961702-104.75991 0-144.720077 39.970918-39.96928 104.768307-39.96928 144.730112 0 39.970918 39.960064 39.970918 104.75479 0 144.720077C700.661862 466.171187 635.864474 466.171187 595.893555 426.206003zM358.53312 769.516032c-31.923302-4.573184-54.890394-18.410291-71.41847-35.402342-16.984474-16.526438-30.830387-39.495475-35.405824-71.420621-4.649062-28.082586-20.856832-41.167565-38.76649-38.763827-17.906586 2.40681-77.046886 66.714419-80.857805 89.475891-3.80887 22.752154 29.271859 12.081152 46.424166 27.654861 17.151283 15.590093-2.139853 61.93664-14.733107 86.845952-6.441984 12.735078-10.289766 26.42176-4.22953 33.76087 7.346586 6.070272 21.03593 2.222592 33.769472-4.220109 24.912384-12.585677 71.258829-31.872922 86.842368-14.731469 15.583539 17.160806 4.911002 50.229965 27.674419 46.419251 22.754099-3.807744 87.065395-62.946611 89.466163-80.85248C399.70857 790.374093 386.627072 774.166938 358.53312 769.516032z',
    'M848.794624 939.156685 571.780416 939.156685 571.780416 653.17123l341.897539 0 0 221.100654C913.677926 909.960704 884.482867 939.156685 848.794624 939.156685zM571.780403 318.743552c-11.861606-3.210138-31.443354-8.36864-39.829709-16.176435-0.596582-0.561766-1.016218-1.246413-1.613824-1.841971-0.560845 0.596582-1.016218 1.280205-1.613824 1.841971-8.386355 7.807795-15.96631 12.965274-27.827917 16.176435l0 263.544325L141.030675 582.287877 141.030675 355.202884c0-35.687834 29.195059-64.882688 64.883302-64.882688l150.649125 0c-16.984474-9.525965-32.846438-20.56233-46.111027-32.932045-60.250624-56.144691-71.129907-137.062605-24.283034-180.767027 19.615539-18.264986 46.252237-27.124736 75.026739-27.124736 39.933133 0 83.972915 17.070797 118.995968 49.706086 20.353331 18.983322 37.722624 43.405619 50.145075 69.056819 12.457267-25.6512 29.791744-50.074419 50.180915-69.056819 35.022029-32.63529 79.062835-49.706086 118.994944-49.706086 28.74071 0 55.410176 8.860774 75.025715 27.124736 46.882611 43.704422 35.96759 124.622336-24.283034 180.767027-13.264589 12.368691-29.127578 23.40608-46.111027 32.932045l144.649234 0c35.688243 0 64.882278 29.195981 64.882278 64.882688l0 227.084948L571.780416 582.287833 571.780416 318.743508zM435.064218 147.625267c-21.476966-19.965747-49.094144-31.913882-73.868288-31.913882-7.404954 0-21.125018 1.211597-29.863322 9.386803-2.000691 1.824563-8.070144 7.439462-8.070144 21.369754 0 15.650406 8.492749 40.24873 32.319386 62.477926 29.124506 27.12576 77.202432 47.601152 111.76704 47.601152 12.176794 0 16.492237-2.666701 16.527053-2.702541C489.524736 242.54505 475.664486 185.453773 435.064218 147.625267zM577.78135 254.790963c0 0 0.034816-0.034816 0.069632-0.034816 0.807424 0 5.50871 1.790771 15.509914 1.790771 34.564608 0 82.64151-20.47529 111.76704-47.601152 23.826637-22.229299 32.283546-46.810112 32.283546-62.442189 0-13.930291-6.033613-19.562496-8.035328-21.404467-8.77312-8.17623-22.457344-9.386803-29.864346-9.386803-24.808038 0-52.390298 11.948134-73.867264 31.913882C585.325466 185.208218 571.358822 241.73865 577.78135 254.790963zM500.89513 939.156685 205.914017 939.156685c-35.688243 0-64.883302-29.195981-64.883302-64.883712L141.030714 653.17123l359.864462 0L500.895177 939.15666z'
  ];
  const colors = ['#c4332b', '#16B644', '#6862FD', '#FDC763'];
  function getVirtulData(year) {
    year = year || '2017';
    let date = +echarts.number.parseDate(year + '-01-01');
    let end = +echarts.number.parseDate(+year + 1 + '-01-01');
    let dayTime = 3600 * 24 * 1000;
    let data = [];
    for (let time = date; time < end; time += dayTime) {
      let items = [];
      let eventCount = Math.round(Math.random() * pathes.length);
      for (let i = 0; i < eventCount; i++) {
        items.push(Math.round(Math.random() * (pathes.length - 1)));
      }
      data.push([echarts.format.formatTime('yyyy-MM-dd', time), items.join('|')]);
    }
    return data;
  }
  const option = {
    tooltip: {},
    title:{
      text:'车辆保养预警',
      top:'19px',
    },
    calendar: [
      {
        left: 'center',
        top: 'middle',
        cellSize: [55, 55],
        yearLabel: { show: false },
        orient: 'vertical',
        dayLabel: {
          firstDay: 1,
          nameMap: 'cn'
        },
        monthLabel: {
          show: true
        },
        range: '2017-03'
      }
    ],
    series: [
      {
        type: 'custom',
        coordinateSystem: 'calendar',
        renderItem: function (params, api) {
          const cellPoint = api.coord(api.value(0));
          const cellWidth = params.coordSys.cellWidth;
          const cellHeight = params.coordSys.cellHeight;
          const value = api.value(1);
          const events = value && value.split('|');
          if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
            return;
          }
          const group = {
            type: 'group',
            children:
                (layouts[events.length - 1] || []).map(function (
                    itemLayout,
                    index
                ) {
                  return {
                    type: 'path',
                    shape: {
                      pathData: pathes[+events[index]],
                      x: -8,
                      y: -8,
                      width: 16,
                      height: 16
                    },
                    position: [
                      cellPoint[0] +
                      echarts.number.linearMap(
                          itemLayout[0],
                          [-0.5, 0.5],
                          [-cellWidth / 2, cellWidth / 2]
                      ),
                      cellPoint[1] +
                      echarts.number.linearMap(
                          itemLayout[1],
                          [-0.5, 0.5],
                          [-cellHeight / 2 + 20, cellHeight / 2]
                      )
                    ],
                    style: api.style({
                      fill: colors[+events[index]]
                    })
                  };
                }) || []
          };
          group.children.push({
            type: 'text',
            style: {
              x: cellPoint[0],
              y: cellPoint[1] - cellHeight / 2 + 15,
              text: echarts.format.formatTime('dd', api.value(0)),
              fill: '#777',
              textFont: api.font({ fontSize: 14 })
            }
          });
          return group;
        },
        dimensions: [undefined, { type: 'ordinal' }],
        data: getVirtulData('2017')
      }
    ]
  };
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
// 初始化当前设备监测
const initChartsMonitor = () => {
	const myChart = echarts.init(chartsMonitorRef.value);
	const option = {
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
			data: ['02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00'],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				itemStyle: {
					color: '#289df5',
					borderColor: '#289df5',
					areaStyle: {
						type: 'default',
						opacity: 0.1,
					},
				},
				data: [20, 32, 31, 34, 12, 13, 20],
				type: 'line',
				areaStyle: {},
			},
		],
	};
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
// 初始化近7天投入品记录
const initChartsInvestment = () => {
	const myChart = echarts.init(chartsInvestmentRef.value);
	const option = {
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
			data: ['7月', '8月', '9月', '10月', '11月', '12月', '1月'],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				data: [10, 20, 15, 80, 70, 11, 30],
				type: 'bar',
			},
		],
	};
	myChart.setOption(option);
	state.myCharts.push(myChart);
};
// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < state.myCharts.length; i++) {
			state.myCharts[i].resize();
		}
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时
onMounted(() => {
  initChartsLeftOne();
	initChartsCenterOne();
	initChartsSevenDays();
	initChartsLeftTwo();
	initChartsMonitor();
	initChartsInvestment();
	initEchartsResize();
  max.value = innerRef.value!.clientHeight - 380;
  setTimeout(()=>{
    inputSlider()
  },10)
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
	initEchartsResizeFun();
});
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
	() => isTagsViewCurrenFull.value,
	() => {
		initEchartsResizeFun();
	}
);
</script>

<style scoped lang="scss">
@import './chart.scss';
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.bottom {
  margin: 5px;
  padding: 0 5px 0 0;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
