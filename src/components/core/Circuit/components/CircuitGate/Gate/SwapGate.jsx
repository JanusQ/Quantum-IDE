import React from 'react'

export default function SwapGate(props) {
  return (
    <g>
    <line
      x1="8"
      y1="8"
      x2="24"
      y2="24"
      strokeWidth="1.25"
      stroke={props.rgb}
    ></line>
    <line
      x1="24"
      y1="8"
      x2="8"
      y2="24"
      strokeWidth="1.25"
      stroke={props.rgb}
    ></line>
  </g>  )
}
