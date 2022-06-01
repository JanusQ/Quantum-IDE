import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { isAuth } from '../../helpers/auth'

const AdminRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				const auth = isAuth()
				if (auth) {
					const { user_type } = auth
					if (user_type === 1) return <Component {...props} />
				}
				return <Redirect to='/signin/1' />
			}}
		/>
	)
}

export default AdminRoute
