import Chart from '../simulator/Chart'
import * as d3 from 'd3'
import { getDirac } from '../components/Mathjax'
import d3Draw from '../simulator/D3Draw'
export const computerParamsChat = (data, element, svgEle, isProbs) => {
	const chart = new Chart()
	const config = {
		barPadding: 0.15,
		barColor: chart._colors[0],
		margins: { top: 10, left: 50, bottom: 50, right: 60 },
		textColor: 'black',
		gridColor: 'gray',
		tickShowGrid: [60, 120, 180],
	}
	const svg = d3.select(`#${svgEle}`)
	svg.selectAll('*').remove()
	chart.box(d3.select(`#${element}`))
	chart.svg(svg)
	chart.width(1200)
	chart.margins(config.margins)
	chart.scaleX = d3
		.scaleBand()
		.domain(data.map((d) => d.xValue))
		.range([0, chart.getBodyWidth()])
		.padding(config.barPadding)

	chart.scaleY = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.yValue)])
		.range([chart.getBodyHeight(), 0])
	chart.renderBars = function () {
		let bars = chart.body().selectAll('.bar').data(data)

		bars.enter()
			.append('rect')
			.attr('class', 'bar')
			.merge(bars)
			.attr('x', (d) => chart.scaleX(d.xValue))
			.attr('y', chart.scaleY(0))
			.attr('width', chart.scaleX.bandwidth())
			.attr('height', 0)
			.attr('fill', config.barColor)
			.transition()
			.duration(config.animateDuration)
			.attr('height', (d) => chart.getBodyHeight() - chart.scaleY(d.yValue))
			.attr('y', (d) => chart.scaleY(d.yValue))

		bars.exit().remove()
	}
	// 处理x轴样式
	function customXAxis(g) {
		const xAxis = d3.axisBottom(chart.scaleX)
		g.call(xAxis)
		g.selectAll('.tick text').remove()
		g.selectAll('.tick line').remove()
		// g.selectAll('.tick text')
		// 	.nodes()
		// 	.forEach(function (t, index) {
		// 		const textSvg = getDirac(t.innerHTML)
		// 		const z = new XMLSerializer()
		// 		g.select(`.tick:nth-of-type(${index + 1})`)
		// 			.append('foreignObject')
		// 			.attr('width', 30)
		// 			.attr('height', 24)
		// 			// .attr('transform', 'scale(0.9)')
		// 			.attr('x', -15)
		// 			.attr('y', 5)
		// 			.append('xhtml:div')
		// 			.attr('height', '100%')
		// 			.attr('width', '100%')
		// 			.html(z.serializeToString(textSvg))
		// 	})

		// g.selectAll('.tick text').remove()
	}
	/* ----------------------------渲染坐标轴------------------------  */
	chart.renderX = function () {
		chart.svg().select('.xAxis').remove()
		chart
			.svg()
			.append('g', '.body')
			.attr('transform', 'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight()) + ')')
			.attr('class', 'xAxis')
			.call(customXAxis)
	}

	chart.renderY = function () {
		chart
			.svg()
			.append('g', '.body')
			.attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
			.attr('class', 'yAxis')
			.call(d3.axisLeft(chart.scaleY))
	}

	chart.renderAxis = function () {
		chart.renderY()
		chart.renderX()
	}
	chart.addMouseOn = function () {
		svg.selectAll('.bar')
			.on('mouseover', function (e, d) {
				const textSvg = getDirac(d.xValue)
				const z = new XMLSerializer()
				const position = d3.pointer(e)
				let tipG
				if (position[0] + String(d.xValue).length * 10 + 52 > 780) {
					tipG = svg
						.append('g')
						.classed('tip', true)
						.attr(
							'transform',
							`translate(${position[0] - String(d.xValue).length * 10 - 5},${position[1] - 10})`
						)
				} else {
					tipG = svg
						.append('g')
						.classed('tip', true)
						.attr('transform', `translate(${position[0] + 55},${position[1] - 10})`)
				}
				tipG.append('rect')
					.attr('stroke', 'gray')
					.attr('stroke-width', 1)
					.attr('height', 47)
					.attr('width', String(d.xValue).length * 10 + 52)
					.attr('fill', '#fff')
					.attr('rx', 2)
				tipG.append('foreignObject')
					.attr('width', String(d.xValue).length * 10 + 12)
					.attr('height', 24)
					// .attr('transform', 'scale(1)')
					.attr('x', 40)
					.attr('y', 2)
					.append('xhtml:div')
					.attr('height', '100%')
					.attr('width', '100%')
					.html(z.serializeToString(textSvg))
				tipG.append('text')
					.attr('fill', chart.textColor)
					.classed('svgtext', true)
					.attr('x', 4)
					.attr('y', 18)
					.html('base:')
				if (!isProbs) {
					const text = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 40)
						.html('sample:' + d.yValue)
				} else {
					const text = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 40)
						.html('probs:' + d.yValue)
				}
			})
			.on('mouseleave', function (e, d) {
				svg.select('.tip').remove()
			})
			.on('mousemove', function (e, d) {
				const position = d3.pointer(e)
				if (position[0] + String(d.xValue).length * 10 + 52 > 780) {
					svg.select('.tip').attr(
						'transform',
						`translate(${position[0] - String(d.xValue).length * 10 - 5},${position[1] - 10})`
					)
				} else {
					svg.select('.tip').attr('transform', `translate(${position[0] + 55},${position[1] - 10})`)
				}
			})
	}

	chart.addZoom = function () {
		// console.log(getDirac(123))
		const extent = [
			[0, config.margins.top],
			[chart.getBodyWidth(), chart.getBodyHeight()],
		]
		chart.svg().call(d3.zoom().scaleExtent([1, 8]).translateExtent(extent).extent(extent).on('zoom', zoomed))
		function zoomed(event) {
			chart.scaleX.range([0, chart.getBodyWidth()].map((d) => event.transform.applyX(d)))
			chart
				.svg()
				.selectAll('.bar')
				.attr('x', (d) => chart.scaleX(d.xValue))
				.attr('width', chart.scaleX.bandwidth())

			chart.svg().selectAll('.xAxis').call(chart.renderX)
		}
	}

	chart.render = function () {
		chart.renderBars()
		chart.renderAxis()
		chart.addMouseOn()
		chart.addZoom()
	}

	chart.renderChart()
}
export const computerD3 = (data, svgEle, gEle, svgWidthData) => {
	const initSvgWidth = svgWidthData || 840
	const operation = {
		svgItemHeight: 34,
		svgItemWidth: 40,
	}
	const d3Fn = new d3Draw(operation)
	const svg = d3.select(`#${svgEle}`)
	const drawG = svg.select(`#${gEle}`)
	// 移除已经添加过的
	drawG.selectAll('*').remove()
	const { gates } = data
	// 列数
	const row = gates[0].length
	const col = gates.length
	const svgWidth = (row + d3Fn.scaleNum) * d3Fn.svgItemWidth > initSvgWidth ? (row + d3Fn.scaleNum) * d3Fn.svgItemWidth : initSvgWidth
	// 设置SVG宽高 高度整体下移了一行
	svg.attr('width', svgWidth)
	svg.attr('height', (col + 4) * d3Fn.svgItemHeight - 50)
	/**
	 * 预留了前边是firstX，画线和添加name
	 */
	for (let i = 0; i < col; i++) {
		d3Fn.drawLine(
			drawG,
			d3Fn.firstX,
			d3Fn.svgItemHeight * (i + 2),
			(row + 3) * d3Fn.svgItemWidth > initSvgWidth ? (row + 3) * d3Fn.svgItemWidth : initSvgWidth,
			d3Fn.svgItemHeight * (i + 2)
		)
		d3Fn.drawName(drawG, d3Fn.svgItemWidth * 2 + 5, d3Fn.svgItemHeight * (i + 2), 'Q' + i)
	}
	// 加入Qint, 右边的继承关系
	for (const key in data.name2index) {
		for (let i = 0; i < data.name2index[key].length; i++) {
			const lineNum = data.name2index[key][data.name2index[key].length - 1] - data.name2index[key][0]
			d3Fn.drawQint(
				drawG,
				d3Fn.svgItemWidth * 2,
				d3Fn.svgItemHeight * (data.name2index[key][0] + 2),
				d3Fn.svgItemHeight * lineNum - 10,
				key
			)
		}
	}

	// 处理操作
	d3Fn.drawOperations2(drawG, gates, data)
}
