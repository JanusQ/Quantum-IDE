import SignLayout from './SignLayout'
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Result, Checkbox, message } from 'antd'
import { getCookie, isAuth, delCookie, setCookie } from '../../helpers/auth'
// import { Redirect } from 'react-router-dom'
import '../styles/SignIn.css'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../../api/auth'
import { useHistory } from 'react-router-dom'

const SignIn = () => {
	const history = useHistory()
	const onFinish = async (value) => {
		await login(value)
		message.success('登录成功')
		if (isRember) {
			setCookie('email', value.email, 7)
			setCookie('password', value.password, 7)
		}
		localStorage.setItem('jwt', JSON.stringify({ name: '123' }))
		history.push('/home')
	}
	const redirectToHome = () => {
		const auth = isAuth()
		// if (auth) {
		// 	return <Redirect to='/home'></Redirect>
		// }
	}
	// 记住密码
	const cookiePassword = getCookie('password')
	const cookieEmail = getCookie('email')
	const [form] = Form.useForm()
	const [isRember, setIsRember] = useState(false)
	const onCheckChange = (e) => {
		if (e.target.checked) {
			setIsRember(true)
		} else {
			setIsRember(false)
			delCookie('email')
			delCookie('password')
		}
	}
	const signinForm = () => {
		return (
			<div className='sign_in_form'>
				<p className='sign_in_title'>用户登录</p>
				<Form onFinish={onFinish} layout='vertical' autoComplete='off' form={form}>
					<Form.Item
						label='邮箱：'
						name='email'
						rules={[
							{ required: true, message: '请输入邮箱' },
							{ type: 'email', message: '邮箱格式错误' },
						]}
					>
						<Input placeholder='请输入您的邮箱' />
					</Form.Item>
					<Form.Item
						label='密码：'
						name='password'
						style={{ marginBottom: '10px' }}
						rules={[{ required: true, message: '请输入密码' }]}
					>
						<Input.Password placeholder='请输入您的密码' />
					</Form.Item>
					<Form.Item style={{ marginBottom: '10px' }}>
						<div className='sign_in_form_operation'>
							<Checkbox onChange={onCheckChange} checked={isRember}>
								记住密码
							</Checkbox>
							{/* <span style={{ float: 'right' }}>
								{' '}
								<Link to='/findPassword'>忘记密码？</Link>{' '}
							</span> */}
						</div>
					</Form.Item>
					<Form.Item style={{ marginBottom: '10px' }}>
						<Button htmlType='submit' style={{ width: '100%' }}>
							登录
						</Button>
					</Form.Item>
					<Form.Item>
						<p className='sign_in_to_signup'>
							<Link to='/signUp'>没有账号？立即注册</Link>
						</p>
					</Form.Item>
				</Form>
			</div>
		)
	}
	useEffect(() => {
		if (cookiePassword) {
			setIsRember(true)
			form.setFieldsValue({
				email: cookieEmail,
				password: cookiePassword,
			})
		}
	}, [])
	return (
		<SignLayout>
			{redirectToHome()}
			<div className='sign_in_div'>{signinForm()}</div>
		</SignLayout>
	)
}

export default SignIn
