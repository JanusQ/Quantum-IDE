import React from 'react'

export default function CustomTowBitGat({ name, color }) {
  return (
    <g>
      <circle cx="16" cy="16" r="4" fill="rgb(0, 45, 156)"></circle>
      <g ransform="translateY(32)">
        <circle
          cx="16"
          cy="48"
          r="16"
          fill={color ? color : 'rgb(0, 45, 160)'}
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
          stroke={color ? color : 'rgb(0, 45, 160)'}
        ></line>
        <text
          x={name.length >= 2 ? '8.21875' : '11.21875'}
          y="54"
          fill="#ffffff"
        >
          {name.length === 3
            ? name.substring(1).toUpperCase()
            : name.toUpperCase()}
        </text>
      </g>
    </g>
  )
}
