import React from 'react'
import AdminNavigation from './AdminNavigation'
import '../adminStyles/AdminLayout.css'
const AdminLayout = ({ children, isComputer }) => {
	return (
		<div style={{ height: '100%' }}>
			<div className='admin_header'>
				<div className='admin_menu_div'>
					<span className='admin_logo_title'>量子计算</span>
					<AdminNavigation />
				</div>
			</div>
			<div className='admin_min'>
				<div className='admin_content'>{children}</div>
			</div>
		</div>
	)
}
export default AdminLayout
