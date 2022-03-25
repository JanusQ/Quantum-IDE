import * as d3 from 'd3'
export default class Chart {
	constructor() {
		this._width = 546
		this._height = 290
		this._margins = { top: 0, left: 0, right: 0, bottom: 0 }
		this._data = []
		this._scaleX = null
		this._scaleY = null
		this._scaleY2 = null
		this._colors = ['rgb(80, 128, 132)', 'rgb(220, 216, 216)']
		this._box = null
		this._svg = null
		this._body = null
		this._padding = { top: 20, left: 0, right: 80, bottom: 120 }
		this._key = 'a'
		// 下半缩放之后的距离 / 2
		this._transformHeight = '20'
	}
	tramsformHeight(t){
		if (arguments.length === 0) return this._transformHeight
		this._transformHeight = t
		return this
	}
	width(w) {
		if (arguments.length === 0) return this._width
		this._width = w
		return this
	}

	height(h) {
		if (arguments.length === 0) return this._height
		this._height = h
		return this
	}

	margins(m) {
		if (arguments.length === 0) return this._margins
		this._margins = m
		return this
	}

	data(d) {
		if (arguments.length === 0) return this._data
		this._data = d
		return this
	}
	key(key) {
		if (arguments.length === 0) return this._key
		this._key = key
		return this
	}
	scaleX(x) {
		if (arguments.length === 0) return this._scaleX
		this._scaleX = x
		return this
	}

	scaleY(y) {
		if (arguments.length === 0) return this._scaleY
		this._scaleY = y
		return this
	}
	scaleY2(y) {
		if (arguments.length === 0) return this._scaleY2
		this._scaleY2 = y
		return this
	}
	svg(s) {
		if (arguments.length === 0) return this._svg
		this._svg = s
		return this
	}

	body(b) {
		if (arguments.length === 0) return this._body
		this._body = b
		return this
	}

	box(b) {
		if (arguments.length === 0) return this._box
		this._box = b
		return this
	}

	getBodyWidth() {
		let width = this._width - this._margins.left - this._margins.right
		return width > 0 ? width : 0
	}

	getBodyHeight() {
		let height = this._height - this._margins.top - this._margins.bottom
		return height > 0 ? height : 0
	}

	padding(p) {
		if (arguments.length === 0) return this._padding
		this._padding = p
		return this
	}

	defineBodyClip() {
		this._svg
			.append('defs')
			.append('clipPath')
			.attr('id', 'clip')
			.append('rect')
			.attr('width', this.getBodyWidth() + this._padding.right)
			.attr('height', this.getBodyHeight() + this._padding.top + this._padding.bottom)
			.attr('x', -this._padding.left)
			.attr('y', -this._padding.top)
	}

	render() {
		return this
	}

	bodyX() {
		return this._margins.left
	}

	bodyY() {
		return this._margins.top
	}

	renderBody() {
		if (!this._body) {
			this._body = this._svg
				.append('g')
				.attr('class', 'body')
				.attr('transform', 'translate(' + this.bodyX() + ',' + this.bodyY() + ')')
			// .attr('clip-path', 'url(#clip)')
		}

		this.render()
	}

	renderChart() {
		if (!this._box) {
			this._box = d3.select('body').append('div').attr('class', 'box')
		}
		if (!this._svg) {
			this._svg = this._box.append('svg').attr('width', this._width).attr('height', this._height)
		}

		this.defineBodyClip()

		this.renderBody()
	}
}
