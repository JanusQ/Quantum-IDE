import React from 'react'
import Navigation from './Navigation'
import { PageHeader } from 'antd'
import '../styles/Layout.css'
const Layout = ({ children }) => {
	return (
		<div style={{ height: '100%' }}>
			<div className='front_header'>
				<div className='front_menu_div'>
					<span className='front_logo_title'>量子计算</span>
					<Navigation />
				</div>
			</div>
			<div className='front_content'>{children}</div>
		</div>
	)
}
export default Layout
