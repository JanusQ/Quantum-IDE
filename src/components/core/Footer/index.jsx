import React from "react"
import { Layout, Menu } from "antd"
import Foot from "./Foot"
export default function Footer() {
  const { Header, Content, Footer } = Layout
  return (
    <div>
      <Layout>
        <Footer style={{ backgroundColor: "#313132" }}>
          <Foot />
        </Footer>
      </Layout>
    </div>
  )
}
