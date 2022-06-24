import { data } from 'browserslist'
import * as d3 from 'd3'
import { color, group, pointer } from 'd3'
import { event as currentEvent } from 'd3-selection'
import { im, number, re } from 'mathjs'
import { ConsoleErrorListener, toDocs } from '../resource/js/quantum-circuit.min'
import Chart from './Chart'
import { getDirac } from '../components/Mathjax'
import QCEngine from './MyQCEngine'
const _ = require('lodash')
export default class d3Draw {
	constructor(options) {
		// 扩展颜色可配置
		options = options || {}
		// write1三角形背景色
		this.write1Background = options.write1Background || '#fff'
		// write1字体颜色
		this.write1FontColor = options.write1FontColor || '#000'
		// write0三角形背景色
		this.write0Background = options.write0Background || '#fff'
		// write0字体颜色
		this.write0FontColor = options.write0FontColor || '#000'
		// had字体颜色
		this.hadFontColor = options.hadFontColor || '#000'
		// 存储d模块圆形颜色
		this.dCircleUsedColor = options.dCircleUsedColor || 'rgb(246, 175, 31)'
		this.dCircleColor = options.dCircleColor || 'rgba(142, 132, 112,0.5)'
		// 互补的圆形透明度
		this.dCircleColorOpacity = options.dCircleColorOpacity || 0.3
		// d模块浅色块颜色
		this.dLightRectColor = options.dLightRectColor || 'rgb(137, 214, 220)'
		// 浅色块条形图的颜色
		this.dBarColor = options.dBarColor || 'rgb(137, 214, 220)'
		this.initQC = new QCEngine()
		// 设置比例
		this.scaleNum = 3
		// 设置空白和间距
		this.svgItemWidth = options.svgItemWidth || 30
		this.firstX = this.svgItemWidth * this.scaleNum

		this.svgItemHeight = options.svgItemHeight || 30
		// 鼠标放上的小label宽
		this.svgItemLabelWidth = 30

		// label位置的偏移 x - 图形的宽
		this.labelTranslate = this.firstX - this.svgItemWidth / 2
		// 存getWholeState
		this.getWholeState = []
		// 存 c filter过滤条件
		this.filter = {}
		// 设置D模块的长度
		this.dLength = 26
		// 控制是否全屏
		this.isFull = false
		// 框选的labels
		this.labels = []
		// 记录B模块选择的index
		this.varstatesIndex = 0
		// 存储C模块的chart
		this.charts = []
		// 存储QC
		this.qc = null
		// D viewBox 和svg宽的比
		this.viewBoxWidth = 1
		this.viewBoxHeight = 1
		this.gate_offest = 0
		// 框选的操作
		this.brushOperations = {}
		// 用于折叠的opeartions副本
		this.copyOperations = []
		// labels副本
		this.copyLabels = []
	}
	exportD3SVG(data) {
		const svg = d3.select('#circuit_svg')
		const drawG = svg.select('#circuit_graph')
		const brushG = svg.select('#circuit_brush')
		const labelG = svg.select('#circuit_label')
		const brushLabelG = svg.select('#brush_label')
		// 移除已经添加过的
		drawG.selectAll('*').remove()
		labelG.selectAll('*').remove()
		brushLabelG.selectAll('*').remove()
		this.qc = data
		const { operations, qubit_number, circuit } = data
		// 列数
		const row = circuit.gates[0].length
		const col = circuit.gates.length

		const svgWidth =
			(row + this.scaleNum) * this.svgItemWidth > 1299 ? (row + this.scaleNum) * this.svgItemWidth : 1299
		// 设置SVG宽高 高度整体下移了一行
		svg.attr('width', svgWidth)
		svg.attr('height', (col + 4) * this.svgItemHeight - 50)
		// 加Label,先加载label label在最底层
		console.log(data)
		for (let i = 0; i < data.labels.length; i++) {
			if (data.labels[i].text && data.labels[i].end_operation !== undefined) {
				const obj = data.getLabelUpDown(data.labels[i].id)
				if (obj.down_qubit !== Infinity && obj.up_qubit !== Infinity) {
					const lineCol = data.labels[i].end_operation - data.labels[i].start_operation
					const labelRow = obj.down_qubit - obj.up_qubit
					this.drawLabel(
						labelG,
						(this.svgItemWidth + this.gate_offest) * data.labels[i].start_operation + this.labelTranslate,
						this.svgItemHeight * (obj.up_qubit + 1.5),
						(this.svgItemWidth + this.gate_offest) * lineCol,
						this.svgItemHeight * labelRow,
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
			this.drawLine(
				drawG,
				this.firstX,
				this.svgItemHeight * (i + 2),
				(row + 3) * this.svgItemWidth > 1299 ? (row + 3) * this.svgItemWidth : 1299,
				this.svgItemHeight * (i + 2)
			)
			this.drawName(drawG, this.svgItemWidth * 2 + 5, this.svgItemHeight * (i + 2), 'Q' + i)
		}
		// 绘制选择线
		for (let i = 0; i < row; i++) {
			this.drawCselectLine(
				drawG,
				this.svgItemWidth * (i + 3) + 14,
				this.svgItemHeight * 2 - 6,
				this.svgItemHeight * col - 15,
				i,
				data
			)
		}
		// 加入Qint, 右边的继承关系
		for (const key in data.name2index) {
			for (let i = 0; i < data.name2index[key].length; i++) {
				const lineNum = data.name2index[key][data.name2index[key].length - 1] - data.name2index[key][0]
				this.drawQint(
					drawG,
					this.svgItemWidth * 2,
					this.svgItemHeight * (data.name2index[key][0] + 2),
					this.svgItemHeight * lineNum - 10,
					key
				)
			}
		}

		// 处理操作
		// this.drawOperations(drawG, operations, data)
		// 处理操作2.0
		this.drawOperations2(drawG, circuit.gates, data)
		// 框选
		this.brushedFn(svg, brushG, brushLabelG)
		// 绘制d模块
		this.drawDChart()
		// 加入折线图
		this.drawLineChart(row, svgWidth)
		// 默认最后一个index的C视图
		this.drawCFn(operations.length - 1)
		// this.fold(svg, data, drawG, operations, brushLabelG, labelG, col)
	}
	// 清空缓存的值
	clear() {
		this.copyOperations = []
		this.copyLabels = []
		this.getWholeState = []
		this.filter = {}
		this.labels = []
		this.charts = []
		d3.selectAll('#chart_svg *').remove()
		d3.selectAll('#chart_down_svg *').remove()
		const drawDiv = d3.select('#d_draw_div')
		drawDiv.selectAll('*').remove()
		this.qc = null
		this.varstatesIndex = 0
	}
	// c视图restore
	restore() {
		this.filter = {}
		const drawData = { magns: [], phases: [], probs: [], base: [] }
		this.getWholeState.forEach((item) => {
			drawData.magns.push(item.magns)
			drawData.phases.push(item.phases)
			drawData.probs.push(item.probs)
			drawData.base.push(item.base)
		})
		this.drawCdownStackedBar(drawData)
		this.charts = []
		this.drawCFn(this.varstatesIndex)
		d3.selectAll('#chart_svg .brushed_rect').remove()
	}
	drawWrite1(svg, x, y, operation) {
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
			.attr('fill', this.write1Background)
			.classed('operation_item', true)
		childG
			.append('rect')
			.attr('x', 2)
			.attr('y', 7)
			.attr('width', 2)
			.attr('height', 6)
			.attr('fill', this.write1FontColor)
			.classed('operation_item', true)
		return parentG
	}
	drawWrite0(svg, x, y) {
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
			.attr('fill', this.write0Background)
			.classed('operation_item', true)
		childG
			.append('circle')
			.attr('cx', 4)
			.attr('cy', 10)
			.attr('r', 3)
			.attr('stroke-width', 1)
			.attr('stroke', this.write0FontColor)
			.attr('fill', 'none')
			.classed('operation_item', true)
		return parentG
	}
	drawH(svg, x, y) {
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
	drawRead(svg, x, y) {
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
	drawCcnot(svg, x, y) {
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
	drawRy(svg, x, y) {
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
	drawRx(svg, x, y) {
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
	drawNameCircle(svg, x, y, name, textY) {
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
	drawNameCircletwoLength(svg, x, y, name, testX) {
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
	drawNameCirclethreeLength(svg, x, y, name, testX) {
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
	drawRz(svg, x, y) {
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
	drawUnumber(svg, x, y, name) {
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
	drawSrn(svg, x, y) {
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
	drawSrndg(svg, x, y) {
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
	drawSDg(svg, x, y, name) {
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
	drawSwap(svg, x, y) {
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

	drawCCPhase(svg, x, y) {
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
	drawCircle(svg, x, y) {
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
	drawLine(svg, x, y, targetX, targetY, color) {
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
	drawLabel(svg, x, y, width, height, labelText, labelId, isBrushed) {
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
	drawName(svg, x, y, name) {
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
	drawQint(svg, x, y, height, name) {
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
	drawRnumber(svg, x, y, name) {
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

	drawSrsswap(svg, x, y, name) {
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
	drawSelfDefinedGate(svg, x, y) {
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
	drawMouseHover(svg, x, y, height) {
		svg.append('rect')
			.attr('width', this.svgItemLabelWidth)
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
		context.lineTo(x + this.svgItemLabelWidth - 10, y)
		context.quadraticCurveTo(x + this.svgItemLabelWidth, y, x + this.svgItemLabelWidth, y + 10)
		context.moveTo(x, y + height - 10)
		context.quadraticCurveTo(x, y + height, x + 10, y + height)
		context.lineTo(x + this.svgItemLabelWidth - 10, y + height)
		context.quadraticCurveTo(x + this.svgItemLabelWidth, y + height, x + this.svgItemLabelWidth, y + height - 10)
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
	drawCselectLine(svg, x, y, height, index, data) {
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
		const self = this
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
				self.drawCFn(e.target.attributes.operationIndex.value)
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
	brushedFn(svg, brushG, labelG) {
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
		const self = this
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
					const labelObj = self.qc.createlabel(start_operation, end_operation + 1)
					this.drawLabel(
						labelG,
						this.svgItemWidth * start_operation + this.labelTranslate,
						this.svgItemHeight * (up_qubit + 1.5),
						this.svgItemWidth * lineCol,
						this.svgItemHeight * labelRow,
						labelObj.id,
						labelObj.id,
						true
					)
					// self.copyLabels.push()
					self.drawDChart({ labels: [labelObj] })

					if (self.copyLabels.length) {
						self.copyLabels.push(labelObj)
					}
					console.log(self.copyLabels)
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
	operationY(line) {
		return this.svgItemHeight * (line + 2)
	}
	// x坐标
	// col:列数
	operationX(col) {
		return (this.svgItemWidth + this.gate_offest) * (col + this.scaleNum)
	}
	// 弧度转度数
	radianToAngle(radian){
		if(typeof(radian) === 'string'){
			const num1 = Number(radian.split('/')[1])
			const num2 = Number(radian.split('/')[0].split('p')[0]) ? Number(radian.split('/')[0].split('p')[0]) : 1
			return _.round(_.divide(_.multiply(_.divide(_.multiply(num2,Math.PI),num1),180),Math.PI)) + '°'
		}else{
			return _.round(_.divide(_.multiply(radian,180),Math.PI)) + '°'
		}
		
	}
	
	// 2.0处理circuit.gates
	drawOperations2(svg, gates, data) {
		for (let i = 0; i < gates.length; i++) {
			for (let j = 0; j < gates[i].length; j++) {
				if (gates[i][j]) {
					const operation = gates[i][j]
					operation.x = this.operationX(j)
					operation.line = i
					operation.col = j
					const name = gates[i][j].name
					const connector = gates[i][j].connector
					switch (name) {
						case 'write0':
							const writeG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							writeG.datum(operation) //绑定数据到dom节点
							this.drawWrite0(writeG, this.operationX(j), this.operationY(i))
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
							this.drawWrite1(writeG1, this.operationX(j), this.operationY(i))
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
							this.drawH(hG, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										swapG,
										this.operationX(j),
										this.operationY(min),
										this.operationX(j),
										this.operationY(max)
									)
								}
								this.drawSwap(swapG, this.operationX(j), this.operationY(i))
							} else {
								this.drawSwap(swapG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(ccnotG, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										ccnotG,
										this.operationX(j),
										this.operationY(min),
										this.operationX(j),
										this.operationY(max)
									)
									this.drawCcnot(ccnotG, this.operationX(j), this.operationY(i))
								}else{
									this.drawCircle(ccnotG, this.operationX(j), this.operationY(i))
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
								this.drawCCPhase(ccphaseG, this.operationX(j), this.operationY(i))
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
										.attr('x', this.operationX(j) + 2)
										.attr('y', this.svgItemHeight * (cu1min + 2) - this.svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(
											this.radianToAngle(operation.options.params.phi)
										)
									ccphaseG
										.append('rect')
										.attr('height', this.svgItemHeight * (cu1max - cu1min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (cu1min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										ccphaseG,
										this.operationX(j),
										this.operationY(cu1min) + 10,
										this.operationX(j),
										this.operationY(cu1max)
									)
								}

								this.drawCCPhase(ccphaseG, this.operationX(j), this.operationY(i))
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
							const ryParentG = this.drawRy(ryG, this.operationX(j), this.operationY(i))
							ryParentG
								.append('text')
								.attr('x', 12)
								.attr('y', -2)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:12px;')
								.text(this.radianToAngle(operation.options.params.theta))

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
							const rxParentG = this.drawRx(rxG, this.operationX(j), this.operationY(i))
							rxParentG
								.append('text')
								.attr('x', 12)
								.attr('y', -2)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:12px;')
								.text(this.radianToAngle(operation.options.params.theta))
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
							const rzParentG = this.drawRz(rzG, this.operationX(j), this.operationY(i))
							rzParentG
								.append('text')
								.attr('x', 12)
								.attr('y', -2)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:12px;')
								.text(this.radianToAngle(operation.options.params.phi))
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
								this.drawCircle(cryG, this.operationX(j), this.operationY(i))
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
										.attr('x', this.operationX(j) + 2)
										.attr('y', this.svgItemHeight * (crymin + 2) - this.svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(this.radianToAngle(operation.options.params.theta))
										
									cryG.append('rect')
										.attr('height', this.svgItemHeight * (crymax - crymin + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (crymin + 2) - this.svgItemHeight / 2)
									this.drawLine(
										cryG,
										this.operationX(j),
										this.operationY(crymin),
										this.operationX(j),
										this.operationY(crymax)
									)
									this.drawRy(cryG, this.operationX(j), this.operationY(i))
								}else{
									this.drawCircle(cryG, this.operationX(j), this.operationY(i))
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
							const phaseParentG = this.drawCCPhase(phaseG, this.operationX(j), this.operationY(i))
							phaseParentG
								.append('text')
								.attr('x', 12)
								.attr('y', -2)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:12px;')
								.text(this.radianToAngle(operation.options.lambda))
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
							const idParentG = this.drawNameCircletwoLength(
								idG,
								this.operationX(j),
								this.operationY(i),
								'id'
							)
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
							const xParentG = this.drawNameCircle(xG, this.operationX(j), this.operationY(i), 'x')
							
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
							const yParentG = this.drawNameCircle(yG, this.operationX(j), this.operationY(i), 'y')
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
							const zParentG = this.drawNameCircle(zG, this.operationX(j), this.operationY(i), 'z')
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
							const srnParentG = this.drawSrn(srnG, this.operationX(j), this.operationY(i))
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
							const srndgParentG = this.drawSrndg(srndgG, this.operationX(j), this.operationY(i))
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
							const r2ParentG = this.drawRnumber(r2G, this.operationX(j), this.operationY(i), 'Zπ/2')
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
							const r4ParentG = this.drawRnumber(r4G, this.operationX(j), this.operationY(i), 'Zπ/4')
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
							const r8ParentG = this.drawRnumber(r8G, this.operationX(j), this.operationY(i), 'Zπ/8')
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
							const u2ParentG = this.drawUnumber(u2G, this.operationX(j), this.operationY(i), 'u2')
							u2ParentG
								.append('text')
								.attr('x', 0)
								.attr('y', -3)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:10px;')
								.text(this.radianToAngle(operation.options.params.phi))
							u2ParentG
								.append('text')
								.attr('x', 22)
								.attr('y', -3)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:10px;')
								.text(
									this.radianToAngle(operation.options.params.lambda)
								)
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
							const u3ParentG = this.drawUnumber(u3G, this.operationX(j), this.operationY(i), 'u3')
							u3ParentG
								.append('text')
								.attr('x', -11)
								.attr('y', -3)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:10px;')
								.text(this.radianToAngle(operation.options.params.theta))
							u3ParentG
								.append('text')
								.attr('x', 11)
								.attr('y', -3)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:10px;')
								.text(this.radianToAngle(operation.options.params.phi))
							u3ParentG
								.append('text')
								.attr('x', 33)
								.attr('y', -3)
								.classed('svgtext', true)
								.append('tspan')
								.attr('text-anchor', 'middle')
								.attr('style', 'font-size:10px;')
								.text(
									this.radianToAngle(operation.options.params.lambda)
								)
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
							const sParentG = this.drawNameCircle(sG, this.operationX(j), this.operationY(i), 's')
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
							const tParentG = this.drawNameCircle(tG, this.operationX(j), this.operationY(i), 't')
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
							const sdegParentG = this.drawSDg(sdegG, this.operationX(j), this.operationY(i), 's')
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
							const tdgParentG = this.drawSDg(tdgG, this.operationX(j), this.operationY(i), 't')
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										srsswapG,
										this.operationX(j),
										this.operationY(min) + 10,
										this.operationX(j),
										this.operationY(max)
									)
								}
								this.drawSrsswap(srsswapG, this.operationX(j), this.operationY(i), '√swp')
							} else {
								this.drawSrsswap(srsswapG, this.operationX(j), this.operationY(i), '√swp')
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										iswapG,
										this.operationX(j),
										this.operationY(min) + 10,
										this.operationX(j),
										this.operationY(max)
									)
								}
								this.drawSrsswap(iswapG, this.operationX(j), this.operationY(i), 'iswp')
							} else {
								this.drawSrsswap(iswapG, this.operationX(j), this.operationY(i), 'iswp')
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
								this.drawNameCircletwoLength(xyG, this.operationX(j), this.operationY(i), 'xy')
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
										.attr('x', this.operationX(j) + 2)
										.attr('y', this.svgItemHeight * (cu1min + 2) - this.svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(
											(_.round(operation.options.params.lambda, 2) ||
												operation.options.params.lambda) + '°'
										)
									xyG.append('rect')
										.attr('height', this.svgItemHeight * (cu1max - cu1min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (cu1min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										xyG,
										this.operationX(j),
										this.operationY(cu1min) + 10,
										this.operationX(j),
										this.operationY(cu1max)
									)
								}

								this.drawNameCircletwoLength(xyG, this.operationX(j), this.operationY(i), 'xy')
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
								this.drawCircle(cyG, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										cyG,
										this.operationX(j),
										this.operationY(min),
										this.operationX(j),
										this.operationY(max)
									)
									this.drawNameCircle(cyG, this.operationX(j), this.operationY(i), 'y')
								}else{
									this.drawCircle(cyG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(czG, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										czG,
										this.operationX(j),
										this.operationY(min),
										this.operationX(j),
										this.operationY(max)
									)
									this.drawCircle(czG, this.operationX(j), this.operationY(i))
								}else{
									this.drawCircle(czG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(chG, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										chG,
										this.operationX(j),
										this.operationY(min),
										this.operationX(j),
										this.operationY(max)
									)
									this.drawNameCircle(chG, this.operationX(j), this.operationY(i), 'h')
								}else{
									this.drawCircle(chG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(csrnG, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										csrnG,
										this.operationX(j),
										this.operationY(min),
										this.operationX(j),
										this.operationY(max)
									)
									this.drawSrn(srnG, this.operationX(j), this.operationY(i))
								}else{
									this.drawCircle(csrnG, this.operationX(j), this.operationY(i))
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
								this.drawNameCircletwoLength(msG, this.operationX(j), this.operationY(i), 'xx', 3)
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
										.attr('x', this.operationX(j) + 2)
										.attr('y', this.svgItemHeight * (cu1min + 2) - this.svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(
											this.radianToAngle(operation.options.params.theta)
										)
									msG.append('rect')
										.attr('height', this.svgItemHeight * (cu1max - cu1min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (cu1min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										msG,
										this.operationX(j),
										this.operationY(cu1min) + 10,
										this.operationX(j),
										this.operationY(cu1max)
									)
								}

								this.drawNameCircletwoLength(msG, this.operationX(j), this.operationY(i), 'xx', 3)
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
								this.drawNameCircletwoLength(yyG, this.operationX(j), this.operationY(i), 'yy', 3)
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
										.attr('x', this.operationX(j) + 2)
										.attr('y', this.svgItemHeight * (cu1min + 2) - this.svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(
											this.radianToAngle(operation.options.params.theta) 
										)
									yyG.append('rect')
										.attr('height', this.svgItemHeight * (cu1max - cu1min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (cu1min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										yyG,
										this.operationX(j),
										this.operationY(cu1min) + 10,
										this.operationX(j),
										this.operationY(cu1max)
									)
								}

								this.drawNameCircletwoLength(yyG, this.operationX(j), this.operationY(i), 'yy', 3)
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
								this.drawNameCircletwoLength(zzG, this.operationX(j), this.operationY(i), 'zz', 3)
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
										.attr('x', this.operationX(j) + 2)
										.attr('y', this.svgItemHeight * (zzmin + 2) - this.svgItemHeight / 2 + 3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text(
											this.radianToAngle(operation.options.params.theta )
										)
									zzG.append('rect')
										.attr('height', this.svgItemHeight * (zzmax - zzmin + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (zzmin + 2) - this.svgItemHeight / 2)
									this.drawLine(
										zzG,
										this.operationX(j),
										this.operationY(zzmin) + 10,
										this.operationX(j),
										this.operationY(zzmax)
									)
								}

								this.drawNameCircletwoLength(zzG, this.operationX(j), this.operationY(i), 'zz', 3)
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
								this.drawCircle(cr2G, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (cr2max - cr2min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (cr2min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										cr2G,
										this.operationX(j),
										this.operationY(cr2min) + 10,
										this.operationX(j),
										this.operationY(cr2max)
									)
									this.drawRnumber(cr2G, this.operationX(j), this.operationY(i), 'Zπ/2')
								}else{
									this.drawCircle(cr2G, this.operationX(j), this.operationY(i))
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
								this.drawCircle(cr4G, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (cr4max - cr4min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (cr4min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										cr4G,
										this.operationX(j),
										this.operationY(cr4min) + 10,
										this.operationX(j),
										this.operationY(cr4max)
									)
									this.drawRnumber(cr4G, this.operationX(j), this.operationY(i), 'Zπ/4')
								}else{
									this.drawCircle(cr4G, this.operationX(j), this.operationY(i))
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
								this.drawCircle(cr8G, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (cr8max - cr8min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (cr8min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										cr8G,
										this.operationX(j),
										this.operationY(cr8min) + 10,
										this.operationX(j),
										this.operationY(cr8max)
									)
									this.drawRnumber(cr8G, this.operationX(j), this.operationY(i), 'Zπ/8')
								}else{
									this.drawCircle(cr8G, this.operationX(j), this.operationY(i))
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
								this.drawCircle(crxG, this.operationX(j), this.operationY(i))
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
									crxG
									.append('text')
									.attr('x', 12)
									.attr('y', -2)
									.classed('svgtext', true)
									.append('tspan')
									.attr('text-anchor', 'middle')
									.attr('style', 'font-size:12px;')
									.text(this.radianToAngle(operation.options.params.theta))
									crxG.append('rect')
										.attr('height', this.svgItemHeight * (crxmax - crxmin + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (crxmin + 2) - this.svgItemHeight / 2)
									this.drawLine(
										crxG,
										this.operationX(j),
										this.operationY(crxmin) + 10,
										this.operationX(j),
										this.operationY(crxmax)
									)
									this.drawRx(rxG, this.operationX(j), this.operationY(i))
								}else{
									this.drawCircle(crxG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(crzG, this.operationX(j), this.operationY(i))
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
									crzG
									.append('text')
									.attr('x', 12)
									.attr('y', -2)
									.classed('svgtext', true)
									.append('tspan')
									.attr('text-anchor', 'middle')
									.attr('style', 'font-size:12px;')
									.text(this.radianToAngle(operation.options.params.phi))
									crzG.append('rect')
										.attr('height', this.svgItemHeight * (crzmax - crzmin + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (crzmin + 2) - this.svgItemHeight / 2)
									this.drawLine(
										crzG,
										this.operationX(j),
										this.operationY(crzmin) + 10,
										this.operationX(j),
										this.operationY(crzmax)
									)
									this.drawRz(crzG, this.operationX(j), this.operationY(i))
								}else{
									this.drawCircle(crzG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(cu1G, this.operationX(j), this.operationY(i))
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
									cu1G
									.append('text')
									.attr('x', 12)
									.attr('y', -2)
									.classed('svgtext', true)
									.append('tspan')
									.attr('text-anchor', 'middle')
									.attr('style', 'font-size:12px;')
									.text(this.radianToAngle(operation.options.params.lambda))
									cu1G.append('rect')
										.attr('height', this.svgItemHeight * (cu1max - cu1min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (cu1min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										cu1G,
										this.operationX(j),
										this.operationY(cu1min) + 10,
										this.operationX(j),
										this.operationY(cu1max)
									)
									this.drawNameCirclethreeLength(cu1G, this.operationX(j), this.operationY(i),'cu1')
								}else{
									this.drawCircle(cu1G, this.operationX(j), this.operationY(i))
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
								this.drawCircle(cu2G, this.operationX(j), this.operationY(i))
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
									cu2G
										.append('text')
										.attr('x', 0)
										.attr('y', -3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:10px;')
										.text(this.radianToAngle(operation.options.params.phi))
									cu2G
										.append('text')
										.attr('x', 22)
										.attr('y', -3)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:10px;')
										.text(
											this.radianToAngle(operation.options.params.lambda)
										)
									cu2G.append('rect')
										.attr('height', this.svgItemHeight * (cu2max - cu2min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (cu2min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										cu2G,
										this.operationX(j),
										this.operationY(cu2min) + 10,
										this.operationX(j),
										this.operationY(cu2max)
									)
									this.drawNameCirclethreeLength(cu2G, this.operationX(j), this.operationY(i),'cu2')
								}else{
									this.drawCircle(cu2G, this.operationX(j), this.operationY(i))
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
								this.drawCircle(cu3G, this.operationX(j), this.operationY(i))
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
								cu3G
									.append('text')
									.attr('x', -11)
									.attr('y', -3)
									.classed('svgtext', true)
									.append('tspan')
									.attr('text-anchor', 'middle')
									.attr('style', 'font-size:10px;')
									.text(this.radianToAngle(operation.options.params.theta))
								cu3G
									.append('text')
									.attr('x', 11)
									.attr('y', -3)
									.classed('svgtext', true)
									.append('tspan')
									.attr('text-anchor', 'middle')
									.attr('style', 'font-size:10px;')
									.text(this.radianToAngle(operation.options.params.phi))
								cu3G
									.append('text')
									.attr('x', 33)
									.attr('y', -3)
									.classed('svgtext', true)
									.append('tspan')
									.attr('text-anchor', 'middle')
									.attr('style', 'font-size:10px;')
									.text(
										this.radianToAngle(operation.options.params.lambda)
									)
									cu3G.append('rect')
										.attr('height', this.svgItemHeight * (cu3max - cu3min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (cu3min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										cu3G,
										this.operationX(j),
										this.operationY(cu3min) + 10,
										this.operationX(j),
										this.operationY(cu3max)
									)
									this.drawNameCirclethreeLength(cu3G, this.operationX(j), this.operationY(i),'cu3')
								}else{
									this.drawCircle(cu3G, this.operationX(j), this.operationY(i))
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
								this.drawCircle(csG, this.operationX(j), this.operationY(i))
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
									csG
										.append('rect')
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										csG,
										this.operationX(j),
										this.operationY(min),
										this.operationX(j),
										this.operationY(max)
									)
									this.drawNameCircle(csG,this.operationX(j),this.operationY(i),'s')
								}else{
									this.drawCircle(csG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(ctG, this.operationX(j), this.operationY(i))
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
									ctG
										.append('rect')
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										ctG,
										this.operationX(j),
										this.operationY(min),
										this.operationX(j),
										this.operationY(max)
									)
									this.drawNameCircle(ctG,this.operationX(j),this.operationY(i),'t')
								}else{
									this.drawCircle(ctG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(csdgG, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										csdgG,
										this.operationX(j),
										this.operationY(min) + 10,
										this.operationX(j),
										this.operationY(max)
									)
									this.drawSDg(sdegG, this.operationX(j), this.operationY(i), 's')
								}else{
									this.drawCircle(csdgG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(ctdgG, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										ctdgG,
										this.operationX(j),
										this.operationY(min) + 10,
										this.operationX(j),
										this.operationY(max)
									)
									this.drawSDg(sdegG, this.operationX(j), this.operationY(i), 't')
								}else{
									this.drawCircle(ctdgG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(ccxG, this.operationX(j), this.operationY(i))
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
									ccxG
										.append('rect')
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										ccxG,
										this.operationX(j),
										this.operationY(min),
										this.operationX(j),
										this.operationY(max)
									)
									this.drawCcnot(ccxG, this.operationX(j), this.operationY(i))
								}else{
									this.drawCircle(ccxG, this.operationX(j), this.operationY(i))
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										cswapG,
										this.operationX(j),
										this.operationY(min) + 10,
										this.operationX(j),
										this.operationY(max)
									)
									this.drawSwap(cswapG, this.operationX(j), this.operationY(i))
								}else{
									this.drawCircle(ccxG, this.operationX(j), this.operationY(i))
								}
								
							} else {
								this.drawCircle(ccxG, this.operationX(j), this.operationY(i))
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
							const csrswapG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
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
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										csrswapG,
										this.operationX(j),
										this.operationY(min) + 10,
										this.operationX(j),
										this.operationY(max)
									)
									this.drawSrsswap(srsswapG, this.operationX(j), this.operationY(i), '√swp')
								}else{
									this.drawCircle(ccxG, this.operationX(j), this.operationY(i))
								}
								
							} else {
								this.drawCircle(ccxG, this.operationX(j), this.operationY(i))
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
							const resetParentG = this.drawNameCirclethreeLength(resetG, this.operationX(j), this.operationY(i), 'rst',5)
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
							const measureG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
							measureG.datum(operation) //绑定数据到dom节点
							const measureParentG = this.drawRead(measureG, this.operationX(j), this.operationY(i))
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
								this.drawCircle(ncnotG, this.operationX(j), this.operationY(i))
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
									ncnotG.append('rect')
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
									this.drawLine(
										ncnotG,
										this.operationX(j),
										this.operationY(min),
										this.operationX(j),
										this.operationY(max)
									)
									this.drawCcnot(ncnotG, this.operationX(j), this.operationY(i))
								}else{
									this.drawCircle(ncnotG, this.operationX(j), this.operationY(i))
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
									this.drawLine(
										defaultG,
										this.operationX(j),
										this.operationY(min) + 10,
										this.operationX(j),
										this.operationY(max)
									)
									defaultG
										.append('text')
										.attr('x', this.operationX(j) + 2)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
										.classed('svgtext', true)
										.append('tspan')
										.attr('text-anchor', 'middle')
										.attr('style', 'font-size:12px;')
										.text('self-define')
									defaultG
										.append('rect')
										.attr('height', this.svgItemHeight * (max - min + 1))
										.attr('width', 22)
										.attr('fill', 'transparent')
										.attr('x', this.operationX(j) - 10)
										.attr('y', this.svgItemHeight * (min + 2) - this.svgItemHeight / 2)
								}

								this.drawSelfDefinedGate(defaultG, this.operationX(j), this.operationY(i))
							} else {
								this.drawSelfDefinedGate(defaultG, this.operationX(j), this.operationY(i))
								
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
	drawLineChart(row, svgWidth) {
		const svg = d3.select('#line_chart_svg')
		// const transformY = (qc.qubit_number + 1) * this.svgItemHeight
		const lineChartG = svg.select('#lineChart_graph')
		lineChartG.selectAll('*').remove()
		svg.attr('width', svgWidth)
		svg.attr('height', 30)
		const data = []
		for (let i = 0; i < this.qc.operations.length; i++) {
			const entropy = this.qc.getEntropy(this.qc.operations[i].index)
			data.push({
				index: this.qc.operations[i].index,
				entropy: entropy,
			})
		}
		const scaleX = d3
			.scaleBand()
			.domain(data.map((d) => d.index))
			.range([this.firstX + this.svgItemWidth / 2, (row + 3) * this.svgItemWidth + this.svgItemWidth / 2])

		// d3.min(data, (d) => d.entropy)
		const scaleY = d3
			.scaleLinear()
			.domain([-0.02, d3.max(data, (d) => d.entropy) + 0.02])
			// .range([transformY + this.svgItemHeight * 4, transformY + this.svgItemHeight * 3])
			.range([this.svgItemHeight, 0])
		// 渲染线条
		const X = d3.map(data, (d) => d.index)
		const Y = d3.map(data, (d) => d.entropy)
		const I = d3.range(X.length)
		lineChartG
			.append('rect')
			.attr('width', svgWidth)
			.attr('height', this.svgItemHeight)
			.attr('fill', 'rgba(229,143,130,0.1)')
			.attr('x', this.firstX)
			.attr('y', 0)
		lineChartG
			.append('path')
			.attr(
				'd',
				'M702.3 364c-41.2 0-79.4 18.8-113.1 41.9-26.3 18.1-52.3 40.6-77.2 63.1-24.9-22.6-50.9-45.1-77.2-63.1-33.7-23.2-71.9-41.9-113.1-41.9-81 0-148 67.1-148 148s67.1 148 148 148c41.2 0 79.4-18.8 113.1-41.9 26.3-18.1 52.3-40.6 77.2-63.1 24.9 22.6 50.9 45.1 77.2 63.1 33.7 23.2 71.9 41.9 113.1 41.9 81 0 148-67.1 148-148s-67-148-148-148zM398.9 565.8c-29.7 20.4-55 30.8-77.2 30.8-45.9 0-84.6-38.7-84.6-84.6s38.7-84.6 84.6-84.6c22.2 0 47.4 10.3 77.2 30.8 21.5 14.8 43.3 33.4 66 53.8-22.7 20.4-44.5 39-66 53.8z m303.4 30.8c-22.2 0-47.4-10.3-77.2-30.8-21.5-14.8-43.3-33.4-66-53.8 22.7-20.4 44.5-39 66-53.8 29.7-20.4 55-30.8 77.2-30.8 45.9 0 84.6 38.7 84.6 84.6s-38.7 84.6-84.6 84.6z'
			)
			.attr('fill', 'rgb(84, 84, 84)')
			.attr('transform', `translate(${this.firstX - this.svgItemWidth - 12},0) scale(0.03)`)
		// .attr('x',this.firstX - this.svgItemWidth)
		// .attr('y',transformY + this.svgItemHeight * 3 + this.svgItemHeight / 2)
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
	// 绘制C视图连线
	drawCLine(svg, lineData, lineXArr, heightStep) {
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
	drawCFn(index) {
		let j = 0
		const barData = this.qc.getVarState(index, undefined)
		this.varstatesIndex = index
		this.drawStackedBar(barData, j, index)
		this.drawCdownStackedBar(this.qc.getWholeState(index))
	}
	drawStackedBar(data, j,  index) {
		// 连线的数据 放在这个方法里 计算图标Y轴整体向下移动的距离
		const heightStep = 10
		const lineData = this.qc.getPmiIndex(index, 0.25)
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
			this.StackedBarChart(
				dataArr,
				g,
				width,
				key,
				config,
				barWidth,
				index,
				j ? widthArr[j - 1] : 0,
				heightStep
			)
			allWidth += width
			chart_svg.attr('width', allWidth + 50)
			j += 1
		}

		this.drawCLine(chart_svg, lineData, lineXArr, heightStep)
	}

	StackedBarChart(data, g, width, name, config, barWidth, index, left, heightStep) {
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
			const childRectPercent = self.qc.variableEntropy(index, name)
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
		self.chartBrushFn(g, barWidth, config, index, name, chart)
		self.charts.push(chart)
		// 总体绘制
		chart.render = function () {
			chart.renderAxis()
			chart.renderText()
			self.renderBar(chart, data)
			chart.addMouseOn()
			chart.renderPinkRect()
		}

		chart.renderChart()
	}

	// 渲染C视图柱子
	renderBar(chart, data) {
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
	chartBrushFn(svg, barWidth, config, index, key, chart) {
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
					if (self.filter[key] && self.filter[key].length) {
						self.filter[key] = []
					}
					for (let i = 0; i < bars.data().length; i++) {
						if (self.filter[bars.data()[i].name]) {
							self.filter[bars.data()[i].name].push(bars.data()[i].index)
						} else {
							self.filter[bars.data()[i].name] = [bars.data()[i].index]
						}
					}

					const allKeys = Object.keys(self.qc.name2index)
					const filterKeys = Object.keys(self.filter)
					// if (allKeys.length === filterKeys.length) {
					const filterResult = self.qc.getIndex(index, JSON.parse(JSON.stringify(self.filter)))
					const filterData = self.getWholeState.filter((item) => {
						return filterResult.includes(item.index)
					})

					const drawData = { magns: [], phases: [], probs: [], base: [] }
					filterData.forEach((item) => {
						drawData.magns.push(item.magns)
						drawData.phases.push(item.phases)
						drawData.probs.push(item.probs)
						drawData.base.push(item.base)
					})
					self.drawCdownStackedBar(drawData)

					// 更新C视图上半
					const barData = self.qc.getVarState(index, JSON.parse(JSON.stringify(self.filter)))

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
						self.charts.forEach((item) => {
							if (item.key() === key) {
								self.renderBar(item, dataArr)
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
	drawCdownStackedBar(data) {
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
		if (!this.getWholeState.length) {
			this.getWholeState = dataArr
		}
		// const width = barWidth * data.magns.length
		this.cDownStackedBarChart(dataArr, chart_down_svg)
	}
	cDownStackedBarChart(data, g) {
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
	/**************************绘制D模块***********************************/
	// 计算input的角度对应的X,Y 有个3px的差值 input的绘制

	getPhaseXY(deg, length) {
		let phaseX = 0
		let phaseY = 0
		if (deg <= 45 || deg >= 315) {
			phaseY = 0
		} else if (deg >= 135 && deg <= 225) {
			phaseY = length
		} else if (deg > 45 && deg < 135) {
			phaseY = length * ((deg - 45) / 90)
		} else {
			phaseY = length * ((315 - deg) / 90)
		}
		if (deg <= 45) {
			phaseX = length / 2 + (deg / 45) * (length / 2)
		} else if (deg >= 315) {
			phaseX = length / 2 - ((360 - deg) / 45) * (length / 2)
		} else if (deg <= 225 && deg >= 135) {
			phaseX = length - length * ((deg - 135) / 90)
		} else if (deg > 45 && deg < 135) {
			phaseX = length
		} else {
			phaseX = 0
		}
		return {
			phaseX,
			phaseY,
		}
	}
	// 绘制input
	drawDinput(svg, x, y, inWidth, deg, color, isNeedShowData, data, chartDiv, chartSvgDiv, offsetX, offsetY) {
		
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		parentG.append('rect').attr('width', this.dLength).attr('height', this.dLength).attr('fill', 'none')
		const childG = parentG.append('g').attr('transform', `translate(3,3)`)
		childG
			.append('rect')
			.attr('width', this.dLength - 6)
			.attr('height', this.dLength - 6)
			.attr('fill', 'transparent')
			.attr('stroke', inWidth ? '#000' : this.dCircleColor)
			.attr('stroke-width', 1)
		childG
			.append('g')
			.attr('transform', `translate(${(20 * (1 - inWidth)) / 2},${(20 * (1 - inWidth)) / 2})`)
			.append('rect')
			.attr('width', inWidth * 20)
			.attr('height', inWidth * 20)
			.attr('fill', color)
		if (inWidth) {
			const { phaseY, phaseX } = this.getPhaseXY(deg, 20)
			const context = d3.path()
			context.moveTo(10, 10)
			context.lineTo(phaseX, phaseY)
			childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1)
		}
		// 浅色块鼠标事件 需要显示图

		if (isNeedShowData) {
			const self = this
			data.probability = Math.pow(data.magnitude.toFixed(1), 2)
			const allKeys = [...Object.keys(data), ...Object.keys(data.var2value)].filter(
				(item) =>
					item !== 'var2value' &&
					item !== 'range' &&
					item !== 'ratio' &&
					item !== 'related_bases' &&
					item !== 'id' &&
					item !== 'max_base_magn'
			)
			childG.on('mouseover', function (e) {
				
				const scrollLeft = chartSvgDiv._groups[0][0].scrollLeft
				const scrollTop = chartSvgDiv._groups[0][0].scrollTop
				chartDiv.selectAll('.show_data_div').remove()
				// 碰撞检测
				let initTop = offsetY ? offsetY - scrollTop + 40 : e.offsetY - scrollTop + 36
				let initLeft =  offsetX ? offsetX + 50 - scrollLeft : e.offsetX - scrollLeft + 10
				const initHeight = 32 * (allKeys.length / 2)
				if(initTop + initHeight > chartDiv._groups[0][0].clientHeight){
					initTop = offsetY ? offsetY - scrollTop - 40 : e.offsetY - scrollTop - 36
				}
				if(initLeft + 200 > chartDiv._groups[0][0].clientWidth){
					initLeft =  offsetX ? offsetX - 210 - scrollLeft : e.offsetX - scrollLeft - 230
				}
				const showDataDiv = chartDiv
					.append('div')
					.attr('class', 'show_data_div')
					.attr(
						'style',
						`height:${initHeight}px;top:${
							initTop
						}px;left:${
							initLeft
						}px;border:1px solid black`
					)
				// const showDataSVG = showDataDiv
				// 	.append('svg')
				// 	.classed('relaed_svg', true)
				// 	.attr('width', '100%')
				// 	.attr('height', '100%')
				self.drawShowData(showDataDiv, data)
			})
			childG.on('mouseleave', function (e) {
				chartDiv.selectAll('.show_data_div').remove()
			})
		}
		return parentG
	}
	// 绘制浅色块显示的条形
	drawShowData(showDataDiv, data) {
		// const keys = Object.keys(data.var2value)
		// const allKeys = Object.keys(data).filter((item) =>)
		// const arr = []
		for (const key in data.var2value) {
			showDataDiv
				.append('span')
				.text(`${key}:${_.round(data.var2value[key], 2)}`)
				.classed('show_data_div_span', true)
		}
		for (const key in data) {
			if (
				key !== 'range' &&
				key !== 'var2value' &&
				key !== 'ratio' &&
				key !== 'related_bases' &&
				key !== 'id' &&
				key !== 'max_base_magn'
			) {
				showDataDiv
					.append('span')
					.text(`${key}:${_.round(data[key], 2)}`)
					.classed('show_data_div_span', true)
			}
		}
	}
	// 绘制D circle
	drawDCircle(svg, x, y, color, arcR, arcDeg, isNeedBorder, roation, scale, chartDiv, chartSvgDiv) {
		//   R 10
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		const borderRect = parentG
			.append('rect')
			.attr('width', this.dLength)
			.attr('height', this.dLength)
			.attr('fill', 'none')
		const childG = parentG.append('g')
		const circleR = this.dLength / 2
		if (isNeedBorder) {
			borderRect.attr('stroke', 'rgb(142, 132, 112)').attr('stroke-width', 1)
			if (arcR) {
				childG
					.append('circle')
					.attr('cx', circleR)
					.attr('cy', circleR)
					.attr('r', circleR - 2)
					.attr('stroke-width', 1)
					.attr('stroke', color)
					.attr('fill', 'transparent')
					.classed('d_item', true)
			}
		} else {
			childG
				.append('circle')
				.attr('cx', circleR)
				.attr('cy', circleR)
				.attr('r', circleR - 2)
				.attr('stroke-width', 1)
				.attr('stroke', color)
				.attr('fill', 'transparent')
				.classed('d_item', true)
		}
		if (arcDeg) {
			const arcRealR = (arcR * this.dLength) / 2 - 2
			const data = { startAngle: 0, endAngle: (Math.PI * arcDeg) / 180 }
			const acrPath = d3.arc().innerRadius(0).outerRadius(arcRealR)
			childG.append('path').attr('d', acrPath(data)).attr('fill', color).attr('transform', 'translate(13,13)')
			// 用浅色圆填充剩余的部分
			const opacityCircleR = { startAngle: (Math.PI * arcDeg) / 180, endAngle: (Math.PI * 360) / 180 }
			const circlePath = d3.arc().innerRadius(0).outerRadius(arcRealR)
			childG
				.append('path')
				.attr('d', circlePath(opacityCircleR))
				.attr('fill', color)
				.attr('transform', 'translate(13,13)')
				.attr('opacity', this.dCircleColorOpacity)
			if (arcR < 1 && arcR > 0) {
				const borderCircleR = { startAngle: (Math.PI * (arcDeg - 1)) / 180, endAngle: (Math.PI * arcDeg) / 180 }
				const borderPath = d3
					.arc()
					.innerRadius(0)
					.outerRadius(this.dLength / 2 - 2)
				childG
					.append('path')
					.attr('d', borderPath(borderCircleR))
					.attr('fill', color)
					.attr('transform', 'translate(13,13)')
				// .attr('stroke','rgba(142, 132, 112,0.5)')
				// .attr('stroke-width',1)
			}
		} else if (!arcDeg && arcR) {
			arcR = (arcR * this.dLength) / 2 - 2
			const context = d3.path()
			context.moveTo(circleR, circleR)
			context.lineTo(circleR, 2)
			childG.append('path').attr('d', context.toString()).attr('stroke', color).attr('stroke-width', 1)
			const opacityCircleR = { startAngle: 0, endAngle: (Math.PI * 360) / 180 }
			const circlePath = d3.arc().innerRadius(0).outerRadius(arcR)
			childG
				.append('path')
				.attr('d', circlePath(opacityCircleR))
				.attr('fill', color)
				.attr('transform', 'translate(13,13)')
				.attr('opacity', this.dCircleColorOpacity)
		}
		childG.on('mouseover', function (e) {
			const scrollLeft = chartSvgDiv._groups[0][0].scrollLeft
			const scrollTop = chartSvgDiv._groups[0][0].scrollTop
			chartDiv.selectAll('.show_circle_div').remove()

			const showCircleDiv = chartDiv
				.append('div')
				.attr('class', 'show_circle_div')
				.attr(
					'style',
					`height:${64}px;top:${e.offsetY - scrollTop}px;left:${
						e.offsetX - scrollLeft + 20
					}px;border:1px solid #ccc`
				)
			showCircleDiv.append('p').html(`roation：${scale.toFixed(2)}`)
			showCircleDiv.append('p').html(`scale：${roation.toFixed(2)}`)
		})
		childG.on('mouseleave', function (e) {
			chartDiv.selectAll('.show_circle_div').remove()
		})
		return parentG
	}
	// 绘制text
	drawText(svg, x, y, index) {
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		parentG.append('rect').attr('width', this.dLength).attr('height', this.dLength).attr('fill', 'none')
		const textSvg = getDirac(index)
		const z = new XMLSerializer()
		parentG
			.append('foreignObject')
			.attr('width', 26)
			.attr('height', 26)
			.attr('x', String(index).length > 1 ? 0 : 3)
			.attr('y', 1)
			.append('xhtml:div')
			.attr('height', '100%')
			.attr('width', '100%')
			.html(z.serializeToString(textSvg))

		return parentG
	}
	// 绘制text
	drawRepeatText(svg, x, y, index, k, isPortrait) {
		if (isPortrait) {
			for (let i = 0; i < index.length; i++) {
				if (index[i][1] - index[i][0] > 2) {
					const textSvg = getDirac(k)
					const z = new XMLSerializer()
					const parentG = svg
						.append('g')
						.attr('transform', `translate(${x}, ${this.dLength * index[i][0]})`)
						.classed('d_item', true)
					parentG
						.append('rect')
						.attr('width', this.dLength)
						.attr('height', this.dLength * (index[i][1] - index[i][0] + 1))
						.attr('fill', 'none')
					parentG
						.append('rect')
						.attr('width', this.dLength - 7)
						.attr('height', 1)
						.attr('fill', 'rgba(142, 132, 112,0.5)')
						.attr('x', x + 3)
						.attr('y', 2)
					parentG
						.append('rect')
						.attr('width', this.dLength - 7)
						.attr('height', 1)
						.attr('fill', 'rgba(142, 132, 112,0.5)')
						.attr('x', x + 3)
						.attr('y', this.dLength * (index[i][1] - index[i][0] + 1) - 4)
					parentG
						.append('foreignObject')
						.attr('width', 26)
						.attr('height', 26)
						.attr('x', String(k).length > 1 ? 0 : 3)
						.attr('y', (this.dLength * (index[i][1] - index[i][0] + 1)) / 2 - 12)
						.append('xhtml:div')
						.attr('height', '100%')
						.attr('width', '100%')
						.html(z.serializeToString(textSvg))
					this.drawLine(
						parentG,
						x + 12,
						8,
						x + 12,
						(this.dLength * (index[i][1] - index[i][0] + 1)) / 2 - 14,
						'rgba(142, 132, 112, 0.5)'
					)
					this.drawLine(
						parentG,
						x + 12,
						(this.dLength * (index[i][1] - index[i][0] + 1)) / 2 + 14,
						x + 12,
						this.dLength * (index[i][1] - index[i][0] + 1) - 8,
						'rgba(142, 132, 112, 0.5)'
					)
				} else {
					for (let j = index[i][0]; j <= index[i][1]; j++) {
						this.drawText(svg, x, this.dLength * j, k)
					}
				}
			}
		} else {
			for (let i = 0; i < index.length; i++) {
				if (index[i][1] - index[i][0] > 2) {
					const textSvg = getDirac(k)
					const z = new XMLSerializer()
					const parentG = svg
						.append('g')
						.attr('transform', `translate(${this.dLength * index[i][0]}, ${y})`)
						.classed('d_item', true)
					parentG
						.append('rect')
						.attr('width', this.dLength * (index[i][1] - index[i][0] + 1))
						.attr('height', this.dLength)
						.attr('fill', 'none')
					parentG
						.append('rect')
						.attr('width', 1)
						.attr('height', this.dLength - 7)
						.attr('fill', 'rgba(142, 132, 112,0.5)')
						.attr('x', 2)
						.attr('y', y + 3)
					parentG
						.append('rect')
						.attr('width', 1)
						.attr('height', this.dLength - 7)
						.attr('fill', 'rgba(142, 132, 112,0.5)')
						.attr('x', this.dLength * (index[i][1] - index[i][0] + 1) - 4)
						.attr('y', y + 3)
					parentG
						.append('foreignObject')
						.attr('width', 26)
						.attr('height', 26)
						.attr('x', (this.dLength * (index[i][1] - index[i][0] + 1)) / 2 - 9)
						.attr('y', 1)
						.append('xhtml:div')
						.attr('height', '100%')
						.attr('width', '100%')
						.html(z.serializeToString(textSvg))
					this.drawLine(
						parentG,
						8,
						y + 13,
						(this.dLength * (index[i][1] - index[i][0] + 1)) / 2 - 14,
						y + 13,
						'rgba(142, 132, 112, 0.5)'
					)
					this.drawLine(
						parentG,
						(this.dLength * (index[i][1] - index[i][0] + 1)) / 2 + 14,
						y + 13,
						this.dLength * (index[i][1] - index[i][0] + 1) - 10,
						y + 13,
						'rgba(142, 132, 112, 0.5)'
					)
				} else {
					for (let j = index[i][0]; j <= index[i][1]; j++) {
						this.drawText(svg, this.dLength * j, y, k)
					}
				}
			}
		}
	}
	// 绘制浅色块text
	drawRelaedNum(svg, x, y, data, textX, chartDiv, chartSvgDiv, textY) {
		data = data.slice(1, data.length)
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		parentG.append('rect').attr('width', this.dLength).attr('height', 14).attr('fill', 'none')
		const self = this
		const childG = parentG.append('g')
		childG
			.append('text')
			.text(`${data.length}+`)
			.attr('style', 'font-size:12px;')
			.classed('svgtext', true)
			.attr('transform', `translate(${textX}, ${textY})`)
			.on('mouseover', function (e) {
				const scrollLeft = chartSvgDiv._groups[0][0].scrollLeft
				const scrollTop = chartSvgDiv._groups[0][0].scrollTop
				chartDiv.selectAll('.relaed_div').remove()
				const relaedDiv = chartDiv
					.append('div')
					.attr('class', 'relaed_div')
					.attr(
						'style',
						`top:${e.offsetY - scrollTop + 36}px;left:${e.offsetX - scrollLeft + 10}px;height:${
							self.dLength * data.length + 17
						}px;width:${self.dLength + 8}px;border:1px solid black`
					)
				relaedDiv
					.append('div')
					.classed('relaed_div_close', true)
					.attr('style', 'width:100%;height:8px;line-height:8px;padding:2px;')
					.append('img')
					.attr('src', '/icon/delete_icon.svg')
					.attr('width', 6)
					.attr('height', 6)
					.attr('style', 'float:right;cursor:pointer;')
					.on('click', (e) => {
						d3.select(e.target.parentNode.parentNode).remove()
					})
				const relaedSVG = relaedDiv
					.append('svg')
					.classed('relaed_svg', true)
					.attr('width', '100%')
					.attr('height', 'calc(100% - 8px)')
				for (let i = 0; i < data.length; i++) {
					self.drawDinput(
						relaedSVG,
						3,
						self.dLength * i,
						data[i].ratio,
						data[i].phases,
						self.dLightRectColor,
						true,
						data[i],
						chartDiv,
						chartSvgDiv,
						e.offsetX,
						e.offsetY
					)
				}
			})
	}
	// 绘制变量名
	drawDqName(svg, name) {
		svg.append('rect').attr('width', this.dLength).attr('height', this.dLength).attr('fill', 'transparent')
		svg.append('text')
			.text(`${name}`)
			.attr('dominant-baseline', 'middle')
			.attr('x', 0)
			.attr('y', this.dLength / 2)
	}
	// 绘制基本结构
	drawElement(labelName, labelId, circleNum, inputStateNumber, svgWidth, svgHeight) {
		const self = this
		let isShowMore = false
		let isFull = false
		let isReduce = false
		//删除
		const getParentNode = (obj) => {
			if (!obj.classList.contains('d_chart_div')) {
				getParentNode(obj.parentNode)
			} else {
				self.qc.labels.splice(
					self.qc.labels.findIndex((item) => item.id === labelId),
					1
				)
				self.qc.label_count--
				d3.select(`#circuit_svg  .label_${labelId}`).remove()
				d3.select(obj).remove()
			}
		}
		const close = (e) => {
			getParentNode(e.target)
		}
		//显示更多操作
		const showMoreOperation = (elm) => {
			if (isShowMore) {
				elm.attr('style', 'display:none')
				isShowMore = !isShowMore
			} else {
				elm.attr('style', 'display:block')
				isShowMore = !isShowMore
			}
		}
		// 放大到全屏
		const expandFn = (chartDiv, operationDiv, svg) => {
			// const expand_div = d3.select('.App').append('div').classed('expand_div', true)
			if (isFull) {
				chartDiv.attr('class', null).classed('d_chart_div', true)
				operationDiv.attr('style', 'display:none')
				isShowMore = false
				svg.attr('width', svgWidth / this.viewBoxWidth)
				svg.attr('height', svgHeight / this.viewBoxHeight)
				svg.attr('viewBox', `0,0,${svgWidth},${svgHeight}`)
				chartSvgDiv.attr('style', 'display:block;')
				chartDiv.select('.reduce_icon').attr('src', '/icon/reduce_icon.svg')
				isFull = !isFull
				isReduce = false
			} else {
				svg.attr('width', '100%')
				svg.attr('height', '100%')
				svg.attr('viewBox', null)
				chartDiv.classed('d_chart_div_full', true)
				operationDiv.attr('style', 'display:none')
				chartSvgDiv.attr('style', 'display:block;')
				chartDiv.selectAll('.title_icon').attr('style', 'display:inline-block;')
				chartDiv.select('.reduce_icon').attr('src', '/icon/reduce_icon.svg')
				isShowMore = false
				isFull = !isFull
				isReduce = false
			}
		}
		// 缩小
		const reduceFn = (chartDiv, operationDiv, chartSvgDiv) => {
			if (isReduce) {
				operationDiv.attr('style', 'display:none')
				isShowMore = false
				chartSvgDiv.attr('style', 'display:block;')
				chartDiv.selectAll('.title_icon').attr('style', 'display:inline-block;')
				svg.attr('width', svgWidth / this.viewBoxWidth)
				svg.attr('height', svgHeight / this.viewBoxHeight)
				svg.attr('viewBox', `0,0,${svgWidth},${svgHeight}`)
				chartDiv.select('.reduce_icon').attr('src', '/icon/reduce_icon.svg')
				isReduce = !isReduce
				isFull = false
			} else {
				chartDiv.attr('class', null).classed('d_chart_div', true)
				chartDiv.selectAll('.title_icon').attr('style', 'display:none')
				operationDiv.attr('style', 'display:none')
				chartSvgDiv.attr('style', 'display:none;')
				isShowMore = false
				isReduce = !isReduce
				isFull = false
				chartDiv.select('.reduce_icon').attr('src', '/icon/zhankai_icon.svg')
			}
		}
		const drawDiv = d3.select('#d_draw_div')
		// drawDiv.selectAll('*').remove()
		const chartDiv = drawDiv.append('div').classed('d_chart_div', true)
		const titleDiv = chartDiv.append('div').classed('d_chart_title', true)
		const labelNameSpan = titleDiv.append('span').classed('label_name', true).text(`${labelName}`)
		const btnDiv = titleDiv.append('div').classed('btn_group', true)
		const chartSvgDiv = chartDiv.append('div').classed('chart_svg_div', true)
		const svg = chartSvgDiv.append('svg').classed('d_chart_svg', true).attr('width', '320').attr('height', '280')
		// const svg = chartSvgDiv.append('svg').classed('d_chart_svg', true)
		const operationDiv = btnDiv.append('div').classed('operation_div', true).attr('style', 'display:none;')
		btnDiv
			.append('img')
			.attr('src', '/img/legends/yellowCircle.png')
			.attr('width', 15)
			.attr('height', 15)
			.classed('title_icon', true)
		btnDiv
			.append('span')
			.text(`${circleNum}`)
			.attr('style', 'font-size:12px;margin-left:5px;')
			.classed('title_icon', true)
		btnDiv
			.append('img')
			.attr('src', '/img/legends/chart.png')
			.attr('width', 15)
			.attr('height', 15)
			.classed('title_icon', true)
		btnDiv
			.append('span')
			.text(`${inputStateNumber}`)
			.attr('style', 'font-size:12px;margin-left:5px;')
			.classed('title_icon', true)
		btnDiv
			.append('img')
			.attr('src', '/icon/more_icon.svg')
			.attr('width', 15)
			.attr('height', 15)
			.on('mouseover', function (e) {
				showMoreOperation(operationDiv)
			})

		operationDiv
			.append('img')
			.attr('src', '/icon/save_icon.svg')
			.on('click', function () {
				self.saveFn(svg.html(), labelNameSpan.html(), svg.attr('width'), svg.attr('height'))
				operationDiv.attr('style', 'display:none')
				isShowMore = false
			})
		operationDiv
			.append('img')
			.attr('src', '/icon/expand_icon.svg')
			.on('click', function () {
				expandFn(chartDiv, operationDiv, svg)
			})
		operationDiv
			.append('img')
			.attr('src', '/icon/reduce_icon.svg')
			.attr('width', 15)
			.attr('height', 15)
			.classed('reduce_icon', true)
			.on('click', function () {
				reduceFn(chartDiv, operationDiv, chartSvgDiv)
			})
		operationDiv.append('img').attr('src', '/icon/delete_icon.svg').on('click', close)
		return {
			svg,
			chartDiv,
			chartSvgDiv,
		}
	}
	// 保存
	saveFn(elm, labelName, width, height) {
		const getParentNode = (obj) => {
			if (!obj.classList.contains('save_draw_div')) {
				getParentNode(obj.parentNode)
			} else {
				d3.select(obj).remove()
			}
		}
		const close = (e) => {
			getParentNode(e.target)
		}
		const saveDiv = d3.select('#self_definded_draw')
		const drawDiv = saveDiv.append('div').classed('save_draw_div', true)
		const titleDiv = drawDiv.append('div').classed('save_div_title', true)
		const btnDiv = titleDiv.append('div').classed('save_btn_group', true)
		btnDiv.append('img').attr('src', '/icon/delete_icon.svg').on('click', close)
		titleDiv.append('span').classed('label_name', true).text(`${labelName}`)
		const saveSvg = drawDiv
			.append('div')
			.classed('save_svg', true)
			.append('svg')
			.attr('width', '100%')
			.attr('height', 'calc(100% - 22px)')
			.attr('viewBox', `0,0,${width},${height}`)
		saveSvg.html(elm)

		// d3.select('.save_svg .d_chart_svg').attr('transform', 'translate(0,0) scale(0.1)')
		// console.log(svg)
	}
	// 绘制曲线
	ribbonPathString(sx, sy, sdy, tx, ty, tdy, tension) {
		var m0, m1
		return (
			tension === 1
				? ['M', [sx, sy], 'L', [tx, ty], 'V', ty + tdy, 'L', [sx, sy + sdy], 'Z']
				: [
						'M',
						[sx, sy],
						'C',
						[(m0 = tension * sx + (1 - tension) * tx), sy],
						' ',
						[(m1 = tension * tx + (1 - tension) * sx), ty],
						' ',
						[tx, ty],
						'V',
						ty + tdy,
						'C',
						[m1, ty + tdy],
						' ',
						[m0, sy + sdy],
						' ',
						[sx, sy + sdy],
						'Z',
				  ]
		).join('')
	}
	silkRibbonPathString(sx, sy, tx, ty, tension) {
		var m0, m1
		return (
			tension == 1
				? [
						'M',
						[sx, sy],
						'L',
						[tx, ty],
						//"Z"
				  ]
				: [
						'M',
						[sx, sy],
						'C',
						[(m0 = tension * sx + (1 - tension) * tx), sy],
						' ',
						[(m1 = tension * tx + (1 - tension) * sx), ty],
						' ',
						[tx, ty],
						//"Z"
				  ]
		).join('')
	}
	// 绘制sankey图
	drawSankey(data) {
		let filter_unused = false //true;

		const circleData = this.qc.getEvoMatrix(data.id)
		let circleDataNum = 0
		if (circleData.length && circleData[0].length) {
			circleDataNum = circleData[0][0]['max'].toFixed(2)
		}

		const { input_state: inputStateData, output_state: outStateData } = this.qc.getState(data.id)
		const { sankey: sankeyData, permute } = this.qc.transferSankeyOrdered(
			data.id,
			1e-5,
			false,
			filter_unused,
			inputStateData,
			outStateData
		)

		const inputBases = inputStateData.bases
		const outBases = outStateData.bases
		// outBases根据permute排序
		outBases.sort(this.sortFunc('id', permute))
		// 计算圆圈g X轴向右移动的距离
		const circleGtransformX = (inputStateData.vars.length + 4) * this.dLength + 14
		// 计算输入input X轴移动
		const inputGTransformX = (inputStateData.vars.length + 1) * this.dLength + 14
		// 计算out_input X轴移动
		const outGTransformX = (inputStateData.vars.length + 7) * this.dLength + 14
		// 计算out_input 浅色块X轴移动
		const outRelatedGX = outGTransformX + (outStateData.vars.length + 1) * this.dLength
		// 设置svg的宽高
		const svgHeight = (outStateData.bases.length + 1) * this.dLength
		const svgWidth = outRelatedGX + this.dLength * 2 - 10
		const { svg, chartDiv, chartSvgDiv } = this.drawElement(
			data.text,
			data.id,
			
			circleDataNum,
			inputStateData['max_magn'].toFixed(2),
			svgWidth,
			svgHeight
		)

		svg.attr('viewBox', `0,0,${svgWidth},${svgHeight}`)
		svg.attr('width', svgWidth / this.viewBoxWidth)
		svg.attr('height', svgHeight / this.viewBoxHeight)
		// svg.attr('width',)

		// 绘制圈
		const circleG = svg
			.append('g')
			.classed('circle_g', true)
			.attr('transform', `translate(${circleGtransformX},${this.dLength})`)
		for (let i = 0; i < sankeyData.length; i++) {
			const color = sankeyData[i].used ? this.dCircleUsedColor : this.dCircleColor
			const arcR = sankeyData[i].ratio
			this.drawDCircle(
				circleG,
				0,
				this.dLength * i,
				color,
				arcR,
				sankeyData[i].phase,
				false,
				sankeyData[i].maganitude,
				sankeyData[i].phase,
				chartDiv,
				chartSvgDiv
			)
		}
		// 绘制input_state

		for (let i = 0; i < inputStateData.vars.length; i++) {
			const inputVar2ValueArr = []
			const textG = svg
				.append('g')
				.classed('text_g', true)
				.attr('transform', `translate(${this.dLength * (i + 1) + 14},${this.dLength})`)
			const qNameX = this.dLength * (i + 1) + 14
			const qNameG = svg
				.append('g')
				.classed('q_name_g', true)
				.attr('transform', `translate(${qNameX + 5},0)`)
			this.drawDqName(qNameG, inputStateData.vars[i])

			for (let j = 0; j < inputBases.length; j++) {
				inputVar2ValueArr.push(inputBases[j].var2value[inputStateData.vars[i]])
			}
			// 得到重复的开始/结束位置:{10:[[0,1],[4,8]]}
			const repeatObj = this.getRepeat(inputVar2ValueArr)
			const catchObj = {}
			for (let k = 0; k < inputVar2ValueArr.length; k++) {
				if (repeatObj[inputVar2ValueArr[k]]) {
					if (!catchObj[inputVar2ValueArr[k]]) {
						this.drawRepeatText(
							textG,
							0,
							this.dLength * k,
							repeatObj[inputVar2ValueArr[k]],
							inputVar2ValueArr[k],
							true
						)
					}
					catchObj[inputVar2ValueArr[k]] = 1
				} else {
					this.drawText(textG, 0, this.dLength * k, inputVar2ValueArr[k])
				}
			}
		}
		const inputG = svg
			.append('g')
			.classed('put_g', true)
			.attr('transform', `translate(${inputGTransformX},${this.dLength})`)
		const inputRelatedG = svg
			.append('g')
			.classed('input_related_g', true)
			.attr('transform', `translate(14 ,${this.dLength})`)
		const drawInputRelaedNumG = svg
			.append('g')
			.classed('input_related_num', true)
			.attr('transform', `translate(0,${this.dLength})`)
		for (let j = 0; j < inputBases.length; j++) {
			this.drawDinput(
				inputG,
				0,
				this.dLength * j,
				inputBases[j].ratio,
				inputBases[j].phases,
				'rgb(80, 128, 132)',
				!!inputBases[j].ratio,
				inputBases[j],
				chartDiv,
				chartSvgDiv
			)
			const number = 0
			for (let k = 0; k < inputBases[j].related_bases.length; k++) {
				if (k === 0) {
					// 只绘一个 然后显示几个
					this.drawDinput(
						inputRelatedG,
						0,
						this.dLength * j,
						inputBases[j].related_bases[k].ratio,
						inputBases[j].related_bases[k].phases,
						this.dLightRectColor,
						true,
						inputBases[j].related_bases[k],
						chartDiv,
						chartSvgDiv
					)
				}
			}
			if (inputBases[j].related_bases.length > 1) {
				this.drawRelaedNum(
					drawInputRelaedNumG,
					0,
					this.dLength * j,
					inputBases[j].related_bases,
					0,
					chartDiv,
					chartSvgDiv,
					17
				)
			}
		}
		// 绘制out_state
		for (let i = 0; i < outStateData.vars.length; i++) {
			let outVar2ValueArr = []
			const textG = svg
				.append('g')
				.classed('text_g', true)
				.attr('transform', `translate(${outGTransformX + this.dLength * (i + 1)},${this.dLength})`)
			const qNameX = outGTransformX + this.dLength * (i + 1)
			const qNameG = svg
				.append('g')
				.classed('q_name_g', true)
				.attr('transform', `translate(${qNameX + 5},0)`)
			this.drawDqName(qNameG, outStateData.vars[i])

			// 绘制text |0>
			for (let j = 0; j < outBases.length; j++) {
				outVar2ValueArr.push(outBases[j].var2value[outStateData.vars[i]])
			}
			// 得到重复的开始/结束位置:{10:[[0,1],[4,8]]}
			const repeatObj = this.getRepeat(outVar2ValueArr)
			const catchObj = {}
			for (let k = 0; k < outVar2ValueArr.length; k++) {
				if (repeatObj[outVar2ValueArr[k]]) {
					if (!catchObj[outVar2ValueArr[k]]) {
						this.drawRepeatText(
							textG,
							0,
							this.dLength * k,
							repeatObj[outVar2ValueArr[k]],
							outVar2ValueArr[k],
							true
						)
					}
					catchObj[outVar2ValueArr[k]] = 1
				} else {
					this.drawText(textG, 0, this.dLength * k, outVar2ValueArr[k])
				}
			}
		}
		const outG = svg
			.append('g')
			.classed('put_g', true)
			.attr('transform', `translate(${outGTransformX},${this.dLength})`)
		const outRelatedG = svg
			.append('g')
			.classed('input_related_g', true)
			.attr('transform', `translate(${outRelatedGX},${this.dLength})`)
		const drawOutRelaedNumG = svg
			.append('g')
			.classed('input_related_num', true)
			.attr('transform', `translate(${outRelatedGX + this.dLength},${this.dLength})`)
		for (let j = 0; j < outBases.length; j++) {
			this.drawDinput(
				outG,
				0,
				this.dLength * j,
				outBases[j].ratio,
				outBases[j].phases,
				'rgb(80, 128, 132)',
				!!outBases[j].ratio,
				outBases[j],
				chartDiv,
				chartSvgDiv
			)
			for (let k = 0; k < outBases[j].related_bases.length; k++) {
				if (k === 0) {
					// 只绘一个 然后显示几个 开发时候是全传入了
					this.drawDinput(
						outRelatedG,
						0,
						this.dLength * j,
						outBases[j].related_bases[k].ratio,
						outBases[j].related_bases[k].phases,
						this.dLightRectColor,
						true,
						outBases[j].related_bases[k],
						chartDiv,
						chartSvgDiv
					)
				}
			}
			if (outBases[j].related_bases.length > 1) {
				this.drawRelaedNum(
					drawOutRelaedNumG,
					0,
					this.dLength * j,
					outBases[j].related_bases,
					0,
					chartDiv,
					chartSvgDiv,
					17
				)
			}
		}
		// 绘制连线
		for (let i = 0; i < sankeyData.length; i++) {
			const color = sankeyData[i].used ? this.dCircleUsedColor : this.dCircleColor
			const toD = this.silkRibbonPathString(
				circleGtransformX + this.dLength,
				this.dLength * (i + 1) + this.dLength / 2,
				outGTransformX,
				this.findToDy(outBases, sankeyData[i].to_id),
				0.5
			)
			svg.append('path').attr('d', toD).attr('fill', 'none').attr('stroke-width', 1).attr('stroke', color)
			const fromD = this.silkRibbonPathString(
				circleGtransformX,
				this.dLength * (i + 1) + this.dLength / 2,
				inputGTransformX + this.dLength,
				this.findfromDy(inputBases, sankeyData[i].from_id),
				0.5
			)
			svg.append('path').attr('d', fromD).attr('fill', 'none').attr('stroke-width', 1).attr('stroke', color)
		}
	}
	// 查to_d连线的Y值
	findToDy(outBases, id) {
		let y = 0
		for (let i = 0; i < outBases.length; i++) {
			if (outBases[i].id === id) {
				y = this.dLength * (i + 1) + this.dLength / 2
				break
			}
		}
		return y
	}
	// 查from_d连线的Y
	findfromDy(fromBases, id) {
		let y = 0
		for (let i = 0; i < fromBases.length; i++) {
			if (fromBases[i].id === id) {
				y = this.dLength * (i + 1) + this.dLength / 2
				break
			}
		}
		return y
	}
	// 排序方法
	sortFunc(propName, referArr) {
		return (prev, next) => {
			return referArr.indexOf(prev[propName]) - referArr.indexOf(next[propName])
		}
	}

	// 绘制普通完整表示
	drawMatrix(data) {
		const { input_state: inputStateData, output_state: outStateData } = this.qc.getState(data.id)

		const circleData = this.qc.getEvoMatrix(data.id)

		let circleDataNum = 0
		if (circleData.length && circleData[0].length) {
			circleDataNum = circleData[0][0]['max'].toFixed(2)
		}

		// 计算矩阵g Y轴向下移动的距离
		const circleGtransformY = (inputStateData.vars.length + 2) * this.dLength + 14

		// 计算输入input Y轴移动
		const inputGTransformY = (inputStateData.vars.length + 1) * this.dLength + 14
		// 计算out_input X轴移动
		const inputWidth = (inputStateData.bases.length + 1) * this.dLength + 15
		// 计算out_input 浅色块X轴移动
		const outRelatedGX = inputWidth + (outStateData.vars.length + 1) * this.dLength
		// 绘制矩阵
		// 设置svg的宽高
		const svgHeight = circleGtransformY + outStateData.bases.length * this.dLength
		const svgWidth = outRelatedGX + this.dLength * 2 + 15
		const { svg, chartDiv, chartSvgDiv } = this.drawElement(
			data.text,
			data.id,
			
			circleDataNum,
			inputStateData['max_magn'].toFixed(2),
			svgWidth,
			svgHeight
		)
		// svg.attr('height', svgHeight).attr('width', svgWidth)
		svg.attr('viewBox', `0,0,${svgWidth},${svgHeight}`)
		svg.attr('width', svgWidth / this.viewBoxWidth)
		svg.attr('height', svgHeight / this.viewBoxHeight)
		const circleG = svg
			.append('g')
			.classed('circle_g', true)
			.attr('transform', `translate(${this.dLength + 15},${circleGtransformY})`)
		for (let i = 0; i < circleData.length; i++) {
			for (let j = 0; j < circleData[i].length; j++) {
				const color = circleData[i][j].used ? this.dCircleUsedColor : this.dCircleColor
				const arcR = circleData[i][j].ratio
				this.drawDCircle(
					circleG,
					this.dLength * j,
					this.dLength * i,
					color,
					arcR,
					circleData[i][j].phase,
					true,
					circleData[i][j].magnitude,
					circleData[i][j].phase,
					chartDiv,
					chartSvgDiv
				)
			}
		}
		// 绘制out_state
		for (let i = 0; i < outStateData.vars.length; i++) {
			const outVar2ValueArr = []
			const textG = svg
				.append('g')
				.classed('text_g', true)
				.attr('transform', `translate(${inputWidth + this.dLength * (i + 1)},${circleGtransformY})`)

			// for (let j = 0; j < outStateData.bases.length; j++) {
			// 	this.drawText(textG, 0, this.dLength * j, outStateData.bases[j].var2value[outStateData.vars[i]])
			// }
			// 绘制text |0>
			for (let j = 0; j < outStateData.bases.length; j++) {
				outVar2ValueArr.push(outStateData.bases[j].var2value[outStateData.vars[i]])
			}
			// 得到重复的开始/结束位置:{10:[[0,1],[4,8]]}

			const repeatObj = this.getRepeat(outVar2ValueArr)
			const catchObj = {}
			for (let k = 0; k < outVar2ValueArr.length; k++) {
				if (repeatObj[outVar2ValueArr[k]]) {
					if (!catchObj[outVar2ValueArr[k]]) {
						this.drawRepeatText(
							textG,
							0,
							this.dLength * k,
							repeatObj[outVar2ValueArr[k]],
							outVar2ValueArr[k],
							true
						)
					}
					catchObj[outVar2ValueArr[k]] = 1
				} else {
					this.drawText(textG, 0, this.dLength * k, outVar2ValueArr[k])
				}
			}
		}
		const outG = svg
			.append('g')
			.classed('put_g', true)
			.attr('transform', `translate(${inputWidth},${circleGtransformY})`)
		const outRelatedG = svg
			.append('g')
			.classed('input_related_g', true)
			.attr('transform', `translate(${outRelatedGX},${circleGtransformY})`)
		const drawOutRelaedNumG = svg
			.append('g')
			.classed('input_related_num', true)
			.attr('transform', `translate(${outRelatedGX + this.dLength},${circleGtransformY})`)
		for (let j = 0; j < outStateData.bases.length; j++) {
			this.drawDinput(
				outG,
				0,
				this.dLength * j,
				outStateData.bases[j].ratio,
				outStateData.bases[j].phases,
				'rgb(80, 128, 132)',
				!!outStateData.bases[j].ratio,
				outStateData.bases[j],
				chartDiv,
				chartSvgDiv
			)
			for (let k = 0; k < outStateData.bases[j].related_bases.length; k++) {
				if (k === 0) {
					// 只绘一个 然后显示几个 开发时候是全传入了
					this.drawDinput(
						outRelatedG,
						0,
						this.dLength * j,
						outStateData.bases[j].related_bases[k].ratio,
						outStateData.bases[j].related_bases[k].phases,
						this.dLightRectColor,
						true,
						outStateData.bases[j].related_bases[k],
						chartDiv,
						chartSvgDiv
					)
				}
			}
			if (outStateData.bases[j].related_bases.length > 1) {
				this.drawRelaedNum(
					drawOutRelaedNumG,
					0,
					this.dLength * j,
					outStateData.bases[j].related_bases,
					0,
					chartDiv,
					chartSvgDiv,
					17
				)
			}
		}
		// 绘制input_state
		inputStateData.vars.reverse()
		let j = inputStateData.vars.length - 1
		for (let i = 0; i < inputStateData.vars.length; i++) {
			const inputVar2ValueArr = []
			const textG = svg
				.append('g')
				.classed('text_g', true)
				.attr('transform', `translate(${this.dLength + 15},${this.dLength * (i + 1) + 14})`)
			// 绘制变量名
			const qNameY = this.dLength * (i + 1) + 14
			const qNameG = svg
				.append('g')
				.classed('q_name_g', true)
				.attr('transform', `translate(${inputWidth + this.dLength * (j + 1) + 5},${qNameY})`)
			this.drawDqName(qNameG, inputStateData.vars[i])
			j--
			// // 绘制文字 |0>
			// for (let j = 0; j < inputStateData.bases.length; j++) {
			// 	this.drawText(textG, this.dLength * j, 0, inputStateData.bases[j].var2value[inputStateData.vars[i]])
			// }

			// 绘制text |0>
			for (let j = 0; j < inputStateData.bases.length; j++) {
				inputVar2ValueArr.push(inputStateData.bases[j].var2value[inputStateData.vars[i]])
			}

			// 得到重复的开始/结束位置:{10:[[0,1],[4,8]]}
			const repeatObj = this.getRepeat(inputVar2ValueArr)
			const catchObj = {}
			for (let k = 0; k < inputVar2ValueArr.length; k++) {
				if (repeatObj[inputVar2ValueArr[k]]) {
					if (!catchObj[inputVar2ValueArr[k]]) {
						this.drawRepeatText(
							textG,
							this.dLength * k,
							0,
							repeatObj[inputVar2ValueArr[k]],
							inputVar2ValueArr[k],
							false
						)
					}
					catchObj[inputVar2ValueArr[k]] = 1
				} else {
					this.drawText(textG, this.dLength * k, 0, inputVar2ValueArr[k])
				}
			}
		}

		const inputG = svg
			.append('g')
			.classed('input_g', true)
			.attr('transform', `translate(${this.dLength + 15},${inputGTransformY})`)
		const inputRelatedG = svg
			.append('g')
			.classed('input_related_g', true)
			.attr('transform', `translate(${this.dLength + 15},14)`)
		const drawRelaedNumG = svg
			.append('g')
			.classed('input_related_num', true)
			.attr('transform', `translate(${this.dLength + 15},0)`)
		for (let j = 0; j < inputStateData.bases.length; j++) {
			this.drawDinput(
				inputG,
				this.dLength * j,
				0,
				inputStateData.bases[j].ratio,
				inputStateData.bases[j].phases,
				'rgb(80, 128, 132)',
				!!inputStateData.bases[j].ratio,
				inputStateData.bases[j],
				chartDiv,
				chartSvgDiv
			)
			// 绘制浅色块
			if (inputStateData.bases[j].related_bases.length) {
				for (let k = 0; k < inputStateData.bases[j].related_bases.length; k++) {
					if (k === 0) {
						// 只绘一个 然后显示几个
						this.drawDinput(
							inputRelatedG,
							this.dLength * j,
							0,
							inputStateData.bases[j].related_bases[k].ratio,
							inputStateData.bases[j].related_bases[k].phases,
							this.dLightRectColor,
							true,
							inputStateData.bases[j].related_bases[k],
							chartDiv,
							chartSvgDiv
						)
					}
				}
				if (inputStateData.bases[j].related_bases.length > 1) {
					this.drawRelaedNum(
						drawRelaedNumG,
						this.dLength * j,
						0,
						inputStateData.bases[j].related_bases,
						7,
						chartDiv,
						chartSvgDiv,
						14
					)
				}
			}
		}
	}
	drawDChart(drawData) {
		// 判断绘制类型
		let labels = []
		if (drawData) {
			labels = drawData.labels.filter((item) => item.text !== '')
		} else {
			labels = this.qc.labels.filter((item) => item.text !== '')
		}
		for (let i = 0; i < labels.length; i++) {
			if (this.qc.canShow(labels[i].id)) {
				if (this.qc.isSparse(labels[i].id)) {
					this.drawSankey(labels[i])
				} else {
					this.drawMatrix(labels[i])
				}
			}
		}
	}
	// 计算重复的key 和出现的起始位置结束位置
	getRepeat(arr) {
		let dic = {}
		for (let k in arr) {
			k = Number(k)
			if (arr[k] == arr[k - 1] || arr[k] == arr[k + 1]) {
				if (!dic[arr[k]]) {
					dic[arr[k]] = [[k, k]]
					continue
				}
				let s = dic[arr[k]].slice(-1)[0]
				if (k - s[1] == 1) {
					s[1] = k
				} else {
					dic[arr[k]].push([k, k])
				}
			}
		}
		return dic
	}
}
