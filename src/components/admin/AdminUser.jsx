import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import '../adminStyles/AdminUser.css'
import { Input, Table, Select, Form, Row, Col, Button, Modal, message } from 'antd'
import { Link } from 'react-router-dom'
import {
	userTypeArr,
	userStatusArr,
	companyTypeArr,
	userTypeName,
	companyName,
	userStatusName,
} from '../../helpers/auth'
import '../styles/CommonAntDesign.css'
import ComponentTitle from '../core/ComponentTitle'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import '../styles/CommonAntDesign.css'
import { getUserList, adminUserDetailedInfo, updateUserAdmin, userDelete } from '../../api/adminAuth'
const AdminUser = () => {
	const { Option } = Select
	const getUserListFn = async () => {
		const params = {
			filter: form.getFieldsValue(),
			page_num: current,
			page_size: pageSizeNum,
		}

		const { data } = await getUserList(params)
		setUserData(JSON.parse(data.userlist))
		setTotal(data.userCount)
	}
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
			dataIndex: 'username',
			key: 'username',
			render: (text, record) => {
				return <a onClick={() => showDetail(record.user_id)}>{text}</a>
			},
		},
		{
			title: '用户类型',
			dataIndex: 'usertype',
			key: 'usertype',
			render: (text) => {
				return userTypeName(text)
			},
		},
		{
			title: '单位名称',
			dataIndex: 'company_name',
			key: 'company_name',
		},
		{
			title: '单位类型',
			dataIndex: 'company_type',
			key: 'company_type',
			render: (text) => {
				return companyName(text)
			},
		},
		{
			title: '状态',
			dataIndex: 'user_status',
			key: 'user_status',
			render: (text) => {
				return userStatusName(text)
			},
		},
		{
			title: '联系方式',
			dataIndex: 'telephone',
			key: 'telephone',
		},

		{
			title: '最近登录时间',
			dataIndex: 'last_login_time',
			key: 'last_login_time',
		},
		{
			title: '操作',
			dataIndex: 'step',
			key: 'step',
			render: (text, record) => {
				return (
					<span>
						<a style={{ marginRight: '10px' }} onClick={() => edit(record.user_id)}>
							编辑
						</a>
						<a onClick={() => deleteUser(record.user_id)}>删除</a>
					</span>
				)
			},
		},
	]
	const [userData, setUserData] = useState([])
	const [current, setCurrent] = useState(1)
	const [total, setTotal] = useState(0)
	const [pageSizeNum, setPageSize] = useState(10)
	const onChange = (page, pageSize) => {
		setCurrent(page)
		setPageSize(pageSize)
	}
	useEffect(() => {
		getUserListFn()
	}, [pageSizeNum, current])
	const pagination = {
		current: current,
		total: total,
		pageSize: pageSizeNum,
		onChange: onChange,
		size: 'small',
		pageSizeOptions: [10, 20, 30],
	}
	const onFinish = () => {
		setCurrent(1)
		getUserListFn()
	}
	const [form] = Form.useForm()
	const reset = () => {
		form.resetFields()
		setCurrent(1)
		getUserListFn()
	}
	const userTypeOperations = userTypeArr.map((item) => (
		<Option key={item.code} value={item.code}>
			{item.name}
		</Option>
	))
	const userStatusOperations = userStatusArr.map((item) => (
		<Option key={item.code} value={item.code}>
			{item.name}
		</Option>
	))
	const companyTypeOperations = companyTypeArr.map((item) => (
		<Option key={item.code} value={item.code}>
			{item.name}
		</Option>
	))
	const [visible, setVisible] = useState(false)
	const showSearch = () => {
		setVisible(!visible)
	}
	const searchDiv = () => {
		const layout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		}
		return (
			<div className='admin_user_search_div'>
				<div className='admin_user_search_title_div'>
					<div className='admin_user_search_title'>
						<span>搜索</span>
						<span className='admin_user_search_menu' onClick={showSearch}>
							填写信息
							<RightOutlined style={{ marginLeft: '7px', display: visible ? 'none' : 'inline-block' }} />
							<DownOutlined style={{ marginLeft: '7px', display: visible ? 'inline-block' : 'none' }} />
						</span>
					</div>
				</div>

				<div className='admin_user_search_content' style={{ display: visible ? 'block' : 'none' }}>
					<div className='admin_user_search_form'>
						<Form {...layout} onFinish={onFinish} form={form}>
							<Row gutter={24}>
								<Col span={6}>
									<Form.Item name='id' label='用户ID'>
										<Input placeholder='请输入用户id'></Input>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item name='username' label='用户名称'>
										<Input placeholder='请输入用户名称'></Input>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item name='company_name' label='单位名称'>
										<Input placeholder='请输入单位名称'></Input>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item name='user_status' label='用户状态'>
										<Select placeholder='请选择用户状态'>{userStatusOperations}</Select>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={24}>
								<Col span={6}>
									<Form.Item name='usertype' label='用户类型'>
										<Select placeholder='请选择用户类型'>{userTypeOperations}</Select>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item name='company_type' label='单位类型'>
										<Select placeholder='请选择单位类型'>{companyTypeOperations}</Select>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Button
										htmlType='submit'
										style={{ marginRight: '10px', width: '88px' }}
										type='primary'
									>
										查询
									</Button>
									<Button style={{ width: '88px' }} onClick={reset}>
										重置
									</Button>
								</Col>
							</Row>
						</Form>
					</div>
				</div>
			</div>
		)
	}
	// 用户详情
	const [isUserDetailVisible, setIsUserDetailVisible] = useState(false)
	const [userDetail, setUserDetail] = useState({})
	const showDetail = async (id) => {
		const params = {}
		params.user_id = id
		const { data } = await adminUserDetailedInfo(params)
		setUserDetail(data)
		setIsUserDetailVisible(true)
	}
	const userDetailCancel = () => {
		setIsUserDetailVisible(false)
	}
	const userDetailModal = () => {
		return (
			<Modal visible={isUserDetailVisible} footer={null} onCancel={userDetailCancel} title='用户信息'>
				<p>用户名称：{userDetail.username}</p>
				<p>单位类型：{userDetail.company_name}</p>
				<p>联系方式：{userDetail.telephone}</p>
				<p>邮箱地址：{userDetail.email}</p>
			</Modal>
		)
	}
	// 编辑
	const [editForm] = Form.useForm()
	const [isEditModalVisible, setIsEditModalVisible] = useState(false)
	const [editid, setEditId] = useState(0)
	const edit = async (id) => {
		setIsEditModalVisible(true)
		const params = {}
		params.user_id = id
		const { data } = await adminUserDetailedInfo(params)
		setEditId(id)
		editForm.setFieldsValue(data)
	}

	const editCancel = () => {
		editForm.resetFields()
		setIsEditModalVisible(false)
	}
	const editOk = () => {
		editForm.validateFields().then(async (value) => {
			value.user_id = editid
			await updateUserAdmin(value)
			message.success('修改成功')
			getUserListFn()
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
								name='username'
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
								name='user_type'
								label='用户类型:'
								rules={[
									{
										required: true,
										message: '选择用户类型',
									},
								]}
							>
								<Select>{userTypeOperations}</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<Form.Item
								name='password'
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
								name='user_status'
								label='用户状态:'
								rules={[
									{
										required: true,
										message: '选择用户状态',
									},
								]}
							>
								<Select>{userStatusOperations}</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<Form.Item
								name='telephone'
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
								name='company_name'
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
								name='email'
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
								name='company_type'
								label='单位类型:'
								rules={[
									{
										required: true,
										message: '选择单位类型',
									},
								]}
							>
								<Select>{companyTypeOperations}</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<Form.Item
								name='company_address'
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
	const deleteUser = (id) => {
		Modal.confirm({
			title: '确认删除？',
			okText: '确认',
			cancelText: '取消',
			onOk: async () => {
				const params = {
					user_id: id,
				}
				await userDelete(params)
				message.success('已删除')
				getUserListFn()
			},
		})
	}
	return (
		<AdminLayout isAdminUser={true}>
			{searchDiv()}
			<ComponentTitle name={'用户管理'}></ComponentTitle>

			<div className='admin_user_div'>
				<Table columns={columns} dataSource={userData} pagination={pagination} rowKey='user_id' />
			</div>
			{userDetailModal()}
			{editModal()}
		</AdminLayout>
	)
}

export default AdminUser
