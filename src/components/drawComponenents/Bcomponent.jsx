import React, { useState, useEffect } from 'react'
import '../core/Right.css'
import { Button, Tooltip } from 'antd'
import * as d3 from 'd3'
import { getDirac } from '../Mathjax'
const _ = require('lodash')
const Bcomponent = (props) => {
	// write1三角形背景色
	const write1Background = '#fff'
	// write1字体颜色
	const write1FontColor = '#000'
	// write0三角形背景色
	const write0Background = '#fff'
	// write0字体颜色
	const write0FontColor = '#000'
	// had字体颜色
	const hadFontColor = '#000'
	// 存储d模块圆形颜色
	const dCircleUsedColor = 'rgb(246, 175, 31)'
	const dCircleColor = 'rgba(142, 132, 112,0.5)'
	// 互补的圆形透明度
	const dCircleColorOpacity = 0.3
	// d模块浅色块颜色
	const dLightRectColor = 'rgb(137, 214, 220)'
	// 浅色块条形图的颜色
	const dBarColor = 'rgb(137, 214, 220)'
	// 设置比例
	const scaleNum = 3
	// 设置空白和间距
	const svgItemWidth = 30
	const firstX = svgItemWidth * scaleNum
	// labels副本
	const copyLabels = []
	const svgItemHeight = 30
	// 鼠标放上的小label宽
	const svgItemLabelWidth = 30
	const gate_offest = 0

	// label位置的偏移 x - 图形的宽
	const labelTranslate = firstX - svgItemWidth / 2
	const exportD3SVG = (data) => {
		const svg = d3.select('#circuit_svg')
		const drawG = svg.select('#circuit_graph')
		const brushG = svg.select('#circuit_brush')
		const labelG = svg.select('#circuit_label')
		const brushLabelG = svg.select('#brush_label')
		// 移除已经添加过的
		drawG.selectAll('*').remove()
		labelG.selectAll('*').remove()
		brushLabelG.selectAll('*').remove()
		const { operations, qubit_number, circuit } = data
		// 列数
		const row = circuit.gates[0].length
		const col = circuit.gates.length

		const svgWidth = (row + scaleNum) * svgItemWidth > 1299 ? (row + scaleNum) * svgItemWidth : 1299
		// 设置SVG宽高 高度整体下移了一行
		svg.attr('width', svgWidth)
		svg.attr('height', (col + 4) * svgItemHeight - 50)
		// 加Label,先加载label label在最底层
		for (let i = 0; i < data.labels.length; i++) {
			if (data.labels[i].text && data.labels[i].end_operation !== undefined) {
				const obj = data.getLabelUpDown(data.labels[i].id)
				if (obj.down_qubit !== Infinity && obj.up_qubit !== Infinity) {
					const lineCol = data.labels[i].end_operation - data.labels[i].start_operation
					const labelRow = obj.down_qubit - obj.up_qubit
					drawLabel(
						labelG,
						(svgItemWidth + gate_offest) * data.labels[i].start_operation + labelTranslate,
						svgItemHeight * (obj.up_qubit + 1.5),
						(svgItemWidth + gate_offest) * lineCol,
						svgItemHeight * labelRow,
						data.labels[i].text,
						data.labels[i].id
					)
				}
			}
		}
		/**
		 * 预留了前边是firstX，画线和添加name
		 */
		for (let i = 0; i < col; i++) {
			drawLine(
				drawG,
				firstX,
				svgItemHeight * (i + 2),
				(row + 3) * svgItemWidth > 1299 ? (row + 3) * svgItemWidth : 1299,
				svgItemHeight * (i + 2)
			)
			drawName(drawG, svgItemWidth * 2 + 5, svgItemHeight * (i + 2), 'Q' + i)
		}
		// 绘制选择线
		for (let i = 0; i < row; i++) {
			drawCselectLine(
				drawG,
				svgItemWidth * (i + 3) + 14,
				svgItemHeight * 2 - 6,
				svgItemHeight * col - 15,
				i,
				data
			)
		}
		// 加入Qint, 右边的继承关系
		for (const key in data.name2index) {
			for (let i = 0; i < data.name2index[key].length; i++) {
				const lineNum = data.name2index[key][data.name2index[key].length - 1] - data.name2index[key][0]
				drawQint(
					drawG,
					svgItemWidth * 2,
					svgItemHeight * (data.name2index[key][0] + 2),
					svgItemHeight * lineNum - 10,
					key
				)
			}
		}

		// 处理操作
		//  drawOperations(drawG, operations, data)
		// 处理操作2.0
		drawOperations2(drawG, circuit.gates, data)
		// 框选
		brushedFn(svg, brushG, brushLabelG)
		// 绘制d模块
		//  drawDChart()
		// 加入折线图
		drawLineChart(row, svgWidth)
        props.drawCFn(operations.length - 1)
	}
	const drawWrite1 = (svg, x, y, operation) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none').classed('operation_item', true)
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(3, 3)
		context.lineTo(20, 10)
		context.lineTo(3, 17)
		childG
			.append('path')
			.attr('d', context.toString())
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', write1Background)
			.classed('operation_item', true)
		childG
			.append('rect')
			.attr('x', 2)
			.attr('y', 7)
			.attr('width', 2)
			.attr('height', 6)
			.attr('fill', write1FontColor)
			.classed('operation_item', true)
		return parentG
	}
	const drawWrite0 = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none').classed('operation_item', true)
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(3, 3)
		context.lineTo(20, 10)
		context.lineTo(3, 17)
		childG
			.append('path')
			.attr('d', context.toString())
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', write0Background)
			.classed('operation_item', true)
		childG
			.append('circle')
			.attr('cx', 4)
			.attr('cy', 10)
			.attr('r', 3)
			.attr('stroke-width', 1)
			.attr('stroke', write0FontColor)
			.attr('fill', 'none')
			.classed('operation_item', true)
		return parentG
	}
	const drawH = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG
			.append('rect')
			.attr('width', 20)
			.attr('height', 20)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('text')
			.attr('x', 10)
			.attr('y', 15)
			.attr('style', `font-size:16px;font-weight:bold;`)
			.append('tspan')
			.text('H')
			.attr('text-anchor', 'middle')
			.classed('svgtext', true)
			.classed('operation_item', true)
		return parentG
	}
	const drawRead = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG
			.append('rect')
			.attr('width', 20)
			.attr('height', 20)
			.attr('fill', 'none')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(3, 14)
		context.quadraticCurveTo(10, 4, 17, 14)
		context.moveTo(10, 16)
		context.lineTo(16, 8)
		childG
			.append('path')
			.attr('d', context.toString())
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', 'none')
			.classed('operation_item', true)
		// 读取到的值
		// childG.append('rect').attr('x', 17).attr('y', 3).attr('width', 1).attr('height', 5).attr('fill', 'blue')
		// childG
		// 	.append('circle')
		// 	.attr('cx', 16)
		// 	.attr('cy', 4)
		// 	.attr('r', 2)
		// 	.attr('stroke-width', 1)
		// 	.attr('stroke', 'blue')
		// 	.attr('fill', 'none')
		return parentG
	}
	// 需要计算直线和target位置再加个实心圆
	const drawCcnot = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)
		const context = d3.path()
		context.moveTo(10, 1)
		context.lineTo(10, 19)
		context.moveTo(1, 10)
		context.lineTo(19, 10)
		childG
			.append('path')
			.attr('d', context.toString())
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', 'none')
			.classed('operation_item', true)
		return parentG
	}
	// ry
	const drawRy = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)

		childG.append('text').attr('x', 4).attr('y', 13).text('ry').classed('svgtext', true)
		return parentG
	}
	// rx
	const drawRx = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)

		childG.append('text').attr('x', 4).attr('y', 13).text('rx').classed('svgtext', true)
		return parentG
	}
	//x,y 等传参统一显示
	// rx
	const drawNameCircle = (svg, x, y, name, textY) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)

		childG
			.append('text')
			.attr('x', 7)
			.attr('y', textY || 13)
			.text(name)
			.classed('svgtext', true)
		return parentG
	}
	const drawNameCircletwoLength = (svg, x, y, name, testX) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)

		childG
			.append('text')
			.attr('x', testX || 4)
			.attr('y', 13)
			.text(name)
			.classed('svgtext', true)
		return parentG
	}
	const drawNameCirclethreeLength = (svg, x, y, name, testX) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)

		childG
			.append('text')
			.attr('x', testX || 3)
			.attr('y', 13)
			.attr('style', `font-size:9px;`)
			.text(name)
			.classed('svgtext', true)
		return parentG
	}
	// rz
	const drawRz = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)

		childG.append('text').attr('x', 4).attr('y', 13).text('rz').classed('svgtext', true)
		return parentG
	}
	// u2/u3
	const drawUnumber = (svg, x, y, name) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)

		childG.append('text').attr('x', 2).attr('y', 13).text(name).classed('svgtext', true)
		return parentG
	}
	// srn
	const drawSrn = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)

		childG.append('text').attr('x', 2).attr('y', 13).text('√x').classed('svgtext', true)

		return parentG
	}
	// srndg
	const drawSrndg = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)

		childG.append('text').attr('x', 0).attr('y', 13).text('√x').classed('svgtext', true)
		childG.append('text').attr('x', 12).attr('y', 10).text('+').classed('svgtext', true)
		return parentG
	}
	// s/t deg
	const drawSDg = (svg, x, y, name) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)

		childG.append('text').attr('x', 6).attr('y', 13).text(name).classed('svgtext', true)
		childG.append('text').attr('x', 10).attr('y', 10).text('+').classed('svgtext', true)
		return parentG
	}
	// 叉号 x
	const drawSwap = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none').classed('operation_item', true)
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(2, 2)
		context.lineTo(18, 18)
		context.moveTo(18, 2)
		context.lineTo(2, 18)
		childG
			.append('path')
			.attr('d', context.toString())
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', 'none')
			.classed('operation_item', true)
		return parentG
	}

	const drawCCPhase = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 10)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 4)
			.attr('fill', 'none')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)
		const context = d3.path()
		context.moveTo(12, 2)
		context.lineTo(9, 18)
		childG
			.append('path')
			.attr('d', context.toString())
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', 'none')
			.classed('operation_item', true)
		return parentG
	}
	//  绘制需要的实心圆，实线
	const drawCircle = (svg, x, y) => {
		svg.append('circle')
			.attr('cx', x)
			.attr('cy', y)
			.attr('r', 4)
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', '#000')
			.classed('operation_item', true)
	}
	// x,y 起始位置 targetX/Y 结束位置
	const drawLine = (svg, x, y, targetX, targetY, color) => {
		const context = d3.path()
		context.moveTo(x, y)
		context.lineTo(targetX, targetY)
		svg.append('path')
			.attr('d', context.toString())
			.attr('stroke', `${color ? color : '#000'}`)
			.attr('stroke-width', 1)
			.attr('fill', 'none')
	}
	// 绘制label
	const drawLabel = (svg, x, y, width, height, labelText, labelId, isBrushed) => {
		const parentG = svg
			.append('g')
			.attr('transform', `translate(${x}, ${y})`)
			.classed(`label_${labelId}`, true)
			.classed('label_item', true)
		const outRect = parentG
			.append('rect')
			.attr('width', width)
			.attr('height', height)
			.attr('fill', '#f2f2f2')
			.attr('rx', 10)
			.attr('opacity', '0.5')

		const context = d3.path()
		context.moveTo(0, 10)
		context.quadraticCurveTo(0, 0, 10, 0)
		context.lineTo(width - 10, 0)
		context.quadraticCurveTo(width, 0, width, 10)
		context.moveTo(0, height - 10)
		context.quadraticCurveTo(0, height, 10, height)
		context.lineTo(width - 10, height)
		context.quadraticCurveTo(width, height, width, height - 10)

		if (isBrushed) {
			outRect.classed('brush_label_rect', true)
			const textG = parentG.append('g').attr('transform', `translate(${width / 2},${height + 7}) scale(0.6)`)
			textG
				.append('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', 10)
				.attr('fill', 'none')
				.attr('stroke', 'rgb(0,0,0)')
				.attr('stroke-width', 0.5)
			textG
				.append('text')
				.attr('x', 0)
				.attr('y', 5)
				.attr('text-anchor', 'middle')
				.text(labelText)
				.classed('svgtext', true)
				.attr('fill', 'rgb(0,0,0)')
			parentG
				.append('path')
				.attr('d', context.toString())
				.attr('stroke', 'rgb(100, 159, 174)')
				.attr('stroke-width', 1)
				.attr('fill', 'none')
		} else {
			const textG = parentG.append('g').attr('transform', `translate(${width / 2},${height + 7}) scale(0.8)`)
			textG
				.append('text')
				.attr('x', 0)
				.attr('y', 5)
				.attr('text-anchor', 'middle')
				.text(labelText)
				.classed('svgtext', true)
			parentG
				.append('path')
				.attr('d', context.toString())
				.attr('stroke', 'rgb(100, 159, 174)')
				.attr('stroke-width', 1)
				.attr('fill', 'none')
		}
	}
	// 绘制q
	const drawName = (svg, x, y, name) => {
		// const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		// const rect = parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none')
		svg.append('text')
			.attr('x', x)
			.attr('y', y + 5)
			.attr('text-anchor', 'middle')
			.text(name)
			.attr('font-size', 14)
			.classed('svgtext', true)
	}
	// 绘制括号Qint
	const drawQint = (svg, x, y, height, name) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		const context = d3.path()
		context.moveTo(10, 0)
		context.quadraticCurveTo(0, 0, 0, 10)
		context.lineTo(0, height - 10)
		context.quadraticCurveTo(0, height, 10, height)
		parentG
			.append('path')
			.attr('d', context.toString())
			.attr('stroke', 'rgb(100, 159, 174)')
			.attr('stroke-width', 1)
			.attr('fill', 'none')
		parentG
			.append('text')
			.attr('width', 20)
			.attr('x', -10)
			.attr('y', height / 2)
			.attr('text-anchor', 'end')
			.text(name)
			.classed('svgtext', true)
	}
	// 绘制r2/r4
	const drawRnumber = (svg, x, y, name) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG
			.append('rect')
			.attr('width', 20)
			.attr('height', 20)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('text')
			.attr('x', 10)
			.attr('y', 13)
			.attr('style', `font-size:8px;`)
			.append('tspan')
			.text(name)
			.attr('text-anchor', 'middle')
			.classed('svgtext', true)
			.classed('operation_item', true)
		return parentG
	}
	// 绘制srs/i swap

	const drawSrsswap = (svg, x, y, name) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG
			.append('rect')
			.attr('width', 20)
			.attr('height', 20)
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.classed('operation_item', true)
		const childG = parentG.append('g')
		childG
			.append('text')
			.attr('x', 10)
			.attr('y', 13)
			.attr('style', `font-size:8px;`)
			.append('tspan')
			.text(name)
			.attr('text-anchor', 'middle')
			.classed('svgtext', true)
			.classed('operation_item', true)
		return parentG
	}
	// 绘制self defined gate
	const drawSelfDefinedGate = (svg, x, y) => {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG
			.append('rect')
			.attr('width', 20)
			.attr('height', 20)
			.attr('fill', '#fff')
			.attr('stroke-width', 1)
			.attr('stroke', '#000')
			.attr('rx', 4)
			.classed('operation_item', true)
	}
	// 鼠标选中效果
	const drawMouseHover = (svg, x, y, height) => {
		svg.append('rect')
			.attr('width', svgItemLabelWidth)
			.attr('height', height)
			.attr('rx', 10)
			.attr('opacity', '0.5')
			.attr('x', x)
			.attr('y', y)
			.attr('class', 'item_label_rect')
			.attr('fill', 'transparent')
		const context = d3.path()
		context.moveTo(x, y + 10)
		context.quadraticCurveTo(x, y, x + 10, y)
		context.lineTo(x + svgItemLabelWidth - 10, y)
		context.quadraticCurveTo(x + svgItemLabelWidth, y, x + svgItemLabelWidth, y + 10)
		context.moveTo(x, y + height - 10)
		context.quadraticCurveTo(x, y + height, x + 10, y + height)
		context.lineTo(x + svgItemLabelWidth - 10, y + height)
		context.quadraticCurveTo(x + svgItemLabelWidth, y + height, x + svgItemLabelWidth, y + height - 10)
		svg.append('path')
			.attr('d', context.toString())
			.attr('stroke-width', 1)
			.attr('class', 'item_label_path')
			.attr('fill', 'transparent')
		// svg.on('mouseover', function () {
		// 	d3.select(this).select('.item_label_path').attr('stroke', 'rgb(100, 159, 174)')
		// 	d3.select(this).select('.item_label_rect').attr('fill', '#f2f2f2')
		// })
		// svg.on('mouseout', function () {
		// 	d3.select(this).select('.item_label_path').attr('stroke', 'transparent')
		// 	d3.select(this).select('.item_label_rect').attr('fill', 'transparent')
		// })
	}
	// 绘制C模块选中线
	const drawCselectLine = (svg, x, y, height, index, data) => {
		const parentG = svg
			.append('g')
			.attr('transform', `translate(${x}, ${y})`)
			.attr('style', 'cursor:pointer;')
			.classed('select_line', true)
		parentG
			.append('rect')
			.attr('width', 10)
			.attr('height', height)
			.attr('fill', 'transparent')
			.attr('x', -5)
			.attr('y', -5)
			.attr('operationIndex', index)
		parentG
			.append('rect')
			.attr('width', 2)
			.attr('height', height)
			.attr('fill', 'transparent')
			.classed('select_rect', true)
			.attr('operationIndex', index)
			.classed('no_click', true)
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(1, 1)
		context.lineTo(6, -4)
		context.lineTo(-4, -4)
		context.closePath()
		context.moveTo(1, height - 1)
		context.lineTo(6, height + 5)
		context.lineTo(-4, height + 5)
		context.closePath()
		childG
			.append('path')
			.attr('d', context.toString())
			.attr('stroke', 'transparent')
			.attr('stroke-width', 1)
			.attr('fill', 'transparent')
			.classed('select_path', true)
			.classed('no_click', true)
		parentG
			.on('click', function (e) {
				d3.selectAll('.select_path')
					.attr('stroke', 'transparent')
					.attr('fill', 'transparent')
					.classed('no_click', true)
				d3.selectAll('.select_rect')
					.attr('stroke', 'transparent')
					.attr('fill', 'transparent')
					.classed('no_click', true)
				d3.select(this)
					.select('.select_path')
					.attr('stroke', 'rgb(149, 143, 143)')
					.attr('fill', 'rgb(149, 143, 143)')
					.attr('class', 'select_path')
				d3.select(this).select('.select_rect').attr('fill', 'rgb(149, 143, 143)').attr('class', 'select_rect')
				props.drawCFn(e.target.attributes.operationIndex.value)
			})
			.on('mouseover', function (e) {
				d3.selectAll('.no_click').attr('stroke', 'transparent').attr('fill', 'transparent')
				d3.select(this).select('.no_click').attr('fill', 'rgb(149, 143, 143,0.5)')
			})
			.on('mouseleave', function (e) {
				d3.selectAll('.no_click').attr('stroke', 'transparent').attr('fill', 'transparent')
			})
	}

	// b视图框选
	const brushedFn = (svg, brushG, labelG) => {
		// Example: https://observablehq.com/@d3/double-click-brush-clear

		let brushed_start = (event) => {
			const { selection, type } = event
			if (selection) {
				// const [[x0, y0], [x1, y1]] = selection;
				const [x0, x1] = selection
			}
		}

		// let brushed = (event) => {
		// 	const {selection, type} = event
		// 	console.log(event)
		// 	if (selection) {
		// 		const [[x0, y0], [x1, y1]] = selection;

		// 	}
		// }

		let brush_event = d3.brushX() //如果是用brush是const [[x0, y0], [x1, y1]] = selection;
		brush_event.on('start', brushed_start)
		// .on("brush", brushed)
		let brushed_end = (event) => {
			const { selection, type } = event
			if (selection) {
				// const [[x0, y0], [x1, y1]] = selection;
				const [x0, x1] = selection

				let operation_notations = svg.selectAll('.operation_g').filter((elm) => {
					const { x } = elm
					return x <= x1 && x > x0
				})
				if (operation_notations.data().length) {
					// 绘制label
					const qubitsArr = []
					const indexArr = []
					for (let i = 0; i < operation_notations.data().length; i++) {
						indexArr.push(operation_notations.data()[i].col)
						qubitsArr.push(operation_notations.data()[i].line)
					}
					const down_qubit = Math.max(...qubitsArr) //  down_qubit
					const up_qubit = Math.min(...qubitsArr) // up_qubit
					const start_operation = Math.min(...indexArr) // start_operation
					const end_operation = Math.max(...indexArr) // end_operation
					const lineCol = end_operation - start_operation + 1
					const labelRow = down_qubit - up_qubit + 1
					const labelObj = props.qc.createlabel(start_operation, end_operation + 1)
					drawLabel(
						labelG,
						svgItemWidth * start_operation + labelTranslate,
						svgItemHeight * (up_qubit + 1.5),
						svgItemWidth * lineCol,
						svgItemHeight * labelRow,
						labelObj.id,
						labelObj.id,
						true
					)
					// drawDChart({ labels: [labelObj] })
                    props.drawDChart({ labels: [labelObj] })
					if (copyLabels.length) {
						copyLabels.push(labelObj)
					}
				}

				brushG.call(brush_event.clear) // 如果当前有选择才需要清空
			}
		}
		brush_event.on('end', brushed_end)
		brushG.attr('class', 'brush').call(brush_event)
	}
	// y坐标
	// line: 行数
	// col: 列数
	const operationY = (line) => {
		return svgItemHeight * (line + 2)
	}
	// x坐标
	// col:列数
	const operationX = (col) => {
		return (svgItemWidth + gate_offest) * (col + scaleNum)
	}
	// 弧度转度数
	const radianToAngle = (radian) => {
		if (typeof radian === 'string') {
			const num1 = Number(radian.split('/')[1])
			const num2 = Number(radian.split('/')[0].split('p')[0]) ? Number(radian.split('/')[0].split('p')[0]) : 1
			return _.round(_.divide(_.multiply(_.divide(_.multiply(num2, Math.PI), num1), 180), Math.PI)) + '°'
		} else {
			return _.round(_.divide(_.multiply(radian, 180), Math.PI)) + '°'
		}
	}

	// 2.0处理circuit.gates
	const drawOperations2 = (svg, gates, data) => {
		for (let i = 0; i < gates.length; i++) {
			for (let j = 0; j < gates[i].length; j++) {
				if (gates[i][j]) {
					const operation = gates[i][j]
					operation.x = operationX(j)
					operation.line = i
					operation.col = j
					const name = gates[i][j].name
					const connector = gates[i][j].connector
					switch (name) {
						case 'write0':
							const writeG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							writeG.datum(operation) //绑定数据到dom节点
							drawWrite0(writeG, operationX(j), operationY(i))
							writeG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 48)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('write0')
							})
							writeG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							writeG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'write1':
							const writeG1 = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							writeG1.datum(operation) //绑定数据到dom节点
							drawWrite1(writeG1, operationX(j), operationY(i))
							writeG1.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 48)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('write1')
							})
							writeG1.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							writeG1.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'h':
							const hG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							hG.datum(operation)
							drawH(hG, operationX(j), operationY(i))
							hG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 20},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 18)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('H')
							})
							hG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							hG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'swap':
							const swapG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							swapG.datum(operation) //绑定数据到dom节点
							if (connector > 0) {
								const swapAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											swapAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...swapAllArr)
								const min = Math.min(...swapAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									swapG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(swapG, operationX(j), operationY(min), operationX(j), operationY(max))
								}
								drawSwap(swapG, operationX(j), operationY(i))
							} else {
								drawSwap(swapG, operationX(j), operationY(i))
							}
							swapG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 38)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('swap')
							})
							swapG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							swapG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cx':
							const ccnotG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							ccnotG.datum(operation)
							if (connector === 0) {
								drawCircle(ccnotG, operationX(j), operationY(i))
							} else {
								const cxAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cxAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...cxAllArr)
								const min = Math.min(...cxAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									ccnotG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(ccnotG, operationX(j), operationY(min), operationX(j), operationY(max))
									drawCcnot(ccnotG, operationX(j), operationY(i))
								} else {
									drawCircle(ccnotG, operationX(j), operationY(i))
								}
							}
							ccnotG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('cx')
							})
							ccnotG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							ccnotG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'ncphase':
							const ccphaseG = svg
								.append('g')
								.classed('operation_item', true)
								.classed('operation_g', true)
							ccphaseG.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawCCPhase(ccphaseG, operationX(j), operationY(i))
							} else {
								const cu1AllArr = []
								const cu1Connector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cu1AllArr.push(k)
											cu1Connector.push(gates[k][j].connector)
										}
									}
								}
								const cu1max = Math.max(...cu1AllArr)
								const cu1min = Math.min(...cu1AllArr)
								const maxConnector = Math.max(...cu1Connector)
								if (operation.connector === maxConnector) {
									ccphaseG
										.append('text')
										.attr('x', operationX(j) + 2)
										.attr('y', svgItemHeight * (cu1min + 2) - svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(radianToAngle(operation.options.params.phi))
									ccphaseG
										.append('rect')
										.attr('height', svgItemHeight * (cu1max - cu1min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (cu1min + 2) - svgItemHeight / 2)
									drawLine(
										ccphaseG,
										operationX(j),
										operationY(cu1min) + 10,
										operationX(j),
										operationY(cu1max)
									)
								}

								drawCCPhase(ccphaseG, operationX(j), operationY(i))
							}

							ccphaseG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 60)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('ncphase')
							})
							ccphaseG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							ccphaseG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'ry':
							const ryG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							ryG.datum(operation) //绑定数据到dom节点
							const ryParentG = drawRy(ryG, operationX(j), operationY(i))
							ryParentG
								.append('text')
								.attr('x', 12)
								.attr('y', -2)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:12px;')
								.text(radianToAngle(operation.options.params.theta))

							ryG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('ry')
							})
							ryG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							ryG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'rx':
							const rxG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							rxG.datum(operation) //绑定数据到dom节点
							const rxParentG = drawRx(rxG, operationX(j), operationY(i))
							rxParentG
								.append('text')
								.attr('x', 12)
								.attr('y', -2)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:12px;')
								.text(radianToAngle(operation.options.params.theta))
							rxG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('rx')
							})
							rxG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							rxG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'rz':
							const rzG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							rzG.datum(operation) //绑定数据到dom节点
							const rzParentG = drawRz(rzG, operationX(j), operationY(i))
							rzParentG
								.append('text')
								.attr('x', 12)
								.attr('y', -2)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:12px;')
								.text(radianToAngle(operation.options.params.phi))
							rzG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('rz')
							})
							rzG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							rzG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cry':
							const cryG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							cryG.datum(operation) //绑定数据到dom节点
							let crymax = 0
							let crymin = 0

							if (connector === 0) {
								drawCircle(cryG, operationX(j), operationY(i))
							} else {
								const cryAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cryAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								crymax = Math.max(...cryAllArr)
								crymin = Math.min(...cryAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									cryG.append('text')
										.attr('x', operationX(j) + 2)
										.attr('y', svgItemHeight * (crymin + 2) - svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(radianToAngle(operation.options.params.theta))

									cryG.append('rect')
										.attr('height', svgItemHeight * (crymax - crymin + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (crymin + 2) - svgItemHeight / 2)
									drawLine(cryG, operationX(j), operationY(crymin), operationX(j), operationY(crymax))
									drawRy(cryG, operationX(j), operationY(i))
								} else {
									drawCircle(cryG, operationX(j), operationY(i))
								}
							}

							cryG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 28)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('cry')
							})
							cryG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							cryG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'u1':
							const phaseG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							phaseG.datum(operation) //绑定数据到dom节点
							const phaseParentG = drawCCPhase(phaseG, operationX(j), operationY(i))
							phaseParentG
								.append('text')
								.attr('x', 12)
								.attr('y', -2)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:12px;')
								.text(radianToAngle(operation.options.lambda))
							phaseG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 46)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('u1')
							})
							phaseG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							phaseG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'id':
							const idG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							idG.datum(operation) //绑定数据到dom节点
							const idParentG = drawNameCircletwoLength(idG, operationX(j), operationY(i), 'id')
							idG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('id')
							})
							idG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							idG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'x':
							const xG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							xG.datum(operation) //绑定数据到dom节点
							const xParentG = drawNameCircle(xG, operationX(j), operationY(i), 'x')

							xG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 16)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('x')
							})
							xG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							xG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'y':
							const yG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							yG.datum(operation) //绑定数据到dom节点
							const yParentG = drawNameCircle(yG, operationX(j), operationY(i), 'y')
							yG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('y')
							})
							yG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							yG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'z':
							const zG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							zG.datum(operation) //绑定数据到dom节点
							const zParentG = drawNameCircle(zG, operationX(j), operationY(i), 'z')
							zG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('z')
							})
							zG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							zG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'srn':
							const srnG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							srnG.datum(operation) //绑定数据到dom节点
							const srnParentG = drawSrn(srnG, operationX(j), operationY(i))
							srnG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('srn')
							})
							srnG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							srnG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'srndg':
							const srndgG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							srndgG.datum(operation) //绑定数据到dom节点
							const srndgParentG = drawSrndg(srndgG, operationX(j), operationY(i))
							srndgG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('srndg')
							})
							srndgG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							srndgG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'r2':
							const r2G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							r2G.datum(operation) //绑定数据到dom节点
							const r2ParentG = drawRnumber(r2G, operationX(j), operationY(i), 'Zπ/2')
							r2G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('r2')
							})
							r2G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							r2G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'r4':
							const r4G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							r4G.datum(operation) //绑定数据到dom节点
							const r4ParentG = drawRnumber(r4G, operationX(j), operationY(i), 'Zπ/4')
							r4G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('r4')
							})
							r4G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							r4G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'r8':
							const r8G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							r8G.datum(operation) //绑定数据到dom节点
							const r8ParentG = drawRnumber(r8G, operationX(j), operationY(i), 'Zπ/8')
							r8G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('r8')
							})
							r8G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							r8G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'u2':
							const u2G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							u2G.datum(operation) //绑定数据到dom节点
							const u2ParentG = drawUnumber(u2G, operationX(j), operationY(i), 'u2')
							u2ParentG
								.append('text')
								.attr('x', 0)
								.attr('y', -3)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:10px;')
								.text(radianToAngle(operation.options.params.phi))
							u2ParentG
								.append('text')
								.attr('x', 22)
								.attr('y', -3)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:10px;')
								.text(radianToAngle(operation.options.params.lambda))
							u2G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('u2')
							})
							u2G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							u2G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'u3':
							const u3G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							u3G.datum(operation) //绑定数据到dom节点
							const u3ParentG = drawUnumber(u3G, operationX(j), operationY(i), 'u3')
							u3ParentG
								.append('text')
								.attr('x', -11)
								.attr('y', -3)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:10px;')
								.text(radianToAngle(operation.options.params.theta))
							u3ParentG
								.append('text')
								.attr('x', 11)
								.attr('y', -3)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:10px;')
								.text(radianToAngle(operation.options.params.phi))
							u3ParentG
								.append('text')
								.attr('x', 33)
								.attr('y', -3)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:10px;')
								.text(radianToAngle(operation.options.params.lambda))
							u3G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('u3')
							})
							u3G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							u3G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 's':
							const sG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							sG.datum(operation) //绑定数据到dom节点
							const sParentG = drawNameCircle(sG, operationX(j), operationY(i), 's')
							sG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 16)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('s')
							})
							sG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							sG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 't':
							const tG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							tG.datum(operation) //绑定数据到dom节点
							const tParentG = drawNameCircle(tG, operationX(j), operationY(i), 't')
							tG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 16)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('t')
							})
							tG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							tG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'sdg':
							const sdegG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							sdegG.datum(operation) //绑定数据到dom节点
							const sdegParentG = drawSDg(sdegG, operationX(j), operationY(i), 's')
							sdegG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 16)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('sdg')
							})
							sdegG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							sdegG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'tdg':
							const tdgG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							tdgG.datum(operation) //绑定数据到dom节点
							const tdgParentG = drawSDg(tdgG, operationX(j), operationY(i), 't')
							tdgG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 16)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('tdg')
							})
							tdgG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							tdgG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'srswap':
							const srsswapG = svg
								.append('g')
								.classed('operation_item', true)
								.classed('operation_g', true)
							srsswapG.datum(operation) //绑定数据到dom节点
							if (connector > 0) {
								const srsswapAllArr = []
								const srsconnectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											srsswapAllArr.push(k)
											srsconnectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...srsswapAllArr)
								const min = Math.min(...srsswapAllArr)
								const maxConnector = Math.max(...srsconnectorArr)
								if (operation.connector === maxConnector) {
									srsswapG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(
										srsswapG,
										operationX(j),
										operationY(min) + 10,
										operationX(j),
										operationY(max)
									)
								}
								drawSrsswap(srsswapG, operationX(j), operationY(i), '√swp')
							} else {
								drawSrsswap(srsswapG, operationX(j), operationY(i), '√swp')
							}
							srsswapG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 38)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('srsswap')
							})
							srsswapG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							srsswapG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})

							break
						case 'iswap':
							const iswapG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							iswapG.datum(operation) //绑定数据到dom节点
							if (connector > 0) {
								const srsswapAllArr = []
								const srsconnectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											srsswapAllArr.push(k)
											srsconnectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...srsswapAllArr)
								const min = Math.min(...srsswapAllArr)
								const maxConnector = Math.max(...srsconnectorArr)
								if (operation.connector === maxConnector) {
									iswapG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(
										iswapG,
										operationX(j),
										operationY(min) + 10,
										operationX(j),
										operationY(max)
									)
								}
								drawSrsswap(iswapG, operationX(j), operationY(i), 'iswp')
							} else {
								drawSrsswap(iswapG, operationX(j), operationY(i), 'iswp')
							}
							iswapG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 38)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('iswap')
							})
							iswapG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							iswapG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'xy':
							const xyG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							xyG.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawNameCircletwoLength(xyG, operationX(j), operationY(i), 'xy')
							} else {
								const cu1AllArr = []
								const cu1Connector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cu1AllArr.push(k)
											cu1Connector.push(gates[k][j].connector)
										}
									}
								}
								const cu1max = Math.max(...cu1AllArr)
								const cu1min = Math.min(...cu1AllArr)
								const maxConnector = Math.max(...cu1Connector)
								if (operation.connector === maxConnector) {
									xyG.append('text')
										.attr('x', operationX(j) + 2)
										.attr('y', svgItemHeight * (cu1min + 2) - svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(
											(_.round(operation.options.params.lambda, 2) ||
												operation.options.params.lambda) + '°'
										)
									xyG.append('rect')
										.attr('height', svgItemHeight * (cu1max - cu1min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (cu1min + 2) - svgItemHeight / 2)
									drawLine(
										xyG,
										operationX(j),
										operationY(cu1min) + 10,
										operationX(j),
										operationY(cu1max)
									)
								}

								drawNameCircletwoLength(xyG, operationX(j), operationY(i), 'xy')
							}

							xyG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('xy')
							})
							xyG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							xyG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cy':
							const cyG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							cyG.datum(operation)
							if (connector === 0) {
								drawCircle(cyG, operationX(j), operationY(i))
							} else {
								const cxAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cxAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...cxAllArr)
								const min = Math.min(...cxAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									cyG.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(cyG, operationX(j), operationY(min), operationX(j), operationY(max))
									drawNameCircle(cyG, operationX(j), operationY(i), 'y')
								} else {
									drawCircle(cyG, operationX(j), operationY(i))
								}
							}
							cyG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('cy')
							})
							cyG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							cyG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cz':
							const czG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							czG.datum(operation)
							if (connector === 0) {
								drawCircle(czG, operationX(j), operationY(i))
							} else {
								const cxAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cxAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...cxAllArr)
								const min = Math.min(...cxAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									czG.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(czG, operationX(j), operationY(min), operationX(j), operationY(max))
									drawCircle(czG, operationX(j), operationY(i))
								} else {
									drawCircle(czG, operationX(j), operationY(i))
								}
							}
							czG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('cz')
							})
							czG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							czG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'ch':
							const chG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							chG.datum(operation)
							if (connector === 0) {
								drawCircle(chG, operationX(j), operationY(i))
							} else {
								const chAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											chAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...chAllArr)
								const min = Math.min(...chAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									chG.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(chG, operationX(j), operationY(min), operationX(j), operationY(max))
									drawNameCircle(chG, operationX(j), operationY(i), 'h')
								} else {
									drawCircle(chG, operationX(j), operationY(i))
								}
							}
							chG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('ch')
							})
							chG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							chG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'csrn':
							const csrnG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							csrnG.datum(operation)
							if (connector === 0) {
								drawCircle(csrnG, operationX(j), operationY(i))
							} else {
								const cxAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cxAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...cxAllArr)
								const min = Math.min(...cxAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									csrnG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(csrnG, operationX(j), operationY(min), operationX(j), operationY(max))
									drawSrn(srnG, operationX(j), operationY(i))
								} else {
									drawCircle(csrnG, operationX(j), operationY(i))
								}
							}
							csrnG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('ch')
							})
							csrnG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							csrnG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'ms':
							const msG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							msG.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawNameCircletwoLength(msG, operationX(j), operationY(i), 'xx', 3)
							} else {
								const msArr = []
								const msConnector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											msArr.push(k)
											msConnector.push(gates[k][j].connector)
										}
									}
								}
								const cu1max = Math.max(...msArr)
								const cu1min = Math.min(...msArr)
								const maxConnector = Math.max(...msConnector)
								if (operation.connector === maxConnector) {
									msG.append('text')
										.attr('x', operationX(j) + 2)
										.attr('y', svgItemHeight * (cu1min + 2) - svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(radianToAngle(operation.options.params.theta))
									msG.append('rect')
										.attr('height', svgItemHeight * (cu1max - cu1min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (cu1min + 2) - svgItemHeight / 2)
									drawLine(
										msG,
										operationX(j),
										operationY(cu1min) + 10,
										operationX(j),
										operationY(cu1max)
									)
								}

								drawNameCircletwoLength(msG, operationX(j), operationY(i), 'xx', 3)
							}

							msG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('ms')
							})
							msG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							msG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'yy':
							const yyG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							yyG.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawNameCircletwoLength(yyG, operationX(j), operationY(i), 'yy', 3)
							} else {
								const yyArr = []
								const yyConnector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											yyArr.push(k)
											yyConnector.push(gates[k][j].connector)
										}
									}
								}
								const cu1max = Math.max(...yyArr)
								const cu1min = Math.min(...yyArr)
								const maxConnector = Math.max(...yyConnector)
								if (operation.connector === maxConnector) {
									yyG.append('text')
										.attr('x', operationX(j) + 2)
										.attr('y', svgItemHeight * (cu1min + 2) - svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(radianToAngle(operation.options.params.theta))
									yyG.append('rect')
										.attr('height', svgItemHeight * (cu1max - cu1min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (cu1min + 2) - svgItemHeight / 2)
									drawLine(
										yyG,
										operationX(j),
										operationY(cu1min) + 10,
										operationX(j),
										operationY(cu1max)
									)
								}

								drawNameCircletwoLength(yyG, operationX(j), operationY(i), 'yy', 3)
							}

							yyG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('yy')
							})
							yyG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							yyG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'zz':
							const zzG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							zzG.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawNameCircletwoLength(zzG, operationX(j), operationY(i), 'zz', 3)
							} else {
								const zzArr = []
								const zzConnector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											zzArr.push(k)
											zzConnector.push(gates[k][j].connector)
										}
									}
								}
								const zzmax = Math.max(...zzArr)
								const zzmin = Math.min(...zzArr)
								const maxConnector = Math.max(...zzConnector)
								if (operation.connector === maxConnector) {
									zzG.append('text')
										.attr('x', operationX(j) + 2)
										.attr('y', svgItemHeight * (zzmin + 2) - svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(radianToAngle(operation.options.params.theta))
									zzG.append('rect')
										.attr('height', svgItemHeight * (zzmax - zzmin + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (zzmin + 2) - svgItemHeight / 2)
									drawLine(
										zzG,
										operationX(j),
										operationY(zzmin) + 10,
										operationX(j),
										operationY(zzmax)
									)
								}

								drawNameCircletwoLength(zzG, operationX(j), operationY(i), 'zz', 3)
							}

							zzG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('zz')
							})
							zzG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							zzG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cr2':
							const cr2G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							cr2G.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawCircle(cr2G, operationX(j), operationY(i))
							} else {
								const cr2Arr = []
								const cr2Connector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cr2Arr.push(k)
											cr2Connector.push(gates[k][j].connector)
										}
									}
								}
								const cr2max = Math.max(...cr2Arr)
								const cr2min = Math.min(...cr2Arr)
								const maxConnector = Math.max(...cr2Connector)
								if (operation.connector === maxConnector) {
									cr2G.append('rect')
										.attr('height', svgItemHeight * (cr2max - cr2min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (cr2min + 2) - svgItemHeight / 2)
									drawLine(
										cr2G,
										operationX(j),
										operationY(cr2min) + 10,
										operationX(j),
										operationY(cr2max)
									)
									drawRnumber(cr2G, operationX(j), operationY(i), 'Zπ/2')
								} else {
									drawCircle(cr2G, operationX(j), operationY(i))
								}
							}

							cr2G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('cr2')
							})
							cr2G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							cr2G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cr4':
							const cr4G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							cr4G.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawCircle(cr4G, operationX(j), operationY(i))
							} else {
								const cr4Arr = []
								const cr4Connector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cr4Arr.push(k)
											cr4Connector.push(gates[k][j].connector)
										}
									}
								}
								const cr4max = Math.max(...cr4Arr)
								const cr4min = Math.min(...cr4Arr)
								const maxConnector = Math.max(...cr4Connector)
								if (operation.connector === maxConnector) {
									cr4G.append('rect')
										.attr('height', svgItemHeight * (cr4max - cr4min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (cr4min + 2) - svgItemHeight / 2)
									drawLine(
										cr4G,
										operationX(j),
										operationY(cr4min) + 10,
										operationX(j),
										operationY(cr4max)
									)
									drawRnumber(cr4G, operationX(j), operationY(i), 'Zπ/4')
								} else {
									drawCircle(cr4G, operationX(j), operationY(i))
								}
							}

							cr4G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('cr4')
							})
							cr4G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							cr4G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cr8':
							const cr8G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							cr8G.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawCircle(cr8G, operationX(j), operationY(i))
							} else {
								const cr8Arr = []
								const cr8Connector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cr8Arr.push(k)
											cr8Connector.push(gates[k][j].connector)
										}
									}
								}
								const cr8max = Math.max(...cr8Arr)
								const cr8min = Math.min(...cr8Arr)
								const maxConnector = Math.max(...cr8Connector)
								if (operation.connector === maxConnector) {
									cr8G.append('rect')
										.attr('height', svgItemHeight * (cr8max - cr8min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (cr8min + 2) - svgItemHeight / 2)
									drawLine(
										cr8G,
										operationX(j),
										operationY(cr8min) + 10,
										operationX(j),
										operationY(cr8max)
									)
									drawRnumber(cr8G, operationX(j), operationY(i), 'Zπ/8')
								} else {
									drawCircle(cr8G, operationX(j), operationY(i))
								}
							}

							cr8G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('cr8')
							})
							cr8G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							cr8G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'crx':
							const crxG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							crxG.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawCircle(crxG, operationX(j), operationY(i))
							} else {
								const crxArr = []
								const crxConnector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											crxArr.push(k)
											crxConnector.push(gates[k][j].connector)
										}
									}
								}
								const crxmax = Math.max(...crxArr)
								const crxmin = Math.min(...crxArr)
								const maxConnector = Math.max(...crxConnector)
								if (operation.connector === maxConnector) {
									crxG.append('text')
										.attr('x', 12)
										.attr('y', -2)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(radianToAngle(operation.options.params.theta))
									crxG.append('rect')
										.attr('height', svgItemHeight * (crxmax - crxmin + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (crxmin + 2) - svgItemHeight / 2)
									drawLine(
										crxG,
										operationX(j),
										operationY(crxmin) + 10,
										operationX(j),
										operationY(crxmax)
									)
									drawRx(rxG, operationX(j), operationY(i))
								} else {
									drawCircle(crxG, operationX(j), operationY(i))
								}
							}

							crxG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('crx')
							})
							crxG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							crxG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'crz':
							const crzG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							crzG.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawCircle(crzG, operationX(j), operationY(i))
							} else {
								const crzArr = []
								const crzConnector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											crzArr.push(k)
											crzConnector.push(gates[k][j].connector)
										}
									}
								}
								const crzmax = Math.max(...crzArr)
								const crzmin = Math.min(...crzArr)
								const maxConnector = Math.max(...crzConnector)
								if (operation.connector === maxConnector) {
									crzG.append('text')
										.attr('x', 12)
										.attr('y', -2)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(radianToAngle(operation.options.params.phi))
									crzG.append('rect')
										.attr('height', svgItemHeight * (crzmax - crzmin + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (crzmin + 2) - svgItemHeight / 2)
									drawLine(
										crzG,
										operationX(j),
										operationY(crzmin) + 10,
										operationX(j),
										operationY(crzmax)
									)
									drawRz(crzG, operationX(j), operationY(i))
								} else {
									drawCircle(crzG, operationX(j), operationY(i))
								}
							}

							crzG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('crz')
							})
							crzG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							crzG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cu1':
							const cu1G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							cu1G.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawCircle(cu1G, operationX(j), operationY(i))
							} else {
								const cu1Arr = []
								const cu1Connector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cu1Arr.push(k)
											cu1Connector.push(gates[k][j].connector)
										}
									}
								}
								const cu1max = Math.max(...cu1Arr)
								const cu1min = Math.min(...cu1Arr)
								const maxConnector = Math.max(...cu1Connector)
								if (operation.connector === maxConnector) {
									cu1G.append('text')
										.attr('x', 12)
										.attr('y', -2)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(radianToAngle(operation.options.params.lambda))
									cu1G.append('rect')
										.attr('height', svgItemHeight * (cu1max - cu1min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (cu1min + 2) - svgItemHeight / 2)
									drawLine(
										cu1G,
										operationX(j),
										operationY(cu1min) + 10,
										operationX(j),
										operationY(cu1max)
									)
									drawNameCirclethreeLength(cu1G, operationX(j), operationY(i), 'cu1')
								} else {
									drawCircle(cu1G, operationX(j), operationY(i))
								}
							}

							cu1G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('cu1')
							})
							cu1G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							cu1G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cu2':
							const cu2G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							cu2G.datum(operation) //绑定数据到dom节点

							if (connector === 0) {
								drawCircle(cu2G, operationX(j), operationY(i))
							} else {
								const cu2Arr = []
								const cu2Connector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cu2Arr.push(k)
											cu2Connector.push(gates[k][j].connector)
										}
									}
								}
								const cu2max = Math.max(...cu2Arr)
								const cu2min = Math.min(...cu2Arr)
								const maxConnector = Math.max(...cu2Connector)
								if (operation.connector === maxConnector) {
									cu2G.append('text')
										.attr('x', 0)
										.attr('y', -3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:10px;')
										.text(radianToAngle(operation.options.params.phi))
									cu2G.append('text')
										.attr('x', 22)
										.attr('y', -3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:10px;')
										.text(radianToAngle(operation.options.params.lambda))
									cu2G.append('rect')
										.attr('height', svgItemHeight * (cu2max - cu2min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (cu2min + 2) - svgItemHeight / 2)
									drawLine(
										cu2G,
										operationX(j),
										operationY(cu2min) + 10,
										operationX(j),
										operationY(cu2max)
									)
									drawNameCirclethreeLength(cu2G, operationX(j), operationY(i), 'cu2')
								} else {
									drawCircle(cu2G, operationX(j), operationY(i))
								}
							}

							cu2G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('cu2')
							})
							cu2G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							cu2G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cu3':
							const cu3G = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							cu3G.datum(operation) //绑定数据到dom节点
							if (connector === 0) {
								drawCircle(cu3G, operationX(j), operationY(i))
							} else {
								const cu3Arr = []
								const cu3Connector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cu3Arr.push(k)
											cu3Connector.push(gates[k][j].connector)
										}
									}
								}
								const cu3max = Math.max(...cu3Arr)
								const cu3min = Math.min(...cu3Arr)
								const maxConnector = Math.max(...cu3Connector)
								if (operation.connector === maxConnector) {
									cu3G.append('text')
										.attr('x', -11)
										.attr('y', -3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:10px;')
										.text(radianToAngle(operation.options.params.theta))
									cu3G.append('text')
										.attr('x', 11)
										.attr('y', -3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:10px;')
										.text(radianToAngle(operation.options.params.phi))
									cu3G.append('text')
										.attr('x', 33)
										.attr('y', -3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:10px;')
										.text(radianToAngle(operation.options.params.lambda))
									cu3G.append('rect')
										.attr('height', svgItemHeight * (cu3max - cu3min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (cu3min + 2) - svgItemHeight / 2)
									drawLine(
										cu3G,
										operationX(j),
										operationY(cu3min) + 10,
										operationX(j),
										operationY(cu3max)
									)
									drawNameCirclethreeLength(cu3G, operationX(j), operationY(i), 'cu3')
								} else {
									drawCircle(cu3G, operationX(j), operationY(i))
								}
							}

							cu3G.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 59)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('cu3')
							})
							cu3G.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							cu3G.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cs':
							const csG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							csG.datum(operation)
							if (connector === 0) {
								drawCircle(csG, operationX(j), operationY(i))
							} else {
								const csAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											csAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...csAllArr)
								const min = Math.min(...csAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									csG.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(csG, operationX(j), operationY(min), operationX(j), operationY(max))
									drawNameCircle(csG, operationX(j), operationY(i), 's')
								} else {
									drawCircle(csG, operationX(j), operationY(i))
								}
							}
							csG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('cs')
							})
							csG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							csG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'ct':
							const ctG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							ctG.datum(operation)
							if (connector === 0) {
								drawCircle(ctG, operationX(j), operationY(i))
							} else {
								const ctAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											ctAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...ctAllArr)
								const min = Math.min(...ctAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									ctG.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(ctG, operationX(j), operationY(min), operationX(j), operationY(max))
									drawNameCircle(ctG, operationX(j), operationY(i), 't')
								} else {
									drawCircle(ctG, operationX(j), operationY(i))
								}
							}
							ctG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('ct')
							})
							ctG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							ctG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'csdg':
							const csdgG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							csdgG.datum(operation)
							if (connector === 0) {
								drawCircle(csdgG, operationX(j), operationY(i))
							} else {
								const csdgAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											csdgAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...csdgAllArr)
								const min = Math.min(...csdgAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									csdgG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(csdgG, operationX(j), operationY(min) + 10, operationX(j), operationY(max))
									drawSDg(sdegG, operationX(j), operationY(i), 's')
								} else {
									drawCircle(csdgG, operationX(j), operationY(i))
								}
							}
							csdgG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('csdg')
							})
							csdgG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							csdgG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'ctdg':
							const ctdgG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							ctdgG.datum(operation)
							if (connector === 0) {
								drawCircle(ctdgG, operationX(j), operationY(i))
							} else {
								const ctdgAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											ctdgAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...ctdgAllArr)
								const min = Math.min(...ctdgAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									ctdgG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(ctdgG, operationX(j), operationY(min) + 10, operationX(j), operationY(max))
									drawSDg(sdegG, operationX(j), operationY(i), 't')
								} else {
									drawCircle(ctdgG, operationX(j), operationY(i))
								}
							}
							ctdgG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('ctdg')
							})
							ctdgG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							ctdgG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'ccx':
							const ccxG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							ccxG.datum(operation)
							if (connector === 0) {
								drawCircle(ccxG, operationX(j), operationY(i))
							} else {
								const ccxAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											ccxAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...ccxAllArr)
								const min = Math.min(...ccxAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									ccxG.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(ccxG, operationX(j), operationY(min), operationX(j), operationY(max))
									drawCcnot(ccxG, operationX(j), operationY(i))
								} else {
									drawCircle(ccxG, operationX(j), operationY(i))
								}
							}
							ccxG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('cx')
							})
							ccxG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							ccxG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'cswap':
							const cswapG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							cswapG.datum(operation) //绑定数据到dom节点
							if (connector > 0) {
								const cswapAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cswapAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...cswapAllArr)
								const min = Math.min(...cswapAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									cswapG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(
										cswapG,
										operationX(j),
										operationY(min) + 10,
										operationX(j),
										operationY(max)
									)
									drawSwap(cswapG, operationX(j), operationY(i))
								} else {
									drawCircle(ccxG, operationX(j), operationY(i))
								}
							} else {
								drawCircle(ccxG, operationX(j), operationY(i))
							}
							cswapG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 38)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('cswap')
							})
							cswapG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							cswapG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'csrswap':
							const csrswapG = svg
								.append('g')
								.classed('operation_item', true)
								.classed('operation_g', true)
							csrswapG.datum(operation) //绑定数据到dom节点
							if (connector > 0) {
								const csrswapAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											csrswapAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...csrswapAllArr)
								const min = Math.min(...csrswapAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									csrswapG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(
										csrswapG,
										operationX(j),
										operationY(min) + 10,
										operationX(j),
										operationY(max)
									)
									drawSrsswap(srsswapG, operationX(j), operationY(i), '√swp')
								} else {
									drawCircle(ccxG, operationX(j), operationY(i))
								}
							} else {
								drawCircle(ccxG, operationX(j), operationY(i))
							}
							csrswapG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 38)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('csrswap')
							})
							csrswapG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							csrswapG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'reset':
							const resetG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							resetG.datum(operation) //绑定数据到dom节点
							const resetParentG = drawNameCirclethreeLength(
								resetG,
								operationX(j),
								operationY(i),
								'rst',
								5
							)
							resetG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 22)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('reset')
							})
							resetG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							resetG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'measure':
							const measureG = svg
								.append('g')
								.classed('operation_item', true)
								.classed('operation_g', true)
							measureG.datum(operation) //绑定数据到dom节点
							const measureParentG = drawRead(measureG, operationX(j), operationY(i))
							measureG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 16)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('x')
							})
							measureG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							measureG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						case 'ncnot':
							const ncnotG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							ncnotG.datum(operation)
							if (connector === 0) {
								drawCircle(ncnotG, operationX(j), operationY(i))
							} else {
								const ncnotAllArr = []
								const connectorArr = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											ncnotAllArr.push(k)
											connectorArr.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...ncnotAllArr)
								const min = Math.min(...ncnotAllArr)
								const maxConnector = Math.max(...connectorArr)
								if (operation.connector === maxConnector) {
									ncnotG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
									drawLine(ncnotG, operationX(j), operationY(min), operationX(j), operationY(max))
									drawCcnot(ncnotG, operationX(j), operationY(i))
								} else {
									drawCircle(ncnotG, operationX(j), operationY(i))
								}
							}
							ncnotG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 44)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)
								text.append('tspan').text('ncnot')
							})
							ncnotG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							ncnotG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
						default:
							const defaultG = svg
								.append('g')
								.classed('operation_item', true)
								.classed('operation_g', true)
							//绑定数据到dom节点
							defaultG.datum(operation)
							if (connector > 0) {
								const cxAllArr = []
								const cxAllconnector = []
								for (let k = 0; k < gates.length; k++) {
									if (gates[k][j]) {
										if (gates[k][j].id === operation.id) {
											cxAllArr.push(k)
											cxAllconnector.push(gates[k][j].connector)
										}
									}
								}
								const max = Math.max(...cxAllArr)
								const min = Math.min(...cxAllArr)
								const maxConnector = Math.max(...cxAllconnector)

								if (operation.connector === maxConnector) {
									drawLine(
										defaultG,
										operationX(j),
										operationY(min) + 10,
										operationX(j),
										operationY(max)
									)
									defaultG
										.append('text')
										.attr('x', operationX(j) + 2)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text('self-define')
									defaultG
										.append('rect')
										.attr('height', svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', operationX(j) - 10)
										.attr('y', svgItemHeight * (min + 2) - svgItemHeight / 2)
								}

								drawSelfDefinedGate(defaultG, operationX(j), operationY(i))
							} else {
								drawSelfDefinedGate(defaultG, operationX(j), operationY(i))
							}

							defaultG.on('mouseover', function (e) {
								svg.selectAll('.tip').remove()
								const position = d3.pointer(e)
								const tipG = svg
									.append('g')
									.classed('tip', true)
									.attr('transform', `translate(${position[0] + 10},${position[1]})`)
								tipG.append('rect')
									.attr('stroke', 'gray')
									.attr('stroke-width', 1)
									.attr('height', 26)
									.attr('width', 90)
									.attr('fill', '#fff')
									.attr('rx', 2)
								const text = tipG
									.append('text')
									.attr('fill', '#000')
									.classed('svgtext', true)
									.attr('x', 4)
									.attr('y', 16)

								text.append('tspan').text('self-define')
							})
							defaultG.on('mousemove', function (e) {
								const position = d3.pointer(e)
								svg.selectAll('.tip').attr('transform', `translate(${position[0] + 10},${position[1]})`)
							})
							defaultG.on('mouseleave', function (e) {
								svg.selectAll('.tip').remove()
							})
							break
					}
				}
			}
		}
	}
	// 绘制折线图
	const drawLineChart = (row, svgWidth) => {
		const svg = d3.select('#line_chart_svg')
		// const transformY = (qc.qubit_number + 1) *  svgItemHeight
		const lineChartG = svg.select('#lineChart_graph')
		lineChartG.selectAll('*').remove()
		svg.attr('width', svgWidth)
		svg.attr('height', 30)
		const data = []
		for (let i = 0; i < props.qc.operations.length; i++) {
			const entropy = props.qc.getEntropy(props.qc.operations[i].index)
			data.push({
				index: props.qc.operations[i].index,
				entropy: entropy,
			})
		}
		const scaleX = d3
			.scaleBand()
			.domain(data.map((d) => d.index))
			.range([firstX + svgItemWidth / 2, (row + 3) * svgItemWidth + svgItemWidth / 2])

		// d3.min(data, (d) => d.entropy)
		const scaleY = d3
			.scaleLinear()
			.domain([-0.02, d3.max(data, (d) => d.entropy) + 0.02])
			// .range([transformY +  svgItemHeight * 4, transformY +  svgItemHeight * 3])
			.range([svgItemHeight, 0])
		// 渲染线条
		const X = d3.map(data, (d) => d.index)
		const Y = d3.map(data, (d) => d.entropy)
		const I = d3.range(X.length)
		lineChartG
			.append('rect')
			.attr('width', svgWidth)
			.attr('height', svgItemHeight)
			.attr('fill', 'rgba(229,143,130,0.1)')
			.attr('x', firstX)
			.attr('y', 0)
		lineChartG
			.append('path')
			.attr(
				'd',
				'M702.3 364c-41.2 0-79.4 18.8-113.1 41.9-26.3 18.1-52.3 40.6-77.2 63.1-24.9-22.6-50.9-45.1-77.2-63.1-33.7-23.2-71.9-41.9-113.1-41.9-81 0-148 67.1-148 148s67.1 148 148 148c41.2 0 79.4-18.8 113.1-41.9 26.3-18.1 52.3-40.6 77.2-63.1 24.9 22.6 50.9 45.1 77.2 63.1 33.7 23.2 71.9 41.9 113.1 41.9 81 0 148-67.1 148-148s-67-148-148-148zM398.9 565.8c-29.7 20.4-55 30.8-77.2 30.8-45.9 0-84.6-38.7-84.6-84.6s38.7-84.6 84.6-84.6c22.2 0 47.4 10.3 77.2 30.8 21.5 14.8 43.3 33.4 66 53.8-22.7 20.4-44.5 39-66 53.8z m303.4 30.8c-22.2 0-47.4-10.3-77.2-30.8-21.5-14.8-43.3-33.4-66-53.8 22.7-20.4 44.5-39 66-53.8 29.7-20.4 55-30.8 77.2-30.8 45.9 0 84.6 38.7 84.6 84.6s-38.7 84.6-84.6 84.6z'
			)
			.attr('fill', 'rgb(84, 84, 84)')
			.attr('transform', `translate(${firstX - svgItemWidth - 12},0) scale(0.03)`)
		// .attr('x', firstX -  svgItemWidth)
		// .attr('y',transformY +  svgItemHeight * 3 +  svgItemHeight / 2)
		// .attr('style','font-size:18px;')
		// .text('∞')
		const line = d3
			.line()
			.defined((i) => data[i])
			.curve(d3.curveLinear)
			.x((i) => scaleX(X[i]))
			.y((i) => scaleY(Y[i]))
		lineChartG
			.append('path')
			.attr('fill', 'none')
			.attr('stroke', 'rgb(229,143,130)')
			.attr('stroke-width', 1)
			.attr('d', line(I))
	}
	useEffect(() => {
		if (props.qc) {
			exportD3SVG(props.qc)
		}
	}, [props.qc])
	return (
		<div id='circuit_view'>
			<div className='title'>
				Circuit
				<Tooltip placement='right' title={'Here is the panel to visualize the quantum circuit.'}>
					<span className='tip_svg'></span>
				</Tooltip>
			</div>
			<div className='circuit_div'>
				<svg id='circuit_svg'>
					<g id='circuit_brush' />
					<g id='brush_label' />
					<g id='circuit_label' />

					<g id='circuit_graph' />

					{/* 下面的在前面 */}
				</svg>
				<div className='line_chart_div'>
					<svg id='line_chart_svg'>
						<g id='lineChart_graph'></g>
					</svg>
				</div>
			</div>
		</div>
	)
}
export default Bcomponent
