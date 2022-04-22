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
	const isHome = useActive(pathname, '/admin')
	const isProject = useActive(pathname, '/admin/project')
	const isAdminUser = useActive(pathname, '/admin/user')
	const isAdminNotice = useActive(pathname, '/admin/notice')
	const isAdminReferenceDoc = useActive(pathname, '/admin/referenceDoc')
	const auth = isAuth()
	// 下拉菜单
	const menu = (
		<Menu>
			<Menu.Item>
				<Link to='/usercenter/userInfo'>个人中心</Link>
			</Menu.Item>
			<Menu.Item>
				<Link to='/usercenter/resetPassword'>修改密码</Link>
			</Menu.Item>
			{/* <Menu.Item>
				<Link>退出登录</Link>
			</Menu.Item> */}
		</Menu>
	)
	return (
		<ul className='front_menu_list'>
			<li className={isHome}>
				<Link to='/admin'>首页</Link>
			</li>
			{/* <li className={isComputer}>
				<Link to='/computer'>计算机列表</Link>
			</li> */}
			<li className={isProject}>
				<Link to='/admin/project'>项目管理</Link>
			</li>
			<li className={isAdminUser}>
				<Link to='/admin/user'>用户管理</Link>
			</li>
			<li className={isAdminNotice}>
				<Link to='/admin/notice'>通知管理</Link>
			</li>
			<li className={isAdminReferenceDoc}>
				<Link to='/admin/referenceDoc'>文档管理</Link>
			</li>
			<li className='front_menu_user'>
				<Dropdown overlay={menu}>
					<a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
						<span className='front_user_name'>{auth.username}</span>
						<DownOutlined />
					</a>
				</Dropdown>
				<span className='front_ling_dang'></span>
				<span className='front_tip_num'>{1}</span>
			</li>
		</ul>
	)
}
export default AdminNavigation
