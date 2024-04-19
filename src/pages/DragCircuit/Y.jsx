import React, { useContext, useEffect, useState } from 'react'
import Cz from './Gate/Cz'
import U3 from './Gate/U3'
import U1 from './Gate/U1'
import U2 from './Gate/U2'
import Rxgate from './Gate/Rxgate'
import Rygate from './Gate/Rygate'
import Rzgate from './Gate/Rzgate'
import H from './Gate/H'
import Ygate from './Gate/Ygate'
import Zgate from './Gate/Zgate'
import Xgate from './Gate/Xgate'
import MeasurGate from './Gate/MeasurGate'
import Cx from './Gate/Cx'
import Cy from './Gate/Cy'
import Crx from './Gate/Crx'
import Cry from './Gate/Cry'
import Crz from './Gate/Crz'
import Cgate from './Gate/Cgate'
import CircleGate from './Gate/CircleGate'
import SquareGate from './Gate/SquareGate'
import { delGateDataContext } from './context'
import { Button, Modal, Form, InputNumber, Drawer } from 'antd'
import * as d3 from 'd3'
export default function Y({ gate, x, y }) {
  function findMaxAndMinIndex(arr) {
    let max = arr[0]
    let min = arr[0]
    let maxIndex = 0
    let minIndex = 0

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i]
        maxIndex = i
      }
      if (arr[i] < min) {
        min = arr[i]
        minIndex = i
      }
    }

    return { maxIndex, minIndex }
  }
  let Index

  if (gate) {
    Index = findMaxAndMinIndex(gate.qubit)

    // if (gate.qubit.length === 2) {
    // }
  }
  const [form] = Form.useForm()
  let delx = x
  // const [selectGate, setselectGate] = useState(null)
  // 判断两个对象是否相等
  const {
    selectGate,
    delGate,
    selGate,
    updateCircuit,
    changeGate,
    dragChangeGate,
  } = useContext(delGateDataContext)
  // 删除这个门
  const delThisGate = () => {
    delGate(x, gate)
    selGate(x, null)
  }

  // 选中门
  const selectThisGate = (e) => {
    d3.select('#removesvg').remove()
    selGate(x, gate)
  }
  // 修改门
  const [isModalOpen, setIsModalOpen] = useState(false)
  const onFinish = (value) => {
    // console.log(value)
    let changeGateData
    if (value.end !== null) {
      changeGateData = {
        name: value.name,
        qubit: [value.start, value.end],
      }
    } else {
      changeGateData = {
        name: value.name,
        qubit: [value.start],
      }
    }
    if (gate.qubit[0] == value.start && gate.qubit[1] == value.end) return
    changeGate(x, gate, changeGateData)
    form.resetFields()
  }
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleContextMenu = (e) => {
    showModal()
  }
  let drag = false
  // 拖拽电路图内的门
  const dragUpGate = (e) => {
    selGate(x, gate)
    e.stopPropagation()
    if (e.button == 2) return
    drag = true
    const dragEleWidth = 32
    let dragEleHeight = 36
    let lineHeight = 0
    if (gate.qubit.length > 1) {
      dragEleHeight =
        (gate.qubit[Index.maxIndex] - gate.qubit[Index.minIndex] + 1) * 40
      lineHeight =
        (gate.qubit[Index.maxIndex] - gate.qubit[Index.minIndex]) * 40
    }
    let svg = d3
      .select('body')
      .append('svg')
      .attr('width', dragEleWidth)
      .attr('height', dragEleHeight)
      .attr('id', 'movesvg')
    // const svg = d3.select("svg")

    let g = svg.append('g')
    // 创建rect元素，并设置其属性
    switch (gate?.qubit.length) {
      case 2:
        let line = g.append('line')
        line
          .attr('x1', 16)
          .attr('x2', 16)
          .attr('y1', 16)
          .attr('y2', lineHeight + 16)
          .attr('stroke', 'rgb(0, 45, 156)')
          .attr('stroke-width', 2)
        for (let index = 0; index < gate?.qubit.length; index++) {
          let cy =
            16 +
            (gate.qubit[Index.maxIndex] - gate.qubit[Index.minIndex]) *
              40 *
              index

          if (index == Index.minIndex) {
            let circle = g.append('circle')
            circle
              .attr('cx', 16)
              .attr('cy', cy)
              .attr('r', 4)
              .attr('fill', 'rgb(0, 45, 156)')
          } else {
            let circle1 = g.append('circle')
            circle1
              .attr('cx', 16)
              .attr('cy', cy)
              .attr('r', 16)
              .attr('fill', 'rgb(0, 45, 156)')
            let text
            if (gate.name.length === 3) {
              text = gate.name.substring(1).toUpperCase()
            } else {
              text = gate.name.toUpperCase()
            }
            g.append('text')
              .attr('x', 8)
              .attr('y', cy + 5)
              .attr('fill', '#ffffff')
              .attr('stroke', 'transparent')
              .text(text)
          }
        }

        break
      case 1:
        if (gate.name == 'x' || gate.name == 'y' || gate.name == 'z') {
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(0, 45, 160)')
        }
        if (
          gate.name == 'rx' ||
          gate.name == 'ry' ||
          gate.name == 'u1' ||
          gate.name == 'u2' ||
          gate.name == 'u3'
        ) {
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(159, 24, 83)')
        }
        if (gate.name == 'rz') {
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(51, 177, 255)')
        }
        if (gate.name == 'h') {
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(250, 77, 86)')
        }
        g.append('text')
          .attr('x', 8)
          .attr('y', 21.5)
          .attr('fill', '#ffffff')
          .text(gate.name.toUpperCase())
        if (gate.name == 'measure') {
          let d =
            'M25.2941 11.584H22.7981L25.2301 8.008V7H21.6141V8H23.9101L21.4861 11.576V12.584H25.2941V11.584ZM15.5662 23.4664C15.5662 24.0836 15.0658 24.584 14.4485 24.584C13.8313 24.584 13.3309 24.0836 13.3309 23.4664C13.3309 22.8621 13.8104 22.3699 14.4096 22.3494L17.1775 17.9208C16.3359 17.5757 15.4144 17.3855 14.4485 17.3855C10.4729 17.3855 7.25 20.6084 7.25 24.584H6C6 19.918 9.78254 16.1355 14.4485 16.1355C15.658 16.1355 16.8081 16.3896 17.8483 16.8474L19.5068 14.1939L20.5668 14.8564L18.9545 17.4361C21.3236 18.9327 22.8971 21.5746 22.8971 24.584H21.6471C21.6471 22.0216 20.3082 19.7719 18.2919 18.4962L15.4698 23.0116C15.5317 23.1505 15.5662 23.3044 15.5662 23.4664Z'
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(168, 168, 168)')

          g.append('path').attr('d', d).attr('fill', '#000')
        }
        if (
          gate.name !== 'h' &&
          gate.name !== 'x' &&
          gate.name !== 'y' &&
          gate.name !== 'z' &&
          gate.name !== 'rx' &&
          gate.name !== 'ry' &&
          gate.name !== 'rz' &&
          gate.name !== 'u1' &&
          gate.name !== 'u2' &&
          gate.name !== 'u3' &&
          gate.name !== 'measure'
        ) {
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(0, 45, 160)')
          g.append('text')
            .attr('x', 8)
            .attr('y', 21.5)
            .attr('fill', '#ffffff')
            .text(gate.name.toUpperCase())
        }
        break
      default:
        break
    }
    const svgNS = svg.node().namespaceURI
    svg.node().setAttributeNS(null, 'style', 'position: fixed')
    svg.node().style.display = 'none'
    document.addEventListener('mousemove', function (e) {
      svg.node().style.cursor = 'grabbing'
      svg.node().style.left = `${e.clientX - 16}px`
      svg.node().style.top = `${e.clientY - 16}px`
      svg.node().style.display = 'block'
      if (!drag) {
        svg.remove()
      }
    })
    svg.node().addEventListener('mouseup', function (e) {
      let mysvg = document.getElementById('mycircuitsvg')
      const mousex = e.clientX - mysvg.getBoundingClientRect().left
      const mousey = e.clientY - mysvg.getBoundingClientRect().top
      const x =
        Math.ceil((mousex - 131) / 48 - 1) < 0
          ? 0
          : Math.ceil((mousex - 130) / 48 - 1)
      const y =
        Math.ceil((mousey + 20) / 40 - 3) < 0
          ? 0
          : Math.ceil((mousey + 20) / 40 - 3)
      drag = false
      delGate(delx, gate)
      dragChangeGate(x, y, gate)
      selGate(x, null)
    })
  }

  const onMouseLeave = () => {
    if (!drag) {
      d3.select('#removesvg').remove()
    }
  }
  document.querySelector('body').addEventListener('mouseup', function (e) {
    drag = false
    d3.select('#removesvg').remove()
  })
  document.addEventListener('click', function () {
    drag = false
    d3.select('#removesvg').remove()
  })
  return (
    <g onMouseLeave={onMouseLeave} onMouseDown={dragUpGate} name={gate.name}>
      {gate.qubit.length > 1 && (
        <line
          strokeWidth="2"
          stroke="rgb(0, 45, 156)"
          x1={16}
          x2={16}
          y1={gate.qubit[0] * 40 + 40}
          y2={gate.qubit[1] * 40 + 40}
        ></line>
      )}
      {gate && gate.qubit.length === 1 ? (
        <g transform={`translate(0,${gate.qubit[0] * 40 + 24})`}>
          {(() => {
            switch (gate.name) {
              case 'h':
                return <H />
              case 'x':
                return <Xgate />
              case 'y':
                return <Ygate />
              case 'x':
                return <Xgate />
              case 'z':
                return <Zgate />
              case 'rx':
                return <Zgate />
              case 'z':
                return <Rxgate />
              case 'ry':
                return <Rygate />
              case 'rz':
                return <Rzgate />
              case 'u1':
                return <U1 />
              case 'u2':
                return <U2 />
              case 'u3':
                return <U3 />
              case 'measure':
                return <MeasurGate />
              default:
                return <SquareGate name={gate.name} />
            }
          })()}
        </g>
      ) : (
        ''
      )}
      {gate && gate.qubit.length === 2 && gate.qubit[0] < gate.qubit[1] ? (
        <g
          className="zcmax"
          transform={`translate(0,${gate.qubit[Index.maxIndex] * 40 + 24})`}
        >
          {(() => {
            switch (gate.name) {
              case 'cx':
                return <Xgate />
              case 'cy':
                return <CircleGate name={'Y'} />
              case 'cz':
                return <CircleGate name={'Z'} />
              case 'crx':
                return <CircleGate x={'8'} name={'RX'} />
              case 'cry':
                return <CircleGate x={'8'} name={'RY'} />
              case 'crz':
                return <CircleGate x={'8'} name={'RZ'} />
              default:
                return <CircleGate name={gate.name} />
            }
          })()}
        </g>
      ) : (
        ''
      )}
      {/* 当下标1的值大于大于下标0的值时正常渲染 当下标1的值小于下标0的值时 如果根据 */}
      {gate && gate.qubit.length === 2 && gate.qubit[0] < gate.qubit[1] ? (
        <g
          className="zcmin"
          transform={`translate(0,${gate.qubit[Index.minIndex] * 40 + 24})`}
        >
          {(() => {
            switch (gate.name) {
              case 'cx':
                return <Cgate />
              case 'cy':
                return <Cgate />
              case 'cz':
                return <Cgate />
              case 'crx':
                return <Cgate />
              case 'cry':
                return <Cgate />
              case 'crz':
                return <Cgate />
              default:
                return <Cgate />
            }
          })()}
        </g>
      ) : (
        ''
      )}
      {gate && gate.qubit.length === 2 && gate.qubit[0] > gate.qubit[1] ? (
        <g
          className="fdmin"
          transform={`translate(0,${gate.qubit[Index.minIndex] * 40 + 24})`}
        >
          {(() => {
            switch (gate.name) {
              case 'cx':
                return <Xgate />
              case 'cy':
                return <CircleGate name={'Y'} />
              case 'cz':
                return <CircleGate name={'Z'} />
              case 'crx':
                return <CircleGate x={'8'} name={'RX'} />
              case 'cry':
                return <CircleGate x={'8'} name={'RY'} />
              case 'crz':
                return <CircleGate x={'8'} name={'RZ'} />
              default:
                return <CircleGate name={gate.name} />
            }
          })()}
        </g>
      ) : (
        ''
      )}
      {/* 当下标1的值大于大于下标0的值时正常渲染 当下标1的值小于下标0的值时 如果根据 */}
      {gate && gate.qubit.length === 2 && gate.qubit[0] > gate.qubit[1] ? (
        <g
          className="min"
          transform={`translate(0,${gate.qubit[Index.maxIndex] * 40 + 24})`}
        >
          {(() => {
            switch (gate.name) {
              case 'cx':
                return <Cgate />
              case 'cy':
                return <Cgate />
              case 'cz':
                return <Cgate />
              case 'crx':
                return <Cgate />
              case 'cry':
                return <Cgate />
              case 'crz':
                return <Cgate />
              default:
                return <Cgate />
            }
          })()}
        </g>
      ) : (
        ''
      )}
      {selectGate?.x == x && selectGate?.y == y && (
        <g>
          <g onClick={delThisGate}>
            <g
              transform={`translate(-1,${
                gate.qubit[Index.minIndex] * 40 + 18
              })`}
            >
              <path
                d="M39 -3L45 3M45 -3L39 3 "
                strokeWidth="1"
                stroke="#434343"
                className="gate-del-icon"
              ></path>
              <circle
                r="7.5"
                cx="42"
                cy="0"
                strokeWidth="1"
                stroke="#e3e3e3"
                fill="transparent"
              ></circle>
            </g>
          </g>
          <g
            onClick={showModal}
            transform={`translate(-1,${gate.qubit[Index.minIndex] * 40 + 14})`}
          >
            <circle
              r="7.5"
              cx="0"
              cy="0"
              strokeWidth="1"
              stroke="#e3e3e3"
              fill="#ffffff"
            ></circle>
            <path
              d="M-1.5 -4L1.5 -4L1.5 4L0 6L-1.5 4ZM-1.5 -2L1.5 -2M-1.5 4 "
              fill="none"
              strokeWidth="1"
              stroke="#434343"
              transform="matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,0.7071067811865475,0.2928932188134524)"
            ></path>
          </g>
        </g>
      )}
      <g transform="translate(-2,-1)">
        <rect
          cursor="pointer"
          name={gate.name}
          onContextMenu={handleContextMenu}
          onClick={selectThisGate}
          strokeWidth="1"
          stroke={
            (selectGate?.x == x && selectGate?.y == y && 'rgb(0, 45, 156)') ||
            'transparent'
          }
          width={36}
          height={
            gate.qubit[Index.maxIndex] - gate.qubit[Index.minIndex] > 0
              ? (gate.qubit[Index.maxIndex] - gate.qubit[Index.minIndex] + 1) *
                40
              : 36
          }
          y={gate.qubit[Index.minIndex] * 40 + 23}
          fill="transparent"
        ></rect>
      </g>
      <Drawer
        title="修改门"
        placement="left"
        closable={false}
        onClose={handleCancel}
        open={isModalOpen}
        key="left"
        width={200}
      >
        <Form
          initialValues={{
            name: gate?.name,
            start: gate.qubit[0],
            end: gate.qubit[1],
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="name"
            name="name"
            rules={[
              { required: true, message: 'Please InputNumber  your username!' },
            ]}
          >
            <InputNumber disabled={true} />
          </Form.Item>
          {/* <div className="div">name</div> */}
          <Form.Item
            label="start"
            name="start"
            rules={[
              {
                type: 'number',
                required: true,
                message: 'Please InputNumber  your username!',
              },
            ]}
          >
            <InputNumber min={0} type="number" />
          </Form.Item>
          {gate.qubit.length === 2 && (
            <Form.Item
              label="end"
              name="end"
              rules={[
                {
                  type: 'number',
                  required: true,
                  message: 'Please InputNumber  your username!',
                },
              ]}
            >
              <InputNumber min={0} type="number" />
            </Form.Item>
          )}

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button onClick={handleOk} type="primary" htmlType="submit">
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </g>
  )
}
