import logo from './logo.svg'
import './App.css'
import Ace from './components/core/Ace'
import Right from './components/core/Right'
import ConsoleComponent from './components/core/ConsoleComponent'
import axios from 'axios'
import React, { useState, useRef } from 'react'
import { exportSVG } from './simulator/CommonFunction'
import QCEngine from './simulator/MyQCEngine'
import {
    cos, sin, round, pi, complex, create, all, max, sparse,
} from 'mathjs'
import { pow2, binary, binary2qubit1, range, toPI, qubit12binary, unique, sum, alt_tensor, calibrate, getExp, linear_entropy, binary2int, average, spec} from './simulator/CommonFunction'
// import MathJax from 'mathJax'
import {getDirac} from './components/Mathjax'
import {send_to_real, recieve_from_real} from './api/test_circuit'

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
// import './test/istest.js'
// import './test/index.js';
// import './test/test_entropy';
// import './test/test_pmi.js'
// import './test/inout_state_test.js'
// import './test/evomatrix_test'
// import './test/variablefilter_test.js'
// import './test/setstatetest.js'
// import './test/canShow_test.js'

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
		if (value === 'about:blank') {
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
		let noBug = false
		let qc = new QCEngine()
		const { qint } = qc
		// TODO: 这些也要写在文档里面
		const {cos, sin, round, pi, complex, create, all, max, sparse, acos, asin, sqrt} =  require('mathjs')
		const { pow2, binary, binary2qubit1, range, toPI, qubit12binary, unique, sum, alt_tensor, calibrate, getExp, linear_entropy, binary2int, average, spec} = require('./simulator/CommonFunction')
		const {tensor, groundState, tensorState} = require('./simulator/MatrixOperation')

		// console.log(groundState(4, [7, 8]))
		// console.log()


		try {
			eval(editorValue)
			// showInDebuggerArea(qc.circuit)

			// siwei: 两个函数的案例
			// range(0, qc.qubit_number).forEach((qubit) => {
			// console.log(qubit, qc.getQubit2Variable(qubit))
			// })
			// qc.labels.forEach((label) => {
			// 	console.log(label, qc.getLabelUpDown(label.id))
			// })
			consoleContent(true, qc.console_data)
			noBug = true
		} catch (error) {
			consoleContent(false, error.message)
			noBug = false
			console.error(error)
		}
		if (noBug) {
			exportSVG(qc)
		}

		// 暂时测试一下
		
		//testfunc(qc)

	}
	async function testfunc(qc)
	{
		console.log(qc.export())
		let data = {}
		data['qasm'] = qc.export();
		data['sample'] = 1000;
		var id;
		id = await send_to_real(data);
		console.log(id['data']);
		let res = await recieve_from_real(id['data'])
		console.log(res)
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


	// console.log(getDirac(1))
	
	return (
		<div className='App'>
			<div className='left-div'>
				<Ace
					runProgram={runProgram}
					selectChange={selectChange}
					onChange={onChange}
					editorValue={editorValue}
				></Ace>
				<ConsoleComponent consoleValue={consoleValue}></ConsoleComponent>
			</div>
			<div className='right-div'>
				<Right></Right>
			</div>
		</div>
	)
}

export default App
