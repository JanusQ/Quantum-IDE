import React from 'react'
import Layout from './Layout'
import '../styles/UserCenter.css'
import { Route, Switch, Redirect, Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ResetPassword from './ResetPassword'
import UserInfo from './UserInfo'

function useActive(currentPath, path) {
	return currentPath === path ? 'active' : ''
}

const UserCenter = () => {
	const router = useSelector((state) => state.router)
	const history = useHistory()
	const pathname = router.location.pathname
	const isResetPassword = useActive(pathname, '/usercenter/resetPassword')
	const isUserInfo = useActive(pathname, '/usercenter/userInfo')
	const goto = (url) => {
		history.push(url)
	}
	return (
		<Layout>
			<div className='user_center'>
				<div className='user_center_left_menu'>
					<div className='user_center_left_menu_title'>个人中心</div>
					<ul className='user_center_left_menu_list'>
						<li className={isUserInfo} onClick={() => goto('/usercenter/userInfo')}>
							个人中心
						</li>
						<li className={isResetPassword} onClick={() => goto('/usercenter/resetPassword')}>
							修改密码
						</li>
					</ul>
				</div>
				<div className='user_center_right_menu'>
					<Switch>
						<Route path='/usercenter/userInfo' component={UserInfo}></Route>
						<Route path='/usercenter/resetPassword' component={ResetPassword}></Route>
						<Redirect from='/usercenter' to='/usercenter/userInfo'></Redirect>
					</Switch>
				</div>
			</div>
		</Layout>
	)
}

export default UserCenter
