import Layout from './Layout'
import React, { useEffect, useState } from 'react'
import '../styles/NoticeList.css'
import { Table } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { getNoticeList } from '../../api/notice'
import moment from 'moment'
const NoticeList = () => {
	const columns = [
		{
			title: '序号',
			dataIndex: 'index',
			render: (text, record, index) => {
				return (pagination.current - 1) * pagination.pageSize + index + 1
			},
		},
		{
			title: '公告标题',
			dataIndex: 'notice_title',
			key: 'notice_title',
			render: (text, record) => {
				return <a onClick={()=>lookDetail(record.notice_id)}>{text}</a>
			},
		},
		{
			title: '发布人',
			dataIndex: 'author',
			key: 'author',
		},
		{
			title: '发布时间',
			dataIndex: 'update_time',
			key: 'update_time',
			render:(text)=>{
				return moment(text).format('YYYY-MM-DD HH:MM:SS')
			}
		},
	]
	const history = useHistory()
	const lookDetail = (id)=>{
		history.push(`/noticedetail/${id}`)
	}
	useEffect(()=>{
		getNoticeListFn()
	},[])
	
	const [ noticeList,setNoticeList ] = useState([])
	const getNoticeListFn = async ()=>{
		const { data } = await getNoticeList()
		setNoticeList(data.notice_list)
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
	return (
		<Layout>
			<div className='notice_div'>
				<div className='notice_title'>通知列表</div>
				<Table columns={columns} dataSource={noticeList} pagination={false} />
			</div>
		</Layout>
	)
}

export default NoticeList
