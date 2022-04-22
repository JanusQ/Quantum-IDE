import React, { useState } from 'react'
import Layout from './Layout'
import { Table, Input, Select, Drawer } from 'antd'
import { Link } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import '../styles/Project.css'
import { recieve_from_real } from '../../api/test_circuit'
import { barChart } from '../../helpers/echartFn'
const Task = () => {
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
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: '项目名称',
			dataIndex: 'age',
			key: 'age',
			render: (text, record) => {
				return <Link to='/'>{text}</Link>
			},
		},
		{
			title: '计算机名称',
			dataIndex: 'address',
			key: 'address',
		},

		{
			title: '运行状态',
			dataIndex: 'step',
			key: 'step',
		},
		{
			title: '运行时长',
			dataIndex: 'step',
			key: 'step',
		},
		{
			title: '创建时间',
			dataIndex: 'step',
			key: 'step',
		},
		{
			title: '操作',
			dataIndex: 'step',
			key: 'step',
			render: (text, record) => {
				return <a onClick={lookResult}>查看结果</a>
			},
		},
	]

	const data = [
		{
			key: '1',
			name: '123',
			age: 32,
			address: '111',
			tags: ['nice', 'developer'],
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
	const [computerChart, setComputerChart] = useState(null)
	const compare = (property) => {
		return function (a, b) {
			const value1 = a[property]
			const value2 = b[property]
			return value1 - value2
		}
	}

	const lookResult = async () => {
		setVisible(true)
		const params = {}
		params.result_id = '528aa9a89f05409faa28d03970a22039'
		const { data } = await recieve_from_real(params)
		const echartsData = {
			yData: [],
			xData: [],
		}
		const dataKeys = Object.keys(data)
		const arr = []
		dataKeys.forEach((item) => {
			arr.push({ form: item, to: parseInt(item, 2) })
		})
		arr.sort(compare('to'))

		// dataKeys.sort
		arr.forEach((item) => {
			echartsData.yData.push(data[item.form])
			echartsData.xData.push(item.form)
		})
		if (!computerChart) {
			setComputerChart(barChart('computer_params_chart', echartsData, true))
		} else {
			barChart(computerChart, echartsData, false)
		}
	}
	const onClose = () => {
		setVisible(false)
	}
	return (
		<Layout>
			<div className='project_div'>
				<div className='project_search_div'>
					<Search style={{ width: 200 }} placeholder='请输入任务名称' onSearch={onSearch}></Search>
					<Select
						placeholder='请选择运行状态'
						style={{ width: 200, marginLeft: '20px' }}
						onChange={statusChange}
					>
						<Option value='1'>等待中</Option>
					</Select>
					{/* <Select
						placeholder='请选择项目阶段'
						style={{ width: 200, marginLeft: '20px' }}
						onChange={statusChange}
					>
						<Option value='1'>已启动</Option>
					</Select> */}
				</div>
				<Table columns={columns} dataSource={data} pagination={pagination} />
			</div>
			<Drawer title='quantum computer name' placement='right' onClose={onClose} visible={visible} width={900}>
				<div className='computer_params_div' id='computer_params_chart'></div>
				<div className='computer_number_div'>
					<p className='computer_number_title'>数据矫正</p>
					{/* <Table columns={columns} dataSource={data} bordered pagination={false} /> */}
				</div>
			</Drawer>
		</Layout>
	)
}

export default Task
