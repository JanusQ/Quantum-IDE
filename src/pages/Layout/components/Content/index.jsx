import React from "react"
import styles from "./index.module.scss"
import { Layout } from "antd"
export default function Content({ children }) {
  const { Content } = Layout
  const contentStyle = {
    minHeight: "800px",
  }
  return <Content style={contentStyle}>{children}</Content>
}
