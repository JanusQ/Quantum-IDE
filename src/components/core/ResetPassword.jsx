import React from 'react'
import '../styles/UserInfo.css'
import { Button, Form, Input, message, Result, Select } from 'antd'
import { Link } from 'react-router-dom'

const ResetPassword = () => {
	const { Option } = Select
	const onFinish = (value) => {}
	const userInfoForm = () => {
		return (
			<Form onFinish={onFinish}  labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} autoComplete='off'>
				<Form.Item
					label='原始密码：'
					name='password'
					rules={[
						{
							required: true,
							message: '请输入原始密码',
						},
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label='密码：'
					name='password'
					rules={[
						{
							required: true,
							message: '请输入密码',
						},
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label='确认密码：'
					name='confirm'
					rules={[
						{
							required: true,
							message: '请确认密码',
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('password') === value) {
									return Promise.resolve()
								}
								return Promise.reject(new Error('两次输入的密码不一致'))
							},
						}),
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 5, span: 19 }}>
					<Button style={{ marginRight: '10px' }}>编辑</Button>
					<Button htmlType='submit' type='primary'>
						保存
					</Button>
				</Form.Item>
			</Form>
		)
	}
	return (
		<div className='user_info_div'>
			<div className='user_info_title'>
				<span className='user_info_name'>修改密码</span>
			</div>
			<div className='user_info_content'>{userInfoForm()}</div>
		</div>
	)
}

export default ResetPassword
