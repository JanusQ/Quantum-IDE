import React, { Suspense } from "react"
import { Navigate } from "react-router-dom"

import LazyLoad from "../utils/LazyLoad"
import JanusLayout from "@/JanusQuantum/JanusLayout"
export const JanusRouter = [
  {
    element: <JanusLayout />,
    children: [
      {
        path: "/janus",
        element: LazyLoad(
          React.lazy(() => import("@/JanusQuantum/JanusHomePage"))
        ),
        meta: {
          requiresAuth: true,
          title: "janus",
          key: "janus",
        },
      },
    ],
  },
]
