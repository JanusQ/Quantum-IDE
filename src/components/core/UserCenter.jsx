import React from 'react'
import Layout from './Layout'
import '../styles/UserCenter.css'
import Routes  from '../../Routes'
const UserCenter = () => {
	return (
		<Layout>
			<div className='user_center'>
				<div className='user_center_left_menu'>
					<div className='user_center_left_menu_title'>个人中心</div>
					<ul className='user_center_left_menu_list'>
						<li className='active'>基本信息</li>
						<li>修改密码</li>
					</ul>
				</div>
				<div className='user_center_right_menu'>
					<Routes />
				</div>
			</div>
		</Layout>
	)
}

export default UserCenter
