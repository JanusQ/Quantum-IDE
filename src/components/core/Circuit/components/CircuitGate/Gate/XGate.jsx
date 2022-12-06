import React from 'react'

export default function XGate() {
  return (
    <g>
    <circle
      cx="16"
      cy="16"
      r="16"
      fill="rgb(0, 45, 156)"
      strokeWidth="0"
      stroke="transparent"
      paintOrder="stroke"
    ></circle>
    <line
      x1="8"
      y1="16"
      x2="24"
      y2="16"
      strokeWidth="1.25"
      stroke=" rgb(255, 255, 255)"
    ></line>
    <line
      x1="16"
      y1="8"
      x2="16"
      y2="24"
      strokeWidth="1.25"
      stroke=" rgb(255, 255, 255)"
    ></line>
  </g>  )
}
