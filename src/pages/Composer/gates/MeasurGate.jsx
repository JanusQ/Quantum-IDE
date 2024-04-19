import React from "react"

export default function MeasurGate() {
  return (
    <g>
      <rect x="8" y="16" width={23} height={17} fill="#fff"></rect>
      <path
        d="M8, 30A10 10 90 1 1 30 30M19, 30"
        strokeWidth="1"
        stroke="black"
        fill="none"
      ></path>
      <circle r="2.5" cx="19" cy="28" fill="black"></circle>
      <line
        x1="19"
        y1="28"
        x2="28"
        y2="15"
        strokeWidth="1"
        stroke="black"
      ></line>
    </g>
  )
}
