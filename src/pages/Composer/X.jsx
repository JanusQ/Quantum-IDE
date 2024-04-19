import React from "react"
import Y from "./Y"

export default function X({ x, item, qubitLineArry }) {
  // let ygate = decompose_gates(item)
  // console.log(ygate, 333)
  return (
    <>
      <g transform={`translate(${x * 45 + 95})`}>
        {/* <g transform={`translate(${x * 30})`}> */}
        {item?.map((gate, index) => (
          <Y name={item.name} x={x} key={index} gate={gate} y={index} />
        ))}
        {/* <rect
          fill="rgb(215, 215, 215)"
          width={5}
          height={qubitLineArry.length * 40}
          y="30"
          x="100"
        ></rect> */}
        {/* <line
          x1={102.5}
          x2={102.5}
          y1={30}
          y2={qubitLineArry.length * 40}
          strokeDasharray="4"
          stroke="rgb(45, 45, 45)"
        ></line> */}
        {/* </g> */}
      </g>
    </>
  )
}
