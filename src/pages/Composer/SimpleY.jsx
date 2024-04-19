import React from "react"
import SimpleGate from "./gates/SimpleGate"
export default function SimpleY({ gate }) {
  let lineY1 = Math.min(...gate?.qubit)
  let lineY2 = Math.max(...gate?.qubit)
  return (
    <g>
      {gate.qubit?.length > 1 && (
        <line
          strokeWidth="1"
          stroke="rgb(31, 161, 206)"
          x1={16}
          x2={16}
          y1={lineY1 * 20 + 40}
          y2={lineY2 * 20 + 40}
        ></line>
      )}
      {gate.qubit?.map((item, index) => (
        <g key={index} transform={`translate(0,${item * 20 + 24})`}>
          <SimpleGate color={gate.qubit.length > 1 ? "yellow" : "red"} />
        </g>
      ))}
    </g>
  )
}
