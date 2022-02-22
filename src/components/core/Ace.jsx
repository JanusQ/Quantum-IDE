import React, { useState, useEffect } from 'react'
import AceEditor from 'react-ace'
import './Ace.css'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-github'
import { Button, Select, Modal } from 'antd'
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { createFile } from '../../simulator/CommonFunction'
import QCEngine from '../../simulator/MyQCEngine'
const Ace = (props) => {
	// 初始化字体
	const [fontSize, setFontSize] = useState(12)
	// 控制字体
	const controlFontSize = (type) => {
		if (type === 'add') {
			if (fontSize >= 12 && fontSize <= 40) {
				setFontSize(fontSize + 1)
			}
		} else {
			if (fontSize > 12) {
				setFontSize(fontSize - 1)
			}
		}
	}

	// 多个选择框
	const { Option } = Select
	const optionList = ['Adding two integers', 'ex7-7', 'ex7-1', 'eeeee', ]  // case的列表，public\js中需要存对应的文件
	const optionChildren = []
	for (let i = 0; i < optionList.length; i++) {
		optionChildren.push(
			<Option key={i} value={optionList[i]}>
				{optionList[i]}
			</Option>
		)
	}
	//导出
	const FileSaver = require('file-saver')
	const [isModalVisible, setIsModalVisible] = useState(false)
	const exportFile = () => {
		setIsModalVisible(true)
	}
	// 多个类型
	const typeArr = [
		{ name: 'SVG', type: 'svg' },
		{ name: 'JavaScript', type: 'js' },
	]
	const typeListChildren = []
	for (let i = 0; i < typeArr.length; i++) {
		typeListChildren.push(
			<li type={typeArr[i].type} key={i}>
				{typeArr[i].name}
			</li>
		)
	}
	// 导出选择类型
	const exportTypeClick = (e) => {
		const eEvent = e || window.event
		try {
			let qc = new QCEngine()
			const { qint } = qc
			eval(props.editorValue)
			const svg = createFile(qc.circuit, eEvent.target.type)
			let blob = new Blob([svg])
			FileSaver.saveAs(blob, `test.${eEvent.target.type}`)
			qc = null
		} catch (error) {
			console.log(error)
		}
	}
	// 弹出框事件
	const handleCancel = () => {
		setIsModalVisible(false)
	}
	useEffect(() => {
		props.selectChange(optionList[0])
	}, [])
	return (
		<div className='ace_div'>
			<div className='title'>QuCode</div>
			{/* 操作按钮 */}
			<div className='ace_operation'>
				<Button type='primary' size='small' onClick={props.runProgram}>
					Run Program
				</Button>
				<Select
					style={{ width: '30%', marginLeft: '10px' }}
					size='small'
					onChange={props.selectChange}
					defaultValue={optionList[0]}
				>
					{optionChildren}
				</Select>
				<Button size='small' style={{ marginLeft: '10px' }} onClick={exportFile}>
					Export
				</Button>
				<ZoomInOutlined
					style={{ marginLeft: '10%', cursor: 'pointer' }}
					onClick={() => {
						controlFontSize('add')
					}}
				/>
				<ZoomOutOutlined
					style={{ marginLeft: '5px', cursor: 'pointer' }}
					onClick={() => {
						controlFontSize('sub')
					}}
				/>
			</div>
			{/* ace编辑器 */}
			<AceEditor
				mode='javascript'
				theme='github'
				onChange={props.onChange}
				name='ACE-EDITOR'
				width='100%'
				height='60%'
				value={props.editorValue}
				showGutter={false}
				style={{ fontSize: fontSize + 'px' }}
				highlightActiveLine={false}
				setOptions={{
					wrap: true,
				}}
			/>
			{/* 导出弹框 */}
			<Modal title='Export' visible={isModalVisible} footer={null} onCancel={handleCancel}>
				<ul className='export_type_ul' onClick={exportTypeClick}>
					{typeListChildren}
				</ul>
			</Modal>
		</div>
	)
}
export default Ace
