import SignLayout from './SignLayout'
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Result, Checkbox } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { signin } from '../../store/actions/auth.actions'
import { getCookie, isAuth } from '../../helpers/auth'
import { Redirect } from 'react-router-dom'
import '../styles/Common.css'
import '../styles/SignIn.css'
import { delCookie } from '../../helpers/auth'
import { Link } from 'react-router-dom'
const SignIn = () => {
	const dispath = useDispatch()
	const auth = useSelector((state) => state.auth)
	const state = useSelector((state) => state)
	const onFinish = (value) => {
		value.isRember = isRember
		dispath(signin(value))
	}
	const showError = () => {
		if (auth.signin.loaded && !auth.signin.success) {
			return <Result status='error' title='登录失败' subTitle={auth.signin.message} />
		}
	}
	const redirectToDashboard = () => {
		const auth = isAuth()
		if (auth) {
			const {
				user: { role },
			} = auth
			if (role === 0) {
				return <Redirect to='/user/dashboard'></Redirect>
			} else {
				return <Redirect to='/admin/dashboard'></Redirect>
			}
		}
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
					<Form.Item label='用户名：' name='email' rules={[{ required: true, message: '请输入用户名' }]}>
						<Input placeholder='请输入您的用户名' />
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
							<span style={{ float: 'right' }}> <Link to="/findPassword">忘记密码？</Link> </span>
						</div>
					</Form.Item>
					<Form.Item style={{ marginBottom: '10px' }}>
						<Button htmlType='submit' style={{ width: '100%' }}>
							登录
						</Button>
					</Form.Item>
					<Form.Item>
						<p className='sign_in_to_signup'><Link to='/signUp'>没有账号？立即注册</Link></p>
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
			{/* {showError()} */}
			{/* {redirectToDashboard()} */}

			<div className='sign_div'>{signinForm()}</div>
		</SignLayout>
	)
}

export default SignIn
