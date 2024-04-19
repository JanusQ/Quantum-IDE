import React from "react"
import SimpleY from "./SimpleY"
export default function SimpleX({ x, item }) {
  return (
    <g>
      {
        <g transform={`translate(${x * 20 + 95})`}>
          {item?.map((gate, index) => (
            <SimpleY name={item.name} x={x} key={index} gate={gate} y={index} />
          ))}
        </g>
      }
    </g>
  )
}
