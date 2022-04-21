import React, { useState } from 'react'
import AdminLayout from './AdminLayout'
import '../adminStyles/AdminProject.css'
import { Input, Table } from 'antd'
import { Link } from 'react-router-dom'
const AdminProject = () => {
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
			title: '任务个数',
			dataIndex: 'address',
			key: 'address',
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
				return (
					<span>
						<a>查看任务详情</a>
						<a>删除</a>
					</span>
				)
			},
		},
	]

	const data = [
		{
			key: '1',
			name: 'John Brown',
			age: 32,
			address: 'New York No. 1 Lake Park',
			tags: ['nice', 'developer'],
		},
		{
			key: '2',
			name: 'Jim Green',
			age: 42,
			address: 'London No. 1 Lake Park',
			tags: ['loser'],
		},
		{
			key: '3',
			name: 'Joe Black',
			age: 32,
			address: 'Sidney No. 1 Lake Park',
			tags: ['cool', 'teacher'],
		},
	]
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
	return (
		<AdminLayout>
			<div className='admin_project_div'>
				<Input.Search style={{ width: '300px' }} placeholder='请输入项目名称' />
				<Table columns={columns} dataSource={data} pagination={pagination} />
			</div>
		</AdminLayout>
	)
}

export default AdminProject
