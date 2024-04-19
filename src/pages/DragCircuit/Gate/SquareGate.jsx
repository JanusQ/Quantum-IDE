import React from 'react'

export default function SquareGate({ name, color, x }) {
  return (
    <g>
      <rect
        y="0"
        type={name}
        fill={color ? color : 'rgb(0, 45, 160)'}
        width="32"
        height="32"
      ></rect>
      <text
        x={name.length == 2 ? '8.21875' : '11.21875'}
        y="21.5"
        fill="#ffffff"
      >
        {name.toUpperCase()}
      </text>
    </g>
  )
}
