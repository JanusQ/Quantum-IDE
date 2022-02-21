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
		this.hadFontColor = options.hadFontColor || 'red'
	}
	exportD3SVG(data) {
		const d3DrawingDiv = d3.select('#d3_drawing')
		// 移除已经添加过的
		if (d3DrawingDiv.select('svg')._groups[0]) {
			d3DrawingDiv.select('svg').remove()
		}
		const svg = d3DrawingDiv.append('svg').attr('width', '100%').attr('height', '100%').attr('display', 'block')
		console.log(data)
		const { operations, qubit_number } = data
		// 列数
		const row = operations.length
		// 行数
		const col = qubit_number
		// 设置SVG宽高
		svg.attr('width', row * 60 + 100)
		svg.attr('height', col * 30 + 40)
		/**
		 * 预留了前边是100 每两个中间是60 所以距离都要加40
		 */
		for (let i = 0; i < col; i++) {
			// 初始线
			this.drawLine(svg, 100, 30 * (i + 1), row * 60 + 40, 30 * (i + 1))
		}
		// 处理操作
		this.handleOperations(svg, operations)

		// this.drawWrite0(svg, 30, 10)
		// this.drawH(svg, 60, 10)
		// this.drawRead(svg, 90, 10)
		// this.drawCcnot(svg, 120, 10)
		// this.drawSwap(svg, 150, 10)
		// this.drawPhase(svg, 180, 10)
	}

	drawWrite1(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff')
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
			.attr('fill-opacity', 0.5)
		childG
			.append('rect')
			.attr('x', 2)
			.attr('y', 7)
			.attr('width', 2)
			.attr('height', 6)
			.attr('fill', this.write1FontColor)
	}
	drawWrite0(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', '#fff')
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
		childG
			.append('circle')
			.attr('cx', 4)
			.attr('cy', 10)
			.attr('r', 3)
			.attr('stroke-width', 1)
			.attr('stroke', this.write0FontColor)
			.attr('fill', 'none')
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
		const childG = parentG.append('g')
		childG
			.append('text')
			.attr('x', 10)
			.attr('y', 15)
			.attr('style', `font-size:16px;font-weight:bold;cursor:default;color:red`)
			.append('tspan')
			.text('H')
			.attr('text-anchor', 'middle')
	}
	drawRead(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`)
		parentG
			.append('rect')
			.attr('width', 20)
			.attr('height', 20)
			.attr('fill', 'none')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
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
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none')
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 8)
			.attr('fill', 'none')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
		childG.append('rect').attr('x', 10).attr('y', 2).attr('width', 1).attr('height', 16)
		childG.append('rect').attr('x', 2).attr('y', 10).attr('width', 16).attr('height', 1)
	}
	// 叉号 x
	drawSwap(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x - 10}, ${y - 10})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none')
		const childG = parentG.append('g')
		const context = d3.path()
		context.moveTo(4, 4)
		context.lineTo(16, 16)
		context.moveTo(16, 4)
		context.lineTo(4, 17)
		childG
			.append('path')
			.attr('d', context.toString())
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', 'none')
	}
	drawPhase(svg, x, y) {
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`)
		parentG.append('rect').attr('width', 20).attr('height', 20).attr('fill', 'none')
		const childG = parentG.append('g')
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 8)
			.attr('fill', 'none')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
		childG
			.append('circle')
			.attr('cx', 10)
			.attr('cy', 10)
			.attr('r', 3)
			.attr('fill', 'none')
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
		const context = d3.path()
		context.moveTo(11, 4)
		context.lineTo(9, 16)
		childG
			.append('path')
			.attr('d', context.toString())
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', 'none')
	}
	// 直接在svg上画 不用g 绘制需要的实心圆，实线
	drawCircle(svg, x, y) {
		svg.append('circle')
			.attr('cx', x)
			.attr('cy', y)
			.attr('r', 4)
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', '#000')
	}
	// x,y 起始位置 targetX/Y 结束位置
	drawLine(svg, x, y, targetX, targetY) {
		const context = d3.path()
		context.moveTo(x, y)
		context.lineTo(targetX, targetY)
		svg.append('path')
			.attr('d', context.toString())
			.attr('stroke', '#000')
			.attr('stroke-width', 1)
			.attr('fill', 'none')
	}
	// 处理操作

	handleOperations(svg, operations) {
		for (let i = 0; i < operations.length; i++) {
			switch (operations[i].operation) {
				// write操作
				case 'write':
					for (let j = operations[i].value.length - 1; j >= 0; j--) {
						if (operations[i].value[j]) {
							if (i === 0) {
								// 第一个从100开始
								this.drawWrite1(svg, 100, 30 * (j + 1))
							} else {
								this.drawWrite1(svg, 60 * (i + 1), 30 * (j + 1))
							}
						} else {
							if (i === 0) {
								// 第一个从100开始
								this.drawWrite0(svg, 100, 30 * (j + 1))
							} else {
								this.drawWrite0(svg, 60 * (i + 1), 30 * (j + 1))
							}
						}
					}
					break
				// had操作
				case 'h':
					for (let j = 0; j < operations[i].qubits.length; j++) {
						this.drawH(svg, 60 * (i + 1) + 40, 30 * (operations[i].qubits[j] + 1))
					}
					break
				case 'swap':
					for (let j = 0; j < operations[i].qubits1.length; j++) {
						this.drawSwap(svg, 60 * (i + 1) + 40, 30 * (operations[i].qubits1[j] + 1))
						for (let k = 0; k < operations[i].qubits2.length; k++) {
							this.drawSwap(svg, 60 * (i + 1) + 40, 30 * (operations[i].qubits2[k] + 1))
							this.drawLine(
								svg,
								60 * (i + 1) + 40,
								30 * (operations[i].qubits1[j] + 1),
								60 * (i + 1) + 40,
								30 * (operations[i].qubits2[k] + 1)
							)
						}
					}
					break
				// todo
				case 'ccnot':
					for (let j = 0; j < operations[i].controls.length; j++) {
						this.drawCircle(svg, 60 * (i + 1) + 40, 30 * (operations[i].controls[j] + 1))
					}

					break
				default:
					break
			}
		}
	}
}

export { d3Draw }
