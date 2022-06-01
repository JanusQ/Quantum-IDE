import React from 'react'
import '../styles/Breadcrumb.css'
const Layout = ({ name, isAdminUser }) => {
	return (
		<div className={isAdminUser ? 'admin_user_breadcrumb_div' : 'breadcrumb_div'}>
			<span className='breadcrumb_icon'></span>
			<span>
				<span style={{ marginRight: '6px' }}>当前位置:</span> <span>{name}</span>
			</span>
		</div>
	)
}
export default Layout
