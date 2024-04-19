import React, { useEffect, useState } from "react"
import { Link, Outlet } from "react-router-dom"
import JanusHeader from "./components/JanusHeader"
import JuanContent from "./components/JuansContent"
import JuanFooter from "./components/JanusFooter"
import logo from "@/assets/image/logo.png"
import { MenuOutlined } from "@ant-design/icons"
import { Layout, Space, Col, Row, Dropdown } from "antd"
import styles from "./index.module.scss"
const { Header, Footer, Content } = Layout
export default function JanusLayout() {
  const [headerStyle, setHeaderStyle] = useState({
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#fff",
    width: "100%",
    height: 60,
    zIndex: 1000,
  })
  const [fontColor, setfontColor] = useState("black")
  const [windowHeight, setWindowHeight] = useState(0)
  // const headerStyle = {
  //   textAlign: "center",
  //   color: "#fff",
  //   height: 80,
  //   paddingInline: 50,
  //   lineHeight: "80px",
  //   backgroundColor: "black",
  //   position: "fixed",
  //   top: 0,
  //   width: "100%",
  // }
  const contentStyle = {
    textAlign: "center",
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#fff",
    overflow: "hidden",
  }
  const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "rgb(0, 16, 46)",
    height: 200,
  }
  const handleScroll = () => {
    let scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop
    if (scrollTop > 80) {
      setHeaderStyle({ ...headerStyle, backgroundColor: "#fff" })
      setfontColor("black")
    } else if (scrollTop <= 80) {
      setHeaderStyle({ ...headerStyle, backgroundColor: "black" })
      setfontColor("#fff")
    }
  }
  const items = [
    {
      key: "1",
      label: (
        <Link tyle={{ fontSize: 18, color: "black" }} to="/janus">
          HomeLink
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link tyle={{ fontSize: 18, color: "black" }} to="/aboutUs">
          About us
        </Link>
      ),
    },
    {
      key: "3",
      label: <Link tyle={{ fontSize: 18, color: "black" }}>Janus-SAT</Link>,
    },
    {
      key: "4",
      label: <Link tyle={{ fontSize: 18, color: "black" }}>Janus-CT</Link>,
    },
    {
      key: "5",
      label: (
        <Link tyle={{ fontSize: 18, color: "black" }}>Janus-PulseLib</Link>
      ),
    },
  ]
  useEffect(() => {
    // window.addEventListener("scroll", handleScroll)
    // return () => {
    //   window.removeEventListener("scroll", handleScroll)
    // }
  }, [])
  return (
    <div className={styles.root}>
      <Header style={headerStyle}>
        <div className="container">
          <div className="nav">
            <div className="logo">
              <Link to="/janus">
                <img
                  style={{
                    width: 50,
                    height: 50,
                    display: "inline-block",
                  }}
                  alt="量子"
                  className="logo"
                  src={logo}
                />
                <span
                  style={{
                    color: fontColor,
                    height: 50,
                    paddingLeft: 10,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                  className="logoName"
                >
                  Juans Quantum
                </span>
              </Link>
            </div>
            <JanusHeader fontColor={fontColor}></JanusHeader>
          </div>

          <div className="min_menu">
            <Dropdown
              menu={{
                items,
              }}
            >
              <MenuOutlined
                style={{
                  fontSize: "32px",
                  color: "black",
                  lineHeight: "74px",
                }}
              />
            </Dropdown>
          </div>
          {/* <div className="search">
            <SearchOutlined style={{ fontSize: 18, color: fontColor }} />
          </div> */}
        </div>
      </Header>
      <Content style={contentStyle}>
        <Outlet />
      </Content>

      <Footer style={footerStyle}>
        <JuanFooter />
      </Footer>
      {/* <JanusHeader />
      <JuanContent>
        <Outlet />
      </JuanContent>
      <JuanFooter /> */}
    </div>
  )
}
