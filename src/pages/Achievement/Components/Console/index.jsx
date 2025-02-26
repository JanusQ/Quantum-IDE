import React from 'react'
import { message, Tooltip } from 'antd'
import './ConsoleComponent.css'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function Console(props) {
  return (
    <div id="console_div">
      <div className="content_div">{props.consoleValue}</div>
    </div>
  )
}
