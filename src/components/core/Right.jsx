import React from 'react'
import './Right.css'
import { Button } from 'antd'
const Right = () => {
	return (
		<div id='right_div_box'>
			<div id='circuit_view'>
				<svg id='circuit_svg'>
					<g id='circuit_label' />
					<g id='circuit_brush' />
					<g id='circuit_graph' />
					{/* 下面的在前面 */}
				</svg>
			</div>
			<div id='right_down_div'>
				<div className='d_component'></div>
				<div className='c_component'>
					<div className='title'>
						<span className='title_name'>Variable State</span>
						<Button className='export_btn restore_btn'>restore filter</Button>
					</div>
					<div className='c_up_draw'>
						<svg id='chart_svg'></svg>
					</div>
					<div className='title'>
						<span className='title_name'>Whole State</span>
					</div>
					<div className='c_down_draw'></div>
				</div>
			</div>
		</div>
	)
}
export default Right
