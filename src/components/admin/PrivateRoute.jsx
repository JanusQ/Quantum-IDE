import { message } from 'antd'
import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { isAuth } from '../../helpers/auth'
// 登录之后才能访问的路由
const PrivateRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				const auth = isAuth()
				if (auth) {
					return <Component {...props} />
				}
				message.error('请先登录')
				return <Redirect to='/signin/1' />
			}}
		/>
	)
}

export default PrivateRoute
