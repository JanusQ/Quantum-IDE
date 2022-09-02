import { message } from 'antd'
import { stubString } from 'lodash'
import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { isAuth } from '../../helpers/auth'
import { submitLog } from '../../util/submitLog'
// 登录之后才能访问的路由
const PrivateRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				// 如果不是管理员账户且要进入后台管理系统 拦截到首页
				submitLog(props.location.pathname,'进入页面','','','')
				const admin = props.location.pathname.substring(1, 6);
				const auth = isAuth()
				if(auth.user_type!==0 && admin==='admin'){
					return <Redirect to='/'></Redirect>
				}
				if (auth) {
					// if(auth.user_type!==i)
					return <Component {...props} />
				}
				message.error('请先登录')
				return <Redirect to='/signin/1' />
			}}
		/>
	)
}

export default PrivateRoute
