import React from 'react'
import AdminNavigation from './AdminNavigation'
import { PageHeader } from 'antd'
import '../styles/Layout.css'
import { useHistory } from 'react-router-dom'
import Footer from '../core/Footer'
const AdminLayout = ({ children, isAdminUser }) => {
	const history = useHistory()
	const backHome = () => {
		return history.push('/')
	}
	return (
		<div style={{ background: '#eaeff5' }}>
			<div className='front_header'>
				<div className='front_menu_div'>
					<span className='front_logo_title' onClick={backHome}>
						量子计算
					</span>
					<AdminNavigation />
				</div>
			</div>
			<div className={isAdminUser ? 'admin_user_content' : 'common_content'}>{children}</div>
			<Footer />
		</div>
	)
}
export default AdminLayout
