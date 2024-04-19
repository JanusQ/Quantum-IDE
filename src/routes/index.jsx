import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import { UserLayoutRouter } from '@/routes/modules/Layout'
import { AdminRouter } from './modules/Admin'
import { ErrorRouter } from './modules/Error'
import { TestRouter } from './modules/Test'
export const rootRouter = [
  ...UserLayoutRouter,
  ...AdminRouter,
  ...ErrorRouter,
  ...TestRouter,
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
]
// console.log(rootRouter)
const Router = () => {
  const routes = useRoutes(rootRouter)
  return routes
}
export default Router
