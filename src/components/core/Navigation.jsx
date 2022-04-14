import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isAuth } from '../../helpers/auth'
function useActive(currentPath, path) {
	return currentPath === path ? 'ant-menu-item-selected' : ''
}
const Navigation = () => {
	const router = useSelector((state) => state.router)
	const pathname = router.location.pathname
	const isHome = useActive(pathname, '/')
	const isShop = useActive(pathname, '/shop')
	const isApp = useActive(pathname, '/app')
	const isSignIn = useActive(pathname, '/signIn')
	const isSignUp = useActive(pathname, '/signUp')
	const isDashboard = useActive(pathname, getDashboarUrl())
	function getDashboarUrl() {
		let url = '/user/dashboard'
		if (isAuth()) {
			const {
				user: { role },
			} = isAuth()
			if (role === 1) {
				url = '/admin/dashboard'
			}
		}
		return url
	}
	return (
		<Menu mode='horizontal' selectable={false}>
			<Menu.Item className={isHome}>
				<Link to='/'>首页</Link>
			</Menu.Item>
			<Menu.Item className={isApp}>
				<Link to='/computer'>计算</Link>
			</Menu.Item>
			{!isAuth() && (
				<>
					<Menu.Item className={isSignIn}>
						<Link to='/signIn'>登录</Link>
					</Menu.Item>
					<Menu.Item className={isSignUp}>
						<Link to='/signUp'>注册</Link>
					</Menu.Item>
				</>
			)}
			{isAuth() && (
				<>
					<Menu.Item className={isDashboard}>
						<Link to={getDashboarUrl()}>dashboard</Link>
					</Menu.Item>
				</>
			)}
		</Menu>
	)
}
export default Navigation
