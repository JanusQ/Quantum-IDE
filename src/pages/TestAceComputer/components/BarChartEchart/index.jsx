import React, { useRef, useEffect } from 'react'
import * as echarts from 'echarts/core'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import styles from './index.module.scss'
echarts.use([GridComponent, BarChart, CanvasRenderer, TooltipComponent])
export default function BarChartEchart({ chartData, runValue }) {
  console.log(runValue)
  const BarChartEchart = useRef()
  const option = {
    title: {
      text:
        runValue == 'qiskit'
          ? 'Simulation Result'
          : runValue == 'sqcg'
          ? 'Exection Result'
          : '',
    },
    color: ['rgb(80, 128, 132)'],
    xAxis: {
      type: 'category',
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        label: {
          show: chartData.length == 2 ? true : false,
          position: 'inside',
        },
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
  }, [chartData])
  return <div className={styles.root} ref={BarChartEchart}></div>
}
