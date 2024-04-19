import React, { Suspense } from "react"
import { Navigate } from "react-router-dom"

import LazyLoad from "../utils/LazyLoad"
import LayoutIndex from "@/admin/Layout"
export const AdminRouter = [
  {
    element: <LayoutIndex />,
    children: [
      {
        path: "/admin",
        element: LazyLoad(React.lazy(() => import("@/admin/ChartData"))),
        meta: {
          requiresAuth: true,
          title: "admin",
          key: "admin",
        },
      },
      {
        path: "/admin/userManage",
        element: LazyLoad(React.lazy(() => import("@/admin/UserManage"))),
        meta: {
          requiresAuth: true,
          title: "/admin/userManage",
          key: "/admin/userManage",
        },
      },
      {
        path: "/admin/operationlog",
        element: LazyLoad(React.lazy(() => import("@/admin/OperationLog"))),
        meta: {
          requiresAuth: true,
          title: "/admin/operationlog",
          key: "/admin/operationlog",
        },
      },
      {
        path: "/admin/documentManage",
        element: LazyLoad(React.lazy(() => import("@/admin/DocumentManage"))),
        meta: {
          requiresAuth: true,
          title: "/admin/documentManage",
          key: "/admin/documentManage",
        },
      },
      {
        path: "/admin/document/detil/*",
        element: LazyLoad(React.lazy(() => import("@/admin/DocumentDetil"))),
        meta: {
          requiresAuth: true,
          title: "/admin/document/detil",
          key: "/admin/document/detil",
        },
      },
      {
        path: "/admin/projectmanage",
        element: LazyLoad(React.lazy(() => import("@/admin/ProjectManage"))),
        meta: {
          requiresAuth: true,
          title: "/admin/projectmanage",
          key: "/admin/projectmanage",
        },
      },
      {
        path: "/admin/adminTask/*",
        element: LazyLoad(
          React.lazy(() => import("@/admin/ProjectManage/Task"))
        ),
        meta: {
          requiresAuth: true,
          title: "/admin/adminTask",
          key: "/admin/adminTask",
        },
      },
      {
        path: "/admin/notice",
        element: LazyLoad(React.lazy(() => import("@/admin/Notice"))),
        meta: {
          requiresAuth: true,
          title: "/admin/notice",
          key: "/admin/notice",
        },
      },
      {
        path: "/admin/noticeDetail/*",
        element: LazyLoad(
          React.lazy(() => import("@/admin/Notice/NoticeDetail"))
        ),
        meta: {
          requiresAuth: true,
          title: "/admin/noticeDetail/*",
          key: "/admin/noticeDetail/*",
        },
      },
    ],
  },
]
