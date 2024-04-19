import React, { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Header from "./components/Header"
import Content from "./components/Content"
import Footer from "./components/Footer"
import "./index.scss"
export default function Layout() {
  const { t, i18n } = useTranslation()
  const menus = [
    {
      label: t("nav.home"),
      path: "/home",
    },
    {
      label: t("nav.computingResource"),
      path: "/computers",
    },
    {
      label: t("nav.pm"),
      path: "/projects",
    },
    {
      label: t("nav.document"),
      path: "/documents",
    },
    {
      label: t("nav.aboutUs"),
      path: "/aboutUs",
    },
    // {
    //   label: "Tool",
    //   path: "/tool",
    // },
  ]
  return (
    <div>
      <Header menus={menus}></Header>
      <Content>
        <Suspense fallback={<div>Loading...</div>}>
          <div>
            <Outlet />
          </div>
        </Suspense>
      </Content>
      <Footer></Footer>
    </div>
  )
}
