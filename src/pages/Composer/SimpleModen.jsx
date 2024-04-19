import React from "react"
import SimpleX from "./SimpleX"
import MeasurGate from "./gates/MeasurGate"
import SimpleLine from "./SimpleLine"

export default function SimpleModen({
  qubitLineArry,
  delCircuit1,
  delCurcuitLenght,
}) {
  let svgWidth = delCircuit1.length * 20 + 230
  let svgHeight = qubitLineArry.length * 20 + 230
  return (
    <svg
      width={1000}
      height={800}
      style={{
        backgroundColor: "#fff",
      }}
      id="Simple"
    >
      <foreignObject width={1000} height={800}>
        <div style={{ width: 1000, height: 800, overflow: "auto" }}>
          <svg width={svgWidth} height={svgHeight}>
            {qubitLineArry.map((qubit, index) => (
              <g
                key={index}
                transform={`translate(60,${20 + index * 20 ? index * 20 : 0})`}
              >
                <g transform="translate(-14,4)">
                  <text
                    x="38.4"
                    y="36"
                    dy=".3em"
                    fill="rgb(111, 111, 111)"
                    fontWeight="400"
                    textAnchor="end"
                    fontSize="14px"
                  >
                    <tspan>q[{index}]</tspan>
                  </text>
                </g>
                <line
                  className="qubit"
                  strokeWidth="1"
                  x1="30"
                  y1="40"
                  x2={svgWidth - 120}
                  y2="40"
                  data-dis="0"
                  stroke="black"
                ></line>
              </g>
            ))}
            {qubitLineArry.map((item, index) => (
              <g
                key={index}
                transform={`translate(${delCircuit1.length * 20 + 100},${
                  20 + index * 20 ? index * 20 + 17 : 0
                })`}
              >
                <MeasurGate />
              </g>
            ))}
            {delCircuit1.map((item, index) => (
              <SimpleX
                qubitLineArry={qubitLineArry}
                key={index}
                x={index}
                item={item}
              />
            ))}
            {delCurcuitLenght.map((item, index) => (
              <SimpleLine
                key={index}
                item={item}
                index={index}
                qubitLineArry={qubitLineArry}
                delCurcuitLenght={delCurcuitLenght}
              />
            ))}
          </svg>
        </div>
      </foreignObject>
    </svg>
  )
}
