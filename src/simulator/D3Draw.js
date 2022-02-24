import { data } from 'browserslist'
import * as d3 from 'd3'
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
		this.firstX = 120
		this.svgItemWidth = 40
		this.svgItemHeight = 30
		// 鼠标放上的小label宽
		this.svgItemLabelWidth = 30
		// 计算比例
		this.scaleNum = this.firstX / this.svgItemWidth
		// label位置的偏移 x - 图形的宽
		this.labelTranslate = this.firstX - 20
	}
	exportD3SVG(data) {
		console.log(data)
		const d3DrawingDiv = d3.select('#d3_drawing')
		// 移除已经添加过的
		if (d3DrawingDiv.select('svg')._groups[0]) {
			d3DrawingDiv.select('svg').remove()
		}

		const svg = d3DrawingDiv.append('svg').attr('width', '100%').attr('height', '100%')
		const drawG = svg.append('g')
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
						drawG,
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
			this.drawName(drawG, this.svgItemWidth * 2 + 10, this.svgItemHeight * (i + 2), 'Q' + data.getQubit2Variable(i).index)
		}
		// 加入Qint
		for (const key in data.name2index) {
			for (let i = 0; i < data.name2index[key].length; i++) {
				const lineNum = data.name2index[key][data.name2index[key].length - 1] - data.name2index[key][0]
				this.drawQint(drawG, this.svgItemWidth * 2, this.svgItemHeight * (data.name2index[key][0] + 2), this.svgItemHeight * lineNum - 10, key)
			}
		}

		// 处理操作
		this.handleOperations(drawG, operations, data)
		// 框选
		this.brushedFn(svg, drawG)
	}

	drawWrite1(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none')
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(3, 3)
		context.lineTo(20, 10)
		context.lineTo(3, 17)
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', this.write1Background)
		childG.append('rect').attr('x', 2).attr('y', 7).attr('width', 2).attr('height', 6).attr('fill', this.write1FontColor)
	}
	drawWrite0(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none')
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(3, 3)
		context.lineTo(20, 10)
		context.lineTo(3, 17)
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', this.write0Background)
		childG.append('circle').attr('cx', 4).attr('cy', 10).attr('r', 3).attr('stroke-width', 1).attr('stroke', this.write0FontColor).attr('fill', 'none')
	}
	drawH(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').attr('stroke', '#000').attr('stroke-width', 1)
		const childG = parentG.append('g')
		childG.append('text').attr('x', 10).attr('y', 15).attr('style', `font-size:16px;font-weight:bold;cursor:default;color:red`).append('tspan').text('H').attr('text-anchor', 'middle')
	}
	drawRead(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', 1)
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(3, 14)
		context.quadraticCurveTo(10, 4, 17, 14)
		context.moveTo(10, 16)
		context.lineTo(16, 8)
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none')
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
	}
	// 需要计算直线和target位置再加个实心圆
	drawCcnot(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff')
		const childG = parentG.append('g')
		childG.append('circle').attr('cx', 10).attr('cy', 10).attr('r', 10).attr('fill', '#fff').attr('stroke', '#000').attr('stroke-width', 1)
		const context = d3.path()
		context.moveTo(10, 1)
		context.lineTo(10, 19)
		context.moveTo(1, 10)
		context.lineTo(19, 10)
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none')
	}
	// 叉号 x
	drawSwap(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none')
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(2, 2)
		context.lineTo(18, 18)
		context.moveTo(18, 2)
		context.lineTo(2, 18)
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none')
	}
	drawCCPhase(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff')
		const childG = parentG.append('g')
		childG.append('circle').attr('cx', 10).attr('cy', 10).attr('r', 10).attr('fill', '#fff').attr('stroke', '#000').attr('stroke-width', 1)
		childG.append('circle').attr('cx', 10).attr('cy', 10).attr('r', 4).attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', 1)
		const context = d3.path()
		context.moveTo(12, 2)
		context.lineTo(9, 18)
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none')
	}
	//  绘制需要的实心圆，实线
	drawCircle(svg, x, y) {
		svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 4).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', '#000')
	}
	// x,y 起始位置 targetX/Y 结束位置
	drawLine(svg, x, y, targetX, targetY) {
		const context = d3.path()
		context.moveTo(x, y)
		context.lineTo(targetX, targetY)
		svg.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none')
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
	}
	// 绘制括号Qint
	drawQint(svg, x, y, height, name) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		const context = d3.path()
		context.moveTo(10, 0)
		context.quadraticCurveTo(0, 0, 0, 10)
		context.lineTo(0, height - 10)
		context.quadraticCurveTo(0, height, 10, height)
		parentG.append('path').attr('d', context.toString()).attr('stroke', 'rgb(100, 159, 174)').attr('stroke-width', 1).attr('fill', 'none')
		parentG
			.append('text')
			.attr('width', 20)
			.attr('x', -10)
			.attr('y', height / 2)
			.attr('text-anchor', 'end')
			.text(name)
	}
	// 绘制self defined gate
	drawSelfDefinedGate(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff').attr('stroke-width', 1).attr('stroke', '#000').attr('rx', 4)
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
		svg.on('mouseover', function () {
			d3.select(this).select('.item_label_path').attr('stroke', 'rgb(100, 159, 174)')
			d3.select(this).select('.item_label_rect').attr('fill', '#f2f2f2')
		})
		svg.on('mouseout', function () {
			d3.select(this).select('.item_label_path').attr('stroke', 'transparent')
			d3.select(this).select('.item_label_rect').attr('fill', 'transparent')
		})
	}
	// // 刷取选中
	brushedFn(svg, drawG) {
		const brush = d3.brush().on('brush end', brushed)
		svg.append('g').call(brush)
		function brushed({ selection }) {
			console.log(selection)
			drawG.each((d) => {
				console.log(d)
			})
		}
	}
	// 处理操作
	handleOperations(svg, operations, data) {
		for (let i = 0; i < operations.length; i++) {
			switch (operations[i].operation) {
				// write操作
				case 'write':
					const writeG = svg.append('g').attr('style', 'cursor:pointer;')
					// 处理数组
					for (let j = operations[i].value.length - 1; j >= 0; j--) {
						if (operations[i].value[j]) {
							this.drawWrite1(writeG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (operations[i].qubits[j] + 2))
						} else {
							this.drawWrite0(writeG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (operations[i].qubits[j] + 2))
						}
					}
					const qubitMin = Math.min(...operations[i].qubits)
					const qubitMax = Math.max(...operations[i].qubits)
					this.drawMouseHover(
						writeG,
						this.svgItemWidth * (i + this.scaleNum) - this.svgItemHeight / 2,
						this.svgItemHeight * (qubitMin + 2) - this.svgItemHeight / 2,
						this.svgItemHeight * (qubitMax - qubitMin + 1)
					)
					break
				// had操作
				case 'h':
					const hG = svg.append('g').attr('style', 'cursor:pointer;')
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawH(hG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (operations[i].qubits[j] + 2))
					}
					const qubitHMin = Math.min(...operations[i].qubits)
					const qubitHMax = Math.max(...operations[i].qubits)
					this.drawMouseHover(
						hG,
						this.svgItemWidth * (i + this.scaleNum) - this.svgItemHeight / 2,
						this.svgItemHeight * (qubitHMin + 2) - this.svgItemHeight / 2,
						this.svgItemHeight * (qubitHMax - qubitHMin + 1)
					)
					break
				case 'swap':
					for (let j = 0; j < operations[i].qubits1.length; j++) {
						const swapG = svg.append('g').attr('style', 'cursor:pointer;')
						this.drawSwap(swapG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (operations[i].qubits1[j] + 2))
						this.drawSwap(swapG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (operations[i].qubits2[j] + 2))
						this.drawLine(
							swapG,
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (operations[i].qubits1[j] + 2),
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (operations[i].qubits2[j] + 2)
						)
						const swapMinQ = Math.min(operations[i].qubits1[j], operations[i].qubits2[j])
						const swapMaxQ = Math.max(operations[i].qubits1[j], operations[i].qubits2[j])
						this.drawMouseHover(
							swapG,
							this.svgItemWidth * (i + this.scaleNum) - this.svgItemHeight / 2,
							this.svgItemHeight * (swapMinQ + 2) - this.svgItemHeight / 2,
							this.svgItemHeight * ((swapMaxQ - swapMinQ) + 1)
						)
					}
					break
				case 'ccnot':
					const ccnotG = svg.append('g').attr('style', 'cursor:pointer;')
					// 判断最大值最小值 向两个极端画线
					const controlsMin = Math.min(...operations[i].controls)
					const controlsMax = Math.max(...operations[i].controls)

					if (controlsMax < operations[i].target[0]) {
						this.drawLine(
							ccnotG,
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (operations[i].target[0] + 2),
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (controlsMin + 2)
						)
					}
					if (controlsMin > operations[i].target[0]) {
						this.drawLine(
							ccnotG,
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (operations[i].target[0] + 2),
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (controlsMax + 2)
						)
					}
					if (controlsMin < operations[i].target[0] && operations[i].target[0] < controlsMax) {
						this.drawLine(
							ccnotG,
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (operations[i].target[0] + 2),
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (controlsMax + 2)
						)
						this.drawLine(
							ccnotG,
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (operations[i].target[0] + 2),
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (controlsMin + 2)
						)
					}

					for (let j = 0; j < operations[i].controls.length; j++) {
						this.drawCircle(ccnotG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (operations[i].controls[j] + 2))
					}

					this.drawCcnot(ccnotG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (operations[i].target[0] + 2))
					const ccnotMinLabelQ = Math.min(...operations[i].controls, ...operations[i].target)
					const ccnotMaxLabelQ = Math.max(...operations[i].controls, ...operations[i].target)
					this.drawMouseHover(
						ccnotG,
						this.svgItemWidth * (i + this.scaleNum) - this.svgItemHeight / 2,
						this.svgItemHeight * (ccnotMinLabelQ + 2) - this.svgItemHeight / 2,
						this.svgItemHeight * (ccnotMaxLabelQ - ccnotMinLabelQ + 1)
					)
					break
				case 'ccphase':
					const ccphaseG = svg.append('g').attr('style', 'cursor:pointer;')
					this.drawLine(
						ccphaseG,
						this.svgItemWidth * (i + this.scaleNum),
						this.svgItemHeight * (operations[i].qubits[0] + 2),
						this.svgItemWidth * (i + this.scaleNum),
						this.svgItemHeight * (operations[i].qubits[operations[i].qubits.length - 1] + 2)
					)
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawCCPhase(ccphaseG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (operations[i].qubits[j] + 2))
					}
					const ccphaseMinQ = Math.min(...operations[i].qubits)
					const ccphaseMaxQ = Math.max(...operations[i].qubits)
					const itemLableRow = ccphaseMaxQ - ccphaseMinQ + 1
					this.drawMouseHover(
						ccphaseG,
						this.svgItemWidth * (i + this.scaleNum) - this.svgItemHeight / 2,
						this.svgItemHeight * (ccphaseMinQ + 2) - this.svgItemHeight / 2,
						itemLableRow * this.svgItemHeight
					)
					break
				case 'phase':
					const phaseG = svg.append('g').attr('style', 'cursor:pointer;')
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawCCPhase(phaseG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (operations[i].qubits[j] + 2))
						phaseG
							.append('text')
							.attr('x', this.svgItemWidth * (i + this.scaleNum) - 6)
							.attr('y', this.svgItemHeight * (operations[i].qubits[j] + 2) - 15)
							.attr('style', 'font-size:12px;')
							.append('tspan')
							.text(operations[i].rotation + '°')
					}
					const phaseMinQ = Math.min(...operations[i].qubits)
					const phaseMaxQ = Math.max(...operations[i].qubits)
					this.drawMouseHover(
						phaseG,
						this.svgItemWidth * (i + this.scaleNum) - this.svgItemHeight / 2,
						this.svgItemHeight * (phaseMinQ + 2) - this.svgItemHeight / 2 - 12,
						this.svgItemHeight * (phaseMaxQ - phaseMinQ + 1) + 15
					)
					break
				case 'read':
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawRead(svg, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (operations[i].qubits[j] + 2))
					}

					break
				case 'noop':
					break
				default:
					const defaultG = svg.append('g').attr('style', 'cursor:pointer;')
					const qubits = data.getQubitsInvolved(operations[i])
					const defaultMinQ = Math.min(...qubits)
					const defaultMaxQ = Math.max(...qubits)
					if (qubits.length) {
						this.drawLine(
							defaultG,
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (qubits[0] + 2),
							this.svgItemWidth * (i + this.scaleNum),
							this.svgItemHeight * (qubits[qubits.length - 1] + 2)
						)

						this.drawSelfDefinedGate(defaultG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (defaultMinQ + 2))
						this.drawSelfDefinedGate(defaultG, this.svgItemWidth * (i + this.scaleNum), this.svgItemHeight * (defaultMaxQ + 2))
						this.drawMouseHover(
							defaultG,
							this.svgItemWidth * (i + this.scaleNum) - this.svgItemHeight / 2,
							this.svgItemHeight * (defaultMinQ + 2) - this.svgItemHeight / 2,
							this.svgItemHeight * (defaultMaxQ - defaultMinQ + 1)
						)
					}

					break
			}
		}
	}
}
