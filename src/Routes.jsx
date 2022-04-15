import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Home from './components/core/Home'
import App from './App'
import SignIn from './components/core/SignIn'
import SignUp from './components/core/SignUp'
const Routes = () => {
	return (
		<HashRouter>
			<Switch>
				<Route path='/' component={App} exact />
				<Route path='/home' component={Home} exact />
                {/* <Route path='/computer' component={App} exact /> */}
				<Route path='/signIn' component={SignIn} exact />
                <Route path='/signUp' component={SignUp} exact />
			</Switch>
		</HashRouter>
	)
}
export default Routes
