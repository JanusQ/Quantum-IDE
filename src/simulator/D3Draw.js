import { data } from 'browserslist'
import * as d3 from 'd3'
import { group } from 'd3'
import { event as currentEvent } from 'd3-selection'
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
	}
	exportD3SVG(data) {
		const svg = d3.select('#circuit_svg')
		const drawG = svg.select('#circuit_graph')
		const brushG = svg.select('#circuit_brush')
		const labelG = svg.select('#circuit_label')
		// 移除已经添加过的
		drawG.selectAll('*').remove()
		labelG.selectAll('*').remove()

		const { operations, qubit_number } = data
		// 列数
		const row = operations.length
		const col = qubit_number
		// 设置SVG宽高 高度整体下移了一行
		svg.attr('width', (row + this.scaleNum) * this.svgItemWidth)
		svg.attr('height', (col + 2) * this.svgItemHeight + 40)

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
						data.labels[i].text
					)
				}
			}
		}
		/**
		 * 预留了前边是firstX，画线和添加name
		 */
		for (let i = 0; i < col; i++) {
			this.drawLine(drawG, this.firstX, this.svgItemHeight * (i + 2), (row + 2) * this.svgItemWidth, this.svgItemHeight * (i + 2))
			this.drawName(drawG, this.svgItemWidth * 2 + 5, this.svgItemHeight * (i + 2), 'Q' + data.getQubit2Variable(i).index)
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
		this.brushedFn(svg, brushG)
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
	drawLabel(svg, x, y, width, height, labelText) {
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`)
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
		parentG
			.append('text')
			.attr('x', width / 2)
			.attr('y', height + 15)
			.attr('text-anchor', 'middle')
			.text(labelText)
			.classed('svgtext', true)
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
			let i = 0
			self.drawStackedBar(data.get_varstate(e.target.attributes.operationIndex.value), i, data)
			self.drawCdownStackedBar(data.get_wholestate(e.target.attributes.operationIndex.value), data)
		})
	}

	// // // 刷取选中
	brushedFn(svg, brushG) {
		// Example: https://observablehq.com/@d3/double-click-brush-clear

		let brushed_start = (event) => {
			const { selection, type } = event
			// console.log(event)
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
					// console.log(x,  elm)
					return x <= x1 && x > x0
				})
				console.log(operation_notations.data())
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
	// 绘制C视图上半
	drawStackedBar(data, i, qc) {
		const chart_svg = d3.select('#chart_svg')
		chart_svg.selectAll('*').remove()
		const keyArr = Object.keys(data)
		let allWidth = 0
		const widthArr = []
		for (const key in data) {
			const dataArr = []
			for (let i = 0; i < data[key].magn.length; i++) {
				const prob = data[key].prob[i] > data[key].magn[i] ? data[key].prob[i] - data[key].magn[i] : 0
				dataArr.push({ name: key, magn: data[key].magn[i], prob: prob, index: i, realProb: data[key].prob[i] })
			}
			const width = 30 * dataArr.length + 120
			widthArr.push(width)
			const g = chart_svg.append('g').attr('transform', `translate(${i ? widthArr[i - 1] : 0},0)`)
			this.StackedBarChart(dataArr, g, width, key, qc)
			allWidth += width
			chart_svg.attr('width', allWidth)
			i += 1
		}
	}
	StackedBarChart(data, g, width, name, qc) {
		const chart = new Chart()
		const config = {
			barPadding: 0.15,
			margins: { top: 20, left: 80, bottom: 100, right: 40 },
			tickShowGrid: [60, 120, 180],
			textColor: 'black',
			gridColor: 'gray',
			hoverColor: 'gray',
			animateDuration: 1000,
		}
		chart.width(width)
		chart.box(d3.select('.c_up_draw'))
		chart.svg(g)
		chart.margins(config.margins)
		chart.scaleX = d3
			.scaleBand()
			.domain(data.map((d) => d.index))
			.range([0, chart.getBodyWidth()])
			.padding(config.barPadding)

		chart.scaleY = d3
			.scaleLinear()
			.domain([0, d3.max(data.map((d) => d.magn + d.prob))])
			.range([chart.getBodyHeight(), 0])
		// 处理x轴样式
		function customXAxis(g) {
			const xAxis = d3.axisBottom(chart.scaleX)
			g.call(xAxis)
			g.select('.domain').remove()
			g.selectAll('.tick line').remove()
			g.selectAll('.tick text').classed('svgtext', true)
			g.selectAll('.tick')
				.append('g')
				.attr('transform', 'translate(-8,8)')
				.append('line')
				.attr('x1', 0.25)
				.attr('y2', 9)
				.attr('stroke-width', 0.5)
				.attr('stroke', 'black')
				.classed('svgtext', true)
			g.selectAll('.tick')
				.append('g')
				.attr('transform', 'translate(8,7)')
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
		// 绘制bar
		chart.stack = d3.stack().keys(['magn', 'prob'])
		chart.renderBars = function () {
			let groups = chart.body().selectAll('.g').data(chart.stack(data))
			let bars = groups
				.enter()
				.append('g')
				.merge(groups)
				.attr('class', (d) => 'g' + d.index)
				.attr('fill', (d) => chart._colors[d.index])
				.selectAll('.bar')
				.data((d) => {
					return d.map((item) => {
						item.index = d.index
						item.name = d.key
						return item
					})
				})
			groups.exit().remove()
			bars.enter()
				.append('rect')
				.attr('class', 'bar')
				.merge(bars)
				.attr('x', (d) => chart.scaleX(d.data.index))
				.attr('y', (d) => chart.scaleY(d[0]))
				.attr('width', chart.scaleX.bandwidth())
				.attr('height', 0)
				.transition()
				.duration(config.animateDuration)
				.attr('height', (d) => chart.scaleY(d[0]) - chart.scaleY(d[1]))
				.attr('y', (d) => chart.scaleY(d[1]))

			bars.exit().remove()
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
			g.selectAll('.bar')
				.on('mouseover', function (e, d) {
					const position = d3.pointer(e)
					const text = g
						.append('text')
						.classed('tip', true)
						.attr('x', position[0] + 100)
						.attr('y', position[1])
						.attr('fill', chart.textColor)
					text.append('tspan').text('magn:' + d.data['magn'])
					text.append('tspan')
						.attr('x', position[0] + 100)
						.attr('dy', '1em')
						.text('prob:' + d.data['realProb'])
				})
				.on('mouseleave', function (e, d) {
					g.select('.tip').remove()
				})
				.on('mousemove', function (e) {
					const position = d3.pointer(e)
					g.select('.tip')
						.attr('x', position[0] + 100)
						.attr('y', position[1] + 20)
					g.selectAll('.tip tspan').attr('x', position[0] + 100)
				})
				.on('click', function (e, d) {
					d3.selectAll('.bar').attr('stroke', config.hoverColor).attr('stroke-width', 0)
					d3.select(this).attr('stroke', config.hoverColor).attr('stroke-width', 1)
					console.log(qc.get_wholestate(d.data.index))
				})
		}
		// 总体绘制
		chart.render = function () {
			chart.renderAxis()
			chart.renderText()
			chart.renderBars()
			chart.addMouseOn()
		}

		chart.renderChart()
	}
	// 绘制C视图下半
	drawCdownStackedBar(data, qc) {
		const chart_down_svg = d3.select('#chart_down_svg')
		chart_down_svg.selectAll('*').remove()
		const keyArr = Object.keys(data)
		const dataArr = []
		for (let i = 0; i < data.magns.length; i++) {
			dataArr.push({ magns: data.magns[i], phases: 1, index: i })
		}
		const g = chart_down_svg.append('g')
		this.cDownStackedBarChart(dataArr, g)
	}
	cDownStackedBarChart(data, g) {
		const chart = new Chart()
		const config = {
			barPadding: 0.15,
			margins: { top: 20, left: 80, bottom: 100, right: 40 },
			tickShowGrid: [60, 120, 180],
			textColor: 'black',
			gridColor: 'gray',
			hoverColor: 'gray',
			animateDuration: 1000,
		}
		chart.width(500)
		chart.box(d3.select('.c_down_draw'))
		chart.svg(g)
		chart.margins(config.margins)
		chart.scaleX = d3
			.scaleBand()
			.domain(data.map((d) => d.index))
			.range([0, chart.getBodyWidth()])
			.padding(config.barPadding)

		chart.scaleY = d3
			.scaleLinear()
			.domain([0, d3.max(data.map((d) => d.magns))])
			.range([chart.getBodyHeight(), 0])
		// 处理x轴样式
		function customXAxis(g) {
			const xAxis = d3.axisBottom(chart.scaleX)
			g.call(xAxis)
			// g.select('.domain').remove()
			g.selectAll('.tick line').remove()
			g.selectAll('.tick text').remove()
		}
		// 处理Y轴样式
		function customYAxis(g) {
			const yAxis = d3.axisLeft(chart.scaleY).tickValues([2])
			g.call(yAxis)
			// g.select('.domain').remove()
			// g.selectAll('.tick line').remove()
			// g.selectAll('.tick text').remove()
		}
		// 绘制bar
		chart.stack = d3.stack().keys(['magns', 'phases'])
		chart.renderBars = function () {
			let groups = chart.body().selectAll('.g').data(chart.stack(data))
			let bars = groups
				.enter()
				.append('g')
				.merge(groups)
				.attr('class', (d) => 'g' + d.index)
				.attr('fill', (d) => chart._colors[d.index])
				.selectAll('.bar')
				.data((d) => {
					return d.map((item) => {
						item.index = d.index
						item.name = d.key
						return item
					})
				})
			groups.exit().remove()
			bars.enter()
				.append('rect')
				.attr('class', 'bar')
				.merge(bars)
				.attr('x', (d) => chart.scaleX(d.data.index))
				.attr('y', (d) => chart.scaleY(d[0]))
				.attr('width', chart.scaleX.bandwidth())
				.attr('height', 0)
				.transition()
				.duration(config.animateDuration)
				.attr('height', (d) => chart.scaleY(d[0]) - chart.scaleY(d[1]))
				.attr('y', (d) => chart.scaleY(d[1]))

			bars.exit().remove()
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
		// 绑定事件
		chart.addMouseOn = function () {
			g.selectAll('.bar')
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
					g.select('.tip').remove()
				})
				.on('mousemove', function (e) {
					const position = d3.pointer(e)
					g.select('.tip')
						.attr('x', position[0] + 100)
						.attr('y', position[1] + 20)
					g.selectAll('.tip tspan').attr('x', position[0] + 100)
				})
		}
		// 总体绘制
		chart.render = function () {
			chart.renderAxis()
			chart.renderBars()
			chart.addMouseOn()
		}

		chart.renderChart()
	}
}
