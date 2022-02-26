import React from 'react'
import './Circuit.css'
const Circuit = () => {
	return (
		<div id='circuit_view'>
			<svg id='circuit_svg' width='100%' height='100%'>
				<g id='circuit_label'/>
				<g id='circuit_brush'/>
				<g id='circuit_graph'/>
				{/* 下面的在前面 */}
			</svg>
		</div>
	)
}
export default Circuit
