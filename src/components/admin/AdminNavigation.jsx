import React, { useState, useEffect } from 'react'
import { Menu, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isAuth } from '../../helpers/auth'
import '../styles/Layout.css'
import { getRemainderList } from '../../api/remainder'
function useActive(currentPath, path) {
	return currentPath === path ? 'active' : ''
}
const AdminNavigation = () => {
	const history = useHistory()
	const router = useSelector((state) => state.router)
	const pathname = router.location.pathname
	const isHome = useActive(pathname, '/admin')
	const isProject = useActive(pathname, '/admin/project')
	const isAdminUser = useActive(pathname, '/admin/user')
	const isAdminNotice = useActive(pathname, '/admin/notice')
	const isAdminReferenceDoc = useActive(pathname, '/admin/referenceDoc')
	const isAdminOperationLog = useActive(pathname, "/admin/operation");
	const auth = isAuth()
	const [remainNum, setRemainNum] = useState(1)
	let interval = null
	const getRemainderListFn = async () => {
		const formData = new FormData()
		formData.append('user_id', auth.user_id)
		const { data } = await getRemainderList(formData)
		setRemainNum(data.remainder_list.length)
	}
	useEffect(() => {
		if (!interval) {
			getRemainderListFn()
			interval = setInterval(() => {
				getRemainderListFn()
			}, 5000)
		}
		return () => clearInterval(interval)
	}, [])
	const lookRemainder = () => {
		if (remainNum) {
			history.push('/message')
		}
	}
	const logOut = () => {
		localStorage.removeItem('jwt')
		history.push('/signin/1')
	}
	// 下拉菜单
	const menu = (
		<Menu>
			<Menu.Item key='1'>
				<Link to='/usercenter/1'>个人中心</Link>
			</Menu.Item>
			<Menu.Item key='2'>
				<Link to='/usercenter/2'>修改密码</Link>
			</Menu.Item>
			<Menu.Item onClick={logOut} key='3'>
				退出登录
			</Menu.Item>
		</Menu>
	)

	return (
    <>
      <ul className="front_menu_list">
        <li className={isHome}>
          <Link to="/admin">后台数据</Link>
        </li>
        {/* <li className={isComputer}>
				<Link to='/computer'>计算机列表</Link>
			</li> */}
        <li className={isProject}>
          <Link to="/admin/project">项目管理</Link>
        </li>
        <li className={isAdminUser}>
          <Link to="/admin/user">用户管理</Link>
        </li>
        <li className={isAdminNotice}>
          <Link to="/admin/notice">通知管理</Link>
        </li>
        <li className={isAdminReferenceDoc}>
          <Link to="/admin/referenceDoc">文档管理</Link>
        </li>
        <li className={isAdminOperationLog}>
          <Link to="/admin/operation">操作日志</Link>
        </li>
      </ul>

      <ul className="front_menu_list front_menu_list_second">
        <>
          <li className="front_menu_user">
            <Dropdown overlay={menu}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <span className="front_user_name">{auth.username}</span>
                <DownOutlined />
              </a>
            </Dropdown>
          </li>
          <li className="menu_notice_li">
            <span className="front_ling_dang" onClick={lookRemainder}></span>
            <span
              className="front_tip_num"
              style={{ display: remainNum > 0 ? "inline-block" : "none" }}
            >
              {remainNum}
            </span>
          </li>
        </>
      </ul>
    </>
  );
}
export default AdminNavigation
