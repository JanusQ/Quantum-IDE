import React, { useState } from "react"
import { Button, Layout, Menu, theme } from "antd"
import { Outlet, useNavigate, useLocation } from "react-router-dom"

import styles from "./index.module.scss"
export default function Tool() {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const { Sider, Content } = Layout
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const navBarMenuConfig = [
    { key: "/tool/composer", label: "Composer" },
    { key: "/tool/dragcircuit", label: "Dragcircuit" },
  ]
  const navBarMenu = navBarMenuConfig.map((item) => ({
    key: item.key,
    label: item.label,
    onClick: (info) => {
      navigate(info.key)
    },
  }))
  return (
    <div className={styles.root}>
      <Layout>
        <Sider
          style={{ backgroundColor: "#fff" }}
          trigger={null}
          collapsible
          // collapsed={collapsed}
        >
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[pathname]}
            items={navBarMenu}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 800,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}
