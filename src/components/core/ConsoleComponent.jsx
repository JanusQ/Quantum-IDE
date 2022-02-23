import { message } from 'antd'
import React from 'react'
import './ConsoleComponent.css'
const ConsoleComponent = (props) => {
	
	return (
		<div id='console_div'>
			<p className='title'>Console</p>
			<div className='content_div'>{props.consoleValue}</div>
		</div>
	)
}
export default ConsoleComponent
