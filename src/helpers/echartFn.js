import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import { getDirac } from '../components/Mathjax'
echarts.use([TooltipComponent, GridComponent, BarChart, SVGRenderer])
export const barChart = (element, data, isNeedInit) => {
	const chartDom = document.getElementById(element)
	let myChart
	if (isNeedInit) {
		myChart = echarts.init(chartDom)
	} else {
		myChart = element
	}
	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: [
			{
				type: 'category',
				data: data.xData,
				axisTick: {
					alignWithLabel: true,
				},
				axisLabel: {
					formatter: function (value, idx) {
						const svg = getDirac(value)
                        console.log(svg)
                        const z = new XMLSerializer()
                        return value
						// return `<foreignObject>z.serializeToString(svg)</foreignObject>`
					},
				},
			},
		],
		yAxis: [
			{
				type: 'value',
			},
		],
		series: [
			{
				name: '',
				type: 'bar',
				barWidth: '60%',
				data: data.yData,
			},
		],
	}
	myChart.setOption(option)
	return myChart
}
