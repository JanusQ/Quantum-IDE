import React, { useState, useRef, useEffect } from "react"
import { Button, message, Tabs, Select, Space } from "antd"
import downloadSvg from "svg-crowbar"
import { circuitExample } from "./alg"
import { decompose_gates } from "./decmp"
import SimpleModen from "./SimpleModen"
import NormalMden from "./NormalMden"
export default function Composer() {
  const inputRef = useRef()
  const [circuit, setcircuit] = useState(
    circuitExample["hamiltonian_simulation_50"]
  )
  const circuitArray = circuit.map((gates) => [...gates])
  let delCircuit = []
  for (let i = 0; i < circuit.length; i++) {
    delCircuit.push(decompose_gates(circuit[i]))
  }
  let delCurcuitLenght = []
  for (let index = 0; index < delCircuit.length; index++) {
    delCurcuitLenght.push(delCircuit[index].length)
  }
  let delCircuit1 = []
  for (let k = 0; k < delCircuit.length; k++) {
    if (delCircuit[k].length >= 1) {
      for (let j = 0; j < delCircuit[k].length; j++) {
        delCircuit1.push(delCircuit[k][j])
      }
    }
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
  const maxqubit = findMaxQubit(circuitArray)

  let qubitLineArry = []
  for (let index = 0; index <= maxqubit; index++) {
    qubitLineArry.push(index)
  }

  // 导入数据
  const [jsonData, setJsonData] = useState(null)
  const onClick = () => {
    inputRef.current.click()
  }
  const handleFileUpload = (event) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const result = JSON.parse(reader.result)
        setJsonData(result)

        // 将解析得到的 JSON 对象存入状态中
      } catch (error) {
        message.error(error)
      }
    }
    reader.readAsText(event.target.files[0])
  }
  useEffect(() => {
    if (jsonData?.length) {
      setcircuit(jsonData)
    }
  }, [jsonData])
  const exportSvg = () => {
    downloadSvg(document.getElementById(circuitModern))
  }
  // 导出json文件
  const exportJosn = () => {
    const jsonData = JSON.stringify(circuit)

    const blob = new Blob([jsonData], { type: "application/json" })

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "circuit.json"
    link.click()
  }
  // 切换电路图模式
  const [circuitModern, setcircuitModern] = useState("Normal")
  const changeMdern = (key) => {
    setcircuitModern(key)
  }
  const items = [
    {
      key: "Normal",
      label: `Normal`,
      children: (
        <NormalMden
          delCircuit1={delCircuit1}
          qubitLineArry={qubitLineArry}
          circuit={circuit}
          delCurcuitLenght={delCurcuitLenght}
        />
      ),
    },
    {
      key: "Simple",
      label: `Simple`,
      children: (
        <SimpleModen
          delCircuit1={delCircuit1}
          qubitLineArry={qubitLineArry}
          circuit={circuit}
          delCurcuitLenght={delCurcuitLenght}
        />
      ),
    },
  ]
  // 案例选择
  const circuitkeys = Object.keys(circuitExample)
  let circuitOption = []
  for (let index = 0; index < circuitkeys.length; index++) {
    circuitOption.push({ value: circuitkeys[index], lable: circuitkeys[index] })
  }
  const changeCircuitExample = (e) => {
    setcircuit(circuitExample[e])
  }
  return (
    <div style={{ background: "#fff" }}>
      <div
        style={{
          marginTop: 20,
          marginLeft: 20,
        }}
        className="uploding"
      >
        <input
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
          type="file"
          accept=".json"
        ></input>
        <Space>
          <Button onClick={onClick}>导入数据(json)</Button>

          <Button
            onClick={exportSvg}
            style={{
              marginLeft: 10,
            }}
          >
            导出图片
          </Button>
          <Button
            onClick={exportJosn}
            style={{
              marginLeft: 10,
            }}
          >
            导出数据(json)
          </Button>
          <Select
            defaultValue="hamiltonian_simulation_50"
            style={{
              width: 120,
            }}
            onChange={changeCircuitExample}
            options={circuitOption}
          />
        </Space>
      </div>

      <div
        style={{
          background: "#fff",
          marginTop: 20,
          marginLeft: 20,
          overflowX: "scroll",
          overflowY: "scroll",
        }}
        className="svgConten"
      >
        <Tabs onChange={changeMdern} defaultActiveKey="1" items={items} />
      </div>
    </div>
  )
}
