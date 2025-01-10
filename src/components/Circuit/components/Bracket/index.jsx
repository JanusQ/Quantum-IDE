import React from 'react'

export default function Bracket({ value, name, item }) {
  //括号使用 贝塞尔曲线详情可参考 const pathData =' M40,0 Q30,0 30,10 L30,90 Q30 100,40,100'
  const pathData = `M40,${value[0] * 40 + 30} Q30,${value[0] * 40 + 30} 30,${
    value[0] * 40 + 30 + 10
  } L30,${value[1] * 40 + 30 + 10 - 40} Q30 ${
    value[1] * 40 + 30 + 20 - 40
  },40,${value[1] * 40 + 30 + 20 - 40}`
  // console.log(value, name.lenght, item)
  return (
    <g>
      <text
        x={(name.length - 3) * -8}
        y={((value[1] + value[0]) / 2) * 40 + 25}
      >
        {name}
      </text>
      <path
        d={pathData}
        stroke="rgb(0, 45, 156)"
        // transform="rotate(180, 25, 50)"
        fill="none"
      />
    </g>
  )
}
