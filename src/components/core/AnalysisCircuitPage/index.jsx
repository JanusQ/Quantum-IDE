import React, { useState, useRef, useEffect, memo } from "react"
import {
  Checkbox,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
  Card,
  Radio,
  Table,
  Tabs,
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
import ChipTable from "./components/Table/ChipTable"
import LayoutTable from "./components/Table/LayoutTable"
import { Provider, KeepAlive } from "react-keep-alive"
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
      qasm_ = props.analysisQc.export()
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
  const [activeConfig, setactiveConfig] = useState("芯片")
  const onConfigTabChange = (key) => {
    setactiveConfig(key)
  }
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
  const columnsChips = [
    {
      title: "chip name",
      dataIndex: "chipName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "description",
      dataIndex: "description",
    },
    {
      title: "qubit number",
      dataIndex: "qubitNumber",
    },
    {
      title: "chip topology",
      dataIndex: "chipTopology",
    },
  ]
  const dataChips = [
    {
      key: "1",
      chipName: "N36U19_0",
      description: "N36U19_0 is a part of N36U19 with chained 5 qubits ",
      qubitNumber: 5,
      chipTopology: "N36U19_0 is a part of N36U19 with chained 5 qubits",
    },
    {
      key: "2",
      chipName: "N36U19_1",
      description: "N36U19_1 is a part of N36U19 with chained 5 qubits",
      qubitNumber: 5,
      chipTopology: "one dimension chain",
    },
    {
      key: "3",
      chipName: "N36U19",
      description: "N36U19 is a 10 qubit chip with chained topologys ",
      qubitNumber: 10,
      chipTopology: "one dimension chain",
    },
  ]
  const columnsLayout = [
    {
      title: "method name",
      dataIndex: "methodName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "description",
      dataIndex: "description",
    },
    {
      title: "estimated cost time",
      dataIndex: "time",
    },
  ]
  const dataLayout = [
    {
      key: "1",
      methodName: "Trivial",
      description:
        "Choose a Layout by assigning n circuit qubits to device qubits 0, .., n-1 using a simple round-robin order.",
      time: "5s",
    },
    {
      key: "2",
      methodName: "Dense ",
      description:
        "Choose a Layout by finding the most connected subset of qubits.",
      time: "5s",
    },
    {
      key: "3",
      methodName: "noise adapative",
      description:
        "Choose a noise-adaptive Layout based on current calibration data for the backend",
      time: "5s",
    },
    {
      key: "4",
      methodName: "sabre",
      description:
        "Choose a Layout via iterative bidirectional routing of the input circuit. The algorithm iterates a number of times until it finds an initial_layout that reduces full routing cost.",
      time: "5s",
    },
  ]
  const columnsRouting = [
    {
      title: "method name",
      dataIndex: "methodName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "description",
      dataIndex: "description",
    },
    {
      title: "estimated cost time",
      dataIndex: "time",
    },
  ]
  const dataRouting = [
    {
      key: "1",
      methodName: "Basic",
      description:
        "The basic mapper is a minimum effort to insert swap gates to map the DAG onto a coupling map. it inserts one or more swaps in front to make all multi-qubits gates compatible.",
      time: "5s",
    },
    {
      key: "2",
      methodName: "Lookahead ",
      description:
        "This algorithm searches through the available combinations of SWAP gates by means of a narrowed best first/beam search. Refer to https://medium.com/qiskit/improving-a-quantum-compiler-48410d7a7084.",
      time: "5s",
    },
    {
      key: "3",
      methodName: "Stochastic",
      description:
        "This algorithm uses a randomized algorithm to map a DAGCircuit onto a coupling_map by adding swap gates.",
      time: "5s",
    },
    {
      key: "4",
      methodName: "Sabre",
      description:
        "This algorithm starts from an initial layout of virtual qubits onto physical qubits, and iterates over the circuit DAG until all gates are exhausted, inserting SWAPs along the way. Refer to https://arxiv.org/pdf/1809.02573.pdf.",
      time: "5s",
    },
  ]
  const columnsTranslation = [
    {
      title: "method name",
      dataIndex: "methodName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "description",
      dataIndex: "description",
    },
    {
      title: "estimated cost time",
      dataIndex: "time",
    },
  ]
  const dataTranslation = [
    {
      key: "1",
      methodName: "Unroller",
      description:
        "Unroll non-basis, non-opaque instructions recursively to a desired basis, using decomposition rules defined for each instruction.",
      time: "5s",
    },
    {
      key: "2",
      methodName: "Translator",
      description:
        "Translates gates to a target basis by searching for a set of translations from a given EquivalenceLibrary.",
      time: "5s",
    },
    {
      key: "3",
      methodName: "Synthesis",
      description:
        "Synthesize gates according to their basis gates and synthesize unitaries over some basis gates. It can approximate 2-qubit unitaries given some approximation closeness measure. ",
      time: "5s",
    },
    {
      key: "4",
      methodName: "Sabre",
      description:
        "This algorithm starts from an initial layout of virtual qubits onto physical qubits, and iterates over the circuit DAG until all gates are exhausted, inserting SWAPs along the way. Refer to https://arxiv.org/pdf/1809.02573.pdf.",
      time: "5s",
    },
  ]
  const dataOptimizations = [
    {
      key: "1",
      methodName: "GatesOptimize",
      description:
        "Optimize chains of single-qubit u1, u2, u3 gates by combining them into a single gate.",
      time: "5s",
    },
    {
      key: "2",
      methodName: "CXCancellation",
      description: "Cancel back-to-back cx gates in dag. ",
      time: "5s",
    },
    {
      key: "3",
      methodName: "OptimizeCliffords",
      description:
        "Combine consecutive Cliffords over the same qubits. This serves as an example of extra capabilities enabled by storing Cliffords natively on the circuit.",
      time: "5s",
    },
    {
      key: "4",
      methodName: "GatesDecomposition",
      description:
        "Optimize chains of single-qubit gates by combining them into a single gate.",
      time: "5s",
    },
    {
      key: "5",
      methodName: "CommutativeCancellation",
      description:
        "Cancel the redundant self-adjoint gates through commutation relations. The cancellation utilizes the commutation relations in the circuit. ",
      time: "5s",
    },
    {
      key: "6",
      methodName: "DynamicDecoupling",
      description:
        "This method scans the circuit for idle periods of time and inserts a DD sequence of gates in those spots. These gates amount to the identity, so do not alter the logical action of the circuit, but have the effect of mitigating decoherence in those idle periods. ",
      time: "5s",
    },
  ]
  const chipSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRows[0].chipName)
      setComputer([selectedRows[0].chipName])
    },
  }
  const layoutSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRows[0].methodName)
      setLayoutValue(selectedRows[0].methodName)
    },
  }
  const routingSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRows[0].methodName)
      setRouting(selectedRows[0].methodName)
    },
  }
  const TranslationSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRows[0].methodName)
      setTranslation(selectedRows[0].methodName)
    },
  }
  const OptimizationsSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRows.methodName)
      setRouting(selectedRows.methodName)
      setLayoutValue(selectedRows.methodName)
    },
  }

  const configContentList = {
    芯片: (
      <div>
        <ChipTable />
      </div>
    ),
    布局算法: (
      <div>
        {/* <Table
          pagination={{
            position: ["none"],
          }}
          rowSelection={{
            type: "radio",
            ...layoutSelection,
          }}
          columns={columnsLayout}
          dataSource={dataLayout}
        /> */}
        <LayoutTable />
      </div>
    ),
    布线算法: (
      <div key="buxian">
        <Table
          pagination={{
            position: ["none"],
          }}
          rowSelection={{
            type: "radio",
            ...routingSelection,
          }}
          columns={columnsRouting}
          dataSource={dataRouting}
        />
      </div>
    ),
    门转换: (
      <div key="zhuanh">
        <Table
          pagination={{
            position: ["none"],
          }}
          rowSelection={{
            type: "radio",
            ...TranslationSelection,
          }}
          columns={columnsLayout}
          dataSource={dataTranslation}
        />
      </div>
    ),
    优化: (
      <div>
        <Table
          pagination={{
            position: ["none"],
          }}
          rowSelection={{
            type: "checkbox",
            ...OptimizationsSelection,
          }}
          columns={columnsLayout}
          dataSource={dataOptimizations}
        />
      </div>
    ),
  }
  const configItems = [
    {
      label: `芯片`,
      key: "1",
      children: (
        <Table
          pagination={{
            position: ["none"],
          }}
          rowSelection={{
            type: "radio",
            ...chipSelection,
          }}
          columns={columnsChips}
          dataSource={dataChips}
        />
      ),
    },
    {
      label: `布局算法`,
      key: "2",
      children: (
        <Table
          pagination={{
            position: ["none"],
          }}
          rowSelection={{
            type: "radio",
            ...layoutSelection,
          }}
          columns={columnsLayout}
          dataSource={dataLayout}
        />
      ),
    },
  ]
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
                  {/* <Card
                    style={{
                      width: "100%",
                    }}
                    title="配置选项"
                    tabList={configTabList}
                    activeTabKey={activeConfig}
                    onTabChange={onConfigTabChange}
                  >
                    {configContentList[activeConfig]}
                  </Card> */}
                  <Tabs
                    items={configItems}
                    defaultActiveKey="1"
                    centered
                  ></Tabs>
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
