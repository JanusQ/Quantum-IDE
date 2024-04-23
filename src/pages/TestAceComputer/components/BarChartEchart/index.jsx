import React, { useRef, useEffect } from 'react'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import styles from './index.module.scss'
echarts.use([GridComponent, BarChart, CanvasRenderer])
export default function BarChartEchart({ chartData }) {
  const BarChartEchart = useRef()
  const option = {
    xAxis: {
      type: 'category',
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: chartData,
        type: 'bar',
      },
    ],
  }
  useEffect(() => {
    let myChart = echarts.getInstanceByDom(BarChartEchart.current)
    if (myChart == null) {
      myChart = echarts.init(BarChartEchart.current)
    }
    myChart.setOption(option)
  })
  return <div className={styles.root} ref={BarChartEchart}></div>
}
