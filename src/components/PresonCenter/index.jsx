/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Dropdown, Menu } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { removeToken, removeUserData } from '@/utils/storage'

export default function Person() {
  const { userData } = useSelector((store) => store.userData)
  const navigate = useNavigate()
  const logout = () => {
    removeToken()
    removeUserData()
    navigate('/')
  }
  let items = [
    {
      key: '1',
      label: <p onClick={() => navigate('/userdata')}>个人中心</p>,
    },
    {
      key: '2',
      label: <p onClick={() => navigate('/resetPassword')}>修改密码</p>,
    },
    {
      key: '3',
      label: <p onClick={logout}>退出登录</p>,
    },
  ]
  if (userData.user_type === 0) {
    items.push({
      key: '4',
      label: <p onClick={() => navigate('/admin')}>后台管理</p>,
    })
  }
  const menu = <Menu items={items}></Menu>

  return (
    <>
      {userData.token ? (
        <Dropdown
          placement="bottomLeft"
          menu={{
            items,
          }}
        >
          <span>
            <div
              style={{
                display: 'inline-block',
                height: 32,
                width: 32,
                borderRadius: 16,
                backgroundColor: 'skyblue',
                textAlign: 'center',
                marginTop: 16,
                lineHeight: 1,
                fontSize: 24,
                color: 'black',
              }}
            >
              {userData.username.slice(0, 1)}
            </div>
            <CaretDownOutlined />
          </span>
        </Dropdown>
      ) : (
        <Link to="/signin">登录 | 注册</Link>
      )}
    </>
  )
}
