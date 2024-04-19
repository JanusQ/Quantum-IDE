import React from "react"

export default function SwapGate({ color }) {
  return (
    <g>
      <line
        x1="8"
        y1="8"
        x2="24"
        y2="24"
        strokeWidth="1.25"
        stroke={color ? color : "rgb(187, 139, 255)"}
      ></line>
      <line
        x1="24"
        y1="8"
        x2="8"
        y2="24"
        strokeWidth="1.25"
        stroke={color ? color : "rgb(187, 139, 255)"}
      ></line>
    </g>
  )
}
