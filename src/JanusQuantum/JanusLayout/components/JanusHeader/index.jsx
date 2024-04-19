import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Popover, Dropdown, Space } from "antd"
import { DownOutlined } from "@ant-design/icons"
export default function JanusHeader({ fontColor }) {
  const [showSelect, setShowSelect] = useState(false)
  const onMouseOver = () => {}

  const items = [
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

  return (
    <div className="header_menu">
      <div>
        <span className="header_menu_item_black">
          <Link to="/home">HomeLink</Link>
        </span>
      </div>

      <Dropdown
        menu={{
          items,
        }}
      >
        <div>
          <span className="header_menu_item_black">
            <Link to="/janus">
              GitHub <DownOutlined />
            </Link>
          </span>
        </div>
      </Dropdown>

      <div>
        <span className="header_menu_item_black">
          <Link to="/aboutUs">About us</Link>
        </span>
      </div>
    </div>
  )
}
