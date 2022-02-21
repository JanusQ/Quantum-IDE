import logo from './logo.svg'
import './App.css'
import Ace from './components/core/Ace'
import Circuit from './components/core/Circuit'
import { Row, Col } from 'antd'
import axios from 'axios'
import React, { useState, useRef } from 'react'
import { exportSVG } from './simulator/CommonFunction'
import QCEngine from './simulator/MyQCEngine'
// import QCEngine from './simulator/MyQCEngine'
// import './test/meausre'
// import './test/reset'
// import './test/ex2-4'
// import './test/myRun'
// import './test/write01'
// import './test/ccnot'
// import './test/permutes'
// import QuantumCircuit from './simulator/QuantumCircuit'
// import './test/matrixOpertation'
// import './test/ncphase'
// import './test/ex7-1'
// import './test/ex7-7'
// import './test/all_operation'

function App() {
	// 编辑器内容
	const [editorValue, setEditorValue] = useState('console.log("123")')
	// 编辑器输入
	function onChange(newValue) {
		setEditorValue(newValue)
	}

	// 选择改变编辑器的内容
	const selectChange = (value) => {
		axios
			.get('/js/' + value + '.js')
			.then((res) => {
				setEditorValue(res.data)
			})
			.catch((error) => {
				setEditorValue('Not Found')
			})
	}
	// 运行
	const runProgram = () => {
		try {
			let qc = new QCEngine()
			const { qint } = qc
			eval(editorValue)
			exportSVG(qc)
			// showInDebuggerArea(qc.circuit)
			qc = null
		} catch (error) {
			// setEditorValue(error.message)
		}
	}
	return (
		<div className='App'>
			<Row gutter={16} className='app-row'>
				<Col span={8}>
					<div className='left-div'>
						<Ace
							runProgram={runProgram}
							selectChange={selectChange}
							onChange={onChange}
							editorValue={editorValue}
						></Ace>
					</div>
				</Col>
				<Col span={16}>
					<div className='right-div'>
						<Circuit></Circuit>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default App
