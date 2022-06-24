import logo from './logo.svg'
import './App.css'
import Ace from './components/core/Ace'
import Right from './components/core/Right'
import ConsoleComponent from './components/core/ConsoleComponent'
import axios from 'axios'
import React, { useState, useRef } from 'react'
import { exportSVG } from './simulator/CommonFunction'
import QCEngine from './simulator/MyQCEngine'
import { cos, sin, round, pi, complex, create, all, max, sparse } from 'mathjs'
import {
	pow2,
	binary,
	binary2qubit1,
	range,
	toPI,
	qubit12binary,
	unique,
	sum,
	alt_tensor,
	calibrate,
	getExp,
	linear_entropy,
	binary2int,
	average,
	spec,
} from './simulator/CommonFunction'
// import MathJax from 'mathJax'
import { getDirac } from './components/Mathjax'

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
	const [qcGlob, setQcGbol] = useState(null)
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
	const runProgram = (sample) => {
		let noBug = false
		let qc = new QCEngine()

		const { qint } = qc
		// TODO: 这些也要写在文档里面
		const { cos, sin, round, pi, complex, create, all, max, sparse, acos, asin, sqrt } = require('mathjs')
		const {
			pow2,
			binary,
			binary2qubit1,
			range,
			toPI,
			qubit12binary,
			unique,
			sum,
			alt_tensor,
			calibrate,
			getExp,
			linear_entropy,
			binary2int,
			average,
			spec,
		} = require('./simulator/CommonFunction')
		const { tensor, groundState, tensorState } = require('./simulator/MatrixOperation')

		// bind function
		let gates = ['cx','cy','cz','ch','csrn','cr2','cr4','cr8','crx','cry','crz','cu1','cu2',
		'cu3','cs','ct','csdg','ctdg','ccx','id','x','y','z','h','srn','srndg','r2','r4','r8','s','t','sdg','tdg',
		'rx','ry','rz','u1','u2','u3','swap','iswap','srswap','xy','ms','yy','zz','had','hadamard','not', 'reset','cnot',
		'phase','startlabel','endlabel','ccnot','ncnot','ncphase','qprint'];
		var cx,cy,cz,ch,csrn,cr2,cr4,cr8,crx,cry,crz,cu1,cu2,cu3,cs,ct,csdg,ctdg,ccx,id,x,y,z,h,srn,srndg,r2,r4,r8,s,t,sdg,
		tdg,rx,ry,rz,u1,u2,u3,swap,iswap,srswap,xy,ms,yy,zz,had,hadamard,not,reset,cnot,phase,startlabel,endlabel,
		ccnot,ncnot,ncphase,qprint;
		//let gates =['had']
		let bind_str = 'gate_name = qc.gate_name.bind(qc);\n ';
		let bind_str_all = '';
		for(let ind=0; ind<gates.length; ind++)
		{
			let gate = gates[ind];
			bind_str_all += bind_str.replace(/gate_name/g, gate);

		}
		console.log(bind_str_all)
		eval(bind_str_all)

		try {
			eval(editorValue)
			consoleContent(true, qc.console_data)
			noBug = true
		} catch (error) {
			consoleContent(false, error.message)
			noBug = false
		}
		if (noBug) {
			qc.runCircuit()
			setQcGbol(qc)
			
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
				<Right qc={qcGlob}></Right>
			</div>
		</div>
	)
}

export default App
