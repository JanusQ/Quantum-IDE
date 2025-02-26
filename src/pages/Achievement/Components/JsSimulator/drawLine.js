// 绘制折线图
import * as d3 from 'd3'

export const drawLineChart = (row, svgWidth, qc) => {
  const svgItemWidth = 35
  const svgItemHeight = 32
  const scaleNum = 3
  const firstX = svgItemWidth * scaleNum
  console.log('drawLineChart')
  const svg = d3.select('#line_chart_svg')
  // const transformY = (qc.qubit_number + 1) * this.svgItemHeight
  const lineChartG = svg.select('#lineChart_graph')
  lineChartG.selectAll('*').remove()
  svg.attr('width', svgWidth)
  svg.attr('height', 30)
  const data = []
  for (let i = 0; i < qc.operations.length; i++) {
    const entropy = qc.getEntropy(qc.operations[i].index)
    data.push({
      index: qc.operations[i].index,
      entropy: entropy,
    })
  }
  const scaleX = d3
    .scaleBand()
    .domain(data.map((d) => d.index))
    .range([
      firstX + svgItemWidth / 2,
      (row + 3) * svgItemWidth + svgItemWidth / 2,
    ])

  // d3.min(data, (d) => d.entropy)
  const scaleY = d3
    .scaleLinear()
    .domain([-0.02, d3.max(data, (d) => d.entropy) + 0.02])
    // .range([transformY + this.svgItemHeight * 4, transformY + this.svgItemHeight * 3])
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
