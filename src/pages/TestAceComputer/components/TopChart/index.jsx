import React, { useRef, useEffect } from 'react'
import BarChartEchart from '../BarChartEchart'
export default function TopChart({ chartData, initOption, runValue }) {
  const canvasRef = useRef()
  console.log(chartData, 'chartData')
  useEffect(() => {
    if (initOption == 'VQA' && runValue == 'sqcg' && chartData.length) {
      const canvas = canvasRef.current
      console.log(canvas, 888)

      let ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      console.log(chartData, 'chartData')
      const grayscaleValues = []
      for (let i = 0; i < 8; i++) {
        grayscaleValues.push(chartData[2]?.slice(i * 8, (i + 1) * 8))
      }
      const squareSize = 40
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const value = grayscaleValues[i][j]
          const colorValue = Math.round(255 - (255 * value * 30) / 8) // 计算颜色值
          const color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`
          ctx.fillStyle = color
          ctx.fillRect(j * squareSize, i * squareSize, squareSize, squareSize)
        }
      }
    }
  }, [chartData])

  return (
    <>
      {initOption == 'VQA' && runValue == 'sqcg' ? (
        <div style={{ width: '100%', height: '100%' }} className="gray_chart">
          <canvas ref={canvasRef} id="canvas" width={320} height={320}></canvas>
          <div className="pro">pro:{chartData[0]}</div>{' '}
          <div className="abel">abel:{chartData[1]}</div>
        </div>
      ) : (
        <BarChartEchart chartData={chartData} />
      )}
    </>
  )
}
