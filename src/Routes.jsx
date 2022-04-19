import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Home from './components/core/Home'
import App from './App'
import SignIn from './components/core/SignIn'
import SignUp from './components/core/SignUp'
import FindPassword from './components/core/FindPassword'
import Computer from './components/core/Computer'
import NoticeList from './components/core/NoticeList'
import zhCN from 'antd/lib/locale/zh_CN'
import { ConfigProvider } from 'antd'
import NoticeDetail from './components/core/NoticeDetail'
import Project from './components/core/Project'
import UserCenter from './components/core/UserCenter'
import Test from './components/test/Test'
const Routes = () => {
	return (
		<ConfigProvider locale={zhCN}>
			<HashRouter>
				<Switch>
					<Route path='/' component={App} exact />
					<Route path='/home' component={Home} exact />
					{/* <Route path='/computer' component={App} exact /> */}
					<Route path='/signIn' component={SignIn} exact />
					<Route path='/signUp' component={SignUp} exact />
					<Route path='/findPassword' component={FindPassword} exact />
					<Route path='/computer' component={Computer} exact />
					<Route path='/notice' component={NoticeList} exact />
					<Route path='/noticedetail' component={NoticeDetail} exact />
					<Route path='/project' component={Project} exact />
					<Route path='/usercenter' component={UserCenter} exact />
					<Route path='/test' component={Test} exact />
				</Switch>
			</HashRouter>
		</ConfigProvider>
	)
}
export default Routes
