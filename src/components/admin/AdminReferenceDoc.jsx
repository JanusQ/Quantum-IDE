import AdminLayout from './AdminLayout'
import React, { useState, useEffect } from 'react'
import '../adminStyles/AdminNotice.css'
import { Table, Button, Modal, Form, Input, Upload } from 'antd'
import { Link } from 'react-router-dom'
import { UploadOutlined } from '@ant-design/icons'
const AdminReferenceDoc = () => {
	const columns = [
		{
			title: '序号',
			dataIndex: 'index',
			render: (text, record, index) => {
				return (pagination.current - 1) * pagination.pageSize + index + 1
			},
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => {
				return <Link to='/'>{text}</Link>
			},
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
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
	const [isAddModalVisible, setIsAddModalVisible] = useState(false)
	const addCancel = () => {
		setIsAddModalVisible(false)
	}
	const addOk = () => {
		addForm.validateFields().then((value) => {
			console.log(value.file.file)
			setIsAddModalVisible(false)
		})
	}
	const [addForm] = Form.useForm()
	const [fileList, setFileList] = useState([])
	const uploadChange = (info) => {
		let fileList = [...info.fileList]
		fileList = fileList.slice(-1)
		setFileList(fileList)
	}
	const beforeUpload = (file) => {
		return false
	}
	const removeFile = () => {
		addForm.resetFields()
	}
	const addModal = () => {
		return (
			<Modal visible={isAddModalVisible} onCancel={addCancel} onOk={addOk} title='添加文档' width={820}>
				<Form form={addForm} layout='vertical'>
					<Form.Item
						name='referenceName'
						label='文档标题'
						rules={[{ required: true, message: '请输入文档标题' }]}
					>
						<Input></Input>
					</Form.Item>
					<Form.Item label='文档上传' name='file' rules={[{ required: true, message: '请选择上传文档' }]}>
						<Upload
							multiple={false}
							fileList={fileList}
							onChange={uploadChange}
							beforeUpload={beforeUpload}
							onRemove={removeFile}
						>
							<Button icon={<UploadOutlined />}>Upload</Button>
						</Upload>
					</Form.Item>
				</Form>
			</Modal>
		)
	}
	const addNotice = () => {
		setIsAddModalVisible(true)
	}

	return (
		<AdminLayout>
			<div className='admin_notice_operation'>
				<Button type='primary' onClick={addNotice}>
					添加
				</Button>
			</div>
			<div className='admin_notice_div'>
				<Table columns={columns} dataSource={data} pagination={pagination} />
			</div>
			{addModal()}
		</AdminLayout>
	)
}

export default AdminReferenceDoc
