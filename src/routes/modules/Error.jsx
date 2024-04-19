import React, { Suspense } from "react"
import { Navigate } from "react-router-dom"

import LazyLoad from "../utils/LazyLoad"

export const ErrorRouter = [
  {
    path: "/404",
    element: LazyLoad(React.lazy(() => import("@/pages/ErrorMessage/404"))),
  },
]
