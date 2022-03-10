import { data } from 'browserslist'
import * as d3 from 'd3'
import { color, group } from 'd3'
import { event as currentEvent } from 'd3-selection'
import { number } from 'mathjs'
import { ConsoleErrorListener, toDocs } from '../resource/js/quantum-circuit.min'
import Chart from './Chart'
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
		// 设置空白和间距
		this.firstX = 90
		this.svgItemWidth = 30
		this.svgItemHeight = 30
		// 鼠标放上的小label宽
		this.svgItemLabelWidth = 30
		// 计算比例
		this.scaleNum = this.firstX / this.svgItemWidth
		// label位置的偏移 x - 图形的宽
		this.labelTranslate = this.firstX - this.svgItemWidth / 2
		// 存get_wholestate
		this.get_wholestate = []
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
	}
	exportD3SVG(data) {
		const svg = d3.select('#circuit_svg')
		const drawG = svg.select('#circuit_graph')
		const brushG = svg.select('#circuit_brush')
		const labelG = svg.select('#circuit_label')
		// 移除已经添加过的
		drawG.selectAll('*').remove()
		labelG.selectAll('*').remove()

		this.qc = data
		const { operations, qubit_number } = data
		// 列数
		const row = operations.length
		const col = qubit_number
		// 设置SVG宽高 高度整体下移了一行
		svg.attr('width', (row + this.scaleNum) * this.svgItemWidth)
		svg.attr('height', (col + 4) * this.svgItemHeight + 40)

		// 加Label,先加载label label在最底层
		for (let i = 0; i < data.labels.length; i++) {
			if (data.labels[i].text && data.labels[i].end_operation !== undefined) {
				const obj = data.getLabelUpDown(data.labels[i].id)
				if (obj.down_qubit !== Infinity && obj.up_qubit !== Infinity) {
					const lineCol = data.labels[i].end_operation - data.labels[i].start_operation
					const labelRow = obj.down_qubit - obj.up_qubit
					this.drawLabel(
						labelG,
						this.svgItemWidth * data.labels[i].start_operation + this.labelTranslate,
						this.svgItemHeight * (obj.up_qubit + 1),
						this.svgItemWidth * lineCol,
						this.svgItemHeight * (labelRow + 1),
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
			this.drawLine(drawG, this.firstX, this.svgItemHeight * (i + 2), (row + 3) * this.svgItemWidth, this.svgItemHeight * (i + 2))
			this.drawName(drawG, this.svgItemWidth * 2 + 5, this.svgItemHeight * (i + 2), 'Q' + i)
		}
		// 绘制选择线
		for (let i = 0; i < row; i++) {
			this.drawCselectLine(drawG, this.svgItemWidth * (i + 3) + 14, this.svgItemHeight * 2 - 6, this.svgItemHeight * col - 15, i, data)
		}
		// 加入Qint, 右边的继承关系
		for (const key in data.name2index) {
			for (let i = 0; i < data.name2index[key].length; i++) {
				const lineNum = data.name2index[key][data.name2index[key].length - 1] - data.name2index[key][0]
				this.drawQint(drawG, this.svgItemWidth * 2, this.svgItemHeight * (data.name2index[key][0] + 2), this.svgItemHeight * lineNum - 10, key)
			}
		}

		// 处理操作
		this.drawOperations(drawG, operations, data)

		// 框选
		this.brushedFn(svg, brushG, labelG, data)
		// 绘制d模块
		this.drawDChart(data)
		// 加入折线图
		this.drawLineChart(svg, data, row)
	}
	// 清空缓存的值
	clear() {
		this.get_wholestate = []
		this.filter = {}
		this.labels = []
		this.charts = []
		d3.selectAll('#chart_svg *').remove()
		this.qc = null
		this.varstatesIndex = 0
	}
	// c视图restore
	restore() {
		this.filter = {}
		const drawData = { magns: [], phases: [], probs: [] }
		this.get_wholestate.forEach((item) => {
			drawData.magns.push(item.magns)
			drawData.phases.push(item.phases)
			drawData.probs.push(item.probs)
		})
		this.drawCdownStackedBar(drawData)
		this.charts = []
		this.drawCFn(this.varstatesIndex, this.qc)
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
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', this.write1Background).classed('operation_item', true)
		childG.append('rect').attr('x', 2).attr('y', 7).attr('width', 2).attr('height', 6).attr('fill', this.write1FontColor).classed('operation_item', true)
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
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', this.write0Background).classed('operation_item', true)
		childG.append('circle').attr('cx', 4).attr('cy', 10).attr('r', 3).attr('stroke-width', 1).attr('stroke', this.write0FontColor).attr('fill', 'none').classed('operation_item', true)
		return parentG
	}
	drawH(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').attr('stroke', '#000').attr('stroke-width', 1).classed('operation_item', true)
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
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', 1).classed('operation_item', true)
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(3, 14)
		context.quadraticCurveTo(10, 4, 17, 14)
		context.moveTo(10, 16)
		context.lineTo(16, 8)
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none').classed('operation_item', true)
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
		childG.append('circle').attr('cx', 10).attr('cy', 10).attr('r', 10).attr('fill', '#fff').attr('stroke', '#000').attr('stroke-width', 1).classed('operation_item', true)
		const context = d3.path()
		context.moveTo(10, 1)
		context.lineTo(10, 19)
		context.moveTo(1, 10)
		context.lineTo(19, 10)
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none').classed('operation_item', true)
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
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none').classed('operation_item', true)
		return parentG
	}
	drawCCPhase(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').classed('operation_item', true)
		const childG = parentG.append('g')
		childG.append('circle').attr('cx', 10).attr('cy', 10).attr('r', 10).attr('fill', '#fff').attr('stroke', '#000').attr('stroke-width', 1).classed('operation_item', true)
		childG.append('circle').attr('cx', 10).attr('cy', 10).attr('r', 4).attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', 1).classed('operation_item', true)
		const context = d3.path()
		context.moveTo(12, 2)
		context.lineTo(9, 18)
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none').classed('operation_item', true)
		return parentG
	}
	//  绘制需要的实心圆，实线
	drawCircle(svg, x, y) {
		svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 4).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', '#000').classed('operation_item', true)
	}
	// x,y 起始位置 targetX/Y 结束位置
	drawLine(svg, x, y, targetX, targetY) {
		const context = d3.path()
		context.moveTo(x, y)
		context.lineTo(targetX, targetY)
		svg.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none').classed('operation_item', true)
	}
	// 绘制label
	drawLabel(svg, x, y, width, height, labelText, labelId, isBrushed) {
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed(`label_${labelId}`, true)
		parentG.append('rect').attr('width', width).attr('height', height).attr('fill', '#f2f2f2').attr('rx', 10).attr('opacity', '0.5')
		const context = d3.path()
		context.moveTo(0, 10)
		context.quadraticCurveTo(0, 0, 10, 0)
		context.lineTo(width - 10, 0)
		context.quadraticCurveTo(width, 0, width, 10)
		context.moveTo(0, height - 10)
		context.quadraticCurveTo(0, height, 10, height)
		context.lineTo(width - 10, height)
		context.quadraticCurveTo(width, height, width, height - 10)
		parentG.append('path').attr('d', context.toString()).attr('stroke', 'rgb(100, 159, 174)').attr('stroke-width', 1).attr('fill', 'none')
		if (isBrushed) {
			const textG = parentG.append('g').attr('transform', `translate(${width / 2},${height + 7}) scale(0.6)`)
			textG.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 10).attr('fill', 'none').attr('stroke', 'rgb(100,159,174)').attr('stroke-width', 0.5)
			textG.append('text').attr('x', 0).attr('y', 5).attr('text-anchor', 'middle').text(labelText).classed('svgtext', true).attr('fill', 'rgb(100,159,174)')
		} else {
			parentG
				.append('text')
				.attr('x', width / 2)
				.attr('y', height + 15)
				.attr('text-anchor', 'middle')
				.text(labelText)
				.classed('svgtext', true)
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
		parentG.append('path').attr('d', context.toString()).attr('stroke', 'rgb(100, 159, 174)').attr('stroke-width', 1).attr('fill', 'none').classed('operation_item', true)
		parentG
			.append('text')
			.attr('width', 20)
			.attr('x', -10)
			.attr('y', height / 2)
			.attr('text-anchor', 'end')
			.text(name)
			.classed('svgtext', true)
	}
	// 绘制self defined gate
	drawSelfDefinedGate(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').attr('stroke-width', 1).attr('stroke', '#000').attr('rx', 4).classed('operation_item', true)
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
		svg.append('path').attr('d', context.toString()).attr('stroke-width', 1).attr('class', 'item_label_path').attr('fill', 'transparent')
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
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).attr('style', 'cursor:pointer;')
		parentG.append('rect').attr('width', 2).attr('height', height).attr('fill', 'transparent').classed('select_rect', true).attr('operationIndex', index)
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
		childG.append('path').attr('d', context.toString()).attr('stroke', 'transparent').attr('stroke-width', 1).attr('fill', 'transparent').classed('select_path', true)
		const self = this
		parentG.on('click', function (e) {
			d3.selectAll('.select_path').attr('stroke', 'transparent').attr('fill', 'transparent')
			d3.selectAll('.select_rect').attr('stroke', 'transparent').attr('fill', 'transparent')
			d3.select(this).select('.select_path').attr('stroke', 'rgb(149, 143, 143)').attr('fill', 'rgb(149, 143, 143)')
			d3.select(this).select('.select_rect').attr('fill', 'rgb(149, 143, 143)')
			self.drawCFn(e.target.attributes.operationIndex.value, data)
		})
	}

	// 刷取选中
	brushedFn(svg, brushG, labelG, qc) {
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
					// console.log(x,  elm)

					return x <= x1 && x > x0
				})
				if (operation_notations.data().length) {
					// 绘制label
					const qubitsArr = []
					const indexArr = []
					for (let i = 0; i < operation_notations.data().length; i++) {
						// 可以按操作类型分 现在按字段名
						if (operation_notations.data()[i].controls) {
							qubitsArr.push(...operation_notations.data()[i].controls)
							qubitsArr.push(...operation_notations.data()[i].target)
						} else if (operation_notations.data()[i].qubits1) {
							qubitsArr.push(...operation_notations.data()[i].qubits1)
							qubitsArr.push(...operation_notations.data()[i].qubits2)
						} else {
							qubitsArr.push(...operation_notations.data()[i].qubits)
						}

						indexArr.push(operation_notations.data()[i].index)
					}

					const down_qubit = Math.max(...qubitsArr) //  down_qubit
					const up_qubit = Math.min(...qubitsArr) // up_qubit
					const start_operation = Math.min(...indexArr) // start_operation
					const end_operation = Math.max(...indexArr) // end_operation
					const lineCol = end_operation - start_operation + 1
					const labelRow = down_qubit - up_qubit

					const labelObj = qc.createlabel(start_operation, end_operation)
					// console.log(qc)
					this.drawLabel(
						labelG,
						this.svgItemWidth * start_operation + this.labelTranslate,
						this.svgItemHeight * 2 - this.svgItemHeight / 2,
						this.svgItemWidth * lineCol,
						this.svgItemHeight * qc.qubit_number,
						labelObj.id,
						labelObj.id,
						true
					)
					self.drawDChart(qc, { labels: [labelObj] })
				}

				brushG.call(brush_event.clear) // 如果当前有选择才需要清空
			}
		}

		brush_event.on('end', brushed_end)

		brushG.attr('class', 'brush').call(brush_event)
	}

	// 处理操作
	drawOperations(svg, operations, data) {
		for (let i = 0; i < operations.length; i++) {
			let operation = operations[i]
			const x = this.svgItemWidth * (i + this.scaleNum)
			operation.x = x
			switch (operations[i].operation) {
				// write操作
				case 'write':
					// 处理数组
					for (let j = operations[i].value.length - 1; j >= 0; j--) {
						const writeG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
						writeG.datum(operation) //绑定数据到dom节点
						if (operations[i].value[j]) {
							this.drawWrite1(writeG, x, this.svgItemHeight * (operations[i].qubits[j] + 2))
						} else {
							this.drawWrite0(writeG, x, this.svgItemHeight * (operations[i].qubits[j] + 2))
						}
					}
					break
				// had操作
				case 'h':
					for (let j = 0; j < operations[i].qubits.length; j++) {
						const hG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
						hG.datum(operation) //绑定数据到dom节点
						this.drawH(hG, x, this.svgItemHeight * (operations[i].qubits[j] + 2))
					}
					break
				case 'swap':
					for (let j = 0; j < operations[i].qubits1.length; j++) {
						const swapG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
						swapG.datum(operation) //绑定数据到dom节点
						this.drawSwap(swapG, x, this.svgItemHeight * (operations[i].qubits1[j] + 2))
						this.drawSwap(swapG, x, this.svgItemHeight * (operations[i].qubits2[j] + 2))
						this.drawLine(swapG, x, this.svgItemHeight * (operations[i].qubits1[j] + 2), x, this.svgItemHeight * (operations[i].qubits2[j] + 2))
					}
					break
				case 'ccnot':
					const ccnotG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
					ccnotG.datum(operation) //绑定数据到dom节点
					// 判断最大值最小值 向两个极端画线
					const controlsMin = Math.min(...operations[i].controls)
					const controlsMax = Math.max(...operations[i].controls)

					if (controlsMax < operations[i].target[0]) {
						this.drawLine(ccnotG, x, this.svgItemHeight * (operations[i].target[0] + 2), x, this.svgItemHeight * (controlsMin + 2))
					}
					if (controlsMin > operations[i].target[0]) {
						this.drawLine(ccnotG, x, this.svgItemHeight * (operations[i].target[0] + 2), x, this.svgItemHeight * (controlsMax + 2))
					}
					if (controlsMin < operations[i].target[0] && operations[i].target[0] < controlsMax) {
						this.drawLine(ccnotG, x, this.svgItemHeight * (operations[i].target[0] + 2), x, this.svgItemHeight * (controlsMax + 2))
						this.drawLine(ccnotG, x, this.svgItemHeight * (operations[i].target[0] + 2), x, this.svgItemHeight * (controlsMin + 2))
					}

					for (let j = 0; j < operations[i].controls.length; j++) {
						this.drawCircle(ccnotG, x, this.svgItemHeight * (operations[i].controls[j] + 2))
					}

					this.drawCcnot(ccnotG, x, this.svgItemHeight * (operations[i].target[0] + 2))
					break
				case 'ccphase':
					const ccphaseG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
					ccphaseG.datum(operation) //绑定数据到dom节点
					this.drawLine(ccphaseG, x, this.svgItemHeight * (operations[i].qubits[0] + 2), x, this.svgItemHeight * (operations[i].qubits[operations[i].qubits.length - 1] + 2))
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawCCPhase(ccphaseG, x, this.svgItemHeight * (operations[i].qubits[j] + 2))
					}
					break
				case 'phase':
					const phaseG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
					phaseG.datum(operation) //绑定数据到dom节点
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawCCPhase(phaseG, x, this.svgItemHeight * (operations[i].qubits[j] + 2))
						phaseG
							.append('text')
							.attr('x', x - 6)
							.attr('y', this.svgItemHeight * (operations[i].qubits[j] + 2) - 15)
							.classed('svgtext', true)
							.append('tspan')
							.text(operations[i].rotation + '°')
					}
					// const phaseMinQ = Math.min(...operations[i].qubits)
					// const phaseMaxQ = Math.max(...operations[i].qubits)
					// this.drawMouseHover(
					// 	phaseG,
					// 	x - this.svgItemHeight / 2,
					// 	this.svgItemHeight * (phaseMinQ + 2) - this.svgItemHeight / 2 - 12,
					// 	this.svgItemHeight * (phaseMaxQ - phaseMinQ + 1) + 15
					// )
					break
				case 'read':
					// TODO: 需要要一个大G,在写绑定
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawRead(svg, x, this.svgItemHeight * (operations[i].qubits[j] + 2))
					}
					// readG.datum(operation)  //绑定数据到dom节点

					break
				case 'noop':
					break
				default:
					const defaultG = svg.append('g').classed('operation_item', true).classed('operation_g', true)
					defaultG.datum(operation) //绑定数据到dom节点
					const qubits = data.getQubitsInvolved(operations[i])
					const defaultMinQ = Math.min(...qubits)
					const defaultMaxQ = Math.max(...qubits)
					if (qubits.length) {
						this.drawLine(defaultG, x, this.svgItemHeight * (qubits[0] + 2), x, this.svgItemHeight * (qubits[qubits.length - 1] + 2))

						this.drawSelfDefinedGate(defaultG, x, this.svgItemHeight * (defaultMinQ + 2))
						this.drawSelfDefinedGate(defaultG, x, this.svgItemHeight * (defaultMaxQ + 2))
					}

					break
			}
		}
	}
	// 绘制折线图
	drawLineChart(svg, qc, row) {
		const transformY = (qc.qubit_number + 1) * this.svgItemHeight
		const lineChartG = svg.select('#lineChart_graph')
		lineChartG.selectAll('*').remove()

		const data = []
		for (let i = 0; i < qc.operations.length; i++) {
			const entropy = qc.get_entropy(qc.operations[i].index)
			data.push({
				index: qc.operations[i].index,
				entropy: entropy,
			})
		}
		const scaleX = d3
			.scaleBand()
			.domain(data.map((d) => d.index))
			.range([this.firstX + this.svgItemWidth / 2, (row + 3) * this.svgItemWidth + this.svgItemWidth / 2])
		const scaleY = d3
			.scaleLinear()
			.domain([d3.min(data, (d) => d.entropy), d3.max(data, (d) => d.entropy)])
			.range([transformY + this.svgItemHeight * 4, transformY + this.svgItemHeight * 3])
		// 渲染线条
		const X = d3.map(data, (d) => d.index)
		const Y = d3.map(data, (d) => d.entropy)
		const I = d3.range(X.length)
		lineChartG
			.append('rect')
			.attr('width', (row + 3) * this.svgItemWidth - this.firstX)
			.attr('height', this.svgItemHeight)
			.attr('fill', 'rgba(185, 215, 195,0.1)')
			.attr('x', this.firstX)
			.attr('y', transformY + this.svgItemHeight * 3)
		lineChartG
			.append('path')
			.attr(
				'd',
				'M702.3 364c-41.2 0-79.4 18.8-113.1 41.9-26.3 18.1-52.3 40.6-77.2 63.1-24.9-22.6-50.9-45.1-77.2-63.1-33.7-23.2-71.9-41.9-113.1-41.9-81 0-148 67.1-148 148s67.1 148 148 148c41.2 0 79.4-18.8 113.1-41.9 26.3-18.1 52.3-40.6 77.2-63.1 24.9 22.6 50.9 45.1 77.2 63.1 33.7 23.2 71.9 41.9 113.1 41.9 81 0 148-67.1 148-148s-67-148-148-148zM398.9 565.8c-29.7 20.4-55 30.8-77.2 30.8-45.9 0-84.6-38.7-84.6-84.6s38.7-84.6 84.6-84.6c22.2 0 47.4 10.3 77.2 30.8 21.5 14.8 43.3 33.4 66 53.8-22.7 20.4-44.5 39-66 53.8z m303.4 30.8c-22.2 0-47.4-10.3-77.2-30.8-21.5-14.8-43.3-33.4-66-53.8 22.7-20.4 44.5-39 66-53.8 29.7-20.4 55-30.8 77.2-30.8 45.9 0 84.6 38.7 84.6 84.6s-38.7 84.6-84.6 84.6z'
			)
			.attr('fill', 'rgb(84, 84, 84)')
			.attr('transform', `translate(${this.firstX - this.svgItemWidth - 5},${transformY + this.svgItemHeight * 3}) scale(0.03)`)
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
		lineChartG.append('path').attr('fill', 'none').attr('stroke', 'rgb(4, 136, 192)').attr('stroke-width', 1).attr('d', line(I))
	}
	// 绘制C的连线
	drawCLine(svg, lineData, lineXArr) {
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
		const initY = 210
		const heightSetp = 5
		for (let i = 0; i < lineData.length; i++) {
			const lineG = svg.append('g').classed('threshold_line', true)
			const context = d3.path()
			context.moveTo(getX(lineData[i], 0), initY)
			context.lineTo(getX(lineData[i], 0), initY + heightSetp * (i + 1))
			context.lineTo(getX(lineData[i], 1), initY + heightSetp * (i + 1))
			context.lineTo(getX(lineData[i], 1), initY)
			lineG.append('path').attr('d', context.toString()).attr('stroke', '#A79C9C').attr('stroke-width', 1).attr('fill', 'none')
		}
	}
	// 绘制C视图上半
	drawCFn(index, qc) {
		let j = 0
		const barData = qc.get_varstate(index, undefined)
		this.varstatesIndex = index
		this.drawStackedBar(barData, j, qc, index)
		this.drawCdownStackedBar(qc.get_wholestate(index), qc)
	}
	drawStackedBar(data, j, qc, index) {
		const config = {
			barPadding: 0.1,
			margins: { top: 20, left: 80, bottom: 100, right: 40 },
			tickShowGrid: [60, 120, 180],
			textColor: 'black',
			gridColor: 'gray',
			hoverColor: 'gray',
		}

		const barWidth = 20
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
					x: barWidth * i + barWidth / 2 + config.margins.left,
				})
				lineXArr[key].push(barWidth * i + barWidth / 2 + config.margins.left + (j ? widthArr[j - 1] : 0))
			}

			const width = barWidth * dataArr.length + config.margins.left + config.margins.right
			widthArr.push(width + (j ? widthArr[j - 1] : 0))
			const g = chart_svg.append('g').attr('transform', `translate(${j ? widthArr[j - 1] : 0},0)`)
			this.StackedBarChart(dataArr, g, width, key, qc, config, barWidth, index, key)
			allWidth += width
			chart_svg.attr('width', allWidth + 50)
			j += 1
		}
		const lineData = qc.get_pmi_index(index, 0.25)
		this.drawCLine(chart_svg, lineData, lineXArr)
	}

	StackedBarChart(data, g, width, name, qc, config, barWidth, index, key) {
		const brush_g = g.append('g').classed('brush_g', true)
		const chart = new Chart()
		const self = this
		chart.width(width)
		chart.key(key)
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
			.range([chart.getBodyHeight(), 0])
		// 处理x轴样式
		function customXAxis(g) {
			const xAxis = d3.axisBottom(chart.scaleX)
			g.call(xAxis)
			g.select('.domain').remove()
			g.selectAll('.tick line').remove()
			g.selectAll('.tick text').classed('svgtext', true).attr('transform', 'rotate(45)').attr('x', 8).attr('y', 8)
			g.selectAll('.tick')
				.append('g')
				.attr('transform', 'translate(-6,8) rotate(45)')
				.append('line')
				.attr('x1', 0.25)
				.attr('y2', 9)
				.attr('stroke-width', 0.5)
				.attr('stroke', 'black')
				.classed('svgtext', true)
			g.selectAll('.tick')
				.append('g')
				.attr('transform', 'translate(6,12) rotate(45)')
				.append('path')
				.attr('d', 'M0.845337 1L2.63087 5.40266L0.845337 9.71606')
				.attr('stroke', 'black')
				.attr('stroke-width', 0.5)
				.attr('stroke-linecap', 'round')
				.classed('svgtext', true)
			g.append('rect').attr('width', chart.getBodyWidth()).attr('height', 5).attr('fill', 'rgb(220, 216, 216)').classed('x_rect', true).classed('svgtext', true).attr('rx', 5).attr('ry', 5)
		}
		// 处理Y轴样式
		function customYAxis(g) {
			const yAxis = d3.axisLeft(chart.scaleY)
			g.call(yAxis)
			g.select('.domain').remove()
			g.selectAll('.tick line').remove()
			g.selectAll('.tick text').remove()
		}

		chart.renderX = function () {
			chart
				.svg()
				.insert('g', '.body')
				.attr('transform', 'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight()) + ')')
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
		// 绘制坐标轴
		chart.renderAxis = function () {
			chart.renderX()
			chart.renderY()
		}
		// 绘制名称
		chart.renderText = function () {
			g.select('.xAxis').append('text').attr('class', 'axisText').attr('x', chart.getBodyWidth()).attr('y', 0).attr('fill', config.textColor).attr('dy', 30)
			g.select('.yAxis')
				.append('text')
				.attr('class', 'axisText')
				.attr('x', -10)
				.attr('y', chart.getBodyHeight())
				.attr('fill', config.textColor)
				.attr('text-anchor', 'end')
				.attr('style', 'font-size:18px')
				.text(`${name}`)
				.classed('svgtext', true)
		}
		// 绑定事件
		chart.addMouseOn = function () {
			g.selectAll('.magn_bar')
				.on('mouseover', function (e, d) {
					const position = d3.pointer(e)
					const tipG = g
						.append('g')
						.classed('tip', true)
						.attr('transform', `translate(${position[0] + 85},${position[1] - 5})`)
					tipG.append('rect').attr('stroke', 'gray').attr('stroke-width', 1).attr('height', 26).attr('width', 110).attr('fill', '#fff').attr('rx', 2)
					const text = tipG.append('text').attr('fill', chart.textColor).classed('svgtext', true).attr('x', 4).attr('y', 16)
					text.append('tspan').text('Maganitue:' + d.magn.toFixed(2))
				})
				.on('mouseleave', function (e, d) {
					g.select('.tip').remove()
				})
				.on('mousemove', function (e) {
					const position = d3.pointer(e)
					g.select('.tip').attr('transform', `translate(${position[0] + 85},${position[1] - 5})`)
				})
			// .on('click', function (e, d) {
			// 	d3.selectAll('.magn_bar').attr('stroke', config.hoverColor).attr('stroke-width', 0)
			// 	d3.selectAll('.prob_bar').attr('stroke', config.hoverColor).attr('stroke-width', 0)
			// 	d3.select(this).attr('stroke', config.hoverColor).attr('stroke-width', 1)
			// })
			g.selectAll('.prob_bar')
				.on('mouseover', function (e, d) {
					const position = d3.pointer(e)
					const tipG = g
						.append('g')
						.classed('tip', true)
						.attr('transform', `translate(${position[0] + 85},${position[1] - 5})`)
					tipG.append('rect').attr('stroke', 'gray').attr('stroke-width', 1).attr('height', 26).attr('width', 110).attr('fill', '#fff').attr('rx', 2)
					const text = tipG.append('text').attr('fill', chart.textColor).classed('svgtext', true).attr('x', 4).attr('y', 16)
					// TODO: prob name
					text.append('tspan').text('probability:' + d.prob.toFixed(2))
				})
				.on('mouseleave', function (e, d) {
					g.select('.tip').remove()
				})
				.on('mousemove', function (e) {
					const position = d3.pointer(e)
					g.select('.tip').attr('transform', `translate(${position[0] + 85},${position[1] - 5})`)
				})
			// .on('click', function (e, d) {
			// 	d3.selectAll('.magn_bar').attr('stroke', config.hoverColor).attr('stroke-width', 0)
			// 	d3.selectAll('.prob_bar').attr('stroke', config.hoverColor).attr('stroke-width', 0)
			// 	d3.select(this).attr('stroke', config.hoverColor).attr('stroke-width', 1)
			// })
		}
		self.chartBrushFn(g, barWidth, config, index, qc, key, chart)
		self.charts.push(chart)
		// 总体绘制
		chart.render = function () {
			chart.renderAxis()
			chart.renderText()
			self.renderBar(chart, data)
			chart.addMouseOn()
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
			.attr('width', chart.scaleX.bandwidth())
			.attr('height', (d) => chart.getBodyHeight() - chart.scaleY(d.magn))
			.attr('fill', chart._colors[1])

		magnBars.exit().remove()

		// 绘制Prob bar

		let probBars = chart.body().selectAll('.prob_bar').data(data)

		probBars
			.enter()
			.append('rect')
			.attr('class', 'prob_bar')
			.merge(probBars)
			.attr('x', (d) => chart.scaleX(d.index))
			.attr('y', (d) => chart.scaleY(d.prob))
			.attr('width', chart.scaleX.bandwidth())
			.attr('height', (d) => chart.getBodyHeight() - chart.scaleY(d.prob))
			.attr('fill', chart._colors[0])

		probBars.exit().remove()
		// 绘制最高的值
		const maxNumber = d3.max([...data.map((d) => d.magn), ...data.map((d) => d.prob)])
		let textIndex = 0
		let bar_texts = chart.body().selectAll('.bar_text').data([maxNumber])
		for (let i = 0; i < data.length; i++) {
			if (data[i].magn === maxNumber || data[i].prob === maxNumber) {
				textIndex = data[i].index
				break
			}
		}
		bar_texts
			.enter()
			.append('text')
			.attr('class', 'bar_text')
			.merge(bar_texts)
			.attr('x', chart.scaleX(textIndex))
			.attr('y', chart.scaleY(maxNumber) - 2)
			.attr('text-anchor', 'start')
			.text((d) => d.toFixed(1))
			.classed('svgtext', true)

		bar_texts.exit().remove()
	}
	// c视图框选
	chartBrushFn(svg, barWidth, config, index, qc, key, chart) {
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
						.attr('width', bars.data()[bars.data().length - 1].x - bars.data()[0].x + barWidth - barWidth * config.barPadding)
						.attr('x', bars.data()[0].x - config.margins.left - barWidth / 2 + barWidth * config.barPadding)
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

					const allKeys = Object.keys(qc.name2index)
					const filterKeys = Object.keys(self.filter)
					// if (allKeys.length === filterKeys.length) {
					const filterResult = qc.get_index(index, JSON.parse(JSON.stringify(self.filter)))
					const filterData = self.get_wholestate.filter((item) => {
						return filterResult.includes(item.index)
					})
					const drawData = { magns: [], phases: [], probs: [] }
					filterData.forEach((item) => {
						drawData.magns.push(item.magns)
						drawData.phases.push(item.phases)
						drawData.probs.push(item.probs)
					})
					self.drawCdownStackedBar(drawData)
					// 更新C视图上半
					const barData = qc.get_varstate(index, JSON.parse(JSON.stringify(self.filter)))

					for (const key in barData) {
						const dataArr = []
						for (let i = 0; i < barData[key].magn.length; i++) {
							// 80 是作图是的margins 的 left 这个x设置的是柱中间的距离 选中超过一半算选中
							dataArr.push({
								name: key,
								magn: barData[key].magn[i],
								prob: barData[key].prob[i],
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
	}
	// 绘制C视图下半
	drawCdownStackedBar(data) {
		const chart_down_svg = d3.select('#chart_down_svg')
		chart_down_svg.selectAll('*').remove()
		const keyArr = Object.keys(data)
		const dataArr = []
		// const barWidth = 20
		for (let i = 0; i < data.magns.length; i++) {
			dataArr.push({ magns: data.magns[i], phases: data.phases[i], probs: data.probs[i], index: i })
		}
		if (!this.get_wholestate.length) {
			this.get_wholestate = dataArr
		}
		// const width = barWidth * data.magns.length
		this.cDownStackedBarChart(dataArr, chart_down_svg)
	}
	cDownStackedBarChart(data, g) {
		const chart = new Chart()
		const config = {
			barPadding: 0.1,
			margins: { top: 20, left: 40, bottom: 0, right: 10 },
			tickShowGrid: [60, 120, 180],
			textColor: 'black',
			gridColor: 'gray',
			hoverColor: 'gray',
			animateDuration: 1000,
		}
		chart.box(d3.select('.c_down_draw'))
		chart.width(546)
		chart.svg(g)
		chart.margins(config.margins)
		chart.scaleX = d3
			.scaleBand()
			.domain(data.map((d) => d.index))
			.range([0, chart.getBodyWidth()])
			.padding(config.barPadding)
		// magnsY 轴
		chart.scaleY = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.magns)])
			.range([chart.getBodyHeight() / 2, 0])
		// phases Y轴
		chart.scaleY2 = d3
			.scaleLinear()
			.domain([0, 360])
			.range([0, chart.getBodyHeight() / 2])
		// 处理x轴样式
		function customXAxis(g) {
			const xAxis = d3.axisBottom(chart.scaleX)
			g.call(xAxis)
			// g.select('.domain').remove()
			g.selectAll('.tick line').remove()
			g.selectAll('.tick text').remove()
			const context = d3.path()
			// 自定义X轴线
			context.moveTo(chart.scaleX(0), 0)
			context.lineTo(chart.scaleX(data.length - 1), 0)
			g.select('.domain').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1)
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
			g.selectAll('.tick')
			g.select('.magnYAxis .tick:nth-of-type(1)').attr('transform', `translate(-4,${chart.getBodyHeight() / 2 - 5})`)
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
				.attr('y', (d) => chart.scaleY(d.magns) - 1)
				.attr('width', chart.scaleX.bandwidth())
				.attr('height', (d) => chart.getBodyHeight() / 2 - chart.scaleY(d.magns))
				.attr('fill', chart._colors[0])

			bars.exit().remove()
		}
		chart.renderProbsBars = function () {
			let bars = chart.body().selectAll('.probs_bar').data(data)
			bars.enter()
				.append('rect')
				.attr('class', 'probs_bar')
				.merge(bars)
				.attr('x', (d) => chart.scaleX(d.index))
				.attr('y', (d) => chart.scaleY(d.probs) - 1)
				.attr('width', chart.scaleX.bandwidth())
				.attr('height', (d) => chart.getBodyHeight() / 2 - chart.scaleY(d.probs))
				.attr('fill', chart._colors[0])
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
				.attr('transform', 'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight() / 2) + ')')
				.attr('class', 'xAxis')
				.classed('svgtext', true)
				.call(customXAxis)
		}

		chart.renderMagnsY = function () {
			chart
				.svg()
				.insert('g', '.body')
				.attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
				.attr('class', 'magnYAxis')
				.classed('svgtext', true)
				.call(customYAxis)
		}
		chart.renderPhasesY = function () {
			chart
				.svg()
				.insert('g', '.body')
				.attr('transform', 'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight() / 2) + ')')
				.attr('class', 'phaseYAxis')
				.classed('svgtext', true)
				.call(customYAxis2)
		}
		// 绘制坐标轴
		chart.renderAxis = function () {
			chart.renderMagnsY()
			chart.renderPhasesY()
			chart.renderX()
		}
		// 绑定事件
		chart.addMouseOn = function () {
			chart
				.svg()
				.selectAll('.bar')
				.on('mouseover', function (e, d) {
					const position = d3.pointer(e)
					const text = g
						.append('text')
						.classed('tip', true)
						.attr('x', position[0] + 100)
						.attr('y', position[1])
						.attr('fill', chart.textColor)
					text.append('tspan').text('magns:' + d.data['magns'])
					text.append('tspan')
						.attr('x', position[0] + 100)
						.attr('dy', '1em')
						.text('phases:' + d.data['phases'])
				})
				.on('mouseleave', function (e, d) {
					chart.svg().select('.tip').remove()
				})
				.on('mousemove', function (e) {
					const position = d3.pointer(e)
					chart
						.svg()
						.select('.tip')
						.attr('x', position[0] + 100)
						.attr('y', position[1] + 20)
					chart
						.svg()
						.selectAll('.tip tspan')
						.attr('x', position[0] + 100)
				})
		}
		// 缩放
		chart.addZoom = function () {
			const extent = [
				[0, config.margins.top],
				[chart.getBodyWidth() - 10, chart.getBodyHeight()],
			]
			chart.svg().call(d3.zoom().scaleExtent([1, 8]).translateExtent(extent).extent(extent).on('zoom', zoomed))
			function zoomed(event) {
				chart.scaleX.range([0, chart.getBodyWidth()].map((d) => event.transform.applyX(d)))
				chart
					.svg()
					.selectAll('.magns_bar')
					.attr('x', (d) => chart.scaleX(d.index))
					.attr('width', chart.scaleX.bandwidth())
				chart
					.svg()
					.selectAll('.probs_bar')
					.attr('x', (d) => chart.scaleX(d.index))
					.attr('width', chart.scaleX.bandwidth())
				chart
					.svg()
					.selectAll('.phases_bar')
					.attr('x', (d) => chart.scaleX(d.index))
					.attr('width', chart.scaleX.bandwidth())
				chart.svg().selectAll('.xAxis').call(chart.renderX)
			}
		}
		// 总体绘制
		chart.render = function () {
			chart.renderProbsBars()
			chart.renderMagnsBars()
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
		} else {
			phaseY = length * (Math.abs(deg - 180) / 180)
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
	drawDInput(svg, x, y, inWidth, deg, color, isNeedShowData, data, chartDiv, chartSvgDiv) {
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		parentG.append('rect').attr('width', this.dLength).attr('height', this.dLength).attr('fill', 'none')
		const childG = parentG.append('g').attr('transform', `translate(3,3)`)
		childG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'transparent').attr('stroke', '#000').attr('stroke-width', 1)
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
			const allKeys = [...Object.keys(data), ...Object.keys(data.var2value)].filter((item) => item !== 'var2value' && item !== 'range')
			childG.on('mouseover', function (e) {
				// console.log(scrollLeft)
				const scrollLeft = chartSvgDiv._groups[0][0].scrollLeft
				const scrollTop = chartSvgDiv._groups[0][0].scrollTop
				chartDiv.selectAll('.show_data_div').remove()
				const showDataDiv = chartDiv
					.append('div')
					.attr('class', 'show_data_div')
					.attr('style', `height:${32 * allKeys.length}px;top:${e.offsetY - scrollTop + 36}px;left:${e.offsetX - scrollLeft + 10}px;border:1px solid black`)
				const showDataSVG = showDataDiv.append('svg').classed('relaed_svg', true).attr('width', '100%').attr('height', '100%')

				self.drawShowData(showDataSVG, data)
			})
			childG.on('mouseleave', function (e) {
				chartDiv.selectAll('.show_data_div').remove()
			})
		}
		return parentG
	}
	// 绘制浅色块显示的条形
	drawShowData(svg, data) {
		const keys = Object.keys(data.var2value)
		const allKeys = Object.keys(data).filter((item) => item !== 'range' && item !== 'var2value')
		const arr = []

		svg.append('line')
			.attr('x1', 111)
			.attr('x2', 111)
			.attr('y1', 6)
			// 32 * key.length - 6 * keys.length
			.attr('y2', 26 * keys.length)
			.attr('stroke-width', 2)
			.attr('stroke', '#000')
			.attr('stroke-dasharray', '5,5')

		for (let i = 0; i < keys.length; i++) {
			const parentG = svg.append('g').attr('transform', `translate(0, ${26 * i})`)
			parentG.append('rect').attr('width', 120).attr('height', 32).attr('fill', 'none')
			const childG = parentG.append('g')
			const text = childG.append('text').text(`${keys[i]}`).attr('style', 'font-size:12px;').classed('svgtext', true).attr('x', 0).attr('y', 19)
			childG
				.append('rect')
				.attr('width', 90 * (data.var2value[keys[i]] / data.range[keys[i]]))
				.attr('height', 20)
				.attr('x', 20)
				.attr('y', 6)
				.attr('fill', 'rgb(137, 214, 220)')

			childG
				.append('text')
				.text(`${data.var2value[keys[i]]}`)
				.attr('style', 'font-size:12px;')
				.classed('svgtext', true)
				.attr('x', 22 + 90 * (data.var2value[keys[i]] / data.range[keys[i]]))
				.attr('y', 19)
		}
		for (let i = 0; i < allKeys.length; i++) {
			const parentG = svg.append('g').attr('transform', `translate(0, ${26 * i + 26 * keys.length})`)
			parentG.append('rect').attr('width', 120).attr('height', 32).attr('fill', 'none')
			const childG = parentG.append('g')
			const text = childG
				.append('text')
				.text(`${allKeys[i]}:${data[allKeys[i]].toFixed(1)}`)
				.attr('style', 'font-size:12px;')
				.classed('svgtext', true)
				.attr('x', 0)
				.attr('y', 19)
		}
	}
	// 绘制D circle
	drawDCircle(svg, x, y, color, arcR, arcDeg, isNeedBorder) {
		//   R 10
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		const borderRect = parentG.append('rect').attr('width', this.dLength).attr('height', this.dLength).attr('fill', 'none')
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
					.attr('fill', 'none')
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
				.attr('fill', 'none')
				.classed('d_item', true)
		}
		if (arcDeg) {
			arcR = (arcR * this.dLength) / 2 - 2
			const data = { startAngle: 0, endAngle: (Math.PI * arcDeg) / 180 }
			const acrPath = d3.arc().innerRadius(0).outerRadius(arcR)
			childG.append('path').attr('d', acrPath(data)).attr('fill', color).attr('transform', 'translate(13,13)')
		} else if (!arcDeg && arcR) {
			arcR = (arcR * this.dLength) / 2 - 2
			const context = d3.path()
			context.moveTo(circleR, circleR)
			context.lineTo(circleR, circleR - arcR)
			childG.append('path').attr('d', context.toString()).attr('stroke', color).attr('stroke-width', 1)
		}

		return parentG
	}
	// 绘制text
	drawText(svg, x, y, index) {
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		parentG.append('rect').attr('width', this.dLength).attr('height', this.dLength).attr('fill', 'none')
		const ketLieftG = parentG.append('g').append('line').attr('x1', 0.25).attr('y2', 9).attr('stroke-width', 0.5).attr('stroke', 'black').attr('svgtext', true)

		const textG = parentG.append('g').append('text').text(index).attr('style', 'font-size:12px;').attr('fill', 'gray').classed('svgtext', true)

		const kitRightG = parentG
			.append('g')
			.append('path')
			.attr('d', 'M0.845337 1L2.63087 5.40266L0.845337 9.71606')
			.attr('stroke', 'black')
			.attr('stroke-width', 0.5)
			.attr('stroke-linecap', 'round')
			.attr('fill', 'none')
			.classed('svgtext', true)

		if (index > 9) {
			// textG.attr('')
			ketLieftG.attr('transform', 'translate(4,9)')
			textG.attr('transform', 'translate(7,18)')
			kitRightG.attr('transform', 'translate(21,8)')
		} else {
			ketLieftG.attr('transform', 'translate(6,9)')
			textG.attr('transform', 'translate(9,18)')
			kitRightG.attr('transform', 'translate(17,8)')
		}

		return parentG
	}
	// 绘制浅色块text
	drawRelaedNum(svg, x, y, data, textX, chartDiv, chartSvgDiv) {
		data = data.slice(1, data.length - 1)
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		parentG.append('rect').attr('width', this.dLength).attr('height', 14).attr('fill', 'none')
		const self = this
		const childG = parentG.append('g')
		childG
			.append('text')
			.text(`${data.length}+`)
			.attr('style', 'font-size:12px;')
			.classed('svgtext', true)
			.attr('transform', `translate(${textX}, ${13}) scale(0.6)`)
			.on('mouseover', function (e) {
				const scrollLeft = chartSvgDiv._groups[0][0].scrollLeft
				const scrollTop = chartSvgDiv._groups[0][0].scrollTop
				chartDiv.selectAll('.relaed_div').remove()
				const relaedDiv = chartDiv
					.append('div')
					.attr('class', 'relaed_div')
					.attr(
						'style',
						`top:${e.offsetY - scrollTop + 36}px;left:${e.offsetX - scrollLeft + 10}px;height:${self.dLength * data.length + 10}px;width:${self.dLength + 8}px;border:1px solid black`
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
				const relaedSVG = relaedDiv.append('svg').classed('relaed_svg', true).attr('width', '100%').attr('height', 'calc(100% - 8px)')
				for (let i = 0; i < data.length; i++) {
					self.drawDInput(relaedSVG, 3, self.dLength * i, data[i].ratio, data[i].phases, 'rgb(137, 214, 220)', true, data[i], chartDiv, e.offsetY + 36, e.offsetX + 10)
				}
			})
	}

	// 绘制基本结构
	drawElement(labelName, labelId, qc) {
		const self = this
		let isShowMore = false
		let isFull = false
		//删除
		const getParentNode = (obj) => {
			if (!obj.classList.contains('d_chart_div')) {
				getParentNode(obj.parentNode)
			} else {
				qc.labels.splice(
					qc.labels.findIndex((item) => item.id === labelId),
					1
				)
				qc.label_count--
				d3.select(`#circuit_svg #circuit_label .label_${labelId}`).remove()
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
		const expandFn = (chartDiv, operationDiv) => {
			// const expand_div = d3.select('.App').append('div').classed('expand_div', true)
			if (isFull) {
				chartDiv.attr('class', null).classed('d_chart_div', true)
				operationDiv.attr('style', 'display:none')
				isShowMore = false
				isFull = !isFull
			} else {
				chartDiv.classed('d_chart_div_full', true)
				operationDiv.attr('style', 'display:none')
				isShowMore = false
				isFull = !isFull
			}
		}

		const drawDiv = d3.select('#d_draw_div')
		// drawDiv.selectAll('*').remove()
		const chartDiv = drawDiv.append('div').classed('d_chart_div', true)
		const titleDiv = chartDiv.append('div').classed('d_chart_title', true)
		titleDiv.append('span').classed('label_name', true).text(`${labelName}`)
		const btnDiv = titleDiv.append('div').classed('btn_group', true)
		const chartSvgDiv = chartDiv.append('div').classed('chart_svg_div', true)
		const svg = chartSvgDiv.append('svg').classed('d_chart_svg', true)
		const operationDiv = btnDiv.append('div').classed('operation_div', true).attr('style', 'display:none;')
		btnDiv.append('img').attr('src', '/img/legends/yellowCircle.png').attr('width', 15).attr('height', 15)
		btnDiv.append('span').text('0.25').attr('style', 'font-size:12px;margin-left:5px;')
		btnDiv.append('img').attr('src', '/img/legends/chart.png').attr('width', 15).attr('height', 15)
		btnDiv.append('span').text('0.25').attr('style', 'font-size:12px;margin-left:5px;')
		btnDiv
			.append('img')
			.attr('src', '/icon/more_icon.svg')
			.attr('width', 15)
			.attr('height', 15)
			.on('click', function (e) {
				showMoreOperation(operationDiv)
			})

		operationDiv
			.append('img')
			.attr('src', '/icon/save_icon.svg')
			.on('click', function () {
				self.saveFn(chartSvgDiv.html())
				// console.log()
			})
		operationDiv
			.append('img')
			.attr('src', '/icon/expand_icon.svg')
			.on('click', function () {
				expandFn(chartDiv, operationDiv)
			})
		operationDiv.append('img').attr('src', '/icon/delete_icon.svg').on('click', close)
		return {
			svg,
			chartDiv,
			chartSvgDiv,
		}
	}
	// 保存
	saveFn(elm) {
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
		titleDiv.append('span').classed('label_name', true).text(`123`)
		const saveSvg = drawDiv.append('div').classed('save_svg', true)
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
	drawSankey(qc, data) {
		const { svg, chartDiv, chartSvgDiv } = this.drawElement(data.text, data.id, qc)
		const sankeyData = qc.transferSankey(data.id)
		const inputStateData = qc.get_input_state(data.id)
		const outStateData = qc.get_output_state(data.id)

		const inputBases = inputStateData.bases
		const outBases = outStateData.bases
		// 计算圆圈g X轴向右移动的距离
		const circleGtransformX = (inputStateData.vars.length + 4) * this.dLength + 14
		// 计算输入input X轴移动
		const inputGTransformX = (inputStateData.vars.length + 1) * this.dLength + 14
		// 计算out_input X轴移动
		const outGTransformX = (inputStateData.vars.length + 7) * this.dLength + 14
		// 计算out_input 浅色块X轴移动
		const outRelatedGX = outGTransformX + (outStateData.vars.length + 1) * this.dLength
		// 设置svg的宽高
		const svgHeight = (inputStateData.bases.length + 1) * this.dLength
		const svgWidth = outRelatedGX + this.dLength * 2 + 100
		svg.attr('height', svgHeight).attr('width', svgWidth)
		// 绘制圈
		const circleG = svg.append('g').classed('circle_g', true).attr('transform', `translate(${circleGtransformX},${this.dLength})`)
		for (let i = 0; i < sankeyData.length; i++) {
			const color = sankeyData[i].used ? 'rgb(246, 175, 31)' : 'rgba(142, 132, 112,0.5)'
			const arcR = sankeyData[i].ratio
			this.drawDCircle(circleG, 0, this.dLength * i, color, arcR, sankeyData[i].phase, false)
		}
		// 绘制input_state
		for (let i = 0; i < inputStateData.vars.length; i++) {
			const textG = svg
				.append('g')
				.classed('text_g', true)
				.attr('transform', `translate(${this.dLength * (i + 1) + 14},${this.dLength})`)
			for (let j = 0; j < inputBases.length; j++) {
				this.drawText(textG, 0, this.dLength * j, inputBases[j].var2value[inputStateData.vars[i]])
			}
		}
		const inputG = svg.append('g').classed('put_g', true).attr('transform', `translate(${inputGTransformX},${this.dLength})`)
		const inputRelatedG = svg.append('g').classed('input_related_g', true).attr('transform', `translate(14,${this.dLength})`)
		const drawInputRelaedNumG = svg.append('g').classed('input_related_num', true).attr('transform', `translate(0,${this.dLength})`)
		for (let j = 0; j < inputBases.length; j++) {
			this.drawDInput(inputG, 0, this.dLength * j, inputBases[j].ratio, inputBases[j].phases, 'rgb(80, 128, 132)')
			const number = 0
			for (let k = 0; k < inputBases[j].related_bases.length; k++) {
				if (k === 0) {
					// 只绘一个 然后显示几个
					this.drawDInput(
						inputRelatedG,
						0,
						this.dLength * j,
						inputBases[j].related_bases[k].ratio,
						inputBases[j].related_bases[k].phases,
						'rgb(137, 214, 220)',
						true,
						inputBases[j].related_bases[k],
						chartDiv,
						chartSvgDiv
					)
				}
			}
			if (inputBases[j].related_bases.length > 1) {
				this.drawRelaedNum(drawInputRelaedNumG, 0, this.dLength * j, inputBases[j].related_bases, 0, chartDiv, chartSvgDiv)
			}
		}
		// 绘制out_state
		for (let i = 0; i < outStateData.vars.length; i++) {
			const textG = svg
				.append('g')
				.classed('text_g', true)
				.attr('transform', `translate(${outGTransformX + this.dLength * (i + 1)},${this.dLength})`)
			// 需要改为正确数据
			for (let j = 0; j < outBases.length; j++) {
				this.drawText(textG, 0, this.dLength * j, outBases[j].var2value[outStateData.vars[i]])
			}
		}
		const outG = svg.append('g').classed('put_g', true).attr('transform', `translate(${outGTransformX},${this.dLength})`)
		const outRelatedG = svg.append('g').classed('input_related_g', true).attr('transform', `translate(${outRelatedGX},${this.dLength})`)
		const drawOutRelaedNumG = svg
			.append('g')
			.classed('input_related_num', true)
			.attr('transform', `translate(${outRelatedGX + this.dLength},${this.dLength})`)
		for (let j = 0; j < outBases.length; j++) {
			this.drawDInput(outG, 0, this.dLength * j, outBases[j].ratio, outBases[j].phases, 'rgb(80, 128, 132)')
			for (let k = 0; k < outBases[j].related_bases.length; k++) {
				if (k === 0) {
					// 只绘一个 然后显示几个 开发时候是全传入了
					this.drawDInput(
						outRelatedG,
						0,
						this.dLength * j,
						outBases[j].related_bases[k].ratio,
						outBases[j].related_bases[k].phases,
						'rgb(137, 214, 220)',
						true,
						outBases[j].related_bases[k],
						chartDiv,
						chartSvgDiv
					)
				}
			}
			if (outBases[j].related_bases.length > 1) {
				this.drawRelaedNum(drawOutRelaedNumG, 0, this.dLength * j, outBases[j].related_bases, 0, chartDiv, chartSvgDiv)
			}
		}
		// 绘制连线
		for (let i = 0; i < sankeyData.length; i++) {
			const color = sankeyData[i].used ? 'rgb(246, 175, 31)' : 'rgba(142, 132, 112,0.5)'
			// 绘制to
			// this.drawLine(
			// 	svg,
			// 	circleGtransformX + this.dLength,
			// 	this.dLength * (i + 1) + this.dLength / 2,
			// 	outGTransformX,
			// 	this.dLength * (sankeyData[i].to_id + 1) + this.dLength / 2
			// )
			const toD = this.silkRibbonPathString(
				circleGtransformX + this.dLength,
				this.dLength * (i + 1) + this.dLength / 2,
				outGTransformX,
				this.dLength * (sankeyData[i].to_id + 1) + this.dLength / 2,
				0.5
			)
			svg.append('path').attr('d', toD).attr('fill', 'none').attr('stroke-width', 2).attr('stroke', color)
			// this.drawLine(
			// 	svg,
			// 	circleGtransformX,
			// 	this.dLength * (i + 1) + this.dLength / 2,
			// 	inputGTransformX + this.dLength,
			// 	this.dLength * (sankeyData[i].from_id + 1) + this.dLength / 2
			// )
			const fromD = this.silkRibbonPathString(
				circleGtransformX,
				this.dLength * (i + 1) + this.dLength / 2,

				inputGTransformX + this.dLength,
				this.dLength * (sankeyData[i].from_id + 1) + this.dLength / 2,

				0.5
			)
			svg.append('path').attr('d', fromD).attr('fill', 'none').attr('stroke-width', 2).attr('stroke', color)
		}
	}

	// 绘制普通完整表示
	drawMatrix(qc, data) {
		const { svg, chartDiv, chartSvgDiv } = this.drawElement(data.text, data.id, qc)
		const inputStateData = qc.get_input_state(data.id)
		const outStateData = qc.get_output_state(data.id)
		// 计算矩阵g Y轴向下移动的距离
		const circleGtransformY = (inputStateData.vars.length + 2) * this.dLength + 14
		// 计算输入input Y轴移动
		const inputGTransformY = (inputStateData.vars.length + 1) * this.dLength + 14
		// 计算out_input X轴移动
		const inputWidth = inputStateData.bases.length * this.dLength
		// 计算out_input 浅色块X轴移动
		const outRelatedGX = inputWidth + (outStateData.vars.length + 1) * this.dLength
		// 绘制矩阵
		// 设置svg的宽高
		const svgHeight = circleGtransformY + outStateData.bases.length * this.dLength
		const svgWidth = outRelatedGX + this.dLength * 2 + 14
		svg.attr('height', svgHeight).attr('width', svgWidth)
		const circleData = qc.get_evo_matrix(data.id)
		const circleG = svg.append('g').classed('circle_g', true).attr('transform', `translate(0,${circleGtransformY})`)
		for (let i = 0; i < circleData.length; i++) {
			for (let j = 0; j < circleData[i].length; j++) {
				const color = circleData[i][j].used ? 'rgb(246, 175, 31)' : 'rgba(142, 132, 112,0.5)'
				const arcR = circleData[i][j].ratio
				this.drawDCircle(circleG, this.dLength * i, this.dLength * j, color, arcR, circleData[i][j].phase, true)
			}
		}
		// 绘制out_state
		for (let i = 0; i < outStateData.vars.length; i++) {
			const textG = svg
				.append('g')
				.classed('text_g', true)
				.attr('transform', `translate(${inputWidth + this.dLength * (i + 1)},${circleGtransformY})`)
			for (let j = 0; j < outStateData.bases.length; j++) {
				this.drawText(textG, 0, this.dLength * j, outStateData.bases[j].var2value[outStateData.vars[i]])
			}
		}
		const outG = svg.append('g').classed('put_g', true).attr('transform', `translate(${inputWidth},${circleGtransformY})`)
		const outRelatedG = svg.append('g').classed('input_related_g', true).attr('transform', `translate(${outRelatedGX},${circleGtransformY})`)
		const drawOutRelaedNumG = svg
			.append('g')
			.classed('input_related_num', true)
			.attr('transform', `translate(${outRelatedGX + this.dLength},${circleGtransformY})`)
		for (let j = 0; j < outStateData.bases.length; j++) {
			this.drawDInput(outG, 0, this.dLength * j, outStateData.bases[j].ratio, outStateData.bases[j].phases, 'rgb(80, 128, 132)')
			for (let k = 0; k < outStateData.bases[j].related_bases.length; k++) {
				if (k === 0) {
					// 只绘一个 然后显示几个 开发时候是全传入了
					this.drawDInput(
						outRelatedG,
						0,
						this.dLength * j,
						outStateData.bases[j].related_bases[k].ratio,
						outStateData.bases[j].related_bases[k].phases,
						'rgb(137, 214, 220)',
						true,
						outStateData.bases[j].related_bases[k],
						chartDiv,
						chartSvgDiv
					)
				}
			}
			if (outStateData.bases[j].related_bases.length > 1) {
				this.drawRelaedNum(drawOutRelaedNumG, 0, this.dLength * j, outStateData.bases[j].related_bases, 0, chartDiv, chartSvgDiv)
			}
		}
		// 绘制input_state
		for (let i = 0; i < inputStateData.vars.length; i++) {
			const textG = svg
				.append('g')
				.classed('text_g', true)
				.attr('transform', `translate(0,${this.dLength * (i + 1) + 14})`)
			// 绘制文字 |0>
			for (let j = 0; j < inputStateData.bases.length; j++) {
				this.drawText(textG, this.dLength * j, 0, inputStateData.bases[j].var2value[inputStateData.vars[i]])
			}
		}
		const inputG = svg.append('g').classed('input_g', true).attr('transform', `translate(0,${inputGTransformY})`)
		const inputRelatedG = svg.append('g').classed('input_related_g', true).attr('transform', `translate(0,14)`)
		const drawRelaedNumG = svg.append('g').classed('input_related_num', true).attr('transform', `translate(0,0)`)
		for (let j = 0; j < inputStateData.bases.length; j++) {
			this.drawDInput(inputG, this.dLength * j, 0, inputStateData.bases[j].ratio, inputStateData.bases[j].phases, 'rgb(80, 128, 132)')
			// 绘制浅色块
			if (inputStateData.bases[j].related_bases.length) {
				for (let k = 0; k < inputStateData.bases[j].related_bases.length; k++) {
					if (k === 0) {
						// 只绘一个 然后显示几个
						this.drawDInput(
							inputRelatedG,
							this.dLength * j,
							0,
							inputStateData.bases[j].related_bases[k].ratio,
							inputStateData.bases[j].related_bases[k].phases,
							'rgb(137, 214, 220)',
							true,
							inputStateData.bases[j].related_bases[k],
							chartDiv,
							chartSvgDiv
						)
					}
				}
				if (inputStateData.bases[j].related_bases.length > 1) {
					this.drawRelaedNum(drawRelaedNumG, this.dLength * j, 0, inputStateData.bases[j].related_bases, 10, chartDiv, chartSvgDiv)
				}
			}
		}
	}
	drawDChart(data) {
		const drawDiv = d3.select('#d_draw_div')
		drawDiv.selectAll('*').remove()
		// 判断绘制类型
		data.labels = data.labels.filter((item) => item.text !== '')
		for (let i = 0; i < data.labels.length; i++) {
			if (data.isSparse(data.labels[i].id)) {
				this.drawSankey(data, data.labels[i])
			} else {
				this.drawMatrix(data, data.labels[i])
			}
		}
	}
}
