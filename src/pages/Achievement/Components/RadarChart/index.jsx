import React, { useState, useRef, useEffect } from 'react'
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { useTranslation } from 'react-i18next'

echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])

export default function MyRadarChart(props) {
  // 中英切换
  const { t } = useTranslation()
  console.log('radarData', props.raderData)
  const radarChart = useRef()
  const option = {
    title: {
      text: t('analysis.Overall improvement'),
    },
    tooltip: {
      trigger: 'axis',
    },
    radar: {
      indicator: [
        { name: t('analysis.Number of gates'), max: 1 },
        { name: t('analysis.Parallelism'), max: 1 },
        { name: t('analysis.Compilation speed'), max: 1 },
        { name: t('analysis.Circuit depth'), max: 1 },
        { name: t('analysis.Fidelity'), max: 1 },
      ],
      axisName: {
        color: 'black',
        fontWeight: 700,
        fontSize: 15,
      },
      center: ['50%', '50%'],
      radius: '58%',
    },

    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        tooltip: {
          trigger: 'item',
        },
        data: [
          {
            value: props.raderData,
            name: t('analysis.Overall improvement'),
            areaStyle: {
              color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                {
                  color: 'rgba(24, 144, 255, 0.5)',
                  offset: 0,
                },
                {
                  color: 'rgba(24, 144, 255, 0.9)',
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
    let myChart = echarts.getInstanceByDom(radarChart.current)
    if (myChart == null) {
      myChart = echarts.init(radarChart.current)
    }
    myChart.setOption(option)
    window.addEventListener('resize', () => {
      myChart.resize()
    })
    return () => {
      window.removeEventListener('resize', () => {
        myChart.resize()
      })
    }
  }, [props.raderData])
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
      className="radarChart"
      ref={radarChart}
    ></div>
  )
}
