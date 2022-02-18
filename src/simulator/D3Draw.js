import * as d3 from 'd3'
const d3Draw = () => {
	const d3DrawingDiv = d3.select('#d3_drawing')
	// 移除已经添加过的
	if (d3DrawingDiv.select('svg')._groups[0]) {
		d3DrawingDiv.select('svg').remove()
	}
	const svg = d3DrawingDiv.append('svg').attr('width', '100%').attr('height', '100%')
	svg.append('text')
		.attr('x', 0)
		.attr('y', 54)
		.attr('dominant-baseline', 'middle')
		.attr('text-anchor', 'start')
		.text('0')
		.on('click', function (event) {
			console.log(event)
		})
	svg.append('line')
		.attr('x1', 20)
		.attr('x2', 2652)
		.attr('y1', 54)
		.attr('y2', 54)
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
	function drawGate() {}
}
export { d3Draw }
