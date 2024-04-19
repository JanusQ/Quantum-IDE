import React from "react"
import Cz from "./gates/Cz"
import I from "./gates/I"
import Pvz from "./gates/Pvz"
import Vz from "./gates/Vz"
import YGate from "./gates/YGate"
import OtherGate from "./OtherGate"
import Cgate from "./gates/Cgate"
import Xgate from "./gates/Xgate"
import SwapGate from "./gates/SwapGate"
export default function Y({ gate }) {
  let lineY1 = Math.min(...gate?.qubit)
  let lineY2 = Math.max(...gate?.qubit)
  let color = false
  switch (gate.name) {
    case "cswap":
      color = "rgb(187, 139, 255)"
      break
    default:
      color = "rgb(126, 164, 248)"
  }

  return (
    <g>
      {gate.qubit?.length > 1 && (
        <line
          strokeWidth="2"
          stroke={color}
          x1={16}
          x2={16}
          y1={lineY1 * 40 + 40}
          y2={lineY2 * 40 + 40}
        ></line>
      )}
      {gate &&
        gate.qubit?.map((item, index) => (
          <g key={index} transform={`translate(0,${item * 40 + 24})`}>
            {(() => {
              switch (gate.name) {
                case "cz":
                  return <Cz />
                case "i":
                  return <I />
                case "pvz":
                  return <Pvz />
                case "vz":
                  return <Vz />
                case "y":
                  return <YGate />
                case "cswap":
                  if (index > 0) {
                    return <SwapGate />
                  }
                  return <Cgate color={color} />
                case "cp":
                  return <Cgate color={color} />
                case "cx":
                  if (index > 0) {
                    return <Xgate />
                  }
                  return <Cgate />

                default:
                  return <OtherGate name={gate?.name} />
              }
            })()}
          </g>
        ))}
    </g>
  )
}
