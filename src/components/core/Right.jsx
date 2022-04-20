import React, { useState, useEffect } from 'react'
import '../styles/Right.css'
import { Button, Tooltip } from 'antd'
import { restore } from '../../simulator/CommonFunction'
const Right = (props) => {
	return (
		<div id='right_div_box'>
			<div
				id='circuit_view'
				style={{
					display: props.isShowBMode ? 'block' : 'none',
					height: !props.isShowCMode && !props.isShowDMode ? '100%' : '40%',
				}}
			>
				<div className='title'>
					Circuit
					<Tooltip placement='right' title={'Here is the panel to visualize the quantum circuit.'}>
						<span className='tip_svg'></span>
					</Tooltip>
				</div>
				<div className='circuit_div'>
					<svg id='circuit_svg'>
						<g id='circuit_brush' />
						<g id='brush_label' />
						<g id='circuit_label' />

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
			<div
				id='right_down_div'
				style={{
					height: props.isShowBMode ? 'calc(60% - 5px)' : '100%',
					marginTop: props.isShowBMode ? '5px' : '0',
					display: !props.isShowCMode && !props.isShowDMode ? 'none' : 'flex',
				}}
			>
				<div
					className='scroll_div'
					style={{
						width: props.isShowCMode ? '60%' : '100%',
						marginRight: props.isShowCMode ? '5px' : '0',
						display: props.isShowDMode ? 'block' : 'none',
					}}
				>
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
				</div>
				<div
					className='c_component'
					style={{
						display: props.isShowCMode ? 'block' : 'none',
						width: props.isShowDMode ? 'calc(40% - 5px)' : '100%',
					}}
				>
					<div className='title'>
						<span className='title_name'>
							Variable State
							<Tooltip
								placement='right'
								title={'Here is the panel to inspect the intermediate variable state.'}
							>
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
							<Tooltip
								placement='right'
								title={'Here is the panel to inspect the global quantum system state.'}
							>
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
