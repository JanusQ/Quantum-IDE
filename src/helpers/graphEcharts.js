import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { GraphChart } from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'

echarts.use([TitleComponent, TooltipComponent, GraphChart, SVGRenderer])
export const drawGraphChart = (element) => {
	const chartDom = document.getElementById(element)
	const myChart = echarts.init(chartDom)
	const option = {
		tooltip: {},
		animationDurationUpdate: 1500,
		animationEasingUpdate: 'quinticInOut',
		series: [
			{
				type: 'graph',
				layout: 'none',
				symbolSize: 50,
				roam: true,
				label: {
					show: true,
				},
				edgeSymbol: ['circle'],
				edgeSymbolSize: [4, 10],
				edgeLabel: {
					fontSize: 20,
				},
				data: [
					{
						color: 'red',
						name: '1',
						x: 300,
						y: 300,
					},
					{
						color: 'blue',
						name: '2',
						x: 500,
						y: 300,
					},
					{
						name: '3',
						x: 600,
						y: 300,
					},
					{
						name: '4',
						x: 300,
						y: 500,
					},
				],
				// links: [],
				links: [
					{
						color: 'red',
						source: '1',
						target: '3',
					},
					{
						color: 'blue',
						source: '2',
						target: '3',
					},
					{
						color: 'yellow',
						source: '1',
						target: '4',
					},
					{
                        color: 'black',
						source: '1',
						target: '4',
					},
				],
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
