import { Layout, Menu } from "antd"
import React from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import styles from "./index.module.scss"
import logo from "@/assets/image/logo.png"
import { sideBarMenuConfig } from "./sideBarMenuConfig"
import Person from "@/components/PresonCenter"
const { Header, Sider, Content } = Layout
export default function Admin() {
  const navigate = useNavigate()

  const location = useLocation()
  const { pathname } = location
  const slideBarMenu = sideBarMenuConfig.map((item) => ({
    key: item.key,
    label: item.label,
    onClick: (info) => navigate(info.key),
  }))
  return (
    <div className={styles.root}>
      <Layout>
        <Header className="header">
          <img
            onClick={() => navigate("/")}
            alt="量子"
            className="logo"
            src={logo}
          />
          <span className="logoName">太元量子</span>
          <div className="header-right">{<Person />}</div>
        </Header>
        <Layout>
          <Sider className="site-layout-background" width={200}>
            <Menu
              items={slideBarMenu}
              mode="inline"
              selectedKeys={[pathname]}
              style={{
                height: "100%",
                borderRight: 0,
              }}
              theme="light"
            />
          </Sider>
          <Layout>
            <Content>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}
