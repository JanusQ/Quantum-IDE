import React, { useEffect, useState } from "react"
import styles from "./index.module.scss"
import { useSelector } from "react-redux"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { Menu, Avatar } from "antd"
import { getUserCredits } from "@/api/topUp"
export default function Wallet() {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const [credits, setcredits] = useState("")
  const { userData } = useSelector((store) => store.userData)
  const items = [
    {
      label: "太元钱包",
      key: "/wallet/account",
      onClick: () => navigate("/wallet/account"),
    },
    {
      label: "购买量子币",
      key: "/wallet/recharge",
      onClick: () => navigate("/wallet/recharge"),
    },
    {
      label: "交易记录",
      key: "/wallet/record",
      onClick: () => navigate("/wallet/record"),
    },
  ]
  const userCredits = async () => {
    const { data } = await getUserCredits({ user_id: userData.user_id })
    setcredits(data.credits)
  }
  useEffect(() => {
    userCredits()
  }, [])
  return (
    <div className={styles.root}>
      <div className="wallet_center_wapper">
        <div className="wallet_center_top">
          <div className="wallet_center_top_content">
            <h2>太元钱包</h2>
          </div>
        </div>
        <div className="wallet_center_con">
          <div className="wallet_left_nav">
            <div className="nav_user_info_wp">
              <Avatar
                style={{
                  backgroundColor: "#7265e6",
                  verticalAlign: "middle",
                }}
                size="large"
                gap={4}
              >
                {userData.username.slice(0, 1)}
              </Avatar>
              <span className="wallet_name">{userData.username}</span>
              <div className="quantum_icon">
                量子币:
                <span className="coin">{credits / 100}</span>
              </div>
            </div>
            <div className="left_nav_wp">
              <div className="left_nav_wp_coin">量子币</div>
              <Menu
                style={{
                  width: 256,
                }}
                defaultSelectedKeys={["1"]}
                selectedKeys={[pathname]}
                mode="inline"
                items={items}
              />
            </div>
          </div>
          <div className="wallet_right">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
