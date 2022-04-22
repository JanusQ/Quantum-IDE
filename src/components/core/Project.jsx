import React, { useState } from 'react'
import Layout from './Layout'
import { Table, Input, Select, Drawer } from 'antd'
import { Link } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import '../styles/Project.css'
import { drawGraphChart } from '../../helpers/graphEcharts'
import { useHistory } from 'react-router-dom'
const Project = () => {
	const history = useHistory()
	const columns = [
		{
			title: '序号',
			dataIndex: 'index',
			render: (text, record, index) => {
				return (pagination.current - 1) * pagination.pageSize + index + 1
			},
		},
		{
			title: '项目编号',
			dataIndex: 'num',
			key: 'num',
		},
		{
			title: '项目名称',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => {
				return <Link to='/'>{text}</Link>
			},
		},
		{
			title: '任务个数',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: '创建时间',
			dataIndex: 'time',
			key: 'time',
		},
		{
			title: '操作',
			dataIndex: 'step',
			key: 'step',
			render: (text, record) => {
				return (
					<span>
						<a onClick={lookTask} style={{ marginRight: '5px' }}>
							查看任务详情
						</a>
						<a>删除</a>
					</span>
				)
			},
		},
	]

	const data = [
		{
			key: '1',
			name: 'test',
			num: '1',
			age: 1,
			time: '2022-04-22',
		},
	]
	const { Search } = Input
	const { Option } = Select
	const onSearch = (value) => {
		console.log(value)
	}
	const statusChange = (value) => {
		console.log(value)
	}
	const [current, setCurrent] = useState(1)
	const [total, setTotal] = useState(100)
	const [pageSize, setPageSize] = useState(10)
	const onChange = (page, pageSize) => {
		setPageSize(pageSize)
		setCurrent(page)
	}
	const pagination = {
		current: current,
		total: total,
		pageSize: pageSize,
		onChange: onChange,
		showTotal: (total) => `共 ${total} 条数据`,
		showQuickJumper: true,
	}
	const [visible, setVisible] = useState(false)
	const lookTask = () => {
		// setVisible(true)
		// setTimeout(() => {
		// 	drawGraphChart('computer_params_graph')
		// }, 1000)
		history.push('/task')
	}
	const onClose = () => {
		setVisible(false)
	}
	return (
		<Layout>
			<div className='project_div'>
				<div className='project_search_div'>
					<Search style={{ width: 200 }} placeholder='请输入项目名称' onSearch={onSearch}></Search>
					<Select
						placeholder='请选择运行状态'
						style={{ width: 200, marginLeft: '20px' }}
						onChange={statusChange}
					>
						<Option value='1'>等待中</Option>
					</Select>
					<Select
						placeholder='请选择项目阶段'
						style={{ width: 200, marginLeft: '20px' }}
						onChange={statusChange}
					>
						<Option value='1'>已启动</Option>
					</Select>
				</div>
				<Table columns={columns} dataSource={data} pagination={pagination} />
			</div>
			<Drawer title='quantum computer name' placement='right' onClose={onClose} visible={visible} width={900}>
				<div className='computer_params_div'>
					<p style={{ fontSize: '16px' }}>参数</p>
					<div className='computer_params_detail'>
						<div className='computer_params_detail_div'>
							<div className='computer_params_detail_item'>
								<div className='computer_params_detail_num'>127</div>
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
							<div className='computer_params_right_item'>status:online</div>
							<div className='computer_params_right_item'>number of qubits: 40</div>
							<div className='computer_params_right_item'>Avg.T1: xxx us</div>
							<div className='computer_params_right_item'>Avg.T2: xxx us</div>
						</div>
					</div>
				</div>
				{/* <div className='computer_number_div'>
					<p className='computer_number_title'>数据矫正</p>
					<Table columns={columns} dataSource={data} bordered pagination={false} />
				</div> */}
				<div id='computer_params_graph' style={{ height: '300px', width: '100%' }}></div>
			</Drawer>
		</Layout>
	)
}

export default Project
