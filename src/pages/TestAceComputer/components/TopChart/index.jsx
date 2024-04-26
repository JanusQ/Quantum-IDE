import React, { useRef, useEffect } from 'react'
import BarChartEchart from '../BarChartEchart'
export default function TopChart({ chartData, initOption, runValue }) {
  const canvasRef = useRef()

  let zero = [0, 1, 4, 5, 8, 9, 12, 13]
  let one = [2, 3, 6, 7, 10, 11, 14, 15]
  let VQA = []
  let zerohe = 0
  let onehe = 0

  if (initOption == 'VQA') {
    for (let i = 0; i < chartData.length; i++) {
      if (zero.includes(i)) {
        zerohe += chartData[i]
      }
      if (one.includes(i)) {
        onehe += chartData[i]
      }
    }
    VQA[0] = zerohe
    VQA[1] = onehe
  }

  return (
    <>
      {chartData.length ? (
        <BarChartEchart
          runValue={runValue}
          chartData={initOption !== 'VQA' ? chartData : VQA}
        />
      ) : (
        ''
      )}
    </>
  )
}
