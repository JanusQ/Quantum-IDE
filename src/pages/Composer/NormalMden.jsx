import React from "react"
import X from "./X"
import Line from "./Line"
export default function NormalMden({
  qubitLineArry,
  delCircuit1,
  delCurcuitLenght,
}) {
  let svgWidth = delCircuit1.length * 45 + 200
  let svgHeight = qubitLineArry.length * 40 + 200
  return (
    <svg id="Normal" width={1000} height={800}>
      <foreignObject width={1000} height={800}>
        <div style={{ width: 1000, height: 800, overflow: "auto" }}>
          <svg width={svgWidth} height={svgHeight}>
            {qubitLineArry.map((qubit, index) => (
              <g
                key={index}
                transform={`translate(60,${20 + index * 40 ? index * 40 : 0})`}
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
                  strokeWidth="2"
                  x1="30"
                  y1="40"
                  x2={svgWidth - 160}
                  y2="40"
                  data-dis="0"
                  stroke="black"
                ></line>
              </g>
            ))}
            {delCurcuitLenght.map((item, index) => (
              <Line
                key={index}
                item={item}
                index={index}
                qubitLineArry={qubitLineArry}
                delCurcuitLenght={delCurcuitLenght}
              />
            ))}
            {delCircuit1.map((item, index) => (
              <X
                qubitLineArry={qubitLineArry}
                key={index}
                x={index}
                item={item}
              />
            ))}
          </svg>
        </div>
      </foreignObject>
    </svg>
  )
}
