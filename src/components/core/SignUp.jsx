import SignLayout from './SignLayout'
import React, { useEffect } from 'react'
import { Button, Form, Input, Result } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { resetSignup, signup } from '../../store/actions/auth.actions'
import { Link } from 'react-router-dom'
import { json } from 'd3'

const SignUp = () => {
	// 获取dispath
	const dispath = useDispatch()
	const auth = useSelector((state) => state.auth)
	const onFinish = (value) => {
		dispath(signup(value))
	}
	const [form] = Form.useForm()
	const showSuccess = () => {
		if (auth.signup.loaded && auth.signup.success) {
			return (
				<Result
					status='success'
					title='注册成功'
					extra={[
						<Button type='primary'>
							<Link to='/signin'>登录</Link>
						</Button>,
					]}
				/>
			)
		}
	}
	const showError = () => {
		if (auth.signup.loaded && !auth.signup.success) {
			return <Result status='error' title='注册失败' subTitle={auth.signup.message} />
		}
	}

	useEffect(() => {
		if (auth.signup.loaded && auth.signup.success) {
			form.resetFields()
		}
	}, [auth])
	useEffect(() => {
		return () => {
			dispath(resetSignup())
		}
	}, [])
	const signupForm = () => {
		return (
			<Form onFinish={onFinish} form={form}>
				<Form.Item label='昵称：' name='name'>
					<Input />
				</Form.Item>
				<Form.Item label='密码：' name='password'>
					<Input.Password />
				</Form.Item>
				<Form.Item label='邮箱：' name='email'>
					<Input />
				</Form.Item>
				<Form.Item>
					<Button type='primary' htmlType='submit'>
						注册
					</Button>
				</Form.Item>
			</Form>
		)
	}
	return (
		<SignLayout title='注册' subTitle=''>
			{showSuccess()}
			{showError()}
			{signupForm()}
		</SignLayout>
	)
}

export default SignUp
