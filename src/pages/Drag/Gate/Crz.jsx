import React from 'react'

export default function Crz() {
  return (
    <g>
      <circle cx="16" cy="16" r="4" fill="rgb(0, 45, 156)"></circle>
      <g ransform="translateY(32)">
        <circle
          cx="16"
          cy="48"
          r="16"
          fill="rgb(0, 45, 160)"
          strokeWidth="0"
          stroke="transparent"
          paintOrder="stroke"
        ></circle>
        <line
          x1="16"
          y1="16"
          x2="16"
          y2="48"
          strokeWidth="1.25"
          stroke="rgb(0, 45, 160)"
        ></line>
        <text x="8" y="54" fill="#ffffff">
          RZ
        </text>
        {/* <line
          x1="8"
          y1="48"
          x2="24"
          y2="48"
          strokeWidth="1.25"
          stroke=" rgb(255, 255, 255)"
        ></line>
        <line
          x1="16"
          y1="40"
          x2="16"
          y2="56"
          strokeWidth="1.25"
          stroke=" rgb(255, 255, 255)"
        ></line> */}
      </g>
    </g>
  )
}
