import React, { useState, useRef, useEffect } from "react"
import {
  Checkbox,
  Button,
  Drawer,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
  Dropdown,
  Menu,
  Card,
} from "antd"
import { InfoCircleOutlined } from "@ant-design/icons"
import AnalysisCircuit from "./components/AnalysisCircuit"
import NormalCircuit from "./components/NormalCircuit"
import RealeCircuit from "../RealeCircuit"
import RadarChart from "./components/RadarChart"
import styles from "./index.module.scss"
import QCEngine from "../../../simulator/MyQCEngine"
import {
  circuitBug,
  circuitAnalysis,
  circuitConfig,
  circuitpredict,
  circuitTime,
} from "../../../api/test_circuit"
import { getComList } from "../../../api/computer"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
// import { useSelector } from "react-redux"
// import { submitTask } from "@/api/test_circuit"
export default function AnalysisCircuitPage(props) {
  const { projectName, projectId } = useParams()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { Option } = Select
  let newQcEngine = new QCEngine()
  const Gates = props.analysisQc.circuit?.gates
  const [normalGates, setNormalGates] = useState([[]])
  const [qasm, setQasm] = useState(null)
  // 切换显示的电路
  const [changCircuitType, setchangCircuitType] = useState(false)
  const [activeTabKey1, setActiveTabKey1] = useState("编译前电路")

  // 在提交后将页面切换为真机
  const [showReal, setShowReal] = useState(false)
  useEffect(() => {
    if (props.analysisQc.circuit) {
      setNormalGates(Gates)
      let qasm_ = ""
      qasm_ = props.analysisQc.newexport()
      setQasm(qasm_)
      setanalysisData(null)
      setPredictData(0.95)
      setBugGates([])
      setEateError(null)
      setchangCircuitType(false)
      setActiveTabKey1("编译前电路")
    }
  }, [Gates, props])

  // bug检测
  const [bugGates, setBugGates] = useState([])
  const bugClick = async () => {
    try {
      if (qasm !== null) {
        const { data } = await circuitBug({ qasm: qasm })
        setBugGates(data.bug_positions)
        message.success("检测成功", 1)
      } else {
        message.error("请先运行项目代码", 1)
      }
    } catch (error) {
      message.error("检测失败", 1)
    }
  }
  // 编译
  const [analysisData, setanalysisData] = useState(null)
  // const [compiledQasm, setcompiledQasm] = useState(null)
  const analysisClick = async () => {
    setEateError(null)

    try {
      if (qasm !== null) {
        const { data } = await circuitAnalysis({
          parameter: {
            layout: layoutValue,
            routing: routing,
            translation: translation,
            optimization: optimization,
          },
          coms: computer,
          qasm: qasm,
        })
        // console.log(data, 6688)
        setanalysisData(data.compiled_qc.qasm)
        setchangCircuitType(true)
        setActiveTabKey1("编译后电路")
        message.success("编译成功", 1)
      } else {
        message.error("请先运行项目代码", 1)
      }
    } catch (error) {
      message.error("编译失败", 1)
    }
  }
  // 噪音
  const [gateError, setEateError] = useState(null)
  const [predictData, setPredictData] = useState(0.95)
  const [raderData, setRaderData] = useState([])
  const predictClick = async () => {
    try {
      if (analysisData !== null) {
        const { data } = await circuitpredict({ qasm: analysisData })
        setEateError(data.gate_errors)
        setPredictData(data.circuit_predict)
        if (raderData.length === 5) {
          let rader = raderData
          rader[4] = data.circuit_predict
          setRaderData(raderData)
        }

        message.success("预测成功", 1)
      } else {
        message.error("请先编译")
      }
    } catch (error) {}
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const submitClick = () => {
    setIsModalOpen(true)
  }
  // 确认提交真机
  const submit = async () => {
    setShowReal(true)
    // let sampleAndComputer = {}
    // form.validateFields().then((value) => {
    //   sampleAndComputer = value
    // })
    // const formData = new FormData()
    // formData.append("project_id", projectId)
    // formData.append("sample", sampleAndComputer.sample)
    // formData.append("export_qasm", qasm)
    // formData.append("computer_name", sampleAndComputer.comName)
    // formData.append("run_type", "sqcg")
    // formData.append("user_id", userData.user_id)
    // const { data } = await submitTask(formData)
    // const taskIdFormData = new FormData()
    // taskIdFormData.append("task_id", data.task_info.task_id)
    // setIsModalOpen(false)
    // const { data: resultDataObj } = await getTaskResult(taskIdFormData)
    // form.resetFields()
  }
  // 获取配置信息
  const getcircuitTime = async () => {
    const { data } = await circuitTime()
    console.log(data, "time")
  }
  useEffect(() => {
    getcircuitTime()
  }, [])
  // 获取计算机列表
  // const [computerList, setComputerList] = useState([])
  // const getComListFn = async () => {
  //   const formData = new FormData()
  //   formData.append("filter", JSON.stringify({ update_code: -1 }))
  //   const { data } = await getComList(formData)
  //   console.log(data, 88888)
  //   setComputerList(data.data.com_list)
  // }

  // useEffect(() => {
  //   // 获取计算机列表

  //   getComListFn()
  // }, [])
  // 分析配置
  const computerList = ["N36U19_0", "N36U19_1", "N36U19"]
  const LayoutData = ["Trivial", "Dense", "Noise_adaptive", "Sabre"]
  const RoutingData = ["Basic", "Lookahead", "Stochastic", "Sabre", "Toqm"]
  const TranslationData = ["Unroller", "Translator", "Synthesis"]
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
  const onClickComputer = (value) => {
    if (value == computer) {
      setComputer([])
    } else {
      setComputer([value])
    }
    submitConfig()
  }
  const onClickLayout = (value) => {
    if (value == layoutValue) {
      setLayoutValue([])
    } else {
      setLayoutValue([value])
    }
    submitConfig()
  }
  const onClickRouting = (value) => {
    if (value == routing) {
      setRouting([])
    } else {
      setRouting([value])
    }
    submitConfig()
  }
  const onClickTranslation = (value) => {
    if (value == translation) {
      setTranslation([])
    } else {
      setTranslation([value])
    }
    submitConfig()
  }
  const onChangeOptimization = (list) => {
    // console.log("radio checked", e.target.value);
    setOptimization(list)
    submitConfig()
  }
  // 提交配置
  // 抽屉开关
  const [open, setOpen] = useState(false)
  const setClick = () => {
    setOpen(true)
  }
  const submitConfig = async () => {
    let configData = {
      parameter: {
        layout: layoutValue,
        routing: routing,
        translation: translation,
        optimization: optimization,
      },
      coms: computer,
    }
    try {
      const { data } = await circuitConfig(configData)
      let rader = [...data.rader_data.score, predictData]
      setRaderData(rader)
      message.success("提交成功", 1)
      setOpen(false)
    } catch (error) {
      message.error("提交失败", 1)
    }
  }
  const onTab1Change = (key) => {
    setActiveTabKey1(key)
    // console.log(key, "key")
    if (key == "编译前电路") {
      setchangCircuitType(false)
    } else if ((key = "编译后电路")) {
      setchangCircuitType(true)
    }
  }
  const tabList = [
    {
      key: "编译前电路",
      tab: "编译前电路",
    },
    {
      key: "编译后电路",
      tab: "编译后电路",
    },
  ]
  const contentList = {
    编译前电路: <NormalCircuit bugGates={bugGates} normalGates={normalGates} />,
    编译后电路: (
      <AnalysisCircuit
        predictData={predictData}
        gateError={gateError}
        analysisData={analysisData}
      />
    ),
  }
  // config tab card
  const configTabList = [
    {
      key: "芯片",
      tab: "芯片",
    },
    {
      key: "布局算法",
      tab: "布局算法",
    },
    {
      key: "布线算法",
      tab: "布线算法",
    },
    {
      key: "门转换",
      tab: "门转换",
    },
    {
      key: "优化",
      tab: "优化",
    },
  ]
  const configContentList = {
    芯片: <div>1</div>,
    布局算法: <div>2</div>,
    布线算法: <div>3</div>,
    门转换: <div>4</div>,
    优化: <div>5</div>,
  }
  return (
    <>
      <div className={styles.root}>
        {showReal ? (
          <RealeCircuit />
        ) : (
          <div className="circuit">
            <div className="Circuit_top">
              <div className="normalCircuit">
                <Card
                  bordered={false}
                  style={{
                    width: "100%",
                  }}
                  extra={
                    !changCircuitType ? (
                      <Button onClick={bugClick}>bug检测</Button>
                    ) : (
                      <Button onClick={predictClick}>噪音分析</Button>
                    )
                  }
                  tabList={tabList}
                  activeTabKey={activeTabKey1}
                  onTabChange={(key) => {
                    onTab1Change(key)
                  }}
                >
                  {contentList[activeTabKey1]}
                </Card>
              </div>
              <div className="radom">
                <RadarChart raderData={raderData} />
              </div>
            </div>
            <div className="Circuit_down">
              <div className="analysisCircuit">
                <Button onClick={submitConfig}>提交配置</Button>
                {!changCircuitType ? (
                  <Button onClick={analysisClick}>编译</Button>
                ) : (
                  ""
                )}
                <div className="config">
                  <div className="optimized">
                    <div className="header">
                      <span>芯片</span>
                      <div className="icon">
                        <Tooltip
                          placement="topLeft"
                          title="Here you can choose which quantum chip your circuit would use.
"
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
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
                            className={computer[0] === item ? "select" : ""}
                            onClick={() => onClickComputer(item)}
                          >
                            {item}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="optimized">
                    <div className="header">
                      <span>布局算法</span>
                      <div className="icon">
                        <Tooltip
                          placement="topLeft"
                          title="This method defines the initial layout for your quantum circuit.
"
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="selectOptimizeda">
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
                      <span>布线算法</span>
                      <div className="icon">
                        <Tooltip
                          placement="topLeft"
                          title="This method defines which swap method to use for those two-qubits gates on qubits that are not directly linked.
"
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
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
                      <span>门转换</span>
                      <div className="icon">
                        <Tooltip
                          placement="topLeft"
                          title="This method defines how the advanced gates decomposed to basic gates.
"
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
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
                      <span>优化</span>
                      <div className="icon">
                        <Tooltip
                          placement="topLeft"
                          title="These methods are post-processing optimization for your quantum circuit. You can have multiple choices."
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
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
            </div>
          </div>
        )}

        <Modal
          title="提交任务"
          open={isModalOpen}
          onOk={submit}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form
            layout="vertical"
            name="submitValue"
            autoComplete="off"
            form={form}
          >
            <Form.Item
              name="sample"
              label={t("Submittask.Sampling frequency")}
              rules={[
                {
                  required: true,
                  message: t("Submittask.Sampling frequency"),
                },
              ]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              name="comName"
              label={t("Submittask.Computer of choice")}
              rules={[
                {
                  required: true,
                  message: t("Submittask.Computer of choice"),
                },
              ]}
            >
              <Select>
                {computerList.map((item, index) => (
                  <Option
                    key={index}
                    value={item.chip_name}
                    label={item.chip_name}
                  ></Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}
