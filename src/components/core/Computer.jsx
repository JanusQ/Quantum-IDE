import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import '../styles/Computer.css'
import { Input, Drawer, Table, Modal } from 'antd'
import { getComList, getComDetil } from '../../api/computer'
import { drawGraphChart } from '../../helpers/graphEcharts'
import ComponentTitle from './ComponentTitle'
import '../styles/CommonAntDesign.css'
const Computer = () => {
	const [searchValue, setSearchValue] = useState('')
	const searchValueChange = (e) => {
		setSearchValue(e.target.value)
	}
	const { Search } = Input
	const onSearch = () => {
		getComListFn()
	}
	const columns = [
		{
			title: '量子位',
			dataIndex: 'name',
			align: 'center',
			key: 'name',
		},
		{
			title: 'single qubit error',
			dataIndex: 'value',
			key: 'value',
			align: 'center',
		},
	]
	const columns1 = [
		{
			title: '量子位',
			dataIndex: 'name',
			align: 'center',
			key: 'name',
		},
		{
			title: 'two qubit error',
			dataIndex: 'value',
			key: 'value',
			align: 'center',
		},
	]
	const [computerList, setComputerList] = useState([])
	const getComListFn = async () => {
		const formData = new FormData()
		const obj = {
			update_code: -1,
		}
		if (searchValue) {
			obj.com_name = searchValue
		}
		formData.append('filter', JSON.stringify(obj))
		const { data } = await getComList(formData)
		setComputerList(data.com_list)
		data.com_list.forEach((item) => {
			showDrawer(item.chip_id, `computer_graph_echarts_${item.chip_id}`, false)
		})
	}
	// 计算机详情
	const [visible, setVisible] = useState(false)

	const onClose = () => {
		setVisible(false)
	}
	const [computerDetail, setComputerDetail] = useState({})
	const [computerTable, setComputerTable] = useState([])
	const [computerTable1, setComputerTable1] = useState([])
	const showDrawer = async (id, element, isShowLineLabel) => {
		const formData = new FormData()
		formData.append('chip_id', id)
		const { data } = await getComDetil(formData)
		const qubits = data.computer.qubits
		const couplers = data.computer.couplers
		const validQubits = data.computer.valid_qubits
		const arr = []
		const arr1 = []
		const arrGraphNode = []
		const arrGraphLinks = []
		for (const key in qubits) {
			if (qubits[key].err !== null) {
				arr.push({
					name: key,
					value: qubits[key].err,
				})
			}
			arrGraphNode.push({
				color: validQubits.includes(qubits[key].bit_name) ? '#003FFF' : '#003f88',
				name: qubits[key].bit_name,
				x: qubits[key].position_x,
				y: qubits[key].position_y,
			})
		}
		for (const key in couplers) {
			if (couplers[key].err !== null) {
				arr1.push({
					name: `${couplers[key].qubit1_name},${couplers[key].qubit2_name}`,
					value: couplers[key].err,
				})
			}
			arrGraphLinks.push({
				color: 'red',
				source: couplers[key].qubit1_name,
				target: couplers[key].qubit2_name,
				label: {
					show: isShowLineLabel,
					formatter: (obj) => {
						return `${obj.data.source}-${obj.data.target}`
					},
					fontSize: 8,
				},
			})
		}
		if (element === 'computer_graph_echarts') {
			setVisible(true)
			setComputerDetail(data.computer)
			setComputerTable(arr)
			setComputerTable1(arr1)
			drawGraphChart('computer_graph_echarts', arrGraphNode, arrGraphLinks)
		} else {
			drawGraphChart(element, arrGraphNode, arrGraphLinks)
		}
	}
	useEffect(() => {
		getComListFn()
	}, [])
	const computerListDom = computerList.map((item) => (
		<div
			className='computer_item'
			onClick={() => showDrawer(item.chip_id, 'computer_graph_echarts', true)}
			key={item.chip_id}
		>
			<div className='computer_item_flex'>
				<div id={`computer_graph_echarts_${item.chip_id}`} style={{ width: '100%', height: '100%' }}></div>
			</div>
			<div className='computer_item_flex'>
				<div className='computer_name_title'>计算机名字</div>
				<div className='computer_name'>{item.chip_name}</div>
				<div className='computer_border'></div>
				<div className='computer_message'>
					<div className='computer_message_item'>
						<div className='computer_message_item_title' style={{ marginTop: '12px', marginBottom: '5px' }}>
							{item.com_status === 1 ? 'OFFLINE' : 'ONLINE'}
						</div>
						<div
							className='computer_message_item_content'
							style={{ textIndent: item.com_status === 1 ? '17px' : '16px' }}
						>
							STATUS
						</div>
					</div>
					<div className='computer_message_item'>
						<div
							className='computer_message_item_title'
							style={{ color: '#003f88', fontSize: '28px', textIndent: '3px' }}
						>
							{item.qubits_number}
						</div>
						<div className='computer_message_item_content'>QUBITS</div>
					</div>
					{/* <div className='computer_message_item'>
						<div className='computer_message_item_title'>{item.com_status === 1 ? 'OFFLINE' : 'ONLINE'}</div>
						<div className='computer_message_item_content'>AVG.T1</div>
					</div>
					<div className='computer_message_item'>
						<div className='computer_message_item_title'>{item.com_status === 1 ? 'OFFLINE' : 'ONLINE'}</div>
						<div className='computer_message_item_content'>STATUS</div>
					</div> */}
				</div>

				{/* <div style={{ marginBottom: '8px' }}>Number of qubits:{item.qubits_number}</div>
				<div className='computer_number'>
					<div className='computer_number_item'>
						<div className='compuer_number_name'>Qubites</div>
						<div className='compuer_number_contet'>{item.qubits_number}</div>
					</div>
				</div> */}
			</div>
		</div>
	))
	const handleCancel = () => {
		setVisible(false)
	}
	const computerDetailModal = () => {
		return (
			<Modal
				title={false}
				visible={visible}
				onCancel={handleCancel}
				footer={false}
				width={950}
				wrapClassName='computer_detail_modal'
			>
				<div className='computer_number_div'>
					<div className='computer_table_father'>
						<div className='computer_table_div'>
							<Table
								columns={columns}
								dataSource={computerTable}
								bordered
								pagination={false}
								rowKey='com_name'
							/>
						</div>
						<div className='computer_table_div'>
							<Table
								columns={columns1}
								dataSource={computerTable1}
								bordered
								pagination={false}
								rowKey='com_name'
							/>
						</div>
					</div>
				</div>
				<div className='computer_graph_div'>
					<div id='computer_graph_echarts'></div>
				</div>
			</Modal>
		)
	}
	return (
		<Layout>
			{/* <Search
				placeholder='请输入量子计算机名称进行检索'
				onSearch={onSearch}
				size='large'
				className='computer_search'
				value={searchValue}
				onChange={searchValueChange}
			/> */}
			<ComponentTitle name={'计算机列表'}></ComponentTitle>
			<div className='computer_list'>{computerListDom}</div>
			{computerDetailModal()}
			{/* <Drawer title={computerDetail.chip_name} placement='right' onClose={onClose} visible={visible} width={900}>
				<div className='computer_params_div'>
					<p style={{ fontSize: '16px' }}>参数</p>
					<div className='computer_params_detail'>
						<div className='computer_params_detail_div'>
							<div className='computer_params_detail_item'>
								<div className='computer_params_detail_num'>{computerDetail.qubits_number}</div>
								<div className='computer_params_detail_name'>Qubits</div>
							</div>
							<div className='computer_params_detail_item'>
								<div className='computer_params_detail_num'>64</div>
								<div className='computer_params_detail_name'>QV</div>
							</div>
							<div className='computer_params_detail_item'>
								<div className='computer_params_detail_num'>850</div>
								<div className='computer_params_detail_name'>CLOPS</div>
							</div>
						</div>
						<div>
							<div className='computer_params_right_item'>
								status:
								<span style={{ marginLeft: '5px' }}>
									{computerDetail.com_status === 1 ? 'offline' : 'online'}
								</span>
							</div>
							<div className='computer_params_right_item'>
								number of qubits: {computerDetail.qubits_number}
							</div>
							<div className='computer_params_right_item'>Avg.T1: {computerDetail.Avg_T1}</div>
							<div className='computer_params_right_item'>Avg.T2: {computerDetail.Avg_T2}</div>
						</div>
					</div>
				</div>
				<div className='computer_number_div'>
					<p className='computer_number_title'>数据校正</p>
					<div className='computer_table_father'>
						<div className='computer_table_div'>
							<Table
								columns={columns}
								dataSource={computerTable}
								bordered
								pagination={false}
								rowKey='com_name'
							/>
						</div>
						<div className='computer_table_div'>
							<Table
								columns={columns1}
								dataSource={computerTable1}
								bordered
								pagination={false}
								rowKey='com_name'
							/>
						</div>
					</div>
				</div>
				<div className='computer_graph_div'>
					<div id='computer_graph_echarts'></div>
				</div>
			</Drawer> */}
		</Layout>
	)
}

export default Computer
