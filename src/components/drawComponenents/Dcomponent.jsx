import React, { useState, useEffect, useImperativeHandle } from 'react'
import '../core/Right.css'
import * as d3 from 'd3'
import { Button, Tooltip } from 'antd'
import { getDirac } from '../Mathjax'
const _ = require('lodash')

const Dcomponent = (props) => {
	const dLength = 26
	const isFull = false
	const viewBoxWidth = 1
	const viewBoxHeight = 1
	const gate_offest = 0
	// 存储d模块圆形颜色
	const dCircleUsedColor = props.dCircleUsedColor || 'rgb(246, 175, 31)'
	const dCircleColor = props.dCircleColor || 'rgba(142, 132, 112,0.5)'
	// 互补的圆形透明度
	const dCircleColorOpacity = props.dCircleColorOpacity || 0.3
	// d模块浅色块颜色
	const dLightRectColor = props.dLightRectColor || 'rgb(137, 214, 220)'
	// 浅色块条形图的颜色
	const dBarColor = props.dBarColor || 'rgb(137, 214, 220)'
	const clear = () => {
		const drawDiv = d3.select('#d_draw_div')
		drawDiv.selectAll('*').remove()
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
	const getPhaseXY = (deg, length) => {
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
	const drawDinput = (
		svg,
		x,
		y,
		inWidth,
		deg,
		color,
		isNeedShowData,
		data,
		chartDiv,
		chartSvgDiv,
		offsetX,
		offsetY
	) => {
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		parentG.append('rect').attr('width', dLength).attr('height', dLength).attr('fill', 'none')
		const childG = parentG.append('g').attr('transform', `translate(3,3)`)
		childG
			.append('rect')
			.attr('width', dLength - 6)
			.attr('height', dLength - 6)
			.attr('fill', 'transparent')
			.attr('stroke', inWidth ? '#000' : dCircleColor)
			.attr('stroke-width', 1)
		childG
			.append('g')
			.attr('transform', `translate(${(20 * (1 - inWidth)) / 2},${(20 * (1 - inWidth)) / 2})`)
			.append('rect')
			.attr('width', inWidth * 20)
			.attr('height', inWidth * 20)
			.attr('fill', color)
		if (inWidth) {
			const { phaseY, phaseX } = getPhaseXY(deg, 20)
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
				const chartDivOffsetLeft = chartDiv._groups[0][0].offsetLeft
				const chartDivOffsetTop = chartDiv._groups[0][0].offsetTop
				const drawDiv = d3.select('#d_draw_div')
				// 碰撞检测
				let initTop = offsetY ? offsetY - scrollTop + 40 : e.offsetY - scrollTop + 36
				let initLeft = offsetX ? offsetX + 50 - scrollLeft : e.offsetX - scrollLeft + 10
				const initHeight = 32 * (allKeys.length / 2)
				if (initTop + initHeight + chartDivOffsetTop > drawDiv._groups[0][0].clientHeight) {
					initTop = offsetY ? offsetY - scrollTop - 40 : e.offsetY - scrollTop - 36
				}
				if (initLeft + 200 + chartDivOffsetLeft > drawDiv._groups[0][0].clientWidth) {
					initLeft = offsetX ? offsetX - 220 - scrollLeft : e.offsetX - scrollLeft - 230
				}

				// console.log(initLeft)
				const showDataDiv = chartDiv
					.append('div')
					.attr('class', 'show_data_div')
					.attr('style', `height:${initHeight}px;top:${initTop}px;left:${initLeft}px;border:1px solid black`)
				// const showDataSVG = showDataDiv
				// 	.append('svg')
				// 	.classed('relaed_svg', true)
				// 	.attr('width', '100%')
				// 	.attr('height', '100%')
				drawShowData(showDataDiv, data)
			})
			childG.on('mouseleave', function (e) {
				chartDiv.selectAll('.show_data_div').remove()
			})
		}
		return parentG
	}
	// 绘制浅色块显示的条形
	const drawShowData = (showDataDiv, data) => {
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
	const drawDCircle = (svg, x, y, color, arcR, arcDeg, isNeedBorder, roation, scale, chartDiv, chartSvgDiv) => {
		//   R 10
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		const borderRect = parentG.append('rect').attr('width', dLength).attr('height', dLength).attr('fill', 'none')
		const childG = parentG.append('g')
		const circleR = dLength / 2
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
			const arcRealR = (arcR * dLength) / 2 - 2
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
				.attr('opacity', dCircleColorOpacity)
			if (arcR < 1 && arcR > 0) {
				const borderCircleR = { startAngle: (Math.PI * (arcDeg - 1)) / 180, endAngle: (Math.PI * arcDeg) / 180 }
				const borderPath = d3
					.arc()
					.innerRadius(0)
					.outerRadius(dLength / 2 - 2)
				childG
					.append('path')
					.attr('d', borderPath(borderCircleR))
					.attr('fill', color)
					.attr('transform', 'translate(13,13)')
				// .attr('stroke','rgba(142, 132, 112,0.5)')
				// .attr('stroke-width',1)
			}
		} else if (!arcDeg && arcR) {
			arcR = (arcR * dLength) / 2 - 2
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
				.attr('opacity', dCircleColorOpacity)
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
	const drawText = (svg, x, y, index) => {
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		parentG.append('rect').attr('width', dLength).attr('height', dLength).attr('fill', 'none')
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
	const drawRepeatText = (svg, x, y, index, k, isPortrait) => {
		if (isPortrait) {
			for (let i = 0; i < index.length; i++) {
				if (index[i][1] - index[i][0] > 2) {
					const textSvg = getDirac(k)
					const z = new XMLSerializer()
					const parentG = svg
						.append('g')
						.attr('transform', `translate(${x}, ${dLength * index[i][0]})`)
						.classed('d_item', true)
					parentG
						.append('rect')
						.attr('width', dLength)
						.attr('height', dLength * (index[i][1] - index[i][0] + 1))
						.attr('fill', 'none')
					parentG
						.append('rect')
						.attr('width', dLength - 7)
						.attr('height', 1)
						.attr('fill', 'rgba(142, 132, 112,0.5)')
						.attr('x', x + 3)
						.attr('y', 2)
					parentG
						.append('rect')
						.attr('width', dLength - 7)
						.attr('height', 1)
						.attr('fill', 'rgba(142, 132, 112,0.5)')
						.attr('x', x + 3)
						.attr('y', dLength * (index[i][1] - index[i][0] + 1) - 4)
					parentG
						.append('foreignObject')
						.attr('width', 26)
						.attr('height', 26)
						.attr('x', String(k).length > 1 ? 0 : 3)
						.attr('y', (dLength * (index[i][1] - index[i][0] + 1)) / 2 - 12)
						.append('xhtml:div')
						.attr('height', '100%')
						.attr('width', '100%')
						.html(z.serializeToString(textSvg))
					drawLine(
						parentG,
						x + 12,
						8,
						x + 12,
						(dLength * (index[i][1] - index[i][0] + 1)) / 2 - 14,
						'rgba(142, 132, 112, 0.5)'
					)
					drawLine(
						parentG,
						x + 12,
						(dLength * (index[i][1] - index[i][0] + 1)) / 2 + 14,
						x + 12,
						dLength * (index[i][1] - index[i][0] + 1) - 8,
						'rgba(142, 132, 112, 0.5)'
					)
				} else {
					for (let j = index[i][0]; j <= index[i][1]; j++) {
						drawText(svg, x, dLength * j, k)
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
						.attr('transform', `translate(${dLength * index[i][0]}, ${y})`)
						.classed('d_item', true)
					parentG
						.append('rect')
						.attr('width', dLength * (index[i][1] - index[i][0] + 1))
						.attr('height', dLength)
						.attr('fill', 'none')
					parentG
						.append('rect')
						.attr('width', 1)
						.attr('height', dLength - 7)
						.attr('fill', 'rgba(142, 132, 112,0.5)')
						.attr('x', 2)
						.attr('y', y + 3)
					parentG
						.append('rect')
						.attr('width', 1)
						.attr('height', dLength - 7)
						.attr('fill', 'rgba(142, 132, 112,0.5)')
						.attr('x', dLength * (index[i][1] - index[i][0] + 1) - 4)
						.attr('y', y + 3)
					parentG
						.append('foreignObject')
						.attr('width', 26)
						.attr('height', 26)
						.attr('x', (dLength * (index[i][1] - index[i][0] + 1)) / 2 - 9)
						.attr('y', 1)
						.append('xhtml:div')
						.attr('height', '100%')
						.attr('width', '100%')
						.html(z.serializeToString(textSvg))
					drawLine(
						parentG,
						8,
						y + 13,
						(dLength * (index[i][1] - index[i][0] + 1)) / 2 - 14,
						y + 13,
						'rgba(142, 132, 112, 0.5)'
					)
					drawLine(
						parentG,
						(dLength * (index[i][1] - index[i][0] + 1)) / 2 + 14,
						y + 13,
						dLength * (index[i][1] - index[i][0] + 1) - 10,
						y + 13,
						'rgba(142, 132, 112, 0.5)'
					)
				} else {
					for (let j = index[i][0]; j <= index[i][1]; j++) {
						drawText(svg, dLength * j, y, k)
					}
				}
			}
		}
	}
	// 绘制浅色块text
	const drawRelaedNum = (svg, x, y, data, textX, chartDiv, chartSvgDiv, textY) => {
		data = data.slice(1, data.length)
		const parentG = svg.append('g').attr('transform', `translate(${x}, ${y})`).classed('d_item', true)
		parentG.append('rect').attr('width', dLength).attr('height', 14).attr('fill', 'none')
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
							dLength * data.length + 17
						}px;width:${dLength + 8}px;border:1px solid black`
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
					drawDinput(
						relaedSVG,
						3,
						dLength * i,
						data[i].ratio,
						data[i].phases,
						dLightRectColor,
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
	const drawDqName = (svg, name) => {
		svg.append('rect').attr('width', dLength).attr('height', dLength).attr('fill', 'transparent')
		svg.append('text')
			.text(`${name}`)
			.attr('dominant-baseline', 'middle')
			.attr('x', 0)
			.attr('y', dLength / 2)
	}
	// 绘制基本结构
	const drawElement = (labelName, labelId, circleNum, inputStateNumber, svgWidth, svgHeight) => {
		const self = this
		let isShowMore = false
		let isFull = false
		let isReduce = false
		//删除
		const getParentNode = (obj) => {
			if (!obj.classList.contains('d_chart_div')) {
				getParentNode(obj.parentNode)
			} else {
				props.qc.labels.splice(
					props.qc.labels.findIndex((item) => item.id === labelId),
					1
				)
				props.qc.label_count--
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
				
                const d_draw_div = d3.select('#d_draw_div')
                d_draw_div.attr('style', 'position:relative')
				chartDiv.attr('class', null).classed('d_chart_div', true)
				operationDiv.attr('style', 'display:none')
				isShowMore = false
				svg.attr('width', svgWidth / viewBoxWidth)
				svg.attr('height', svgHeight / viewBoxHeight)
				svg.attr('viewBox', `0,0,${svgWidth},${svgHeight}`)
				chartSvgDiv.attr('style', 'display:block;')
				chartDiv.select('.reduce_icon').attr('src', '/icon/reduce_icon.svg')
				isFull = !isFull
				isReduce = false
			} else {
                const d_draw_div = d3.select('#d_draw_div')
                d_draw_div.attr('style', 'positon:unset')
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
				svg.attr('width', svgWidth / viewBoxWidth)
				svg.attr('height', svgHeight / viewBoxHeight)
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
		const drawDiv = d3.select('#d_draw_div').attr('style', 'position:relative')
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
				saveFn(svg.html(), labelNameSpan.html(), svg.attr('width'), svg.attr('height'))
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
	const saveFn = (elm, labelName, width, height) => {
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
	const ribbonPathString = (sx, sy, sdy, tx, ty, tdy, tension) => {
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
	const silkRibbonPathString = (sx, sy, tx, ty, tension) => {
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
	const drawSankey = (data) => {
		let filter_unused = false //true;

		const circleData = props.qc.getEvoMatrix(data.id)
		let circleDataNum = 0
		if (circleData.length && circleData[0].length) {
			circleDataNum = circleData[0][0]['max'].toFixed(2)
		}

		const { input_state: inputStateData, output_state: outStateData } = props.qc.getState(data.id)
		const { sankey: sankeyData, permute } = props.qc.transferSankeyOrdered(
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
		outBases.sort(sortFunc('id', permute))
		// 计算圆圈g X轴向右移动的距离
		const circleGtransformX = (inputStateData.vars.length + 4) * dLength + 14
		// 计算输入input X轴移动
		const inputGTransformX = (inputStateData.vars.length + 1) * dLength + 14
		// 计算out_input X轴移动
		const outGTransformX = (inputStateData.vars.length + 7) * dLength + 14
		// 计算out_input 浅色块X轴移动
		const outRelatedGX = outGTransformX + (outStateData.vars.length + 1) * dLength
		// 设置svg的宽高
		const svgHeight = (outStateData.bases.length + 1) * dLength
		const svgWidth = outRelatedGX + dLength * 2 - 10
		const { svg, chartDiv, chartSvgDiv } = drawElement(
			data.text,
			data.id,

			circleDataNum,
			inputStateData['max_magn'].toFixed(2),
			svgWidth,
			svgHeight
		)

		svg.attr('viewBox', `0,0,${svgWidth},${svgHeight}`)
		svg.attr('width', svgWidth / viewBoxWidth)
		svg.attr('height', svgHeight / viewBoxHeight)
		// svg.attr('width',)

		// 绘制圈
		const circleG = svg
			.append('g')
			.classed('circle_g', true)
			.attr('transform', `translate(${circleGtransformX},${dLength})`)
		for (let i = 0; i < sankeyData.length; i++) {
			const color = sankeyData[i].used ? dCircleUsedColor : dCircleColor
			const arcR = sankeyData[i].ratio
			drawDCircle(
				circleG,
				0,
				dLength * i,
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
				.attr('transform', `translate(${dLength * (i + 1) + 14},${dLength})`)
			const qNameX = dLength * (i + 1) + 14
			const qNameG = svg
				.append('g')
				.classed('q_name_g', true)
				.attr('transform', `translate(${qNameX + 5},0)`)
			drawDqName(qNameG, inputStateData.vars[i])

			for (let j = 0; j < inputBases.length; j++) {
				inputVar2ValueArr.push(inputBases[j].var2value[inputStateData.vars[i]])
			}
			// 得到重复的开始/结束位置:{10:[[0,1],[4,8]]}
			const repeatObj = getRepeat(inputVar2ValueArr)
			const catchObj = {}
			for (let k = 0; k < inputVar2ValueArr.length; k++) {
				if (repeatObj[inputVar2ValueArr[k]]) {
					if (!catchObj[inputVar2ValueArr[k]]) {
						drawRepeatText(
							textG,
							0,
							dLength * k,
							repeatObj[inputVar2ValueArr[k]],
							inputVar2ValueArr[k],
							true
						)
					}
					catchObj[inputVar2ValueArr[k]] = 1
				} else {
					drawText(textG, 0, dLength * k, inputVar2ValueArr[k])
				}
			}
		}
		const inputG = svg
			.append('g')
			.classed('put_g', true)
			.attr('transform', `translate(${inputGTransformX},${dLength})`)
		const inputRelatedG = svg
			.append('g')
			.classed('input_related_g', true)
			.attr('transform', `translate(14 ,${dLength})`)
		const drawInputRelaedNumG = svg
			.append('g')
			.classed('input_related_num', true)
			.attr('transform', `translate(0,${dLength})`)
		for (let j = 0; j < inputBases.length; j++) {
			drawDinput(
				inputG,
				0,
				dLength * j,
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
					drawDinput(
						inputRelatedG,
						0,
						dLength * j,
						inputBases[j].related_bases[k].ratio,
						inputBases[j].related_bases[k].phases,
						dLightRectColor,
						true,
						inputBases[j].related_bases[k],
						chartDiv,
						chartSvgDiv
					)
				}
			}
			if (inputBases[j].related_bases.length > 1) {
				drawRelaedNum(
					drawInputRelaedNumG,
					0,
					dLength * j,
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
				.attr('transform', `translate(${outGTransformX + dLength * (i + 1)},${dLength})`)
			const qNameX = outGTransformX + dLength * (i + 1)
			const qNameG = svg
				.append('g')
				.classed('q_name_g', true)
				.attr('transform', `translate(${qNameX + 5},0)`)
			drawDqName(qNameG, outStateData.vars[i])

			// 绘制text |0>
			for (let j = 0; j < outBases.length; j++) {
				outVar2ValueArr.push(outBases[j].var2value[outStateData.vars[i]])
			}
			// 得到重复的开始/结束位置:{10:[[0,1],[4,8]]}
			const repeatObj = getRepeat(outVar2ValueArr)
			const catchObj = {}
			for (let k = 0; k < outVar2ValueArr.length; k++) {
				if (repeatObj[outVar2ValueArr[k]]) {
					if (!catchObj[outVar2ValueArr[k]]) {
						drawRepeatText(textG, 0, dLength * k, repeatObj[outVar2ValueArr[k]], outVar2ValueArr[k], true)
					}
					catchObj[outVar2ValueArr[k]] = 1
				} else {
					drawText(textG, 0, dLength * k, outVar2ValueArr[k])
				}
			}
		}
		const outG = svg.append('g').classed('put_g', true).attr('transform', `translate(${outGTransformX},${dLength})`)
		const outRelatedG = svg
			.append('g')
			.classed('input_related_g', true)
			.attr('transform', `translate(${outRelatedGX},${dLength})`)
		const drawOutRelaedNumG = svg
			.append('g')
			.classed('input_related_num', true)
			.attr('transform', `translate(${outRelatedGX + dLength},${dLength})`)
		for (let j = 0; j < outBases.length; j++) {
			drawDinput(
				outG,
				0,
				dLength * j,
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
					drawDinput(
						outRelatedG,
						0,
						dLength * j,
						outBases[j].related_bases[k].ratio,
						outBases[j].related_bases[k].phases,
						dLightRectColor,
						true,
						outBases[j].related_bases[k],
						chartDiv,
						chartSvgDiv
					)
				}
			}
			if (outBases[j].related_bases.length > 1) {
				drawRelaedNum(
					drawOutRelaedNumG,
					0,
					dLength * j,
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
			const color = sankeyData[i].used ? dCircleUsedColor : dCircleColor
			const toD = silkRibbonPathString(
				circleGtransformX + dLength,
				dLength * (i + 1) + dLength / 2,
				outGTransformX,
				findToDy(outBases, sankeyData[i].to_id),
				0.5
			)
			svg.append('path').attr('d', toD).attr('fill', 'none').attr('stroke-width', 1).attr('stroke', color)
			const fromD = silkRibbonPathString(
				circleGtransformX,
				dLength * (i + 1) + dLength / 2,
				inputGTransformX + dLength,
				findfromDy(inputBases, sankeyData[i].from_id),
				0.5
			)
			svg.append('path').attr('d', fromD).attr('fill', 'none').attr('stroke-width', 1).attr('stroke', color)
		}
	}
	// 查to_d连线的Y值
	const findToDy = (outBases, id) => {
		let y = 0
		for (let i = 0; i < outBases.length; i++) {
			if (outBases[i].id === id) {
				y = dLength * (i + 1) + dLength / 2
				break
			}
		}
		return y
	}
	// 查from_d连线的Y
	const findfromDy = (fromBases, id) => {
		let y = 0
		for (let i = 0; i < fromBases.length; i++) {
			if (fromBases[i].id === id) {
				y = dLength * (i + 1) + dLength / 2
				break
			}
		}
		return y
	}
	// 排序方法
	const sortFunc = (propName, referArr) => {
		return (prev, next) => {
			return referArr.indexOf(prev[propName]) - referArr.indexOf(next[propName])
		}
	}

	// 绘制普通完整表示
	const drawMatrix = (data) => {
		const { input_state: inputStateData, output_state: outStateData } = props.qc.getState(data.id)

		const circleData = props.qc.getEvoMatrix(data.id)

		let circleDataNum = 0
		if (circleData.length && circleData[0].length) {
			circleDataNum = circleData[0][0]['max'].toFixed(2)
		}

		// 计算矩阵g Y轴向下移动的距离
		const circleGtransformY = (inputStateData.vars.length + 2) * dLength + 14

		// 计算输入input Y轴移动
		const inputGTransformY = (inputStateData.vars.length + 1) * dLength + 14
		// 计算out_input X轴移动
		const inputWidth = (inputStateData.bases.length + 1) * dLength + 15
		// 计算out_input 浅色块X轴移动
		const outRelatedGX = inputWidth + (outStateData.vars.length + 1) * dLength
		// 绘制矩阵
		// 设置svg的宽高
		const svgHeight = circleGtransformY + outStateData.bases.length * dLength
		const svgWidth = outRelatedGX + dLength * 2 + 15
		const { svg, chartDiv, chartSvgDiv } = drawElement(
			data.text,
			data.id,

			circleDataNum,
			inputStateData['max_magn'].toFixed(2),
			svgWidth,
			svgHeight
		)
		// svg.attr('height', svgHeight).attr('width', svgWidth)
		svg.attr('viewBox', `0,0,${svgWidth},${svgHeight}`)
		svg.attr('width', svgWidth / viewBoxWidth)
		svg.attr('height', svgHeight / viewBoxHeight)
		const circleG = svg
			.append('g')
			.classed('circle_g', true)
			.attr('transform', `translate(${dLength + 15},${circleGtransformY})`)
		for (let i = 0; i < circleData.length; i++) {
			for (let j = 0; j < circleData[i].length; j++) {
				const color = circleData[i][j].used ? dCircleUsedColor : dCircleColor
				const arcR = circleData[i][j].ratio
				drawDCircle(
					circleG,
					dLength * j,
					dLength * i,
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
				.attr('transform', `translate(${inputWidth + dLength * (i + 1)},${circleGtransformY})`)

			// for (let j = 0; j < outStateData.bases.length; j++) {
			// 	 drawText(textG, 0,  dLength * j, outStateData.bases[j].var2value[outStateData.vars[i]])
			// }
			// 绘制text |0>
			for (let j = 0; j < outStateData.bases.length; j++) {
				outVar2ValueArr.push(outStateData.bases[j].var2value[outStateData.vars[i]])
			}
			// 得到重复的开始/结束位置:{10:[[0,1],[4,8]]}

			const repeatObj = getRepeat(outVar2ValueArr)
			const catchObj = {}
			for (let k = 0; k < outVar2ValueArr.length; k++) {
				if (repeatObj[outVar2ValueArr[k]]) {
					if (!catchObj[outVar2ValueArr[k]]) {
						drawRepeatText(textG, 0, dLength * k, repeatObj[outVar2ValueArr[k]], outVar2ValueArr[k], true)
					}
					catchObj[outVar2ValueArr[k]] = 1
				} else {
					drawText(textG, 0, dLength * k, outVar2ValueArr[k])
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
			.attr('transform', `translate(${outRelatedGX + dLength},${circleGtransformY})`)
		for (let j = 0; j < outStateData.bases.length; j++) {
			drawDinput(
				outG,
				0,
				dLength * j,
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
					drawDinput(
						outRelatedG,
						0,
						dLength * j,
						outStateData.bases[j].related_bases[k].ratio,
						outStateData.bases[j].related_bases[k].phases,
						dLightRectColor,
						true,
						outStateData.bases[j].related_bases[k],
						chartDiv,
						chartSvgDiv
					)
				}
			}
			if (outStateData.bases[j].related_bases.length > 1) {
				drawRelaedNum(
					drawOutRelaedNumG,
					0,
					dLength * j,
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
				.attr('transform', `translate(${dLength + 15},${dLength * (i + 1) + 14})`)
			// 绘制变量名
			const qNameY = dLength * (i + 1) + 14
			const qNameG = svg
				.append('g')
				.classed('q_name_g', true)
				.attr('transform', `translate(${inputWidth + dLength * (j + 1) + 5},${qNameY})`)
			drawDqName(qNameG, inputStateData.vars[i])
			j--
			// // 绘制文字 |0>
			// for (let j = 0; j < inputStateData.bases.length; j++) {
			// 	 drawText(textG,  dLength * j, 0, inputStateData.bases[j].var2value[inputStateData.vars[i]])
			// }

			// 绘制text |0>
			for (let j = 0; j < inputStateData.bases.length; j++) {
				inputVar2ValueArr.push(inputStateData.bases[j].var2value[inputStateData.vars[i]])
			}

			// 得到重复的开始/结束位置:{10:[[0,1],[4,8]]}
			const repeatObj = getRepeat(inputVar2ValueArr)
			const catchObj = {}
			for (let k = 0; k < inputVar2ValueArr.length; k++) {
				if (repeatObj[inputVar2ValueArr[k]]) {
					if (!catchObj[inputVar2ValueArr[k]]) {
						drawRepeatText(
							textG,
							dLength * k,
							0,
							repeatObj[inputVar2ValueArr[k]],
							inputVar2ValueArr[k],
							false
						)
					}
					catchObj[inputVar2ValueArr[k]] = 1
				} else {
					drawText(textG, dLength * k, 0, inputVar2ValueArr[k])
				}
			}
		}

		const inputG = svg
			.append('g')
			.classed('input_g', true)
			.attr('transform', `translate(${dLength + 15},${inputGTransformY})`)
		const inputRelatedG = svg
			.append('g')
			.classed('input_related_g', true)
			.attr('transform', `translate(${dLength + 15},14)`)
		const drawRelaedNumG = svg
			.append('g')
			.classed('input_related_num', true)
			.attr('transform', `translate(${dLength + 15},0)`)
		for (let j = 0; j < inputStateData.bases.length; j++) {
			drawDinput(
				inputG,
				dLength * j,
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
						drawDinput(
							inputRelatedG,
							dLength * j,
							0,
							inputStateData.bases[j].related_bases[k].ratio,
							inputStateData.bases[j].related_bases[k].phases,
							dLightRectColor,
							true,
							inputStateData.bases[j].related_bases[k],
							chartDiv,
							chartSvgDiv
						)
					}
				}
				if (inputStateData.bases[j].related_bases.length > 1) {
					drawRelaedNum(
						drawRelaedNumG,
						dLength * j,
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
	const drawDChart = (drawData) => {
		// 判断绘制类型
		let labels = []
		if (drawData) {
			labels = drawData.labels.filter((item) => item.text !== '')
		} else {
			labels = props.qc.labels.filter((item) => item.text !== '')
		}
		for (let i = 0; i < labels.length; i++) {
			if (props.qc.canShow(labels[i].id)) {
				if (props.qc.isSparse(labels[i].id)) {
					drawSankey(labels[i])
				} else {
					drawMatrix(labels[i])
				}
			}
		}
	}
	// 计算重复的key 和出现的起始位置结束位置
	const getRepeat = (arr) => {
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
	useEffect(() => {
		if (props.qc) {
			clear()
			drawDChart()
		}
	}, [props.qc])
	useImperativeHandle(props.onRef, () => {
		return {
			drawDChart: drawDChart,
		}
	})
	return (
		<div className='d_component'>
			<div className='title'>
				<span className='title_name'>
					Evolution
					<Tooltip
						placement='right'
						title={
							'Here is the panel to interpret the evolution of sub-quantum circuits by matrix representation or sankey diagram.'
						}
					>
						<span className='tip_svg'></span>
					</Tooltip>
				</span>
				<div className='pic_tip'>
					<img src='/img/legends/subbase.png' />
					<span className='tip_text'>subbase</span>
				</div>
				<div className='pic_tip'>
					<img src='/img/legends/base.png' />
					<span className='tip_text'>base</span>
				</div>
				<div className='pic_tip'>
					<img src='/img/legends/transformation.png' />
					<span className='tip_text'>transformation</span>
				</div>
				<div className='pic_tip'>
					<img src='/img/legends/idletransformation.png' />
					<span className='tip_text'>idle transformation</span>
				</div>
			</div>
			<div id='d_draw_div'></div>
		</div>
	)
}
export default Dcomponent
