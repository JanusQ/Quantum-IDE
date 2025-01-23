import React, { useRef, useEffect, useState } from 'react'
import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TitleComponent, TooltipComponent, GraphChart, CanvasRenderer])
export default function GraphEcharts({
  data,
  linksData,
  chipEditMddalOpen,
  setChipEditMddalOpen,
  setTitle,
  setSelectNodeData,
}) {
  const GraphEchartsRef = useRef()
  const option = {
    tooltip: {
      formatter: function (params) {
        if (params.dataType === 'node') {
          return params.name
        }
        if (params.dataType === 'edge') {
          return `${params.data.selfDefine}`
        }
      },
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        scaleLimit: {
          min: 1,
          max: 1,
        },
        type: 'graph',
        layout: 'none',
        symbolSize: 30,
        label: {
          show: true,
          fontSize: 8,
          color: '#fff',
        },
        data: data,
        links: linksData,
        lineStyle: {
          opacity: 0.9,
          width: 2,
          curveness: 0,
        },
        itemStyle: {
          color: function (params) {
            return params.data.color
          },
        },
      },
    ],
  }

  useEffect(() => {
    let myChart = echarts.getInstanceByDom(GraphEchartsRef.current)
    if (myChart == null) {
      myChart = echarts.init(GraphEchartsRef.current)
    }
    myChart.setOption(option)
    myChart.on('click', function (params) {
      if (params.dataType === 'series') {
        setTitle('编辑')
        console.log(params, 'series')
      }
      if (params.dataType === 'node') {
        setTitle('编辑')
        setSelectNodeData(params.data)
        setChipEditMddalOpen(true)
        console.log(params.data, 'node')
      }
      if (params.dataType === 'edge') {
        console.log(params, 'edge')
        setTitle('编辑')
      }
    })

    return () => {
      window.removeEventListener('resize', function () {
        myChart.resize()
      })
      myChart.dispose()
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%' }} ref={GraphEchartsRef}></div>
  )
}
