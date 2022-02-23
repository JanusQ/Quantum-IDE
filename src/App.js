import logo from './logo.svg'
import './App.css'
import Ace from './components/core/Ace'
import Circuit from './components/core/Circuit'
import ConsoleComponent from './components/core/ConsoleComponent'
import axios from 'axios'
import React, { useState, useRef } from 'react'
import { exportSVG } from './simulator/CommonFunction'
import QCEngine from './simulator/MyQCEngine'
import { range } from 'd3'

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
	const [editorValue, setEditorValue] = useState('')
	// console的内容
	const [consoleValue, setConsoleValue] = useState(null)
	// 编辑器输入
	function onChange(newValue) {
		setEditorValue(newValue)
	}

	// 选择改变编辑器的内容
	const selectChange = (value) => {
		// 自定义
		if (value === 'about:black') {
			setEditorValue('//please')
		} else {
			axios
				.get('/js/' + value + '.js')
				.then((res) => {
					setEditorValue(res.data)
				})
				.catch((error) => {
					setEditorValue('Not Found')
				})
		}
	}
	// 运行
	const runProgram = () => {
		try {
			let qc = new QCEngine()
			const { qint } = qc
			eval(editorValue)
			exportSVG(qc)
			// showInDebuggerArea(qc.circuit)

			// siwei: 两个函数的案例
			// range(0, qc.qubit_number).forEach((qubit) => {
				// console.log(qubit, qc.getQubit2Variable(qubit))
			// })
			// qc.labels.forEach((label) => {
			// 	console.log(label, qc.getLabelUpDown(label.id))
			// })
			consoleContent(true, qc.console_data)
		} catch (error) {
			consoleContent(false, error.message)
		}
	}
	// 处理console
	const consoleContent = (isTure, message) => {
		if (isTure) {
			const console_list = []
			for (let i = 0; i < message.length; i++) {
				console_list.push(<p key={i}>{message[i]}</p>)
			}
			setConsoleValue(<div className='right_content'>{console_list}</div>)
		} else {
			setConsoleValue(<div className='error_content'>{message}</div>)
		}
	}
	return (
		<div className='App'>
			<div className='left-div'>
				<Ace runProgram={runProgram} selectChange={selectChange} onChange={onChange} editorValue={editorValue}></Ace>
				<ConsoleComponent consoleValue={consoleValue}></ConsoleComponent>
			</div>
			<div className='right-div'>
				<Circuit></Circuit>
			</div>
		</div>
	)
}

export default App
