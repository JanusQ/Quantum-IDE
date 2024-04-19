import React from "react"

export default function SimpleLine({
  index,
  item,
  qubitLineArry,
  delCurcuitLenght,
}) {
  // console.log(item, 88)
  let sum = 0
  for (let i = 0; i < index + 1; i++) {
    sum += delCurcuitLenght[i]
  }
  return (
    <g>
      <g transform={`translate(${sum * 20 - 20 + 20})`}>
        <rect
          fill="rgb(215, 215, 215)"
          width={3}
          height={qubitLineArry.length * 20}
          y="30"
          x="100"
        ></rect>
        <g transform={`translate(${-delCurcuitLenght[index] * 10})`}>
          <text fontSize={12} x={index > 8 ? 94 : 99} y="21.5" fill="green">
            {index + 1}
          </text>
        </g>
        <line
          x1={102}
          x2={102}
          y1={30}
          y2={qubitLineArry.length * 20 + 20}
          strokeDasharray="4"
          stroke="rgb(45, 45, 45)"
        ></line>
      </g>
    </g>
  )
}
