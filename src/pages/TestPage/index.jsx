import React, { useEffect, useState } from "react"
import { Anchor, Row, Col, Affix, Button } from "antd"
export default function Test() {
  const selectitem = [
    {
      title: "c",
      value: "q",
      type: 0,
    },
    {
      title: "c",
      value: "q",
      type: 0,
    },
    {
      title: "c",
      value: "q",
      type: 0,
    },
    {
      title: "c",
      value: "q",
      type: 0,
    },
  ]
  return (
    <div className="container">
      <div className="select_content">
        {selectitem.map((item, index) => {
          return (
            <div className="select_item" key={index}>
              <div className="select_item_title">{item.title}</div>
              <div className="select_item_content">{item.value}</div>
            </div>
          )
        })}
      </div>
      <div className="render_content"></div>
    </div>
  )
}
