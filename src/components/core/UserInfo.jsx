import React from 'react'
import '../styles/UserInfo.css'
import { Button, Form, Input, message, Result, Select } from 'antd'
import { Link } from 'react-router-dom'

const UserInfo = () => {
	const { Option } = Select
	const onFinish = (value) => {}
	const userInfoForm = () => {
		return (
			<Form onFinish={onFinish} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} autoComplete='off'>
				<Form.Item
					label='用户名称：'
					name='username'
					rules={[
						{
							required: true,
							message: '请输入用户名',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label='手机号码：'
					name='telephone'
					rules={[
						{
							required: true,
							message: '请输入手机号',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label='电子邮箱：'
					name='email'
					rules={[
						{
							required: true,
							message: '请输入电子邮箱',
						},
						{
							type: 'email',
							message: '邮箱格式错误',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label='单位名称：'
					name='company_name'
					rules={[
						{
							required: true,
							message: '请输入单位名称',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label='单位类型：'
					name='company_type'
					rules={[{ required: true, message: '请选择单位类型' }]}
				>
					<Select placeholder='请选择单位类型'>
						<Option value='0'>科研院所</Option>
						<Option value='1'>学校</Option>
						<Option value='2'>企业</Option>
						<Option value='3'>个人</Option>
						<Option value='4'>其它</Option>
					</Select>
				</Form.Item>
				<Form.Item
					label='单位地址：'
					name='company_address'
					rules={[{ required: true, message: '请输入单位地址' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 5, span: 19 }}>
					<Button style={{ marginRight: '10px' }}>编辑</Button>
					<Button htmlType='submit'>保存</Button>
				</Form.Item>
			</Form>
		)
	}
	return (
		<div className='user_info_div'>
			<div className='user_info_title'>
				<span className='user_info_name'>基本信息</span>
			</div>
			<div className='user_info_content'>{userInfoForm()}</div>
		</div>
	)
}

export default UserInfo
