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
import MessageList from './components/core/MessageList'
import messageDetail from './components/core/MessageDetail'
import ReferenceDoc from './components/core/ReferenceDoc'
import AdminHome from './components/admin/AdminHome'
import AdminProject from './components/admin/AdminProject'
import Task from './components/core/Task'
import AdminUser from './components/admin/AdminUser'
import AdminNotice from './components/admin/AdminNotice'
import AdminReferenceDoc from './components/admin/AdminReferenceDoc'
import AdminNoticeDetail from './components/admin/AdminNoticeDetail'
import PrivateRoute from './components/admin/PrivateRoute'
import AdminTask from './components/admin/AdminTask'
const Routes = () => {
	return (
		<ConfigProvider locale={zhCN}>
			<HashRouter>
				<Switch>
					<PrivateRoute path='/aceComputer/:projectName/:projectId' component={App} />
					<Route path='/' component={Home} exact />
					{/* <Route path='/computer' component={App} exact /> */}
					<Route path='/signin/:type' component={SignIn} exact />
					<Route path='/signUp' component={SignUp} exact />
					<Route path='/findPassword' component={FindPassword} exact />
					<PrivateRoute path='/computer' component={Computer} exact />
					<PrivateRoute path='/notice' component={NoticeList} exact />
					<PrivateRoute path='/noticedetail/:noticeId' component={NoticeDetail} exact />
					<PrivateRoute path='/project' component={Project} exact />
					<PrivateRoute path='/task/:taskId/:projectName' component={Task} exact />
					<PrivateRoute path='/usercenter/:type' component={UserCenter} />
					<PrivateRoute path='/test' component={Test} exact />
					<PrivateRoute path='/message' component={MessageList} exact />
					<PrivateRoute path='/messageDetail' component={messageDetail} exact />
					<PrivateRoute path='/referenceDoc/:docId' component={ReferenceDoc} exact />
					<PrivateRoute path='/admin' component={AdminHome} exact />
					<PrivateRoute path='/admin/project' component={AdminProject} exact />
					<PrivateRoute path='/admin/user' component={AdminUser} exact />
					<PrivateRoute path='/admin/notice' component={AdminNotice} exact />
					<PrivateRoute path='/admin/referenceDoc' component={AdminReferenceDoc} exact />
					<PrivateRoute path='/admin/noticeDetail/:noticeId' component={AdminNoticeDetail} exact />
					<PrivateRoute path='/admin/adminTask/:taskId/:projectName' component={AdminTask} exact />
				</Switch>
			</HashRouter>
		</ConfigProvider>
	)
}
export default Routes
