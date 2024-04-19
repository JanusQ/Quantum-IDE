import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Dropdown, Menu, Avatar, Badge } from "antd"
import { CaretDownOutlined } from "@ant-design/icons"
import { removeToken, removeUserData } from "@/utils/storage"
import { useTranslation } from "react-i18next"

export default function Person() {
  const { t, i18n } = useTranslation()

  const { userData } = useSelector((store) => store.userData)
  const navigate = useNavigate()
  const logout = () => {
    removeToken()
    removeUserData()
    window.location.href = "/"
  }
  let items = [
    {
      key: "1",
      label: (
        <p onClick={() => navigate("/userdata")}>{t("menu.personalCenter")}</p>
      ),
    },
    {
      key: "2",
      label: (
        <p onClick={() => navigate("/resetPassword")}>
          {t("menu.changePassword")}
        </p>
      ),
    },

    {
      key: "3",
      label: <p onClick={logout}>{t("menu.logOut")}</p>,
    },
  ]
  if (userData.user_type === 0) {
    items.push({
      key: "4",
      label: (
        <p onClick={() => navigate("/admin")}>{t("menu.backgroundSystem")}</p>
      ),
    })
    items.push({
      key: "5",
      label: <p onClick={() => navigate("/wallet")}>{t("menu.wallet")}</p>,
    })
  }
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
            <Badge
              onClick={() => {
                // console.log(33)
              }}
              count={0}
            >
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
            </Badge>
            <CaretDownOutlined style={{ color: "#fff" }} />
          </span>
        </Dropdown>
      ) : (
        <div className="login_register" onClick={() => navigate("/signin")}>
          <span style={{ width: 100, display: "inline-block", marginTop: 10 }}>
            {t("login.Log in")} &nbsp; | &nbsp; {t("login.Sign up")}
          </span>
        </div>
      )}
    </>
  )
}
