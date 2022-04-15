import React from 'react'
import '../styles/SignLayout.css'
const SignLayout = ({ children }) => {
	return (
		<div className='sign_layout'>
			<div className='sign_header'>
                <span className='sign_logo_title'>量子计算</span>
              
            </div>
			<div className='sign_content'>{children}</div>
		</div>
	)
}
export default SignLayout
