import React from "react"
import Y from "./Y"
export default function X({ x, item }) {
  return (
    <g name="555" transform={`translate(${x * 50 + 95})`}>
      {item.map((gate, index) => (
        <Y name={item.name} x={x} key={index} gate={gate} y={index} />
      ))}
    </g>
  )
}
