import React, { Suspense } from 'react'
import { Navigate } from 'react-router-dom'

import LazyLoad from '../utils/LazyLoad'
import LayoutIndex from '@/pages/Layout'
import Layout from '@/pages/Layout'
import Introduce from '@/pages/Introduce'
export const UserLayoutRouter = [
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/home" />,
      },
      {
        path: '/aboutUs',
        element: LazyLoad(React.lazy(() => import('@/pages/AboutUs'))),
      },
      {
        path: '/test',
        element: LazyLoad(React.lazy(() => import('@/pages/TestPage'))),
      },
      {
        path: '/home',
        element: <Introduce />,
      },
      {
        path: '/register',
        element: LazyLoad(React.lazy(() => import('@/pages/Register'))),
      },
      {
        path: '/signin',
        element: LazyLoad(React.lazy(() => import('@/pages/Login'))),
        meta: {
          requiresAuth: false,
          title: '登录页',
          key: 'login',
        },
      },
      {
        path: '/computers',
        element: LazyLoad(React.lazy(() => import('@/pages/Computer'))),
      },
      {
        path: '/documents',
        element: LazyLoad(React.lazy(() => import('@/pages/Document'))),
      },
      {
        path: '/aceComputer/*',
        element: LazyLoad(React.lazy(() => import('@/pages/OldAceComputer'))),
        meta: {
          requiresAuth: true,
          title: 'aceComputer',
          key: 'aceComputer',
        },
      },

      {
        path: '/projects',
        element: LazyLoad(React.lazy(() => import('@/pages/Project'))),
        meta: {
          requiresAuth: true,
          title: '项目列表',
          key: 'project',
        },
      },
      {
        path: '/projects/task/*',
        element: LazyLoad(React.lazy(() => import('@/components/Task'))),
        meta: {
          requiresAuth: true,
          title: 'task',
          key: 'project/task',
        },
      },
      {
        path: '/dragcircuit',
        element: LazyLoad(React.lazy(() => import('@/pages/DragCircuit'))),
      },
      {
        path: '/composer',
        element: LazyLoad(React.lazy(() => import('@/pages/Composer'))),
      },
      {
        path: '/achievement',
        element: LazyLoad(React.lazy(() => import('@/pages/Achievement'))),
      },
      {
        path: '/sat',
        element: LazyLoad(React.lazy(() => import('@/pages/SAT'))),
      },
      {
        path: '/userdata',
        element: LazyLoad(React.lazy(() => import('@/pages/UserInfo'))),
        meta: {
          requiresAuth: true,
          title: 'userdata',
          key: 'userdata',
        },
      },
      {
        path: '/wallet',
        element: LazyLoad(React.lazy(() => import('@/pages/Wallet'))),
        children: [
          {
            path: '/wallet',
            element: <Navigate to="/wallet/account" />,
          },
          {
            path: '/wallet/account',
            element: LazyLoad(
              React.lazy(() => import('@/pages/Wallet/components/Account'))
            ),
          },
          {
            path: '/wallet/recharge',
            element: LazyLoad(
              React.lazy(() => import('@/pages/Wallet/components/Recharge'))
            ),
          },
          {
            path: '/wallet/record',
            element: LazyLoad(
              React.lazy(() => import('@/pages/Wallet/components/Record'))
            ),
          },
        ],
        meta: {
          requiresAuth: true,
          title: 'wallet',
          key: 'wallet',
        },
      },
      {
        path: '/resetPassword',
        element: LazyLoad(React.lazy(() => import('@/pages/ResetPassword'))),

        meta: {
          requiresAuth: true,
          title: 'resetPassword',
          key: 'resetPassword',
        },
      },
      {
        path: '/tool',
        element: LazyLoad(React.lazy(() => import('@/pages/Tool'))),
        children: [
          {
            path: '/tool',
            element: <Navigate to="/tool/composer" />,
          },
          {
            path: '/tool/dragcircuit',
            element: LazyLoad(React.lazy(() => import('@/pages/DragCircuit'))),
          },
          {
            path: '/tool/composer',
            element: LazyLoad(React.lazy(() => import('@/pages/Composer'))),
          },
        ],
      },
    ],
  },
  {
    path: '/examples/*',
    element: LazyLoad(React.lazy(() => import('@/pages/TestAceComputer'))),
    meta: {
      requiresAuth: true,
      title: 'TestAceComputer',
      key: 'TestAceComputer',
    },
  },
]
