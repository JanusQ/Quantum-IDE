import React from 'react'
import { Menu, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isAuth } from '../../helpers/auth'
import '../styles/Layout.css'
function useActive(currentPath, path) {
	return currentPath === path ? 'active' : ''
}
const AdminNavigation = () => {
	const router = useSelector((state) => state.router)
	const pathname = router.location.pathname
	const isHome = useActive(pathname, '/home')
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
	// 下拉菜单
	const menu = (
		<Menu>
			<Menu.Item>
				<Link>个人中心</Link>
			</Menu.Item>
			<Menu.Item>
				<Link>修改密码</Link>
			</Menu.Item>
			<Menu.Item>
				<Link>退出登录</Link>
			</Menu.Item>
		</Menu>
	)
	return (
		<ul className='front_menu_list'>
			<li className={isHome}>
				<Link to='/home'>首页</Link>
			</li>
			<li>
				<Link to='/'>计算机列表</Link>
			</li>
			<li>
				<Link to='/'>项目管理</Link>
			</li>
			<li>
				<Link to='/'>参考文档</Link>
			</li>
			<li className='front_menu_user'>
				<Dropdown overlay={menu}>
					<a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
						<span className='front_user_name'>
							aaa
						</span>
						<DownOutlined />
						
					</a>
				</Dropdown>
			</li>
			
		</ul>
	)
}
export default AdminNavigation
