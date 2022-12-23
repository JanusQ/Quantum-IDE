import React, { useState, useRef, useEffect } from "react"
import * as echarts from "echarts/core"
import { TitleComponent, LegendComponent } from "echarts/components"
import { RadarChart } from "echarts/charts"
import { CanvasRenderer } from "echarts/renderers"

echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])

export default function MyRadarChart(props) {
  const radarChart = useRef()
  const option = {
    title: {
      text: "预期结果",
    },
    tooltip: {
      trigger: "axis",
    },
    radar: {
      indicator: [
        { name: "门数量提升", max: 1 },
        { name: "并行度提升", max: 1 },
        { name: "编译速度", max: 1 },
        { name: "深度提升", max: 1 },
        { name: "保真度", max: 1 },
      ],
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        tooltip: {
          trigger: "item",
        },
        data: [
          {
            value: props.raderData,
            name: "预期数据",
            areaStyle: {
              color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                {
                  color: "rgba(24, 144, 255, 0.5)",
                  offset: 0,
                },
                {
                  color: "rgba(24, 144, 255, 0.9)",
                  offset: 1,
                },
              ]),
            },
          },
        ],
      },
    ],
  }
  useEffect(() => {
    const myChart = echarts.init(radarChart.current)
    myChart.setOption(option)
  })
  return <div className="radarChart" ref={radarChart}></div>
}
