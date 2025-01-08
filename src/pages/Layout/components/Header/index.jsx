import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, Row, Col, Button, Popover, Badge, Layout } from "antd"
import styles from "./index.module.scss"
import logo from "@/assets/image/logo.png"
import Language from "../Language"
import Person from "../Person"
export default function Header({ menus }) {
  const { Header } = Layout

  const location = useLocation()
  return (
    <div className={styles.root}>
      <Header className="header">
        <Row className="headerContent">
          <Col className="logoContent" lg={4} md={5} sm={24} xs={24}>
            <Link to="/home">
              <div className="logo">
                <img alt="logo" src={logo}></img>
                <span>JanusQ</span>
              </div>
            </Link>
          </Col>
          <Col className="menuContent" lg={20} md={19} sm={0} xs={0}>
            <ul className="menu">
              {menus.map(({ label, path }) => (
                <Link key={path} style={{ color: "#fff" }} to={path}>
                  <li
                    className={
                      location.pathname === path
                        ? "path_active menu_item"
                        : "menu_item"
                    }
                  >
                    {label}
                  </li>
                </Link>
              ))}
              <div className="changeLanguage">
                <Language />
              </div>
              <div className="header_right">
                <Person />
              </div>
            </ul>
          </Col>
        </Row>
      </Header>
    </div>
  )
}
