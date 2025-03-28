import React, { useRef, useEffect, useState } from 'react'
import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, message, Modal, Space } from 'antd'
import { deleteCoupling } from '@/api/chip'
echarts.use([TitleComponent, TooltipComponent, GraphChart, CanvasRenderer])
export default function GraphEcharts({
  data,
  linksData,
  chipEditMddalOpen,
  setChipEditMddalOpen,
  setTitle,
  setSelectNodeData,
  drawerOpen,
  getChipDetailGraphData,
}) {
  const [modal, contextHolder] = Modal.useModal()
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
  const [name, setName] = useState('')

  const confirm = (value) => {
    modal.confirm({
      title: '删除该耦合器？',
      icon: <ExclamationCircleOutlined />,
      content: value.selfDefine,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const { data } = await deleteCoupling({ id: value.coupler_id })
        message.success('删除成功')
        getChipDetailGraphData()

        console.log('OK', data)
      },
    })
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
        confirm(params.data)
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
  }, [linksData])

  return (
    <div style={{ width: 650, height: 650 }} ref={GraphEchartsRef}>
      {contextHolder}
    </div>
  )
}
