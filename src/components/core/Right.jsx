import React, { useState, useEffect } from 'react'
import './Right.css'
import { Button, Tooltip } from 'antd'
import Dcomponent from '../drawComponenents/Dcomponent'
import Bcomponent from '../drawComponenents/Bcomponent'
import Ccomponent from '../drawComponenents/Ccomponent'
const Right = (props) => {
	const DRef = React.createRef()
	const drawDChart = (data) => {
		DRef.current.drawDChart(data)
	}
	const CRef = React.createRef()
	const drawCFn = (data) => {
		CRef.current.drawCFn(data)
	}
	return (
		<div id='right_div_box'>
			<Bcomponent
				qc={props.qc}
				drawDChart={(data) => drawDChart(data)}
				drawCFn={(data) => drawCFn(data)}
			></Bcomponent>
			<div id='right_down_div'>
				<Dcomponent qc={props.qc} onRef={DRef}></Dcomponent>
				<Ccomponent qc={props.qc} onRef={CRef}></Ccomponent>
			</div>
		</div>
	)
}
export default Right
