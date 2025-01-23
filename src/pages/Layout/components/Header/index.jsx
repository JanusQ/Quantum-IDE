import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Row, Col, Button, Popover, Badge, Layout, Dropdown } from 'antd'
import styles from './index.module.scss'
import logo from '@/assets/image/logo.png'
import Language from '../Language'
import Person from '../Person'
import { DownOutlined } from '@ant-design/icons'
export default function Header({ menus }) {
  const { Header } = Layout

  const location = useLocation()
  const applications = [
    {
      key: '1',
      label: '应用1',
      // icon: <AppstoreOutlined />,
    },
    {
      key: '2',
      label: '应用2',
      // icon: <AppstoreOutlined />,
    },
  ]
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
                <Link key={path} style={{ color: '#fff' }} to={path}>
                  <li
                    className={
                      location.pathname === path
                        ? 'path_active menu_item'
                        : 'menu_item'
                    }
                  >
                    {label}
                  </li>
                </Link>
              ))}
              {/* 应用 */}
              <div className="applications">
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: '1',
                        label: (
                          <Link to="/QuantumFinance">Quantum Finance</Link>
                        ),
                      },
                      {
                        key: '2',
                        label: <Link to="/sat">SAT</Link>,
                      },
                    ],
                  }}
                >
                  <li className="menu_item">
                    Applications <DownOutlined />
                  </li>
                </Dropdown>
              </div>
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
