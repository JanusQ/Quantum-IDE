import SignLayout from './SignLayout'
import React, { useEffect } from 'react'
import { Button, Form, Input, message, Result, Select } from 'antd'
import { resetSignup, signup } from '../../store/actions/auth.actions'
import { Link, useHistory } from 'react-router-dom'
import { json } from 'd3'
import '../styles/Signup.css'
import { register } from '../../api/auth'

const SignUp = () => {
	const { Option } = Select
	const [form] = Form.useForm()

	const history = useHistory()
	// 获取dispath

	const onFinish = async (value) => {
		await register(value)
		message.success('注册成功')
		form.resetFields()
		history.push('/signIn')
	}

	const signupForm = () => {
		return (
			<div className='sign_up_form'>
				<div className='sign_up_form_item'></div>
				<div className='sign_up_form_item'>
					<Form
						onFinish={onFinish}
						form={form}
						labelCol={{ span: 5 }}
						wrapperCol={{ span: 19 }}
						autoComplete='off'
					>
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
							<Button htmlType='submit'>注册</Button>
						</Form.Item>
						<Form.Item wrapperCol={{ offset: 5, span: 19 }}>
							<div>
								<span style={{ float: 'right' }} className='signup_to_in'>
									<Link to='/signIn'>已经有账户了？点击登录</Link>
								</span>
							</div>
						</Form.Item>
					</Form>
				</div>
			</div>
		)
	}
	return (
		<SignLayout>
			{/* {showSuccess()}
			{showError()} */}
			<div className='sign_up_div'>{signupForm()}</div>
		</SignLayout>
	)
}

export default SignUp
