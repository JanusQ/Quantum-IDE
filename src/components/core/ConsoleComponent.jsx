import { message,Tooltip } from 'antd'
import React from 'react'
import './ConsoleComponent.css'
const ConsoleComponent = (props) => {
	return (
		<div id='console_div'>
			<p className='title'>
				Console
				<Tooltip placement='right' title={'tip'}>
					<span className='tip_svg'></span>
				</Tooltip>
			</p>
			<div className='content_div'>{props.consoleValue}</div>
		</div>
	)
}
export default ConsoleComponent
