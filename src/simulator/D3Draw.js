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
		// 现在设置的是每一列按50 前边空白区域100 所以之后每一项都是多算两列
		this.firstX = 100
		this.svgItemWidth = 50
		// 计算比例
		this.scaleNum = this.firstX / this.svgItemWidth
	}
	exportD3SVG(data) {
		console.log(data)
		const d3DrawingDiv = d3.select('#d3_drawing')
		// 移除已经添加过的
		if (d3DrawingDiv.select('svg')._groups[0]) {
			d3DrawingDiv.select('svg').remove()
		}
		const svg = d3DrawingDiv.append('svg').attr('width', '100%').attr('height', '100%').attr('display', 'block')
		const { operations, qubit_number } = data
		// 列数
		const row = operations.length
		const col = qubit_number
		// 设置SVG宽高 高度整体下移了一行
		svg.attr('width', (row + this.scaleNum) * this.svgItemWidth)
		svg.attr('height', (col + 2) * 30 + 40)
		// 加Label,先加载label label在最底层
		for (let i = 0; i < data.labels.length; i++) {
			const lineCol = data.labels[i].end_operation - data.labels[i].start_operation
			if (data.labels[i].text) {
				this.drawLabel(svg, this.svgItemWidth * data.labels[i].start_operation + 80, 40, this.svgItemWidth * lineCol, col * 30 + 10, data.labels[i].text)
			}
		}
		/**
		 * 预留了前边是100，画线和添加name
		 */
		for (let i = 0; i < col; i++) {
			this.drawLine(svg, this.firstX, 30 * (i + 2), (row + 2) * this.svgItemWidth, 30 * (i + 2))
			this.drawName(svg, 60, 30 * (i + 2), `Q${i}`)
		}
		// 加入Qint
		for (const key in data.name2index) {
			for (let i = 0; i < data.name2index[key].length; i++) {
				const lineNum = data.name2index[key][data.name2index[key].length - 1] - data.name2index[key][0]
				this.drawQint(svg, 50, 30 * (data.name2index[key][0] + 2), 30 * lineNum - 10, key)
			}
		}

		// 处理操作
		this.handleOperations(svg, operations)
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
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', 1)
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(3, 14)
		context.quadraticCurveTo(10, 4, 17, 14)
		context.moveTo(10, 16)
		context.lineTo(16, 8)
		childG.append('path').attr('d', context.toString()).attr('stroke', '#000').attr('stroke-width', 1).attr('fill', 'none')
		childG.append('rect').attr('x', 17).attr('y', 3).attr('width', 1).attr('height', 5).attr('fill', 'blue')
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
			.attr('text-anchor','middle')
			.text(labelText)
	}
	// 绘制q
	drawName(svg, x, y, name) {
		// const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		// const rect = parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none')
		svg.append('text')
			.attr('x', x)
			.attr('y', y + 5)
			.attr('text-anchor','middle')
			
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
			.attr('width',20)
			.attr('x', -20)
			.attr('y', height / 2)
			.text(name)
	}
	// 处理操作
	handleOperations(svg, operations) {
		for (let i = 0; i < operations.length; i++) {
			switch (operations[i].operation) {
				// write操作
				case 'write':
					// 处理数组
					for (let j = operations[i].value.length - 1; j >= 0; j--) {
						if (operations[i].value[j]) {
							this.drawWrite1(svg, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].qubits[j] + 2))
						} else {
							this.drawWrite0(svg, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].qubits[j] + 2))
						}
					}
					break
				// had操作
				case 'h':
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawH(svg, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].qubits[j] + 2))
					}
					break
				case 'swap':
					for (let j = 0; j < operations[i].qubits1.length; j++) {
						this.drawSwap(svg, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].qubits1[j] + 2))
						for (let k = 0; k < operations[i].qubits2.length; k++) {
							this.drawSwap(svg, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].qubits2[k] + 2))
							this.drawLine(
								svg,
								this.svgItemWidth * (i + this.scaleNum),
								30 * (operations[i].qubits1[j] + 2),
								this.svgItemWidth * (i + this.scaleNum),
								30 * (operations[i].qubits2[k] + 2)
							)
						}
					}
					break
				case 'ccnot':
					// 判断最大值最小值 向两个极端画线
					const controlsMin = Math.min(...operations[i].controls)
					const controlsMax = Math.max(...operations[i].controls)
					const g = svg.append('g')
					if (controlsMax < operations[i].target[0]) {
						this.drawLine(g, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].target[0] + 2), this.svgItemWidth * (i + this.scaleNum), 30 * (controlsMin + 2))
					}
					if (controlsMin > operations[i].target[0]) {
						this.drawLine(g, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].target[0] + 2), this.svgItemWidth * (i + this.scaleNum), 30 * (controlsMax + 2))
					}
					if (controlsMin < operations[i].target[0] && operations[i].target[0] < controlsMax) {
						this.drawLine(g, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].target[0] + 2), this.svgItemWidth * (i + this.scaleNum), 30 * (controlsMax + 2))
						this.drawLine(g, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].target[0] + 2), this.svgItemWidth * (i + this.scaleNum), 30 * (controlsMin + 2))
					}

					for (let j = 0; j < operations[i].controls.length; j++) {
						this.drawCircle(g, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].controls[j] + 2))
					}

					this.drawCcnot(g, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].target[0] + 2))

					break
				case 'ccphase':
					this.drawLine(
						svg,
						this.svgItemWidth * (i + this.scaleNum),
						30 * (operations[i].qubits[0] + 2),
						this.svgItemWidth * (i + this.scaleNum),
						30 * (operations[i].qubits[operations[i].qubits.length - 1] + 2)
					)
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawCCPhase(svg, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].qubits[j] + 2))
					}

					break
				case 'phase':
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawCCPhase(svg, this.svgItemWidth * (i + this.scaleNum), 30 * (operations[i].qubits[j] + 2))
						svg.append('text')
							.attr('x', this.svgItemWidth * (i + this.scaleNum) - 6)
							.attr('y', 30 * (operations[i].qubits[j] + 2) - 10)
							.attr('style', 'font-size:12px;')
							.append('tspan')
							.text(operations[i].rotation + '°')
					}

					break
				// case 'noop':

				// 	break
				default:
					break
			}
		}
	}
}
