import React from 'react'
import AdminNavigation from './AdminNavigation'
import '../styles/Layout.css'
const AdminLayout = ({ children, isComputer }) => {
	return (
		<div style={{ height: '100%' }}>
			<div className='front_header'>
				<div className='front_menu_div'>
					<span className='front_logo_title'>量子计算</span>
					<AdminNavigation />
				</div>
			</div>
			<div className={isComputer ? 'computer_content' : 'front_content'}>{children}</div>
		</div>
	)
}
export default AdminLayout
