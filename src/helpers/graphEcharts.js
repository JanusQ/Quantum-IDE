import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TitleComponent, TooltipComponent, GraphChart, CanvasRenderer])
export const drawGraphChart = (element, data, linksData) => {
	const chartDom = document.getElementById(element)
	const myChart = echarts.init(chartDom)
	const option = {
		tooltip: {
			formatter: function (params) {
				if (params.dataType === 'node') {
					return params.name
				}
				if (params.dataType === 'edge') {
					return `${params.data.selfDefine}`
				}
			},
		},
		animationDurationUpdate: 1500,
		animationEasingUpdate: 'quinticInOut',
		series: [
			{
				scaleLimit: {
					min: 1,
					max: 1,
				},
				type: 'graph',
				layout: 'none',
				symbolSize: 30,
				label: {
					show: true,
					fontSize: 8,
					color: '#fff',
					
				},
				data: data,
				// links: [],
				links: linksData,
				lineStyle: {
					opacity: 0.9,
					width: 2,
					curveness: 0,
				},
				itemStyle: {
					color: function (params) {
						return params.data.color
					},
				},
			},
		],
	}

	option && myChart.setOption(option)
}
