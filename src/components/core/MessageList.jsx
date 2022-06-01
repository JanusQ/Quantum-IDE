import Layout from './Layout'
import React, { useState, useEffect } from 'react'
import '../styles/MessageList.css'
import { Table, Button, message, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { FolderOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { getRemainderList, readRemainder } from '../../api/remainder'
import { isAuth } from '../../helpers/auth'
import '../styles/CommonAntDesign.css'
import ComponentTitle from './ComponentTitle'
import moment from 'moment'
const MessageList = () => {
	const columns = [
		{
			title: '主题',
			dataIndex: 'remainder_title',
			key: 'remainder_title',
		},
		{
			title: '时间',
			dataIndex: 'remainder_time',
			key: 'remainder_time',
			render: (text) => {
				moment(text).format('YYYY-MM-DD HH:MM:SS')
			},
		},
	]
	const auth = isAuth()
	const [remainList, setRemainList] = useState([])
	const getRemainderListFn = async () => {
		const formData = new FormData()
		formData.append('user_id', auth.user_id)
		const { data } = await getRemainderList(formData)
		setRemainList(data.remainder_list)
		readRemainderFn(data.remainder_list)
	}
	// 用户读消息
	const readRemainderFn = async (data) => {
		const formData = new FormData()

		const arr = []
		data.forEach((item) => {
			arr.push({ remainder_id: item.remainder_id })
		})
		formData.append('user_id', auth.user_id)
		formData.append('remainder_list', JSON.stringify(arr))

		await readRemainder(formData)
	}
	useEffect(() => {
		getRemainderListFn()
	}, [])
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
			<ComponentTitle name='消息列表'></ComponentTitle>
			<div className='message_div'>
			
				<Table columns={columns} dataSource={remainList} pagination={false} />
			</div>
		</Layout>
	)
}

export default MessageList
