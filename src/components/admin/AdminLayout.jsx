import React from 'react'
import AdminNavigation from './AdminNavigation'
import '../styles/Layout.css'
const AdminLayout = ({ children }) => {
	return (
		<div>
			<div className='front_header'>
				<div className='front_menu_div'>
					<span className='front_logo_title'>量子计算</span>
					<AdminNavigation />
				</div>
			</div>
			<div >{children}</div>
		</div>
	)
}
export default AdminLayout
