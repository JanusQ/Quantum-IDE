import React from 'react'

export default function RowBracket({ item, gates }) {
  const { end_operation, start_operation } = item
  let tranlength = 95

  let col = []
  for (let i = 0; i < gates.length; i++) {
    for (let j = 0; j < gates[i].length; j++) {
      if (start_operation <= j && j < end_operation && gates[i][j]) {
        col.push(i)
      }
    }
  }

  // 找出最小值
  const minValue = Math.min(...col)
  const toppathData = `M${start_operation * 40 + tranlength} ${
    minValue * 40 + 20 + 10
  },Q${start_operation * 40 + tranlength} ${minValue * 40 + 10 + 10},${
    start_operation * 40 + tranlength + 10
  } ${minValue * 40 + 10 + 10},L${end_operation * 40 + tranlength - 40 + 20},${
    minValue * 40 + 10 + 10
  } Q${end_operation * 40 + tranlength + 10 - 40 + 20} ${
    minValue * 40 + 10 + 10
  },${end_operation * 40 + tranlength + 10 - 40 + 20} ${
    minValue * 40 + 20 + 10
  }`
  // 最大值
  const maxValue = Math.max(...col)
  const downpathData = `M${start_operation * 40 + tranlength} ${
    maxValue * 40 + 10 + 40
  },Q${start_operation * 40 + tranlength} ${maxValue * 40 + 20 + 40} ${
    start_operation * 40 + tranlength + 10
  } ${maxValue * 40 + 20 + 40},L${end_operation * 40 + tranlength - 40 + 20} ${
    maxValue * 40 + 20 + 40
  },Q${end_operation * 40 + tranlength + 10 - 40 + 20} ${
    maxValue * 40 + 20 + 40
  } ${end_operation * 40 + tranlength + 10 - 40 + 20} ${
    maxValue * 40 + 10 + 40
  }`
  return (
    <g>
      <path
        d={toppathData}
        stroke="rgb(0, 45, 156)"
        // transform="rotate(180, 25, 50)"
        fill="none"
      ></path>
      <path d={downpathData} stroke="rgb(0, 45, 156)" fill="none"></path>
      <rect
        x={start_operation * 40 + tranlength}
        y={minValue * 40 + 20}
        fill="#f2f2f2"
        width={(end_operation - start_operation) * 40 - 10}
        opacity="0.5"
        height={(maxValue - minValue) * 40 + 40}
      ></rect>
      <text
        fontSize="12"
        x={
          ((start_operation + end_operation) / 2) * 40 +
          86 -
          (item.text.toString().length * 6) / 2 +
          6
        }
        y={maxValue * 40 + 40 + 30}
      >
        {item.text}
      </text>
    </g>
  )
}
