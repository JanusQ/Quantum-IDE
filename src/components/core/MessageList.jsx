import Layout from './Layout'
import React, { useState } from 'react'
import '../styles/MessageList.css'
import { Table, Button, message, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { FolderOutlined, FolderOpenOutlined } from '@ant-design/icons'
const MessageList = () => {
	const columns = [
		{
			title: '状态',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => {
				if (true) {
					return <FolderOpenOutlined />
				} else {
					return <FolderOutlined />
				}
			},
		},
		{
			title: '发件人',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: '主题',
			dataIndex: 'address',
			key: 'address',
			render: (text, record) => {
				return <Link to='/'>{text}</Link>
			},
		},
		{
			title: '时间',
			dataIndex: 'time',
			key: 'tiem',
		},
		{
			title: '操作',
			dataIndex: 'address',
			key: 'address',
			render: (text, record) => {
				return <a onClick={() => deleteItem(record.key)}>删除</a>
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
	const [selectedRowkeys, setSelectedRowkeys] = useState([])
	const rowSelectChange = (selectedRowKeys) => {
		setSelectedRowkeys(selectedRowKeys)
	}
	const rowSelection = {
		selectedRowkeys,
		onChange: rowSelectChange,
	}
	const deleteSelect = () => {
		if (!selectedRowkeys.length) {
			message.error('请至少选择一条数据')
			return
		}
		Modal.confirm({
			title: '确认删除？',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {
				console.log(selectedRowkeys)
			},
		})
		console.log(selectedRowkeys)
	}
	const deleteItem = (id) => {
		Modal.confirm({
			title: '确认删除？',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {
				console.log(id)
			},
		})
	}
	return (
		<Layout>
			<div className='message_div'>
				<div className='message_title'>消息列表</div>
				<div className='message_operation'>
					<Button style={{ float: 'right', marginTop: '3px' }} type='primary' onClick={deleteSelect}>
						删除
					</Button>
				</div>
				<Table columns={columns} dataSource={data} pagination={pagination} rowSelection={rowSelection} />
			</div>
		</Layout>
	)
}

export default MessageList
