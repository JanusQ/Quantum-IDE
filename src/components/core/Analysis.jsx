import React, { useState, useRef, useEffect } from "react"
import "../styles/Analysis.scss"
import { Radio, Checkbox, Button } from "antd"
import { SettingOutlined } from "@ant-design/icons"
import * as echarts from "echarts"
import Circuit from "./Circuit"
import QCEngine from "../../simulator/MyQCEngine"
import { getComList } from "../../api/computer"
export default function Analysis(props) {
  const { radarData, circuitPreditt, CircuitAnalysisData } = { ...props }
  // circuit_predict和其他数据是两个接口需要合并一下
  let radarValue = [...radarData, circuitPreditt.circuit_predict]
  const main = useRef()
  const option = {
    title: {
      text: "预期结果",
    },
    tooltip: {
      trigger: "axis",
    },
    radar: {
      indicator: [
        { name: "门数量", max: 1 },
        { name: "并行度", max: 1 },
        { name: "编译速度", max: 1 },
        { name: "深度", max: 1 },
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
            value: radarValue,
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
  const LayoutData = ["trivial", "dense", "noise_adaptive", "sabre"]
  const RoutingData = ["basic", "lookahead", "stochastic", "sabre", "toqm"]
  const TranslationData = ["unroller", "translator", "synthesis"]
  const optimizationData = [
    "GatesOptimize",
    "CXCancellation",
    "OptimizeCliffords",
    "GatesDecomposition",
    "CommutativeCancellation",
    "DynamicDecoupling",
  ]
  const [layoutValue, setLayoutValue] = useState([])
  const [routing, setRouting] = useState([])
  const [translation, setTranslation] = useState([])
  const [optimization, setOptimization] = useState([])
  // 选择的计算机
  const [computer, setComputer] = useState([])
  let configData = {
    parameter: {
      layout: layoutValue,
      routing: routing,
      translation: translation,
      optimization: optimization,
    },
    computer: computer,
  }
  const onChangeLayout = (e) => {
    // console.log("radio checked", e.target.value);
    setLayoutValue([e.target.value])
  }
  const onChangeRouting = (e) => {
    // console.log("radio checked", e.target.value);
    setRouting([e.target.value])
  }
  const onChangeTranslation = (e) => {
    // console.log("radio checked", e.target.value);
    setTranslation([e.target.value])
  }
  const onChangeOptimization = (list) => {
    // console.log("radio checked", e.target.value);
    setOptimization(list)
  }
  const onChangeComputerList = (e) => {
    // console.log("radio checked", e.target.value);
    setComputer([e.target.value])
    // console.log(computer);
  }
  // 取消单选框
  const cancle = (type) => {
    switch (type) {
      case "translation":
        setTranslation([])
        break
      case "routing":
        setRouting([])
        break
      case "layout":
        setLayoutValue([])
        break
      case "computer":
        setComputer([])
        break
      default:
        break
    }
  }
  // 获取计算机列表
  const [computerList, setComputerList] = useState([])
  const getComListFn = async () => {
    const formData = new FormData()
    formData.append("filter", JSON.stringify({ update_code: -1 }))
    const { data } = await getComList(formData)
    setComputerList(data.com_list)
  }
  useEffect(() => {
    // 获取计算机列表

    getComListFn()
  }, [])
  useEffect(() => {
    const myChart = echarts.init(main.current)
    myChart.setOption(option)
  }, [radarValue])
  useEffect(() => {
    props.parameter(configData)
    // console.log(configData, 66)
  }, [layoutValue, routing, translation, optimization, computer])
  const runAnalysis = () => {
    props.changCircuit(true)
    props.runProgram(true)
  }
  const [computerData, setcomputerData] = useState(null)
  const onClickComputer = (value) => {
    if (value == computer) {
      setComputer([])
    } else {
      setComputer([value])
    }
  }
  const onClickLayout = (value) => {
    if (value == layoutValue) {
      setLayoutValue([])
    } else {
      setLayoutValue([value])
    }
  }
  const onClickRouting = (value) => {
    if (value == routing) {
      setRouting([])
    } else {
      setRouting([value])
    }
  }
  const onClickTranslation = (value) => {
    if (value == translation) {
      setTranslation([])
    } else {
      setTranslation([value])
    }
  }
  const onClickOptimization = (value, index) => {
    // console.log(optimization[1], 6677)
    // console.log(optimization[index], 1, value)
    if (optimization[index] == value) {
      let optArr = optimization
      let newoptArr = optArr.filter((item) => item !== value)
      setOptimization(newoptArr)
      console.log(newoptArr, 8899)
    } else {
      let optarr = optimization
      console.log(optimization)
      console.log(optarr[index], 6)
      let newoptarr = optarr.push(value)
      console.log(optarr, 55)
      setOptimization(newoptarr)
    }
    console.log(optimization)
  }
  return (
    <div className="compile">
      <span>{props.circuitType ? "编译后" : "编译前"}</span>
      <div className="top">
        <div className="circuit">
          <Circuit
            circuitType={props.circuitType}
            circuitPreditt={circuitPreditt}
            circuitData={CircuitAnalysisData}
          />
        </div>
        <div className="chart">
          <div ref={main} className="radarChart"></div>
        </div>
      </div>
      <div className="middle">
        <div>配置</div>
        <Button onClick={runAnalysis} type="primary" style={{ marginTop: 10 }}>
          Analysis
        </Button>
        <div className="config">
          <div
            style={{
              width: "50%",
              height: 23,
              backgroundColor: "rgb(51, 129, 253)",
              marginLeft: 0,
            }}
            className="Progress"
          ></div>
        </div>
      </div>
      <div className="down">
        <div className="optimized">
          <div className="header">
            <span>coms</span>
            <div className="icon">
              <SettingOutlined />
            </div>
          </div>
          <div className="selectOptimizeda">
            {/* <Radio.Group onChange={onChangeComputerList} value={computer[0]}>
              {computerList.map((item, index) => (
                <div key={index}>
                  <Radio
                    onClick={() => cancle("computer")}
                    value={item.chip_name}
                  >
                    {item.chip_name}
                  </Radio>
                </div>
              ))}
            </Radio.Group> */}
            {computerList.map((item, index) => (
              <div key={index} className="selectList">
                <div
                  className={computer[0] === item.chip_name ? "select" : ""}
                  onClick={() => onClickComputer(item.chip_name)}
                >
                  {item.chip_name}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="optimized">
          <div className="header">
            <span>layout</span>
            <div className="icon">
              <SettingOutlined />
            </div>
          </div>
          <div className="selectOptimizeda">
            {/* <Radio.Group onChange={onChangeLayout} value={layoutValue[0]}>
              {LayoutData.map((item, index) => (
                <div key={index}>
                  <Radio onClick={() => cancle("layout")} value={item}>
                    {item}
                  </Radio>
                </div>
              ))}
            </Radio.Group> */}
            {LayoutData.map((item, index) => (
              <div key={index} className="selectList">
                <div
                  className={layoutValue[0] === item ? "select" : ""}
                  onClick={() => onClickLayout(item, index)}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="optimized">
          <div className="header">
            <span>routing</span>
            <div className="icon">
              <SettingOutlined />
            </div>
          </div>
          <div className="selectOptimizeda">
            {/* <Radio.Group onChange={onChangeRouting} value={routing[0]}>
              {RoutingData.map((item, index) => (
                <div key={index}>
                  <Radio onClick={() => cancle("routing")} value={item}>
                    {item}
                  </Radio>
                </div>
              ))}
            </Radio.Group> */}
            {RoutingData.map((item, index) => (
              <div key={index} className="selectList">
                <div
                  className={routing[0] === item ? "select" : ""}
                  onClick={() => onClickRouting(item)}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="optimized">
          <div className="header">
            <span>translation</span>
            <div className="icon">
              <SettingOutlined />
            </div>
          </div>
          <div className="selectOptimizeda">
            {/* <Radio.Group onChange={onChangeTranslation} value={translation[0]}>
              {TranslationData.map((item, index) => (
                <div key={index}>
                  <Radio onClick={() => cancle("translation")} value={item}>
                    {item}
                  </Radio>
                </div>
              ))}
            </Radio.Group> */}
            {TranslationData.map((item, index) => (
              <div key={index} className="selectList">
                <div
                  className={translation[0] === item ? "select" : ""}
                  onClick={() => onClickTranslation(item)}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="optimized">
          <div className="header">
            <span>optimization</span>
            <div className="icon">
              <SettingOutlined />
            </div>
          </div>
          <div className="selectOptimized">
            <Checkbox.Group
              value={optimization}
              options={optimizationData}
              onChange={onChangeOptimization}
            ></Checkbox.Group>
            {/* {optimizationData.map((item, index) => (
              <div key={index} className="selectList">
                <div
                  className={optimization[index] === item ? "select" : ""}
                  onClick={() => onClickOptimization(item, index)}
                >
                  {item}
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  )
}
