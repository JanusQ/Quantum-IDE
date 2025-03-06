import React, { useState, useEffect } from 'react'
import MyQuantumCircuit from './myquantumCircuit'
import { Button, Card, Space, Tooltip, Row, Col, message } from 'antd'
import Editor from '@monaco-editor/react'
import styles from './index.module.scss'
import Gates from './Gates'
import X from './X'
import { delGateDataContext } from './context'
import { submitTask } from '@/api/test_circuit'
import SubmitTaskModal from '../Achievement/Components/SubmitTaskModal'
import BarChartEchart from '../Achievement/Components/BarChartEchart'

const circuit = new MyQuantumCircuit(5)

export default function Drag() {
  const { OneBitGateList, TowBitGateList } = Gates()
  const [svgHeight, setSvgHeight] = useState(500)
  const [svgWidth, setSvgWidth] = useState(800)
  const [circutGates, setCircutGates] = useState(circuit.gates)
  const [circuitGateList, setCircuitGateList] = useState([])
  const [dragGate, setDragGate] = useState(null)
  const [qasm, setQasm] = useState('')
  const [submitModal, setSubmitModal] = useState(false)

  const onChangeEditor = (value, event) => {
    setQasm(value)
    circuit.importQASM(value)
    setCircutGates(circuit.gates)
    handleCircuit(circuit)
  }
  // 拖拽门到画布上
  const handleDragGate = (gate) => {
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
          document.body.style.cursor = 'grabbing'
        }
      })
    }

    img.src = 'data:image/svg+xml,' + encodeURIComponent(svgData)
    document.addEventListener('mouseup', function (e) {
      if (img) {
        img.remove()
        // setDragGate(null)
        img = null
        document.body.style.cursor = 'default'
      }
    })
  }
  //释放鼠标事件

  const handleMouseDownSvg = (e) => {
    if (!dragGate) return
    const svgRect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - svgRect.left
    const mouseY = e.clientY - svgRect.top
    const x =
      Math.ceil((mouseX - 131) / 48) < 0
        ? 0
        : Math.ceil((mouseX - 130) / 48 - 1)
    const y =
      Math.ceil((mouseY + 20) / 40 - 3) < 0
        ? 0
        : Math.ceil((mouseY + 20) / 40 - 3)

    if (dragGate?.bit == 1) {
      handleAddGate(dragGate?.name, x, y)
    }
    if (dragGate?.bit == 2) {
      handleAddGate('cx', x, [y, y + 1])
    }

    setDragGate(null)
  }
  // 添加门到画布上
  const handleAddGate = (name, clo, row) => {
    circuit.addGate(name, clo, row)
    setQasm(circuit.exportQASM())
    setCircutGates(circuit.gates)
    handleCircuit(circuit)
  }
  // 删除门
  const handleDeleteGate = (id) => {
    circuit.removeGate(id)
    setQasm(circuit.exportQASM())
    setCircutGates(circuit.gates)
    handleCircuit(circuit)
  }

  const handleMouseMoveSvg = (e) => {
    if (!dragGate) return
    const svgRect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - svgRect.left
    const mouseY = e.clientY - svgRect.top
    const x =
      Math.ceil((mouseX - 131) / 48) < 0
        ? 0
        : Math.ceil((mouseX - 130) / 48 - 1)
    const y =
      Math.ceil((mouseY + 20) / 40 - 3) < 0
        ? 0
        : Math.ceil((mouseY + 20) / 40 - 3)

    if (dragGate?.bit == 1) {
      circuit.addGate(dragGate?.name, x, y)
    }
    if (dragGate?.bit == 2) {
      circuit.addGate('cx', x, [y, y + 1])
    }
    console.log(circuit.gates)

    // setDragGate(null)
    setQasm(circuit.exportQASM())

    setCircutGates(circuit.gates)
    handleCircuit(circuit)
  }

  // 处理电路图
  const handleCircuit = (circuit) => {
    var layer2inst = []
    let gates = circuit.gates
    let numq = gates.length
    let numl = gates[0].length
    // let
    for (let i = 0; i < numl; i++) {
      layer2inst.push([])
    }

    for (let i = 0; i < numq; i++) {
      let wire = gates[i]
      for (let la = 0; la < wire.length; la++) {
        if (wire[la] == null) continue
        let id = wire[la]['id']
        let flag = false
        let k = 0
        for (k = 0; k < layer2inst[la].length; k++) {
          if (id == layer2inst[la][k]['id']) {
            flag = true
            break
          }
        }
        if (flag == true) {
          //only allow 2 qubits gates now
          if (wire[la]['connector'] == 1) layer2inst[la][k]['qubits'].push(i)
          else layer2inst[la][k]['qubits'].unshift(i)
        } else {
          let gate = {}
          gate['id'] = wire[la]['id']
          gate['name'] = wire[la]['name']
          gate['qubits'] = [i]

          if ('params' in wire[la]['options'])
            gate['params'] = wire[la]['options']['params']
          else gate['params'] = {}
          layer2inst[la].push(gate)
        }
      }
    }
    setCircuitGateList(layer2inst)
  }
  const [probs, setProbs] = useState([])

  const runProgram = async ({ sample, computer_name }) => {
    const formData = new FormData()
    formData.append('project_id', 220)
    formData.append('project_name', 'test22')
    formData.append('computer_name', computer_name)
    formData.append('sample', sample)
    formData.append('export_qasm', JSON.stringify(circuitGateList))
    formData.append('run_type', 'qiskit')
    formData.append('user_id', 114)
    formData.append('label', 'test22')
    const { data } = await submitTask(formData)
    if (data.is_submit_success) {
      message.success('Success!')
      setProbs(data.probs)
      // let qcAfter = new QCEngine()
      // qcAfter.import(data.task_info.compiled_circuit)
      // setAfterCircuit(qcAfter.circuit.gates)
      setSubmitModal(false)
    } else {
      message.error('Failed!')
    }

    // console.log('formData', formData)
  }
  useEffect(() => {
    handleCircuit(circuit)
  }, [circutGates])

  return (
    <div className={styles.root}>
      <div className="operation_content">
        <Space>
          <Button onClick={() => setSubmitModal(true)}>运行</Button>
        </Space>
      </div>
      <Row>
        <Col span={4}>
          <div className="dragGate">
            <div className="oneBit">
              {OneBitGateList?.map((item, index) => (
                <Tooltip key={index} placement="topLeft" title={item.name}>
                  <svg
                    style={{ cursor: 'grab' }}
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="40"
                    height={item.bit * 40}
                    onMouseDown={() => handleDragGate(item)}
                    id={item.name}
                  >
                    {item.gate}
                  </svg>
                </Tooltip>
              ))}
            </div>
            <div className="towBit">
              {TowBitGateList?.map((item, index) => (
                <Tooltip key={index} placement="topLeft" title={item.name}>
                  <svg
                    style={{ cursor: 'grab' }}
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    key={index}
                    width="40"
                    height="80"
                    onMouseDown={() => handleDragGate(item)}
                    id={item.name}
                  >
                    {item.gate}
                  </svg>
                </Tooltip>
              ))}
            </div>
          </div>
        </Col>
        <Col span={16}>
          <div className="circuit_content">
            <svg
              id="mycircuitsvg"
              onMouseUp={handleMouseDownSvg}
              // onMouseMove={handleMouseMoveSvg}
              height={svgHeight}
              width={svgWidth}
            >
              <g transform="translate(40,50)">
                {Array.from({ length: 4 }).map((v, index) => (
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
                      x2={svgWidth - 80}
                      y2="40"
                      data-dis="0"
                      stroke="#C4C4C4"
                    ></line>
                  </g>
                ))}
                {circutGates.map((qubit, index) => (
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
                      x2={svgWidth - 80}
                      y2="40"
                      data-dis="0"
                      stroke="#C4C4C4"
                    ></line>
                  </g>
                ))}
                <delGateDataContext.Provider
                  value={{
                    handleAddGate,
                    handleDeleteGate,
                  }}
                >
                  {circuitGateList.map((gateX, index) => (
                    <X key={index} x={index} gateX={gateX} />
                  ))}
                </delGateDataContext.Provider>
              </g>
            </svg>
          </div>
          <div className="show_data_content">
            {probs.length > 0 ? <BarChartEchart chartData={probs} /> : null}
          </div>
        </Col>
        <Col span={4}>
          <div className="editr_Content">
            <Editor
              width={'100%'}
              height="90vh"
              defaultLanguage="qasm"
              value={qasm}
              onChange={onChangeEditor}
            />
          </div>
        </Col>
      </Row>
      <SubmitTaskModal
        type={'pysimulator'}
        runProgram={runProgram}
        submitModal={submitModal}
        setSubmitModal={setSubmitModal}
      />
    </div>
  )
}
