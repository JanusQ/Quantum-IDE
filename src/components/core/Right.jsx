import React, { useState, useEffect } from 'react'
import './Right.css'
import { Button, Tooltip } from 'antd'
import { restore } from '../../simulator/CommonFunction'
const Right = () => {
	return (
		<div id='right_div_box'>
			<div id='circuit_view'>
				<div className='title'>
					Circuit
					<Tooltip placement='right' title={'tip'}>
						<span className='tip_svg'></span>
					</Tooltip>
				</div>
				<div className='circuit_div'>
					<svg id='circuit_svg'>
						<g id='circuit_label' />
						<g id='circuit_brush' />
						<g id='circuit_graph' />

						{/* 下面的在前面 */}
					</svg>
					<div className='line_chart_div'>
						<svg id='line_chart_svg'>
							<g id='lineChart_graph'></g>
						</svg>
					</div>
				</div>
			</div>
			<div id='right_down_div'>
				<div className='scroll_div'>
					<div className='d_component'>
						<div className='title'>
							<span className='title_name'>
								Evolution
								<Tooltip placement='right' title={'tip'}>
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
				</div>
				<div className='c_component'>
					<div className='title'>
						<span className='title_name'>
							Variable State
							<Tooltip placement='right' title={'tip'}>
								<span className='tip_svg'></span>
							</Tooltip>
						</span>
						<Button className='export_btn restore_btn' onClick={restore}>
							restore filter
						</Button>
					</div>
					<div className='c_up_draw'>
						<svg id='chart_svg'></svg>
					</div>
					<div className='title'>
						<span className='title_name'>
							System State
							<Tooltip placement='right' title={'tip'}>
								<span className='tip_svg'></span>
							</Tooltip>
						</span>
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
