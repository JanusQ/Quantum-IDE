import React, { useState, useEffect, useRef } from 'react'
import X from './X'
import styles from './index.module.scss'
import downloadSvg from 'svg-crowbar'
import dragCircuit from './qasm'
import { delGateDataContext } from './context'
import {
  Button,
  Space,
  Tooltip,
  Modal,
  Form,
  Input,
  ColorPicker,
  InputNumber,
} from 'antd'
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
import SquareGate from './Gate/SquareGate'
import CustomTowBitGat from './Gate/CustomTowBitGat'
let myquantionCircuit = new dragCircuit()

export default function DragCircuit() {
  const svgRef = useRef()
  const [circuit, setstateCircuit] = useState(myquantionCircuit.circuit)
  const circuitArray = circuit.map((gates) => [...gates])
  const maxqubit = findMaxQubit(circuitArray)
  let qubitLineArry = []
  for (let index = 0; index <= maxqubit; index++) {
    qubitLineArry.push(index)
  }
  if (qubitLineArry.length < 4) {
    qubitLineArry = [1, 2, 3, 4]
  }
  function findMaxQubit(circuit) {
    return circuit.reduce((max, gates) => {
      const maxQubit = gates.reduce(
        (gatesMax, gate) => Math.max(gatesMax, ...(gate.qubit || [])),
        0
      )
      return Math.max(maxQubit, max)
    }, 0)
  }
  const width =
    circuit.length * 50 + 500 > 1000 ? circuit.length * 50 + 500 : 1000
  const svgHeight =
    qubitLineArry.length * 40 + 300 > 600
      ? qubitLineArry.length * 40 + 300
      : 600
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
      document.querySelector('.ant-layout-content').appendChild(img)
      document.addEventListener('mousemove', function (e) {
        if (img) {
          img.style.left = `${e.pageX - 16}px`
          img.style.top = `${e.pageY - 16}px`
          img.style.display = 'block'
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
  // 真实修改
  let realChange = false
  let delX = 0
  const addCircuitGate = (e, gate) => {
    const svgRect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - svgRect.left
    const mouseY = e.clientY - svgRect.top
    let ygate = console.log(mouseY - 70, 'ygate')
    const x =
      Math.ceil((mouseX - 131) / 48) < 0
        ? 0
        : Math.ceil((mouseX - 130) / 48 - 1)
    const y =
      Math.ceil((mouseY + 20) / 40 - 3) < 0
        ? 0
        : Math.ceil((mouseY + 20) / 40 - 3)
    delX = x
    if (dragGate?.bit == 2) {
      myquantionCircuit.addGate({ name: dragGate.name, qubit: [y, y + 1] }, x)
      setstateCircuit(myquantionCircuit.circuit)
    } else if (dragGate?.bit === 1) {
      myquantionCircuit.addGate({ name: dragGate.name, qubit: [y] }, x)
      setstateCircuit(myquantionCircuit.circuit)
    }
  }
  const dragChangeGate = (x, y, gate) => {
    const { qubit, name } = gate
    const czq1 = Math.abs(qubit[1] - qubit[0])
    if (qubit.length == 2) {
      if (qubit[1] - qubit[0] > 0) {
        myquantionCircuit.addGate({ name: name, qubit: [y, czq1 + y] }, x)
      } else {
        myquantionCircuit.addGate({ name: name, qubit: [czq1 + y, y] }, x)
      }

      setstateCircuit(myquantionCircuit.circuit)
    } else if (qubit.length == 1) {
      myquantionCircuit.addGate({ name: name, qubit: [y] }, x)
      setstateCircuit(myquantionCircuit.circuit)
    }
    setupdateCircuit(updateCircuit + 1)
  }
  const handleMouseDown = (e) => {
    realChange = true
    gateSelectMoveMouseUp()
    addCircuitGate(e)
  }

  const [OneBitGateList, setOneBitGateList] = useState([
    {
      name: 'h',
      gate: <H />,
      bit: 1,
    },
    {
      name: 'x',
      gate: <Xgate />,
      bit: 1,
    },
    {
      name: 'y',
      gate: <Ygate />,
      bit: 1,
    },
    {
      name: 'z',
      gate: <Zgate />,
      bit: 1,
    },
    {
      name: 'rx',
      gate: <Rxgate />,
      bit: 1,
    },
    {
      name: 'ry',
      gate: <Rygate />,
      bit: 1,
    },
    {
      name: 'rz',
      gate: <Rzgate />,
      bit: 1,
    },
    {
      name: 'u1',
      gate: <U1 />,
      bit: 1,
    },
    {
      name: 'u2',
      gate: <U2 />,
      bit: 1,
    },
    {
      name: 'u3',
      gate: <U3 />,
      bit: 1,
    },
    {
      name: 'measure',
      gate: <MeasurGate />,
      bit: 1,
    },
  ])
  const [TowBitGateList, setTowBitGateList] = useState([
    {
      name: 'cx',
      gate: <Cx />,
      bit: 2,
    },
    {
      name: 'cy',
      gate: <Cy />,
      bit: 2,
    },
    {
      name: 'cz',
      gate: <Cz />,
      bit: 2,
    },
    {
      name: 'crx',
      gate: <Crx />,
      bit: 2,
    },
    {
      name: 'cry',
      gate: <Cry />,
      bit: 2,
    },
    {
      name: 'crz',
      gate: <Crz />,
      bit: 2,
    },
  ])

  const [updateCircuit, setupdateCircuit] = useState(0)
  const delGate = (x, dlgate) => {
    myquantionCircuit.removeGate(x, dlgate)
    setstateCircuit(myquantionCircuit.circuit)
    setupdateCircuit(updateCircuit + 1)
  }
  const [selectGate, setSelectGate] = useState()

  const selGate = (x, slgate) => {
    if (!slgate) {
      setSelectGate(null)
      return
    }
    const y = myquantionCircuit.selectGate(x, slgate)
    setSelectGate({ x, y })
  }
  const changeGate = (x, changeGate, changecontent) => {
    // console.log(x, changeGate, changecontent)
    myquantionCircuit.changeGate(x, changeGate, changecontent)
    setstateCircuit(myquantionCircuit.circuit)
    setupdateCircuit(updateCircuit + 1)
  }
  // 导出svg图片
  const exportSvg = () => {
    downloadSvg(document.getElementById('mycircuitsvg'))
  }
  // 导出json文件
  const exportJosn = () => {
    const jsonData = JSON.stringify(circuit)

    const blob = new Blob([jsonData], { type: 'application/json' })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'circuit.json'
    link.click()
  }
  // 自定义量子门
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [gateColor, setGateColor] = useState('rgb(0, 45, 160)')
  const customGate = () => {
    setIsModalOpen(true)
  }
  const customGateColor = (e) => {
    console.log(e.metaColor.a, 66)
    setGateColor(
      `rgb(${e.metaColor.r},${e.metaColor.g},${e.metaColor.b},${e.metaColor.a})`
    )
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onFinish = (values) => {
    if (values.gateBit == 1) {
      let oneBitGate = OneBitGateList.push({
        name: values.gateName,
        bit: 1,
        gate: <SquareGate color={gateColor} name={values.gateName} />,
      })
      console.log(oneBitGate)
    } else if (values.gateBit == 2) {
      TowBitGateList.push({
        name: values.gateName,
        bit: 2,
        gate: <CustomTowBitGat color={gateColor} name={values.gateName} />,
      })
      console.log(TowBitGateList, 899)
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  // 门框选
  const [isGateSelect, setIsGateSelect] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [endX, setEndX] = useState(0)
  const [endY, setEndY] = useState(0)
  const handlegateSelect = (e) => {
    if (selectGate || dragGate) return
    const svgRect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - svgRect.left
    const mouseY = e.clientY - svgRect.top
    setStartX(mouseX)
    setStartY(mouseY)
    setEndX(mouseX)
    setEndY(mouseY)
    setIsGateSelect(true)
  }
  const gateSelectMouseMove = (e) => {
    if (isGateSelect) {
      const svgRect = e.currentTarget.getBoundingClientRect()
      const mouseX = e.clientX - svgRect.left
      const mouseY = e.clientY - svgRect.top
      setEndX(mouseX)
      setEndY(mouseY)
    }
  }
  const gateSelectMoveMouseUp = (e) => {
    setIsGateSelect(false)
    // 当x坐标除于40的的余数大于8时向上取整 小于8向下取整
    // 当y坐标除于48的余数大于4时向上取整 小于向下取整
    const handleCoordinate = (x, y) => {
      if (x) {
        if ((x - 131) / 48 < 0) return 0
        if ((x - 130) / 48) {
          const remainder = (x - 130) % 48
          if (remainder > 4) return Math.ceil((x - 131) / 48)
          if (remainder < 4) return Math.floor((x - 131) / 48)
        }
      }
      if (y) {
        if (y - 70 < 0) return 0
        if (y - 70) {
          const remainder = (y - 70) % 40
          if (remainder > 8) return Math.ceil((y - 70) / 40 - 1)
          if (remainder < 8) return Math.floor((y - 70) / 40 - 1)
        }
      }
    }
    const x1 = handleCoordinate(startX, null)
    const y1 = handleCoordinate(null, startY)
    const x2 = handleCoordinate(endX, null)
    const y2 = handleCoordinate(null, endY)

    // const x1 =
    //   Math.round((startX - 131) / 48) < 0
    //     ? 0
    //     : Math.round((startX - 130) / 48 - 1)
    // const y1 =
    //   Math.round((startY + 20) / 40 - 3) < 0
    //     ? 0
    //     : Math.round((startY + 20) / 40 - 3)
    // const x2 =
    //   Math.round((endX - 131) / 48) < 0 ? 0 : Math.round((endX - 130) / 48 - 1)
    // const y2 =
    //   Math.round((endY + 20) / 40 - 3) < 0
    //     ? 0
    //     : Math.round((endY + 20) / 40 - 3)
    console.log(startX, endX, startY, endY, 99)
    const selected = []
    const startRow = Math.min(x1, x2)
    const endRow = Math.max(x1, x2)
    const startCol = Math.min(y1, y2)
    const endCol = Math.max(y1, y2)
    console.log(
      startRow,
      endRow,
      startCol,
      endCol,
      'startRow,endRow,startCol,endCol'
    )
    // console.log(startRow);

    for (let i = startRow; i < endRow; i++) {
      for (let j = 0; j < circuit.length; j++) {
        if (circuit[i] && circuit[i][j]) {
          const maxQubit = Math.max(...circuit[i][j].qubit)
          const minQubit = Math.min(...circuit[i][j].qubit)
          if (startCol <= minQubit && endCol >= maxQubit) {
            selected.push(circuit[i][j])
          }
        }
      }
    }
    console.log(selected, 'selected')
  }
  return (
    <div className={styles.root}>
      <div className="dragGate">
        <div className="oneBit">
          {OneBitGateList.map((item, index) => (
            <Tooltip key={index} placement="topLeft" title={item.name}>
              <svg
                style={{ cursor: 'grab' }}
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="40"
                height={item.bit * 40}
                onMouseDown={() => drag(item)}
                id={item.name}
              >
                {item.gate}
              </svg>
            </Tooltip>
          ))}
        </div>
        <div className="towBit">
          {TowBitGateList.map((item, index) => (
            <Tooltip key={index} placement="topLeft" title={item.name}>
              <svg
                style={{ cursor: 'grab' }}
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                key={index}
                width="40"
                height="80"
                onMouseDown={() => drag(item)}
                id={item.name}
              >
                {item.gate}
              </svg>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="drag_content">
        <div className="jsonCircuitData">
          <ul>
            {circuit.map((qubit, index) => (
              <li key={index}>
                <div>
                  timeStep[{index}]
                  <ul>
                    {qubit?.map((gate, index) => (
                      <li key={index}>
                        <span>
                          {gate?.name}'['{gate.qubit.join(',')}']'
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="svg_content_f">
          <div className="operationCircuit">
            <Space>
              <Button>运行</Button>
              <Button onClick={exportJosn}>导出JSON</Button>
              <Button onClick={exportSvg}>导出电路图</Button>
              <Button onClick={customGate}>自定Gate</Button>
            </Space>
          </div>
          <div
            className="scrll_content"
            style={{
              overflowX: 'scroll',
              overflowY: 'scroll',
              height: 600,
              width: '100%',
              maxWidth: '100%',
            }}
          >
            <div
              style={{
                width: width,
                height: svgHeight,
              }}
              className="svg_content"
            >
              <svg
                ref={svgRef}
                id="mycircuitsvg"
                fill="transparent"
                onMouseUp={handleMouseDown}
                onMouseDown={handlegateSelect}
                onMouseMove={gateSelectMouseMove}
                width={width}
                height={svgHeight}
              >
                <rect
                  x={Math.min(startX, endX)}
                  y={Math.min(startY, endY)}
                  width={Math.abs(endX - startX)}
                  height={Math.abs(endY - startY)}
                  fill="transparent"
                  strokeWidth="2"
                  stroke="black"
                ></rect>

                <g transform="translate(40,50)">
                  {qubitLineArry.map((qubit, index) => (
                    <g
                      key={index}
                      transform={`translate(60,${
                        20 + index * 40 ? index * 40 : 0
                      })`}
                    >
                      <g transform="translate(-14,4)">
                        <text
                          x="38.4"
                          y="36"
                          dy=".3em"
                          fill="rgb(111, 111, 111)"
                          fontWeight="400"
                          textAnchor="end"
                          fontSize="14px"
                        >
                          <tspan>q[{index}]</tspan>
                        </text>
                      </g>
                      <line
                        className="qubit"
                        strokeWidth="2"
                        x1="30"
                        y1="40"
                        x2={width - 80}
                        y2="40"
                        data-dis="0"
                        stroke="#C4C4C4"
                      ></line>
                    </g>
                  ))}
                  {circuit.map((item, index) => (
                    <delGateDataContext.Provider
                      key={index}
                      value={{
                        selectGate,
                        delGate,
                        selGate,
                        updateCircuit,
                        changeGate,
                        dragChangeGate,
                      }}
                    >
                      <X key={index} x={index} item={item} />
                    </delGateDataContext.Provider>
                  ))}
                </g>
                {/* 框选 */}
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="自定义量子门"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            gateBit: 1,
            gateColor: 'rgb(0, 45, 160)',
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="gateName"
            name="gateName"
            rules={[
              {
                required: true,
                message: 'Please input your gateName!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="gateBit"
            name="gateBit"
            rules={[
              {
                required: true,
                message: 'Please input your gateBit!',
              },
            ]}
          >
            <InputNumber min={1} max={2} defaultValue={1} />
          </Form.Item>
          <Form.Item
            label="gateColor"
            name="gateColor"
            rules={[
              {
                required: true,
                message: 'Please input your gateColor!',
              },
            ]}
          >
            <ColorPicker
              defaultValue={'rgb(0, 45, 160)'}
              value={gateColor}
              format="rgb"
              onChange={customGateColor}
            />
            {/* <Input addonAfter={<ColorPicker />} /> */}
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              确然添加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
