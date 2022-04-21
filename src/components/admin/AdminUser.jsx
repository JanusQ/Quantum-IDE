import React, { useState } from 'react'
import AdminLayout from './AdminLayout'
import '../adminStyles/AdminUser.css'
import { Input, Table, Select, Form, Row, Col, Button, Modal } from 'antd'
import { Link } from 'react-router-dom'
const AdminUser = () => {
	const { Option } = Select
	const columns = [
		{
			title: '序号',
			dataIndex: 'index',
			render: (text, record, index) => {
				return (pagination.current - 1) * pagination.pageSize + index + 1
			},
		},
		{
			title: '用户名称',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => {
				return <a onClick={showDetail}>{text}</a>
			},
		},
		{
			title: '用户类型',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: '单位名称',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: '单位类型',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: '状态',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: '联系方式',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: '创建时间',
			dataIndex: 'step',
			key: 'step',
		},
		{
			title: '最近登录时间',
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
						<a style={{ marginRight: '10px' }} onClick={edit}>
							编辑
						</a>
						<a onClick={deleteUser}>删除</a>
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
	const onFinish = (value) => {
		console.log(value)
	}
	const [form] = Form.useForm()
	const reset = () => {
		form.resetFields()
	}
	const searchDiv = () => {
		return (
			<div className='admin_user_search_div'>
				<Form onFinish={onFinish} form={form}>
					<Row gutter={24}>
						<Col span={6}>
							<Form.Item name='userName' label='用户名称'>
								<Input placeholder='请输入用户名称'></Input>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='conutName' label='单位名称'>
								<Input placeholder='请输入单位名称'></Input>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='userStatus' label='用户状态'>
								<Select>
									<Option>正常</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={6}>
							<Form.Item name='userType' label='用户类型'>
								<Select>
									<Option>正常</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='conutType' label='单位类型'>
								<Select>
									<Option>正常</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Button htmlType='submit' style={{ marginRight: '10px', width: '88px' }} type='primary'>
								查询
							</Button>
							<Button style={{ width: '88px' }} onClick={reset}>
								重置
							</Button>
						</Col>
					</Row>
				</Form>
			</div>
		)
	}
	// 用户详情
	const [isUserDetailVisible, setIsUserDetailVisible] = useState(false)
	const showDetail = () => {
		setIsUserDetailVisible(true)
	}
	const userDetailCancel = () => {
		setIsUserDetailVisible(false)
	}
	const userDetailModal = () => {
		return (
			<Modal visible={isUserDetailVisible} footer={null} onCancel={userDetailCancel} title='用户信息'>
				<p>用户名称：aaa</p>
				<p>单位类型：aaa</p>
				<p>联系方式：aaa</p>
				<p>邮箱地址：aaa</p>
			</Modal>
		)
	}
	// 编辑
	const [editForm] = Form.useForm()
	const [isEditModalVisible, setIsEditModalVisible] = useState(false)
	const edit = () => {
		setIsEditModalVisible(true)
	}
	const editCancel = () => {
		editForm.resetFields()
		setIsEditModalVisible(false)
	}
	const editOk = () => {
		editForm.validateFields().then((value) => {
			setIsEditModalVisible(false)
		})
	}

	const editModal = () => {
		return (
			<Modal visible={isEditModalVisible} onCancel={editCancel} onOk={editOk} title='用户信息' width={820}>
				<Form form={editForm} layout='vertical'>
					<Row gutter={24}>
						<Col span={12}>
							<Form.Item
								name='userName'
								label='用户名称:'
								rules={[
									{
										required: true,
										message: '请输入用户名称',
									},
								]}
							>
								<Input placeholder='请输入用户名称'></Input>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='conutName'
								label='用户类型:'
								rules={[
									{
										required: true,
										message: '选择用户类型',
									},
								]}
							>
								<Select>
									<Option>正常</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<Form.Item
								name='userName'
								label='密码:'
								rules={[
									{
										required: true,
										message: '请输入密码',
									},
								]}
							>
								<Input placeholder='请输入密码'></Input>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='conutName'
								label='用户状态:'
								rules={[
									{
										required: true,
										message: '选择用户状态',
									},
								]}
							>
								<Select>
									<Option>正常</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<Form.Item
								name='userName'
								label='联系方式:'
								rules={[
									{
										required: true,
										message: '请输入联系方式',
									},
								]}
							>
								<Input placeholder='请输入联系方式'></Input>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='userName'
								label='单位名称:'
								rules={[
									{
										required: true,
										message: '请输入单位名称',
									},
								]}
							>
								<Input placeholder='请输入单位名称'></Input>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<Form.Item
								name='userName'
								label='邮箱地址:'
								rules={[
									{
										required: true,
										message: '请输入邮箱地址',
									},
								]}
							>
								<Input placeholder='请输入邮箱地址'></Input>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='conutName'
								label='单位类型:'
								rules={[
									{
										required: true,
										message: '选择单位类型',
									},
								]}
							>
								<Select>
									<Option>正常</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<Form.Item
								name='userName'
								label='单位地址:'
								rules={[
									{
										required: true,
										message: '请输入单位地址',
									},
								]}
							>
								<Input placeholder='请输入单位地址'></Input>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		)
	}
	// 删除
	const deleteUser = () => {
		Modal.confirm({
			title: '确认删除？',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {},
		})
	}
	return (
		<AdminLayout>
			{searchDiv()}
			<div className='admin_user_div'>
				<Table columns={columns} dataSource={data} pagination={pagination} />
			</div>
			{userDetailModal()}
			{editModal()}
		</AdminLayout>
	)
}

export default AdminUser
