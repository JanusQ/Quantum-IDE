import React from "react"

export default function Line({ index, item, qubitLineArry, delCurcuitLenght }) {
  // console.log(item, 88)
  let sum = 0
  for (let i = 0; i < index + 1; i++) {
    sum += delCurcuitLenght[i]
  }

  return (
    <g transform={`translate(${sum * 45 - 45 + 30})`}>
      <rect
        fill="rgb(215, 215, 215)"
        width={5}
        height={qubitLineArry.length * 40}
        y="30"
        x="100"
      ></rect>
      <g transform={`translate(${-delCurcuitLenght[index] * 20})`}>
        <text fontSize={12} x={index > 8 ? 94 : 99} y="21.5" fill="green">
          {index + 1}
        </text>
      </g>
      <line
        x1={102.5}
        x2={102.5}
        y1={30}
        y2={qubitLineArry.length * 40}
        strokeDasharray="4"
        stroke="rgb(45, 45, 45)"
      ></line>
    </g>
  )
}
