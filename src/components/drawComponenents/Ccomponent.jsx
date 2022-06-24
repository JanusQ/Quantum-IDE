import React, { useState, useEffect, useImperativeHandle } from 'react'
import '../core/Right.css'
import { Button, Tooltip } from 'antd'
import * as d3 from 'd3'
import { getDirac } from '../Mathjax'
import Chart from '../../simulator/Chart'
const _ = require('lodash')
const Ccomponent = (props) => {
	let getWholeState = []

	// 记录B模块选择的index
	let varstatesIndex = 0
	// 存储C模块的chart
	let charts = []
	// 存 c filter过滤条件
	let filter = {}
    const clear = ()=>{
        filter = {}
        charts = []
        varstatesIndex = 0
        getWholeState = []
        d3.selectAll('#chart_svg *').remove()
		d3.selectAll('#chart_down_svg *').remove()
    }
	// c视图restore
	const restore = () => {
		filter = {}
		const drawData = { magns: [], phases: [], probs: [], base: [] }
		getWholeState.forEach((item) => {
			drawData.magns.push(item.magns)
			drawData.phases.push(item.phases)
			drawData.probs.push(item.probs)
			drawData.base.push(item.base)
		})
		drawCdownStackedBar(drawData)
		charts = []
		drawCFn(varstatesIndex)
		d3.selectAll('#chart_svg .brushed_rect').remove()
	}
	// 绘制C视图连线
	const drawCLine = (svg, lineData, lineXArr, heightStep) => {
		const initY = (lineData.length + 1) * heightStep

		svg.attr('height', 267 + lineData.length * heightStep)
		if (!lineData.length) {
			return
		}

		const getKey = (obj, i) => {
			return Object.keys(obj)[i]
		}
		const getValue = (obj, i) => {
			return obj[getKey(obj, i)]
		}
		const getX = (obj, i) => {
			return lineXArr[getKey(obj, i)][getValue(obj, i)]
		}

		for (let i = 0; i < lineData.length; i++) {
			const lineG = svg.append('g').classed('threshold_line', true)
			const context = d3.path()
			context.moveTo(getX(lineData[i], 0), initY)
			context.lineTo(getX(lineData[i], 0), initY - heightStep * (i + 1))
			context.lineTo(getX(lineData[i], 1), initY - heightStep * (i + 1))
			context.lineTo(getX(lineData[i], 1), initY)
			lineG
				.append('path')
				.attr('d', context.toString())
				.attr('stroke', '#E58F82')
				.attr('stroke-width', 1)
				.attr('fill', 'none')
		}
	}
	// 绘制C视图上半
	const drawCFn = (index) => {
        clear()
		let j = 0
		const barData = props.qc.getVarState(index, undefined)
		varstatesIndex = index
		drawStackedBar(barData, j, index)
		drawCdownStackedBar(props.qc.getWholeState(index))
	}
	const drawStackedBar = (data, j, index) => {
		// 连线的数据 放在这个方法里 计算图标Y轴整体向下移动的距离
		const heightStep = 10
		const lineData = props.qc.getPmiIndex(index, 0.25)
		const config = {
			barPadding: 0.1,
			margins: { top: 20, left: 50, bottom: 120, right: 40 },
			tickShowGrid: [60, 120, 180],
			textColor: 'black',
			gridColor: 'gray',
			hoverColor: 'gray',
		}
		const barWidth = 26
		const chart_svg = d3.select('#chart_svg')
		chart_svg.selectAll('*').remove()
		const keyArr = Object.keys(data)
		let allWidth = 0
		const widthArr = []
		// 定义所有线X轴的数据
		const lineXArr = {}
		for (const key in data) {
			const dataArr = []
			lineXArr[key] = []
			for (let i = 0; i < data[key].magn.length; i++) {
				// 80 是作图是的margins 的 left 这个x设置的是柱中间的距离 选中超过一半算选中
				dataArr.push({
					name: key,
					magn: data[key].magn[i],
					prob: data[key].prob[i],
					index: i,
					phase: data[key].phase[i],
					x: barWidth * i + barWidth / 2 + config.margins.left,
				})
				lineXArr[key].push(barWidth * i + barWidth / 2 + config.margins.left + (j ? widthArr[j - 1] : 0))
			}
			const width = barWidth * dataArr.length + config.margins.left + config.margins.right
			widthArr.push(width + (j ? widthArr[j - 1] : 0))
			const g = chart_svg.append('g').attr('transform', `translate(${j ? widthArr[j - 1] : 0},${6 * heightStep})`)
			StackedBarChart(dataArr, g, width, key, config, barWidth, index, j ? widthArr[j - 1] : 0, heightStep)
			allWidth += width
			chart_svg.attr('width', allWidth + 50)
			j += 1
		}

		drawCLine(chart_svg, lineData, lineXArr, heightStep)
	}

	const StackedBarChart = (data, g, width, name, config, barWidth, index, left, heightStep) => {
		const chart = new Chart()
		const self = this
		chart.width(width)
		chart.key(name)
		chart.box(d3.select('.c_up_draw'))
		chart.svg(g)
		chart.margins(config.margins)
		chart.scaleX = d3
			.scaleBand()
			.domain(data.map((d) => d.index))
			.range([0, chart.getBodyWidth()])
			.paddingInner(config.barPadding)
			.round(true)
		chart.scaleY = d3
			.scaleLinear()
			.domain([0, d3.max([...data.map((d) => d.magn), ...data.map((d) => d.prob)])])
			.range([chart.getBodyHeight() / 2, 0])

		chart.scalePhaseY = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.phase) || 1])
			.range([0, chart.getBodyHeight() / 2])
		// 处理x轴样式
		function customXAxis(g) {
			const xAxis = d3.axisBottom(chart.scaleX)
			g.call(xAxis)
			g.select('.domain').remove()
			g.selectAll('.tick line').remove()

			g.append('rect')
				.attr('width', chart.getBodyWidth())
				.attr('height', 5)
				.attr('fill', 'rgb(220, 216, 216)')
				.classed('x_rect', true)
				.classed('svgtext', true)
				.attr('rx', 5)
				.attr('ry', 5)
			// g.selectAll('.tick text').remove()
			g.selectAll('.tick text')
				.nodes()
				.forEach(function (t, index) {
					const textSvg = getDirac(t.innerHTML)
					const z = new XMLSerializer()
					g.select(`.tick:nth-of-type(${index + 1})`)
						.append('foreignObject')
						.attr('width', 24)
						.attr('height', 24)
						// .attr('transform', 'scale(0.9)')
						.attr('x', t.innerHTML.length > 1 ? -10 : -8)
						.attr('y', 5)
						.append('xhtml:div')
						.attr('height', '100%')
						.attr('width', '100%')
						.html(z.serializeToString(textSvg))
				})

			g.selectAll('.tick text').remove()
		}
		// 处理上边Y轴样式
		function customYAxis(g) {
			const yAxis = d3.axisLeft(chart.scaleY)
			g.call(yAxis)
			g.select('.domain').remove()
			g.selectAll('.tick').remove()
		}
		// 绘制phase的Y轴
		function customPhaseY(g) {
			const yAxis = d3.axisLeft(chart.scalePhaseY)
			g.call(yAxis)
			g.select('.domain').remove()
			g.selectAll('.tick').remove()
		}

		chart.renderX = function () {
			chart
				.svg()
				.insert('g', '.body')
				.attr(
					'transform',
					'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight() / 2) + ')'
				)
				.attr('class', 'xAxis')
				.call(customXAxis)
		}

		chart.renderY = function () {
			chart
				.svg()
				.insert('g', '.body')
				.attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
				.attr('class', 'yAxis')
				.call(customYAxis)
		}
		chart.renderPhaseY = function () {
			chart
				.svg()
				.insert('g', '.body')
				.attr(
					'transform',
					'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight() / 2 + 22) + ')'
				)
				.attr('class', 'phaseYaxis')
				.call(customPhaseY)
		}
		// 绘制坐标轴
		chart.renderAxis = function () {
			chart.renderX()
			chart.renderY()
			chart.renderPhaseY()
		}
		// 绘制名称
		chart.renderText = function () {
			g.select('.yAxis')
				.append('text')
				.attr('class', 'axisText')
				.attr('x', name.length > 5 ? -25 : -20)
				.attr('y', chart.getBodyHeight() / 2 - 20)
				.attr('fill', config.textColor)
				.attr('text-anchor', 'middle')
				.attr('style', 'font-size:18px')
				.text(`${name}`)
				.classed('svgtext', true)
		}
		// 绘制粉色方块
		chart.renderPinkRect = function () {
			const parentRectHeight = 20
			const childRectPercent = props.qc.variableEntropy(index, name)
			// 减去了stroke的2
			const childRectHeight = (parentRectHeight - 2) * childRectPercent
			g.select('.yAxis')
				.append('rect')
				.attr('height', parentRectHeight)
				.attr('width', 20)
				.attr('x', -30)
				.attr('y', chart.getBodyHeight() / 2 - parentRectHeight + 6)
				.attr('fill', 'transparent')
				.attr('stroke', '#000')
				.attr('stroke-width', 1)

			g.select('.yAxis')
				.append('rect')
				.attr('height', childRectHeight)
				.attr('width', 18)
				.attr('x', -29)
				.attr('y', chart.getBodyHeight() / 2 - childRectHeight + 5)
				.attr('fill', 'rgb(229,143,130)')
		}
		// 绑定事件
		chart.addMouseOn = function () {
			g.selectAll('.magn_bar')
				.on('mouseover', function (e, d) {
					const position = d3.pointer(e)
					const tipG = d3
						.select('#chart_svg')
						.append('g')
						.classed('tip', true)
						.attr('transform', `translate(${position[0] + 55 + left},${position[1] + heightStep * 6 - 10})`)
					tipG.append('rect')
						.attr('stroke', 'gray')
						.attr('stroke-width', 1)
						.attr('height', 26)
						.attr('width', 110)
						.attr('fill', '#fff')
						.attr('rx', 2)
					const text = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 16)
					text.append('tspan').text('Maganitue:' + _.round(d.magn, 2))
				})
				.on('mouseleave', function (e, d) {
					d3.select('#chart_svg').select('.tip').remove()
				})
				.on('mousemove', function (e) {
					const position = d3.pointer(e)
					d3.select('#chart_svg')
						.select('.tip')
						.attr('transform', `translate(${position[0] + 55 + left},${position[1] + heightStep * 6 - 10})`)
				})
			g.selectAll('.prob_bar')
				.on('mouseover', function (e, d) {
					const position = d3.pointer(e)
					const tipG = d3
						.select('#chart_svg')
						.append('g')
						.classed('tip', true)
						.attr('transform', `translate(${position[0] + 55 + left},${position[1] + heightStep * 6 - 10})`)
					tipG.append('rect')
						.attr('stroke', 'gray')
						.attr('stroke-width', 1)
						.attr('height', 26)
						.attr('width', 110)
						.attr('fill', '#fff')
						.attr('rx', 2)
					const text = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 16)

					text.append('tspan').text('probability:' + _.round(d.prob, 2))
				})
				.on('mouseleave', function (e, d) {
					d3.select('#chart_svg').select('.tip').remove()
				})
				.on('mousemove', function (e) {
					const position = d3.pointer(e)
					d3.select('#chart_svg')
						.select('.tip')
						.attr('transform', `translate(${position[0] + 55 + left},${position[1] + heightStep * 6 - 10})`)
				})
			g.selectAll('.phase_bar')
				.on('mouseover', function (e, d) {
					const phaseLength = String(_.round(d.phase, 2)).split('.').join('').length

					const position = d3.pointer(e)
					const tipG = d3
						.select('#chart_svg')
						.append('g')
						.classed('tip', true)
						.attr('transform', `translate(${position[0] + 55 + left},${position[1] + heightStep * 6 - 10})`)
					tipG.append('rect')
						.attr('stroke', 'gray')
						.attr('stroke-width', 1)
						.attr('height', 26)
						.attr('width', phaseLength * 10 + 45)
						.attr('fill', '#fff')
						.attr('rx', 2)
					const text = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 16)
					text.append('tspan').text('phase:' + _.round(d.phase, 2))
				})
				.on('mouseleave', function (e, d) {
					d3.select('#chart_svg').select('.tip').remove()
				})
				.on('mousemove', function (e) {
					const position = d3.pointer(e)
					d3.select('#chart_svg')
						.select('.tip')
						.attr(
							'transform',
							`translate(${position[0] + 55 + left},${position[1] + +heightStep * 6 - 10})`
						)
				})
		}
		chartBrushFn(g, barWidth, config, index, name, chart)
		charts.push(chart)
		// 总体绘制
		chart.render = function () {
			chart.renderAxis()
			chart.renderText()
			renderBar(chart, data)
			chart.addMouseOn()
			chart.renderPinkRect()
		}

		chart.renderChart()
	}

	// 渲染C视图柱子
	const renderBar = (chart, data) => {
		// 绘制Magn bar
		let magnBars = chart.body().selectAll('.magn_bar').data(data)
		magnBars
			.enter()
			.append('rect')
			.attr('class', 'magn_bar')
			.merge(magnBars)
			.attr('x', (d) => chart.scaleX(d.index))
			.attr('y', (d) => chart.scaleY(d.magn))
			.attr('width', chart.scaleX.bandwidth() - 1)
			.attr('height', (d) => chart.getBodyHeight() / 2 - chart.scaleY(d.magn))
			.attr('fill', chart._colors[0])
		// .attr('stroke', '#000')
		// .attr('stroke-width', 1)
		magnBars.exit().remove()
		// 绘制Prob bar
		let probBars = chart.body().selectAll('.prob_bar').data(data)
		// console.log(chart.getBodyHeight() / 2)
		probBars
			.enter()
			.append('rect')
			.attr('class', 'prob_bar')
			.merge(probBars)
			.attr('x', (d) => chart.scaleX(d.index) + 1)
			.attr('y', (d) => chart.scaleY(d.prob) + 1)
			.attr('width', chart.scaleX.bandwidth() - 3)
			.attr('height', (d) =>
				chart.getBodyHeight() / 2 - chart.scaleY(d.prob) > 2
					? 1
					: chart.getBodyHeight() / 2 - chart.scaleY(d.prob) - 1 > 0
					? chart.getBodyHeight() / 2 - chart.scaleY(d.prob) - 1
					: 0
			)
			.attr('fill', '#fff')
			.attr('stroke', '#fff')
			.attr('stroke-width', 1)

		probBars.exit().remove()
		// 绘制phase bar

		let phaseBars = chart.body().selectAll('.phase_bar').data(data)

		phaseBars
			.enter()
			.append('rect')
			.attr('class', 'phase_bar')
			.merge(phaseBars)
			.attr('x', (d) => chart.scaleX(d.index))
			.attr('y', (d) => chart.getBodyHeight() / 2 + 22)
			.attr('width', chart.scaleX.bandwidth())
			.attr('height', (d) => chart.scalePhaseY(d.phase))
			.attr('fill', chart._colors[1])

		phaseBars.exit().remove()
		// 绘制最高的值
		let upTextIndex = 0

		const upMaxNumber = d3.max([...data.map((d) => d.magn), ...data.map((d) => d.prob)])
		let bar_texts = chart.body().selectAll('.bar_text').data([upMaxNumber])
		for (let i = 0; i < data.length; i++) {
			if (data[i].magn === upMaxNumber || data[i].prob === upMaxNumber) {
				upTextIndex = data[i].index
				break
			}
		}
		bar_texts
			.enter()
			.append('text')
			.attr('class', 'bar_text')
			.merge(bar_texts)
			.attr('x', chart.scaleX(upTextIndex) + 10)
			.attr('y', (d) => chart.scaleY(d) - 2)
			.attr('text-anchor', 'middle')
			.text(_.round(upMaxNumber, 2))
			.classed('svgtext', true)
			.attr('style', 'font-size:12px;')
		// .attr('transform', '1')

		bar_texts.exit().remove()

		// 绘制phase的值
		let downTextIndex = 0
		const downMaxNumber = d3.max([...data.map((d) => d.phase)])
		if (downMaxNumber) {
			let bar_texts2 = chart.body().selectAll('.bar_text2').data([downMaxNumber])
			for (let i = 0; i < data.length; i++) {
				if (data[i].phase === downMaxNumber) {
					downTextIndex = data[i].index
					break
				}
			}
			bar_texts2
				.enter()
				.append('text')
				.attr('class', 'bar_text')
				.merge(bar_texts2)
				.attr('x', chart.scaleX(downTextIndex) + 10)
				.attr('y', (d) => chart.getBodyHeight() / 2 + chart.scalePhaseY(d) + 32)
				.attr('text-anchor', 'middle')
				.text(_.round(downMaxNumber, 2) + '°')
				.classed('svgtext', true)
				.attr('style', 'font-size:12px;')
			// .attr('transform', 'scale(0.8)')
			bar_texts2.exit().remove()
		}
	}
	// c视图框选
	const chartBrushFn = (svg, barWidth, config, index, key, chart) => {
		const brushG = svg.append('g')
		let brushed_start = (event) => {
			const { selection, type } = event

			if (selection) {
				const [x0, x1] = selection
			}
		}
		let brush_event = d3.brushX()
		brush_event.on('start', brushed_start)
		const self = this
		let brushed_end = (event) => {
			const { selection, type } = event

			if (selection) {
				svg.select('.brushed_rect').remove()
				const [x0, x1] = selection
				let bars = svg.selectAll('.magn_bar').filter((elm) => {
					const { x } = elm
					return x <= x1 && x > x0
				})

				if (bars.data().length) {
					svg.select('.xAxis')
						.append('rect')
						.classed('brushed_rect', true)
						.attr(
							'width',
							bars.data()[bars.data().length - 1].x -
								bars.data()[0].x +
								barWidth -
								barWidth * config.barPadding
						)
						.attr('x', bars.data()[0].x - config.margins.left - barWidth / 2)
						.attr('y', 1)
						.attr('rx', 3)
						.attr('ry', 3)
						.attr('height', 3)
						.attr('fill', '#1A57F5')

					// 通过传递进来的key 判断当前清空的filter key
					if (filter[key] && filter[key].length) {
						filter[key] = []
					}
					for (let i = 0; i < bars.data().length; i++) {
						if (filter[bars.data()[i].name]) {
							filter[bars.data()[i].name].push(bars.data()[i].index)
						} else {
							filter[bars.data()[i].name] = [bars.data()[i].index]
						}
					}

					const allKeys = Object.keys(props.qc.name2index)
					const filterKeys = Object.keys(filter)
					// if (allKeys.length === filterKeys.length) {
					const filterResult = props.qc.getIndex(index, JSON.parse(JSON.stringify(filter)))
					const filterData = getWholeState.filter((item) => {
						return filterResult.includes(item.index)
					})

					const drawData = { magns: [], phases: [], probs: [], base: [] }
					filterData.forEach((item) => {
						drawData.magns.push(item.magns)
						drawData.phases.push(item.phases)
						drawData.probs.push(item.probs)
						drawData.base.push(item.base)
					})
					drawCdownStackedBar(drawData)

					// 更新C视图上半
					const barData = props.qc.getVarState(index, JSON.parse(JSON.stringify(filter)))

					for (const key in barData) {
						const dataArr = []
						for (let i = 0; i < barData[key].magn.length; i++) {
							// 80 是作图是的margins 的 left 这个x设置的是柱中间的距离 选中超过一半算选中
							dataArr.push({
								name: key,
								magn: barData[key].magn[i],
								prob: barData[key].prob[i],
								phase: barData[key].phase ? barData[key].phase[i] : 0,
								index: i,
								x: barWidth * i + barWidth / 2 + config.margins.left,
							})
						}
						charts.forEach((item) => {
							if (item.key() === key) {
								renderBar(item, dataArr)
							}
						})
					}
				}
				brushG.call(brush_event.clear) // 如果当前有选择才需要清空
				// }
			}
		}
		brush_event.on('end', brushed_end)
		brushG.attr('class', 'brush').call(brush_event)

		brushG.select('.overlay').attr('width', chart.width()).attr('height', chart.height())
	}
	// 绘制C视图下半
	const drawCdownStackedBar = (data) => {
		const chart_down_svg = d3.select('#chart_down_svg')
		chart_down_svg.attr('height', '303px')
		chart_down_svg.selectAll('*').remove()
		const keyArr = Object.keys(data)
		const dataArr = []
		// const barWidth = 20
		for (let i = 0; i < data.magns.length; i++) {
			dataArr.push({
				magns: data.magns[i],
				phases: data.phases[i],
				probs: data.probs[i],
				index: i,
				base: data.base[i],
			})
		}
		if (!getWholeState.length) {
			getWholeState = dataArr
		}
		// const width = barWidth * data.magns.length
		cDownStackedBarChart(dataArr, chart_down_svg)
	}
	const cDownStackedBarChart = (data, g) => {
		const chart = new Chart()
		const config = {
			barPadding: 0.1,
			margins: { top: 20, left: 40, bottom: 0, right: 80 },
			tickShowGrid: [60, 120, 180],
			textColor: 'black',
			gridColor: 'gray',
			hoverColor: 'gray',
			animateDuration: 1000,
		}
		chart.tramsformHeight((data[0].base.length * 15) / 2)
		chart.box(d3.select('.c_down_draw'))
		// console.log()
		chart.width(d3.select('.c_down_draw')._groups[0][0].clientWidth)
		chart.svg(g)
		chart.margins(config.margins)
		chart.scaleX = d3
			.scaleBand()
			.domain(data.map((d) => d.index))
			.range([0, chart.getBodyWidth()])
			.padding(config.barPadding)
		chart.scaleX2 = d3
			.scaleBand()
			.domain(data.map((d) => d.index))
			.range([0, chart.getBodyWidth()])
			.padding(config.barPadding)
		// magnsY 轴
		chart.scaleY = d3
			.scaleLinear()
			.domain([0, d3.max([...data.map((d) => d.magns), ...data.map((d) => d.probs)])])
			.range([chart.getBodyHeight() / 2, 0])
		// phases Y轴
		chart.scaleY2 = d3
			.scaleLinear()
			.domain([0, 360])
			.range([0, chart.getBodyHeight() / 2 - chart.tramsformHeight()])
		// 处理x轴样式
		function customXAxis(g) {
			const z = new XMLSerializer()

			const xAxis = d3.axisBottom(chart.scaleX)
			g.call(xAxis)
			// g.select('.domain').remove()
			g.selectAll('.tick line').remove()
			g.selectAll('.tick text').remove()
			g.selectAll('.tick:nth-of-type(1)')
				.append('foreignObject')
				.attr('width', data[0].base.length * 15)
				.attr('height', 24)
				.attr('style', 'color:rgba(0,0,0,1)')
				.attr('transform', 'scale(0.7) rotate(45)')
				.attr('x', 0)
				.attr('y', 0)
				.append('xhtml:div')
				.attr('height', '100%')
				.attr('width', '100%')
				.html(z.serializeToString(getDirac(data[0].base)))
			g.selectAll('.tick:nth-last-of-type(1)')
				.append('foreignObject')
				.attr('width', data[g.selectAll('.tick')._groups[0].length - 1].base.length * 15)
				.attr('height', 24)
				.attr('style', 'color:rgba(0,0,0,1)')
				.attr('transform', 'scale(0.7) rotate(45)')
				.attr('x', 0)
				.attr('y', 0)
				.append('xhtml:div')
				.attr('height', '100%')
				.attr('width', '100%')
				.html(z.serializeToString(getDirac(data[g.selectAll('.tick')._groups[0].length - 1].base)))
			const context = d3.path()
			// 自定义X轴线
			// context.moveTo(chart.scaleX(0), 0)
			// context.lineTo(chart.scaleX(data.length - 1), 0)
			// g.select('.domain').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1)
		}
		// 处理x2轴样式
		function customXAxis2(g) {
			const xAxis = d3.axisBottom(chart.scaleX)
			g.call(xAxis)
			// g.select('.domain').remove()
			g.selectAll('.tick line').remove()
			// g.selectAll('.tick text').attr('color', 'rgba(0,0,0,0)')
			g.selectAll('.tick text')
				.nodes()
				.forEach(function (t, index) {
					// console.log(data)
					const textSvg = getDirac(data[index].base)
					const z = new XMLSerializer()
					g.select(`.tick:nth-of-type(${index + 1})`)
						.append('foreignObject')
						.attr('width', data[index].base.length * 15)
						.attr('height', 24)
						.attr('style', 'color:rgba(0,0,0,0)')
						.attr('transform', 'scale(0.8) rotate(45)')
						.attr('x', 0)
						.attr('y', 0)
						.append('xhtml:div')
						.attr('height', '100%')
						.attr('width', '100%')
						.html(z.serializeToString(textSvg))
				})

			g.selectAll('.tick text').remove()
			const context = d3.path()
			// 自定义X轴线
			// context.moveTo(chart.scaleX(0), 0)
			// context.lineTo(chart.scaleX(data.length - 1), 0)
			// g.select('.domain').attr('d', context.toString()).attr('stroke', 'none').attr('stroke-width', 1)
		}
		// 处理mangns Y轴样式
		function customYAxis(g) {
			const yAxis = d3
				.axisLeft(chart.scaleY)
				.tickValues([0, d3.max(data, (d) => d.magns.toFixed(2))])
				.tickFormat((d) => `${d}`)
			g.call(yAxis)
			g.select('.domain').remove()
			g.selectAll('.tick line').remove()
			// g.selectAll('.tick')
			g.select('.magnYAxis .tick:nth-of-type(1)').attr(
				'transform',
				`translate(-4,${chart.getBodyHeight() / 2 - 5})`
			)
			// g.selectAll('.tick text').remove()
		}
		// 处理phases Y轴样式
		function customYAxis2(g) {
			const yAxis = d3
				.axisLeft(chart.scaleY2)
				.tickValues([0, 360])
				.tickFormat((d) => `${d}°`)
			g.call(yAxis)
			g.select('.domain').remove()
			g.selectAll('.tick line').remove()
			g.select('.phaseYAxis .tick:nth-of-type(1)').attr('transform', 'translate(0,5)')
		}
		// 绘制bar
		chart.renderMagnsBars = function () {
			let bars = chart.body().selectAll('.magns_bar').data(data)
			bars.enter()
				.append('rect')
				.attr('class', 'magns_bar')
				.merge(bars)
				.attr('x', (d) => chart.scaleX(d.index))
				.attr('y', (d) => (chart.scaleY(d.magns) - 1 > 0 ? chart.scaleY(d.magns) - 1 : 0))
				.attr('width', chart.scaleX.bandwidth())
				.attr('height', (d) => chart.getBodyHeight() / 2 - chart.scaleY(d.magns))
				.attr('fill', chart._colors[0])
			// .attr('stroke', '#000')
			// .attr('stroke-width', 0.5)
			bars.exit().remove()
		}
		chart.renderProbsBars = function () {
			let bars = chart.body().selectAll('.probs_bar').data(data)
			bars.enter()
				.append('rect')
				.attr('class', 'probs_bar')
				.merge(bars)
				.attr('x', (d) => chart.scaleX(d.index) + 0.5)
				.attr('y', (d) => chart.scaleY(d.probs) - 1)
				.attr('width', chart.scaleX.bandwidth() - 1.5)
				.attr('height', (d) =>
					chart.getBodyHeight() / 2 - chart.scaleY(d.probs) > 2
						? 1
						: chart.getBodyHeight() / 2 - chart.scaleY(d.probs) - 1 > 0
						? chart.getBodyHeight() / 2 - chart.scaleY(d.probs) - 1
						: 0
				)
				.attr('fill', '#fff')
				.attr('stroke', '#fff')
				.attr('stroke-width', 1)
			bars.exit().remove()
		}
		chart.renderPhasesBars = function () {
			let bars = chart.body().selectAll('.phases_bar').data(data)
			bars.enter()
				.append('rect')
				.attr('class', 'phases_bar')
				.merge(bars)
				.attr('x', (d) => chart.scaleX(d.index))
				.attr('y', (d) => chart.getBodyHeight() / 2 + 1)
				.attr('width', chart.scaleX.bandwidth())
				.attr('height', (d) => chart.scaleY2(d.phases))
				.attr('fill', chart._colors[1])

			bars.exit().remove()
		}

		chart.renderX = function () {
			chart.svg().select('.xAxis').remove()
			chart
				.svg()
				.insert('g', '.body')
				.attr(
					'transform',
					'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight() / 2) + ')'
				)
				.attr('class', 'xAxis')
				.classed('svgtext', true)
				.call(customXAxis)
		}
		chart.renderX2 = function () {
			chart.svg().select('.xAxis2').remove()
			chart
				.svg()
				.insert('g', '.body')
				.attr(
					'transform',
					'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight() / 2) + ')'
				)
				.attr('class', 'xAxis2')
				.classed('svgtext', true)
				.call(customXAxis2)
		}
		chart.renderMagnsY = function () {
			chart.svg().select('.magnYAxis').remove()
			chart
				.svg()
				.insert('g', '.body')
				.attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
				.attr('class', 'magnYAxis')
				.classed('svgtext', true)
				.call(customYAxis)
		}
		chart.renderPhasesY = function () {
			chart.svg().select('.phaseYAxis').remove()
			chart
				.svg()
				.insert('g', '.body')
				// 'translate(' +
				// 		chart.bodyX() +
				// 		',' +
				// 		(chart.bodyY() + chart.getBodyHeight() / 2 + chart.tramsformHeight()) +
				// 		')'
				.attr(
					'transform',
					'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight() / 2) + ')'
				)

				.attr('class', 'phaseYAxis')
				.classed('svgtext', true)
				.call(customYAxis2)
		}
		// 绘制坐标轴
		chart.renderAxis = function () {
			chart.renderMagnsY()
			chart.renderPhasesY()
			chart.renderX()
			chart.renderX2()
		}
		// 绑定事件
		chart.addMouseOn = function () {
			g.selectAll('.magns_bar')
				.on('mouseover', function (e, d) {
					const textSvg = getDirac(d.base)
					const z = new XMLSerializer()
					const position = d3.pointer(e)
					let tipG
					if (position[0] + String(d.base).length * 10 + 96 > 300) {
						tipG = g
							.append('g')
							.classed('tip', true)
							.attr(
								'transform',
								`translate(${position[0] - String(d.base).length * 10 - 70},${position[1] - 5})`
							)
					} else {
						tipG = g
							.append('g')
							.classed('tip', true)
							.attr('transform', `translate(${position[0] + 85},${position[1] - 5})`)
					}

					tipG.append('rect')
						.attr('stroke', '#ccc')
						.attr('stroke-width', 1)
						.attr('height', 44)
						.attr('width', String(d.base).length * 10 + 96)
						.attr('fill', '#fff')
						.attr('rx', 2)
					const text = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 18)
					text.append('tspan').text('Base:')
					tipG.append('foreignObject')
						.attr('width', String(d.base).length * 10 + 12)
						.attr('height', 24)
						// .attr('transform', 'scale(1)')
						.attr('x', 38)
						.attr('y', 2)
						.append('xhtml:div')
						.attr('height', '100%')
						.attr('width', '100%')
						.html(z.serializeToString(textSvg))
					const text2 = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 36)
						.text(`Maganitue:${_.round(d.magns, 2)}`)
				})
				.on('mouseleave', function (e, d) {
					g.select('.tip').remove()
				})
				.on('mousemove', function (e, d) {
					const position = d3.pointer(e)
					if (position[0] + String(d.base).length * 10 + 96 > 300) {
						g.select('.tip').attr(
							'transform',
							`translate(${position[0] - String(d.base).length * 10 - 70},${position[1] - 5})`
						)
					} else {
						g.select('.tip').attr('transform', `translate(${position[0] + 55},${position[1] - 5})`)
					}
				})
			g.selectAll('.probs_bar')
				.on('mouseover', function (e, d) {
					const textSvg = getDirac(d.base)
					const z = new XMLSerializer()

					const position = d3.pointer(e)
					let tipG
					if (position[0] + String(d.base).length * 10 + 77 > 300) {
						tipG = g
							.append('g')
							.classed('tip', true)
							.attr(
								'transform',
								`translate(${position[0] - String(d.base).length * 10 - 50},${position[1] - 5})`
							)
					} else {
						tipG = g
							.append('g')
							.classed('tip', true)
							.attr('transform', `translate(${position[0] + 85},${position[1] - 5})`)
					}

					tipG.append('rect')
						.attr('stroke', '#ccc')
						.attr('stroke-width', 1)
						.attr('height', 44)
						.attr('width', String(d.base).length * 10 + 77)
						.attr('fill', '#fff')
						.attr('rx', 2)
					const text = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 18)
					text.append('tspan').text('Base:')
					tipG.append('foreignObject')
						.attr('width', String(d.base).length * 10 + 12)
						.attr('height', 24)
						// .attr('transform', 'scale(1)')
						.attr('x', 38)
						.attr('y', 2)
						.append('xhtml:div')
						.attr('height', '100%')
						.attr('width', '100%')
						.html(z.serializeToString(textSvg))
					const text2 = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 36)
						.text(`Probability:${_.round(d.probs, 2)}`)
				})
				.on('mouseleave', function (e, d) {
					g.select('.tip').remove()
				})
				.on('mousemove', function (e, d) {
					const position = d3.pointer(e)
					if (position[0] + String(d.base).length * 10 + 77 > 300) {
						g.select('.tip').attr(
							'transform',
							`translate(${position[0] - String(d.base).length * 10 - 50},${position[1] - 5})`
						)
					} else {
						g.select('.tip').attr('transform', `translate(${position[0] + 55},${position[1] - 5})`)
					}
				})
			g.selectAll('.phases_bar')
				.on('mouseover', function (e, d) {
					const textSvg = getDirac(d.base)

					const z = new XMLSerializer()
					const position = d3.pointer(e)
					let tipG
					if (position[0] + String(d.base).length * 10 + 60 > 300) {
						tipG = g
							.append('g')
							.classed('tip', true)
							.attr(
								'transform',
								`translate(${position[0] - String(d.base).length * 10 - 30},${position[1] - 5})`
							)
					} else {
						tipG = g
							.append('g')
							.classed('tip', true)
							.attr('transform', `translate(${position[0] + 85},${position[1] - 5})`)
					}

					tipG.append('rect')
						.attr('stroke', '#ccc')
						.attr('stroke-width', 1)
						.attr('height', 44)
						.attr('width', String(d.base).length * 10 + 60)
						.attr('fill', '#fff')
						.attr('rx', 2)
					const text = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 18)
					text.append('tspan').text('Base:')
					tipG.append('foreignObject')
						.attr('width', String(d.base).length * 10 + 12)
						.attr('height', 24)
						// .attr('transform', 'scale(1)')
						.attr('x', 38)
						.attr('y', 2)
						.append('xhtml:div')
						.attr('height', '100%')
						.attr('width', '100%')
						.html(z.serializeToString(textSvg))
					const text2 = tipG
						.append('text')
						.attr('fill', chart.textColor)
						.classed('svgtext', true)
						.attr('x', 4)
						.attr('y', 36)
						.text(`Phase:${_.round(d.phases, 2)}`)
				})
				.on('mouseleave', function (e, d) {
					g.select('.tip').remove()
				})
				.on('mousemove', function (e, d) {
					const position = d3.pointer(e)
					if (position[0] + String(d.base).length * 10 + 60 > 300) {
						g.select('.tip').attr(
							'transform',
							`translate(${position[0] - String(d.base).length * 10 - 30},${position[1] - 5})`
						)
					} else {
						g.select('.tip').attr('transform', `translate(${position[0] + 55},${position[1] - 5})`)
					}
				})
		}
		// 缩放
		chart.addZoom = function () {
			// console.log(getDirac(123))
			const extent = [
				[0, config.margins.top],
				[chart.getBodyWidth(), chart.getBodyHeight()],
			]
			chart.svg().call(d3.zoom().scaleExtent([1, 8]).translateExtent(extent).extent(extent).on('zoom', zoomed))
			function zoomed(event) {
				chart.scaleX.range([0, chart.getBodyWidth()].map((d) => event.transform.applyX(d)))
				chart.scaleX2.range([0, chart.getBodyWidth()].map((d) => event.transform.applyX(d)))
				chart
					.svg()
					.selectAll('.magns_bar')
					.attr('x', (d) => chart.scaleX(d.index))
					.attr('width', chart.scaleX.bandwidth())
				chart
					.svg()
					.selectAll('.probs_bar')
					.attr('x', (d) => chart.scaleX(d.index) + 0.5)
					.attr('width', chart.scaleX.bandwidth() - 1.5)
				chart
					.svg()
					.selectAll('.phases_bar')
					.attr('x', (d) => chart.scaleX(d.index))
					.attr('width', chart.scaleX.bandwidth())
				chart.svg().selectAll('.xAxis').call(chart.renderX)
				chart.svg().selectAll('.xAxis2').call(chart.renderX2)

				// 5.28 目前试的大概显示24个柱子
				if (event.transform.k > 5.28) {
					const zoomHeight = chart.tramsformHeight()

					// magnsY 轴
					chart.scaleY.range([chart.getBodyHeight() / 2, zoomHeight])
					// phases Y轴
					chart.scaleY2.range([0, chart.getBodyHeight() / 2 - zoomHeight])

					chart
						.svg()
						.selectAll('.magns_bar')
						.attr('height', (d) =>
							chart.getBodyHeight() / 2 - chart.scaleY(d.magns) > 0
								? chart.getBodyHeight() / 2 - chart.scaleY(d.magns)
								: 0
						)
						.attr('y', (d) => chart.scaleY(d.magns) - zoomHeight)
						.attr('stroke-width', 1)
					chart
						.svg()
						.selectAll('.probs_bar')
						.attr('height', (d) =>
							chart.getBodyHeight() / 2 - chart.scaleY(d.probs) > 1
								? 1
								: chart.getBodyHeight() / 2 - chart.scaleY(d.probs)
						)
						.attr('y', (d) => chart.scaleY(d.probs) - zoomHeight)

					chart
						.svg()
						.selectAll('.phases_bar')
						.attr('y', (d) => chart.getBodyHeight() / 2 + zoomHeight + 1)
						.attr('height', (d) => chart.scaleY2(d.phases))

					chart.svg().selectAll('.xAxis2 .tick foreignObject').attr('style', 'color:rgb(0,0,0)')
					chart.svg().selectAll('.xAxis .tick foreignObject').attr('style', 'color:rgba(0,0,0,0)')
					chart
						.svg()
						.select('.xAxis')
						.attr(
							'transform',
							'translate(' +
								chart.bodyX() +
								',' +
								(chart.bodyY() + chart.getBodyHeight() / 2 + zoomHeight) +
								')'
						)
					chart
						.svg()
						.select('.xAxis2')
						.attr(
							'transform',
							'translate(' +
								chart.bodyX() +
								',' +
								(chart.bodyY() + chart.getBodyHeight() / 2 - zoomHeight) +
								')'
						)
					// g.selectAll('.tick text')
					chart.svg().select('.xAxis2 .domain').attr('stroke', '#000')
					chart.svg().selectAll('.magnYAxis').call(chart.renderMagnsY)
					chart.svg().selectAll('.phaseYAxis').call(chart.renderPhasesY)
					const newY = chart.bodyY() - zoomHeight
					chart
						.svg()
						.selectAll('.magnYAxis')
						.attr('transform', 'translate(' + chart.bodyX() + ',' + newY + ')')
					chart
						.svg()
						.selectAll('.phaseYAxis')
						.attr(
							'transform',
							'translate(' +
								chart.bodyX() +
								',' +
								(chart.bodyY() + chart.getBodyHeight() / 2 + zoomHeight) +
								')'
						)
				} else {
					// magnsY 轴
					chart.scaleY.range([chart.getBodyHeight() / 2, 0])
					// phases Y轴
					chart.scaleY2.range([0, chart.getBodyHeight() / 2])

					const newY = chart.bodyY()
					chart
						.svg()
						.selectAll('.magnYAxis')
						.attr('transform', 'translate(' + chart.bodyX() + ',' + newY + ')')

					chart
						.svg()
						.selectAll('.phaseYAxis')
						.attr(
							'transform',
							'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight() / 2) + ')'
						)
					chart
						.svg()
						.selectAll('.magns_bar')
						.attr('height', (d) => chart.getBodyHeight() / 2 - chart.scaleY(d.magns))
						.attr('y', (d) => (chart.scaleY(d.magns) - 1 > 0 ? chart.scaleY(d.magns) - 1 : 0))
						.attr('stroke-width', 0.5)
					chart
						.svg()
						.selectAll('.probs_bar')
						.attr('height', (d) =>
							chart.getBodyHeight() / 2 - chart.scaleY(d.probs) > 2
								? 1
								: chart.getBodyHeight() / 2 - chart.scaleY(d.probs) - 1 > 0
								? chart.getBodyHeight() / 2 - chart.scaleY(d.probs) - 1
								: 0
						)
						.attr('y', (d) => chart.scaleY(d.probs) - 1)
					chart
						.svg()
						.selectAll('.phases_bar')
						.attr('y', (d) => chart.getBodyHeight() / 2 + 1)
						.attr('height', (d) => chart.scaleY2(d.phases))
					chart
						.svg()
						.selectAll('.xAxis2 .tick foreignObject')

						.attr('style', 'color:rgba(0,0,0,0)')
					chart.svg().selectAll('.xAxis .tick foreignObject').attr('style', 'color:rgba(0,0,0,1)')
					chart
						.svg()
						.select('.xAxis')
						.attr(
							'transform',
							'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight() / 2) + ')'
						)
					chart
						.svg()
						.select('.xAxis2')
						.attr(
							'transform',
							'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight() / 2) + ')'
						)
					chart.svg().select('.xAxis2 .domain').attr('stroke', 'none')

					chart.svg().selectAll('.magnYAxis').call(chart.renderMagnsY)
					chart.svg().selectAll('.phaseYAxis').call(chart.renderPhasesY)
				}
			}
		}
		// 总体绘制
		chart.render = function () {
			chart.renderMagnsBars()
			chart.renderProbsBars()
			chart.renderPhasesBars()
			chart.addMouseOn()
			chart.addZoom()
			chart.renderAxis()
		}
		chart.renderChart()
	}
	useImperativeHandle(props.onRef, () => {
		return {
			drawCFn: drawCFn,
		}
	})
	return (
		<div className='c_component'>
			<div className='title'>
				<span className='title_name'>
					Variable State
					<Tooltip placement='right' title={'Here is the panel to inspect the intermediate variable state.'}>
						<span className='tip_svg'></span>
					</Tooltip>
				</span>
				<Button className='export_btn restore_btn' onClick={restore}>
					restore filter
				</Button>
			</div>
			<div className='c_up_draw'>
				<svg id='chart_svg'></svg>
			</div>
			<div className='title'>
				<span className='title_name'>
					System State
					<Tooltip placement='right' title={'Here is the panel to inspect the global quantum system state.'}>
						<span className='tip_svg'></span>
					</Tooltip>
				</span>
			</div>
			<div className='c_down_draw'>
				<svg id='chart_down_svg'></svg>
			</div>
		</div>
	)
}
export default Ccomponent
