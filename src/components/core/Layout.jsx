import React from 'react'
import Navigation from './Navigation'
import { PageHeader } from 'antd'
const Layout = ({ children }) => {
	return (
		<div>
			<Navigation />
			<div style={{width:"85%",margin:"0 auto"}}>
			{children}
			</div>
		</div>
	)
}
export default Layout
