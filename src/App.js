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
import Layout from './components/core/Layout'
import { Modal, Checkbox, message, Input, Radio } from 'antd'
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
		
		testfunc(qc)

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
	const leftOperations = () => {
		return (
			<div className='computer_left_operation'>
				<ul>
					<li>
						<span className='computer_left_operation_item' onClick={saveCase}></span>
					</li>
					<li>
						<span className='computer_left_operation_item' onClick={selectRun}></span>
					</li>
					<li>
						<span className='computer_left_operation_item' onClick={selectShow}></span>
					</li>
				</ul>
			</div>
		)
	}
	// 控制显示视图
	const [isSelectShowModalVisible, setIsSelectModalVisible] = useState(false)
	const options = [
		{
			label: 'B视图',
			value: 'B',
		},
		{
			label: 'C视图',
			value: 'C',
		},
		{
			label: 'D视图',
			value: 'D',
		},
	]
	const [checkedModeList, setCheckedModeList] = useState(['B', 'C', 'D'])
	const onModeChange = (list) => {
		setCheckedModeList(list)
	}
	const selectShowModal = () => {
		return (
			<Modal
				visible={isSelectShowModalVisible}
				onOk={isSelectShowOk}
				onCancel={isSelectShowCancel}
				title='选择视图'
			>
				<p>选择视图展示</p>
				<Checkbox.Group options={options} value={checkedModeList} onChange={onModeChange}></Checkbox.Group>
			</Modal>
		)
	}
	const selectShow = () => {
		setIsSelectModalVisible(true)
	}
	const isSelectShowOk = () => {
		setIsSelectModalVisible(false)
		isShowRight()
		// isShowA()
		isShowB()
		isShowC()
		isShowD()
	}
	const isSelectShowCancel = () => {
		setIsSelectModalVisible(false)
	}
	const [isShowAMode, setIsShowAMode] = useState(true)
	const [isShowBMode, setIsShowBMode] = useState(true)
	const [isShowCMode, setIsShowCMode] = useState(true)
	const [isShowDMode, setIsShowDMode] = useState(true)
	const [isShowRightMode, setIsShowRightMode] = useState(true)
	const isShowA = () => {
		return setIsShowAMode(checkedModeList.includes('A'))
	}
	const isShowB = () => {
		return setIsShowBMode(checkedModeList.includes('B'))
	}
	const isShowC = () => {
		return setIsShowCMode(checkedModeList.includes('C'))
	}
	const isShowD = () => {
		return setIsShowDMode(checkedModeList.includes('D'))
	}
	const isShowRight = () => {
		if (!checkedModeList.includes('C') && !checkedModeList.includes('B') && !checkedModeList.includes('D')) {
			setIsShowRightMode(false)
		} else {
			setIsShowRightMode(true)
		}
	}
	// 保存项目
	const [isSaveCaseModalVisible, setIsSaveCaseModalVisible] = useState(false)
	const [caseName, setCaseName] = useState('')
	const onSaveChange = (e) => {
		setCaseName(e.target.value)
	}
	const saveCaseModal = () => {
		return (
			<Modal visible={isSaveCaseModalVisible} onOk={isSaveOk} onCancel={isSaveCancel} title='保存项目'>
				<p>项目名称</p>
				<Input value={caseName} onChange={onSaveChange}></Input>
			</Modal>
		)
	}
	const isSaveOk = () => {
		if (!caseName) {
			message.error('请输入项目名称')
			return
		}
		console.log(caseName)
		setIsSaveCaseModalVisible(false)
	}
	const isSaveCancel = () => {
		setIsSaveCaseModalVisible(false)
		setCaseName('')
	}
	const saveCase = () => {
		setIsSaveCaseModalVisible(true)
	}
	// 真机 模拟器切换
	const [isSelectRunModalVisible, setIsSelectRunModalVisible] = useState(false)
	const [runValue, setRunValue] = React.useState(2)
	const onSelectRunChange = (e) => {
		setRunValue(e.target.value)
	}
	const selectRunModal = () => {
		return (
			<Modal visible={isSelectRunModalVisible} onOk={isSelectRunOk} onCancel={isSelectRunCancel} title='切换模式'>
				<p>请选择模式</p>
				<Radio.Group onChange={onSelectRunChange} value={runValue}>
					<Radio value={1}>真机</Radio>
					<Radio value={2}>模拟器</Radio>
				</Radio.Group>
			</Modal>
		)
	}

	const isSelectRunOk = () => {
		setIsSelectRunModalVisible(false)
	}
	const selectRun = () => {
		setIsSelectRunModalVisible(true)
	}
	const isSelectRunCancel = () => {
		setIsSelectRunModalVisible(false)
	}
	return (
		<Layout isComputer={true}>
			{leftOperations()}
			<div className='App'>
				<div
					className='left-div'
					style={{
						display: isShowAMode ? 'block' : 'none',
						width: isShowRightMode ? '28%' : '100%',
						marginRight: isShowRightMode ? '5px' : '0',
					}}
				>
					<Ace
						runProgram={runProgram}
						selectChange={selectChange}
						onChange={onChange}
						editorValue={editorValue}
					></Ace>
					<ConsoleComponent consoleValue={consoleValue}></ConsoleComponent>
				</div>
				<div
					className='right-div'
					style={{
						width: isShowAMode ? 'calc(72% - 5px)' : '100%',
						display: isShowRightMode ? 'block' : 'none',
					}}
				>
					<Right isShowBMode={isShowBMode} isShowCMode={isShowCMode} isShowDMode={isShowDMode}></Right>
				</div>
			</div>
			{selectShowModal()}
			{saveCaseModal()}
			{selectRunModal()}
		</Layout>
	)
}

export default App
