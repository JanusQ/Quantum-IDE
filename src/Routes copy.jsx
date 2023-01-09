import React, { lazy, Suspense } from "react"
import { HashRouter, Route, Switch } from "react-router-dom"

import Home from "./components/core/Home"
// import App from "./App"
// const Home = React.lazy(() => import("./components/core/Home"))
// import SignIn from "./components/core/SignIn"
// import SignUp from "./components/core/SignUp"
// import FindPassword from "./components/core/FindPassword"
// import Computer from "./components/core/Computer"
// import NoticeList from "./components/core/NoticeList"
import zhCN from "antd/lib/locale/zh_CN"
import { ConfigProvider } from "antd"
// import NoticeDetail from "./components/core/NoticeDetail"
// import Project from "./components/core/Project"
// import UserCenter from "./components/core/UserCenter"
// import Test from "./components/test/Test"
// import MessageList from "./components/core/MessageList"
// import messageDetail from "./components/core/MessageDetail"
// import ReferenceDoc from "./components/core/ReferenceDoc"
// import AdminHome from "./components/admin/AdminHome"
// import AdminProject from "./components/admin/AdminProject"
// import Task from "./components/core/Task"
// import AdminUser from "./components/admin/AdminUser"
// import AdminNotice from "./components/admin/AdminNotice"
// import AdminReferenceDoc from "./components/admin/AdminReferenceDoc"
// import AdminNoticeDetail from "./components/admin/AdminNoticeDetail"
// import AdminOperationLog from "./components/admin/AdminOperationLog"
import PrivateRoute from "./components/admin/PrivateRoute"
// import AdminTask from "./components/admin/AdminTask"
// import AbuoutUs from "./components/core/AbuoutUs"
// import NotFound from "./components/core/NotFound"
// const Home = React.lazy(() => import("./components/core/Home"))
const App = React.lazy(() => import("./App"))
const SignIn = React.lazy(() => import("./components/core/SignIn"))
const SignUp = React.lazy(() => import("./components/core/SignUp"))
const FindPassword = React.lazy(() => import("./components/core/FindPassword"))
const Computer = React.lazy(() => import("./components/core/Computer"))
const NoticeList = React.lazy(() => import("./components/core/NoticeList"))
const NoticeDetail = React.lazy(() => import("./components/core/NoticeDetail"))
const Project = React.lazy(() => import("./components/core/Project"))
const UserCenter = React.lazy(() => import("./components/core/UserCenter"))
const Test = React.lazy(() => import("./components/test/Test"))
const MessageList = React.lazy(() => import("./components/core/MessageList"))
const messageDetail = React.lazy(() =>
  import("./components/core/MessageDetail")
)
const ReferenceDoc = React.lazy(() => import("./components/core/ReferenceDoc"))
const AdminHome = React.lazy(() => import("./components/admin/AdminHome"))
const AdminProject = React.lazy(() => import("./components/admin/AdminProject"))
const Task = React.lazy(() => import("./components/core/Task"))
const AdminUser = React.lazy(() => import("./components/admin/AdminUser"))
const AdminNotice = React.lazy(() => import("./components/admin/AdminNotice"))
const AdminReferenceDoc = React.lazy(() =>
  import("./components/admin/AdminReferenceDoc")
)
const AdminNoticeDetail = React.lazy(() =>
  import("./components/admin/AdminNoticeDetail")
)
const AdminOperationLog = React.lazy(() =>
  import("./components/admin/AdminOperationLog")
)
const AdminTask = React.lazy(() => import("./components/admin/AdminTask"))
const AbuoutUs = React.lazy(() => import("./components/core/AbuoutUs"))
const NotFound = React.lazy(() => import("./components/core/NotFound"))

const Routes = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <PrivateRoute
              path="/aceComputer/:projectName/:projectId"
              component={App}
            />
            <Route path="/" component={Home} exact />
            <Route path="/test" component={Test} exact />
            {/* <Route path='/computer' component={App} exact /> */}
            <Route path="/signin/:type" component={SignIn} exact />
            <Route path="/signUp" component={SignUp} exact />
            <Route path="/findPassword" component={FindPassword} exact />
            <Route path="/aboutUs" component={AbuoutUs} exact />
            <Route path="/notFound" component={NotFound} exact />
            <PrivateRoute path="/computer" component={Computer} exact />
            <PrivateRoute path="/notice" component={NoticeList} exact />
            <PrivateRoute
              path="/noticedetail/:noticeId"
              component={NoticeDetail}
              exact
            />
            <PrivateRoute path="/project" component={Project} exact />
            <PrivateRoute
              path="/task/:taskId/:projectName"
              component={Task}
              exact
            />
            <PrivateRoute path="/usercenter/:type" component={UserCenter} />
            <PrivateRoute path="/test" component={Test} exact />
            <PrivateRoute path="/message" component={MessageList} exact />
            <PrivateRoute
              path="/messageDetail"
              component={messageDetail}
              exact
            />
            <PrivateRoute
              path="/referenceDoc/:docId"
              component={ReferenceDoc}
              exact
            />
            <PrivateRoute path="/admin" component={AdminHome} exact />
            <PrivateRoute
              path="/admin/project"
              component={AdminProject}
              exact
            />
            <PrivateRoute path="/admin/user" component={AdminUser} exact />
            <PrivateRoute path="/admin/notice" component={AdminNotice} exact />
            <PrivateRoute
              path="/admin/operation"
              component={AdminOperationLog}
              exact
            />
            <PrivateRoute
              path="/admin/referenceDoc"
              component={AdminReferenceDoc}
              exact
            />
            <PrivateRoute
              path="/admin/noticeDetail/:noticeId"
              component={AdminNoticeDetail}
              exact
            />
            <PrivateRoute
              path="/admin/adminTask/:taskId/:projectName"
              component={AdminTask}
              exact
            />
          </Switch>
        </Suspense>
      </HashRouter>
    </ConfigProvider>
  )
}
export default Routes
