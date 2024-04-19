import React, { Suspense } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./components/Nacbar"
import Content from "./components/Content"
import Footer from "./components/Footer"
import Foot from "./components/Foot"
import { useTranslation } from "react-i18next"

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
      <Navbar menus={menus} />
      <Content>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </Content>
      <Footer>
        <Foot />
      </Footer>
    </div>
  )
}
