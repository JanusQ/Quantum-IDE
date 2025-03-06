import React from 'react'
import Y from './Y'
export default function X({ x, gateX }) {
  // console.log(gateX, 'gateX')
  return (
    <g name="555" transform={`translate(${x * 50 + 95})`}>
      {gateX.map((gate, index) => (
        <Y name={gateX.name} x={x} key={index} gate={gate} y={index} />
      ))}
    </g>
  )
}
