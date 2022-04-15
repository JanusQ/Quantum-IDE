import SignLayout from './SignLayout'
import React from 'react'
import { Button, Form, Input, Result } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { signin } from '../../store/actions/auth.actions'
import { isAuth } from '../../helpers/auth'
import { Redirect } from 'react-router-dom'

const SignIn = () => {
	const dispath = useDispatch()
	const auth = useSelector((state) => state.auth)
	const state = useSelector((state) => state)
	const onFinish = (value) => {
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
	const signinForm = () => {
		return (
			<Form onFinish={onFinish}>
				<Form.Item label='密码：' name='password'>
					<Input.Password />
				</Form.Item>
				<Form.Item label='邮箱：' name='email'>
					<Input />
				</Form.Item>
				<Form.Item>
					<Button type='primary' htmlType='submit'>
						登录
					</Button>
				</Form.Item>
			</Form>
		)
	}
	return (
		<SignLayout>
			{showError()}
			{redirectToDashboard()}
			{signinForm()}
		</SignLayout>
	)
}

export default SignIn
