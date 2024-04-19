import React from 'react'
import Layout from '@/pages/Layout'
import LazyLoad from '../utils/LazyLoad'
import LayoutIndex from '@/pages/Layout'
export const TestRouter = [
  {
    element: <Layout />,
    children: [
      {
        path: '/test',
        element: LazyLoad(React.lazy(() => import('@/Test'))),
      },
    ],
  },
]
