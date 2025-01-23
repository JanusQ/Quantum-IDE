import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import TureStatus from './Components/Gates/TureStatus'
import NotSymbol from './Components/Gates/NotSymbol'
import UnderFindStatus from './Components/Gates/UnderFindStatus'
import AndSymbol from './Components/Gates/AndSymbol'
import FalseStatus from './Components/Gates/FalseStatus'
import { Col, Row, Button, Space, Badge } from 'antd'
import {
  PlusOutlined,
  ArrowRightOutlined,
  CloseOutlined,
} from '@ant-design/icons'
export default function SAT() {
  const gates = [
    { name: 'TureStatus', component: <TureStatus /> },
    { name: 'FalseStatus', component: <FalseStatus /> },
    { name: 'UnderFindStatus', component: <UnderFindStatus /> },
    { name: 'NotSymbol', component: <NotSymbol /> },
    { name: 'AndSymbol', component: <AndSymbol /> },
  ]
  const [dragGate, setDragGate] = useState(null)

  const drag = (gate) => {
    setDragGate(gate)
    const canvas = document.createElement('canvas') // 创建 Canvas 元素
    const ctx = canvas.getContext('2d')
    const svg = document.getElementById(gate.name) // 获取 SVG 元素
    const svgData = new XMLSerializer().serializeToString(svg) // 将 SVG 转换为字符串
    let img = new Image() // 创建新的 Image 对象
    img.onload = function () {
      canvas.width = svg.width.baseVal.value
      canvas.height = svg.height.baseVal.value
      ctx.drawImage(img, 0, 0) // 在 Canvas 上绘制图像
      // const link = document.createElement("a"); // 创建下载链接
      // link.download = "image.png";
      // link.href = canvas.toDataURL(); // 将 Canvas 转换为数据 URL
      // link.click(); // 触发下载
      img.style.position = 'fixed'
      img.style.cursor = 'pointer'
      img.style.pointerEvents = 'none'
      img.style.display = 'none'
      document.querySelector('body').appendChild(img)
      document.addEventListener('mousemove', function (e) {
        if (img) {
          img.style.left = `${e.pageX - 16}px`
          img.style.top = `${e.pageY - 16}px`
          img.style.display = 'block'
          img.style.pointerEvents = 'none'

          document.body.style.cursor = 'grabbing'
        }
      })
    }

    img.src = 'data:image/svg+xml,' + encodeURIComponent(svgData)
    document.addEventListener('mouseup', function (e) {
      if (img) {
        img.remove()
        setDragGate(null)
        img = null
        document.body.style.cursor = 'default'
      }
    })
    // console.log(gate)
  }
  // 释放gates的函数
  const releaseGates = (index) => {
    console.log('releaseGates', index)
    if (!dragGate) return

    const newRunData = [...runData]
    newRunData[index].push(dragGate)
    setRunData(newRunData)
  }
  const [selectGate, setSelectGate] = useState({
    index: null,
    gateIndex: null,
  })
  // 删除gates的函数
  const deleteGate = (index, gateIndex) => {
    setSelectGate({ index: null, gateIndex: null })
    const newRunData = [...runData]
    newRunData[index].splice(gateIndex, 1)
    setRunData(newRunData)
  }

  const addGate = (gate) => {}

  const [runData, setRunData] = useState([[], [], []])
  return (
    <div className={styles.root}>
      <div className="operation_content">
        <div className="drag_content">
          {gates.map((gate, index) => {
            return (
              <div
                onMouseDown={() => drag(gate)}
                className="drag_item"
                key={index}
              >
                <svg
                  id={gate.name}
                  xmlns="http://www.w3.org/2000/svg"
                  width={'32'}
                  height="32"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  {gate?.component}
                </svg>
              </div>
            )
          })}
        </div>
        <Space>
          <Button>运行</Button>
        </Space>
      </div>

      <div className="view_content">
        <Row gutter={16}>
          <Col span={11}>
            <div className="drag_area">
              <div className="title">释放区域</div>
              {runData.map((gateList, index) => {
                return (
                  <div
                    style={{ zIndex: 999 }}
                    onMouseUp={() => releaseGates(index)}
                    className="drag_X"
                    key={index}
                  >
                    {gateList.map((gate, currentGateIndex) => {
                      return (
                        <div
                          onClick={() => {
                            setSelectGate({
                              index,
                              gateIndex: currentGateIndex,
                            })
                          }}
                          className={
                            selectGate.index === index &&
                            selectGate.gateIndex === currentGateIndex
                              ? 'drag_item active'
                              : 'drag_item'
                          }
                          key={currentGateIndex}
                        >
                          <Badge
                            count={
                              selectGate.index === index &&
                              selectGate.gateIndex === currentGateIndex ? (
                                <CloseOutlined
                                  onClick={() =>
                                    deleteGate(index, currentGateIndex)
                                  }
                                  style={{ color: 'red' }}
                                />
                              ) : null
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={'32'}
                              height="32"
                              viewBox="0 0 32 32"
                              fill="currentColor"
                              className="w-6 h-6"
                            >
                              {gate.component}
                            </svg>
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setRunData([...runData, []])
                }}
              >
                添加
              </Button>
            </div>
          </Col>
          <Col span={2}>
            <div
              style={{ transform: 'translateY(50%)' }}
              className="right_arrow"
            >
              <ArrowRightOutlined
                style={{ fontSize: '32px', margin: '0 auto' }}
              />
            </div>
          </Col>
          <Col span={11}>
            <div className="result_area"></div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
