import React from 'react'
import { useHistory } from 'react-router-dom'
import '../styles/Footer.css'
const Layout = ({ children, isLogin }) => {
	const history = useHistory()
	return (
		<div className='footer_div' style={{ display: isLogin ? 'none' : 'block' }}>
			<div className='footer_content'>
				<div className='footer_menu'>
					<ul>
						<li className='footer_menu_title'>
							<span>关于我们</span>
						</li>
						<li> <a href="http://physics.zju.edu.cn/">浙江大学物理学院</a> </li>
						<li><a href="http://www.cs.zju.edu.cn/">浙江大学计算机学院</a> </li>
					</ul>
					<ul>
						<li className='footer_menu_title'>
							<span>用户指南</span>
						</li>
						<li>用户指南</li>
						<li></li>
					</ul>
					<ul>
						<li className='footer_menu_title'>
							<span>联系方案</span>
						</li>
						<li>解决方案</li>
					</ul>
					<div className='footer_phone'>
						<p className='footer_phone_title'>联系我们</p>
						<p>地址：浙江大学西溪校区</p>
						<p>电话：0571-0000000</p>
						<p>邮编：310000</p>
					</div>
					{/* <div className='footer_commen_btn'>加入我们</div> */}
				</div>
				<div className='footer_ban_quan'>
					版权所有&copy;浙江大学量子计算<span style={{ marginLeft: '20px' }}>保留一切权利</span>
				</div>
			</div>
		</div>
	)
}
export default Layout
