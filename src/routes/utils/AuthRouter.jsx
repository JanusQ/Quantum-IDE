import React from "react"
import { useLocation, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { rootRouter } from "@/routes/index"
import { searchRouter } from "../../utils/util"
import { message } from "antd"
import { submitLog } from "@/utils/submitLog"
export default function AuthRouter({ children }) {
  const { pathname } = useLocation()
  const { userData } = useSelector((store) => store.userData)
  const route = searchRouter(pathname, rootRouter)
  if (userData.username !== "wangxuanhe") {
    submitLog(pathname, "进入页面", "", "", "")
  }

  const adminpath = [
    "/admin",
    "/admin/projectmanage",
    "/admin/userManage",
    "/admin/notice",
    "/admin/documentManage",
    "/admin/operationlog",
  ]
  if (!route.meta?.requiresAuth) return children
  if (!userData.token) {
    message.error("请先登录", 0.5)
    return <Navigate to="/signin" replace />
  }
  if (userData.user_type !== 0 && adminpath.indexOf(pathname) !== -1) {
    return <Navigate to="/404" />
  }
  return children
}
