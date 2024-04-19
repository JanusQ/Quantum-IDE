import React from 'react'

export default function CircleGate({ name, x }) {
  return (
    <g>
      <circle
        cx="16"
        cy="16"
        r="16"
        fill="rgb(0, 45, 160)"
        strokeWidth="0"
        stroke="transparent"
        paintOrder="stroke"
      ></circle>
      {name && (
        <text
          x={name.length >= 2 ? '8.21875' : '11.21875'}
          y="21.5"
          fill="#ffffff"
        >
          {name.length === 3
            ? name.substring(1).toUpperCase()
            : name.toUpperCase()}
        </text>
      )}
    </g>
  )
}
