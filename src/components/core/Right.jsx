import React from 'react'
import './Right.css'
import { Button } from 'antd'
import { restore } from '../../simulator/CommonFunction'
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
				<div className='d_component'>
					<div className='title'>
						<span className='title_name'>Evolution</span>
					</div>
					<div id='d_chart_div'>
						<div className='d_chart_title'></div>
						<svg id='d_chart_svg'></svg>
					</div>
				</div>
				<div className='c_component'>
					<div className='title'>
						<span className='title_name'>Variable State</span>
						<Button className='export_btn restore_btn' onClick={restore}>
							restore filter
						</Button>
					</div>
					<div className='c_up_draw'>
						<svg id='chart_svg'>
							<g id='chart_up_brush' />
						</svg>
					</div>
					<div className='title'>
						<span className='title_name'>Whole State</span>
					</div>
					<div className='c_down_draw'>
						<svg id='chart_down_svg'></svg>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Right
