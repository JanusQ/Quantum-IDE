import logo from "./logo.svg"
import "./App.css"
import "./components/styles/CommonAntDesign.css"
import Ace from "./components/core/Ace"
import Right from "./components/core/Right"
import Analysis from "./components/core/Analysis"
import AnalysisCircuitPage from "./components/core/AnalysisCircuitPage"
import ConsoleComponent from "./components/core/ConsoleComponent"
import axios from "axios"
import React, { useState, useRef, useEffect } from "react"
import { exportSVG } from "./simulator/CommonFunction"
import QCEngine from "./simulator/MyQCEngine"
// import QuantumCircuit from "./simulator/QuantumCircuit"

// import QuantumCircuit from "quantum-circuit"
import {
  cos,
  sin,
  round,
  pi,
  complex,
  create,
  all,
  max,
  sparse,
  hartreeEnergyDependencies,
} from "mathjs"
import ComponentTitle from "../src/components/core/ComponentTitle"
import {
  pow2,
  binary,
  binary2qubit1,
  range,
  toPI,
  qubit12binary,
  unique,
  sum,
  alt_tensor,
  calibrate,
  getExp,
  linear_entropy,
  binary2int,
  average,
  spec,
} from "./simulator/CommonFunction"
// import MathJax from 'mathJax'
import { getDirac } from "./components/Mathjax"
import Layout from "./components/core/Layout"
import {
  Modal,
  Checkbox,
  message,
  Input,
  Radio,
  Form,
  Select,
  AutoComplete,
} from "antd"
import {
  send_to_real,
  recieve_from_real,
  saveProject,
  submitTask,
  loadPro,
  circuitAnalysis,
  circuitpredict,
} from "./api/test_circuit"
import { values } from "lodash"
import { getComList } from "./api/computer"
import { useParams } from "react-router-dom"
import { isAuth } from "./helpers/auth"
import { computerParamsChat, computerD3 } from "./helpers/computerParamsChart"
import { getTaskResult } from "./api/project"
import { uploadOperation } from "./api/operationLog"
import { submitLog } from "./util/submitLog"
import { useTranslation } from "react-i18next"
import "antd/lib/table/style/css.js"

// import QCEngine from './simulator/MyQCEngine'
// import './test/meausre'
// import './test/reset'
// import './test/ex2-4'
// import './test/myRun'
// import './test/write01'
// import './test/ccnot'
// import './test/permutes'
// import QuantumCircuit from './simulator/QuantumCircuit'
// import './test/matrixOpertation'
// import './test/ncphase'
// import './test/ex7-1'
// import './test/ex7-7'
// import './test/all_operation'
// import './test/istest.js'
// import './test/index.js';
// import './test/test_entropy';
// import './test/test_pmi.js'
// import './test/inout_state_test.js'
// import './test/evomatrix_test'
// import './test/variablefilter_test.js'
// import './test/setstatetest.js'
// import './test/canShow_test.js'

function App() {
  const _ = require("lodash")
  // 提供的case列表
  const initCaseList = [
    {
      value: "engine_gates debug",
    },
    {
      value: "Quantum Conditional Execution",
    },
    {
      value: "Gate Teleportation",
    },
    {
      value: "Simon's Algorithm",
    },
    {
      value: "Phase estimation",
    },
    {
      value: "Grover's Algorithm",
    },
    {
      value: "Adding two quantum intergers",
    },
    {
      value: "Entangled Qubits",
    },
    {
      value: "Bernstein-Vazirani Algorithm",
    },
    {
      value: "Quantum Fourier Transform",
    },
    {
      value: "Deutsch-Jozsa Algorithm",
    },
    // {
    // 	value: "Shor's Algorithm",
    // },
    // {
    // 	value: 'user_study',
    // },
    // {
    // 	value: 'into_evolution',
    // },
    // {
    // 	value: 'case 1',
    // },
    // {
    // 	value: 'bell_state',
    // },
    // {
    // 	value: 'all gates',
    // },
    // {
    // 	value: 'ex7-7',
    // },
    // {
    // 	value: 'ex7-1',
    // },
    {
      value: "Markov Process",
    },
  ]
  // 背景色

  const [backcolor, setBackcolor] = useState("black")
  const [optionList, setOptionList] = useState([])
  // 中英文
  const { t, i18n } = useTranslation()

  // 编辑器内容
  const [editorValue, setEditorValue] = useState("")
  // console的内容
  const [consoleValue, setConsoleValue] = useState(null)
  const [circuit, setcircuit] = useState([])
  // 编辑器输入
  function onChange(newValue) {
    setEditorValue(newValue)
  }
  const auth = isAuth()
  // {user_id: 2, username: 'wangxuanhe', user_type: 0} 6666
  const { projectName, projectId } = useParams()

  // 分发事件
  const dispathRun = () => {
    if (
      runValue === "sqcg" ||
      runValue === "sqcg_cluster" ||
      runValue === "qiskit"
    ) {
      setSubmitModalVisible(true)
    } else {
      runProgram()
    }
  }
  // 运行
  const runProgram = (sample) => {
    let noBug = false
    let qc = new QCEngine()

    const { qint } = qc
    // TODO: 这些也要写在文档里面
    const {
      cos,
      sin,
      round,
      pi,
      complex,
      create,
      all,
      max,
      sparse,
      acos,
      asin,
      sqrt,
    } = require("mathjs")
    const {
      pow2,
      binary,
      binary2qubit1,
      range,
      toPI,
      qubit12binary,
      unique,
      sum,
      alt_tensor,
      calibrate,
      getExp,
      linear_entropy,
      binary2int,
      average,
      spec,
    } = require("./simulator/CommonFunction")
    const {
      tensor,
      groundState,
      tensorState,
    } = require("./simulator/MatrixOperation")

    //bind function
    let gates = [
      "cx",
      "cy",
      "cz",
      "ch",
      "csrn",
      "cr2",
      "cr4",
      "cr8",
      "crx",
      "cry",
      "crz",
      "cu1",
      "cu2",
      "cu3",
      "cs",
      "ct",
      "csdg",
      "ctdg",
      "ccx",
      "id",
      "x",
      "y",
      "z",
      "h",
      "srn",
      "srndg",
      "r2",
      "r4",
      "r8",
      "s",
      "t",
      "sdg",
      "tdg",
      "rx",
      "ry",
      "rz",
      "u1",
      "u2",
      "u3",
      "swap",
      "iswap",
      "srswap",
      "xy",
      "ms",
      "yy",
      "zz",
      "had",
      "hadamard",
      "not",
      "reset",
      "cnot",
      "phase",
      "startlabel",
      "endlabel",
      "ccnot",
      "ncnot",
      "ncphase",
      "qprint",
      "cphase",
    ]
    var cx,
      cy,
      cz,
      ch,
      csrn,
      cr2,
      cr4,
      cr8,
      crx,
      cry,
      crz,
      cu1,
      cu2,
      cu3,
      cs,
      ct,
      csdg,
      ctdg,
      ccx,
      id,
      x,
      y,
      z,
      h,
      srn,
      srndg,
      r2,
      r4,
      r8,
      s,
      t,
      sdg,
      tdg,
      rx,
      ry,
      rz,
      u1,
      u2,
      u3,
      swap,
      iswap,
      srswap,
      xy,
      ms,
      yy,
      zz,
      had,
      hadamard,
      not,
      reset,
      cnot,
      phase,
      startlabel,
      endlabel,
      ccnot,
      ncnot,
      ncphase,
      cphase,
      qprint
    //let gates =['had']
    let bind_str = "gate_name = qc.gate_name.bind(qc);\n "
    let bind_str_all = ""
    for (let ind = 0; ind < gates.length; ind++) {
      let gate = gates[ind]
      bind_str_all += bind_str.replace(/gate_name/g, gate)
    }

    eval(bind_str_all)

    try {
      eval(editorValue)
      consoleContent(true, qc.console_data)
      noBug = true
    } catch (error) {
      consoleContent(false, error.message)
      noBug = false
    }
    // 模拟器
    if (noBug && runValue === "JavaScript_simulator") {
      qc.runCircuit()
      // console.log(qc,999);
      exportSVG(qc)
    }
    // 真机
    if (
      noBug &&
      (runValue === "sqcg" ||
        runValue === "sqcg_cluster" ||
        runValue === "qiskit")
    ) {
      realRun(qc, sample, runValue)
    }

    if (noBug && runValue === "analysis") {
      setAnalysisQc(qc)
      setBackcolor("#fff")
    }
  }
  const [analysisQc, setAnalysisQc] = useState({})
  async function testfunc(qc) {
    //qc.import(0);
    let data = {}
    data["qasm"] = qc.newexport()

    // console.log(data['qasm'])
    data["sample"] = 1000
    data["type"] = "sqcg"
    var id
    id = await send_to_real(data)
    const params = {}
    params.result_id = id["data"]["result_id"]
    params.type = "sqcg"
    // console.log(params)
    let res = await recieve_from_real(params)
    // console.log(res)
  }
  // 分析
  const [parameter, setParameter] = useState({})
  const [CircuitAnalysisData, setCircuitAnalysisData] = useState({})
  const [circuitPreditt, setCircuitPreditt] = useState({})
  //
  // 是否展示真机电路
  const [circuitType, setcircuitType] = useState(false)
  const changCircuit = (type) => {
    setcircuitType(type)
  }
  const beforAlalysis = (qc) => {
    setCircuitAnalysisData(qc.circuit)
  }
  // 雷达图数据
  const [radarData, setRadarData] = useState([])
  const runCircuitAlalysis = async (qc) => {
    const hide = message.loading("正在编译", 0, () => {})
    let analysisData = {}
    analysisData["qasm"] = qc.newexport()
    analysisData["coms"] = parameter.computer
    analysisData["parameter"] = parameter.parameter
    let predictData = { qasm: qc.newexport() }
    try {
      const analysisRes = await circuitAnalysis(analysisData)
      const predictRes = await circuitpredict(analysisData)
      const score = analysisRes.data.compiled_qc.score
      const predict = predictRes.data.circuit_predict
      setRadarData(score)
      // const radar_data ={analysisRes.data.compiled_qc.score}
      setCircuitPreditt(predictRes.data)
      let analysisQc = new QCEngine()
      analysisQc.import(predictRes.data.return_qasm)
      setCircuitAnalysisData(analysisQc.circuit)
      hide()
      message.success("编译成功", 1)
    } catch (error) {
      console.log(error)
      hide()
      message.error("编译失败", 1)
    }

    // console.log(analysisQc.import(res.data.compiled_qc),555);
    // console.log(analysisQc.circuit,5555);
    // 绘制analysis电路图
    // computerD3(
    //   analysisQc.circuit,
    //   `anlysisSvg`,
    //   `anlysisSvg_g`,
    //   890
    // )
  }
  // 真机运行的画图
  const [resultData, setResultData] = useState(null)
  const drawFn = (data) => {
    let qc = new QCEngine()
    qc.import(data.origin_circuit)
    computerD3(qc.circuit, `real_before_chart_svg`, `real_before_chart_g`, 1200)
    let qcAfter = new QCEngine()
    qcAfter.import(data.compiled_circuit[0])
    computerD3(
      qcAfter.circuit,
      `real_after_chart_svg`,
      `real_after_chart_g`,
      1200
    )
  }
  const drawChart = (data) => {
    if (!data) {
      data = resultData
    }
    if (isSimple) {
      const echartsData = []
      const dataKeys = Object.keys(data.result)
      const arr = []
      dataKeys.forEach((item) => {
        arr.push({ form: item, to: parseInt(item, 2) })
      })
      arr.sort(compare("to"))
      // dataKeys.sort
      arr.forEach((item) => {
        echartsData.push({
          yValue: data.result[item.form],
          xValue: item.form,
        })
      })
      // console.log(qc.import(data.compiled_qc))
      computerParamsChat(
        echartsData,
        "real_params_chart",
        "real_params_chart_svg",
        false
      )
      // if(isSimple)
    } else {
      const echartsData = []
      const dataKeys = Object.keys(data.probs)
      const arr = []
      dataKeys.forEach((item) => {
        arr.push({ form: item, to: item })
      })
      arr.sort(compare("to"))
      // dataKeys.sort
      arr.forEach((item) => {
        echartsData.push({
          yValue: _.parseInt(_.multiply(data.probs[item.form], data.sample)),
          xValue: item.form,
        })
      })
      computerParamsChat(
        echartsData,
        "real_params_chart",
        "real_params_chart_svg",
        true
      )
    }
  }
  const compare = (property) => {
    return function (a, b) {
      const value1 = a[property]
      const value2 = b[property]
      return value1 - value2
    }
  }
  const [isSimple, setIsSimple] = useState(true)
  const changeType = (isFirst, checked) => {
    if (!isFirst) {
      setIsSimple(!isSimple)
    }
  }
  const realRun = async (qc, sample, runValue) => {
    setIsSubmitModalLoading(true)
    try {
      const formData = new FormData()
      formData.append("project_id", projectId)
      formData.append("sample", sample)
      formData.append("export_qasm", qc.newexport())
      formData.append("computer_name", form.getFieldsValue(["comName"]).comName)
      formData.append("run_type", runValue)
      formData.append("user_id", auth.user_id)
      const { data } = await submitTask(formData)
      const taskIdFormData = new FormData()
      taskIdFormData.append("task_id", data.task_info.task_id)
      setIsSubmitModalLoading(false)
      message.success("已提交")
      // 提交日志
      try {
        submitLog("", "提交代码", editorValue, "运行成功")
      } catch (error) {}

      setSubmitModalVisible(false)

      const { data: resultDataObj } = await getTaskResult(taskIdFormData)
      // if(resultDataObj){
      // 	console.log(resultDataObj,3355);
      // 	setcircuit(resultDataObj.compiled_circuit)
      // }

      drawFn(resultDataObj)
      setResultData(resultDataObj)
      if (!isSimple) {
        setIsSimple(true)
      } else {
        drawChart(resultDataObj)
      }
    } catch (e) {
      // 提交运行错误信息到后台
      submitLog("", "提交代码", editorValue, e.msg)

      setIsSubmitModalLoading(false)
    }
    form.resetFields()
  }
  useEffect(() => {
    if (resultData) {
      drawChart()
    }
  }, [isSimple])
  // 处理console.log
  const consoleContent = (isTure, message) => {
    if (isTure) {
      const console_list = []
      for (let i = 0; i < message.length; i++) {
        console_list.push(<p key={i}>{message[i]}</p>)
      }
      setConsoleValue(<div className="right_content">{console_list}</div>)
    } else {
      setConsoleValue(<div className="error_content">{message}</div>)
    }
  }
  // 保存项目
  const saveCase = async (caseName, caseValue) => {
    const formData = new FormData()
    const obj = {}
    newFile[initOption] = editorValue
    for (const key in newFile) {
      obj[key] = newFile[key]
    }
    formData.append("user_id", auth.user_id)
    formData.append("project_id", projectId)
    formData.append("code", JSON.stringify(obj))
    await saveProject(formData)
    message.success("已保存")
  }
  // 添加新空白页面

  const [newFile, setNewFile] = useState({})
  const [initOption, setInitOption] = useState("")

  // 选择改变编辑器的内容
  const selectChange = (value) => {
    setInitOption(value)
    if (newFile[value]) {
      setEditorValue(newFile[value])
    } else if (initCaseList.includes(value)) {
      axios
        .get("/js/" + value + ".js")
        .then((res) => {
          setEditorValue(res.data)
        })
        .catch((error) => {
          setEditorValue("//please")
        })
    } else {
      setEditorValue("//please")
    }

    // }
  }
  const addNew = () => {
    setIsNewCaseModalVisible(true)
  }
  const [isNewCaseModalVisible, setIsNewCaseModalVisible] = useState(false)
  const [caseName, setCaseName] = useState("")
  const onSaveChange = (value) => {
    setCaseName(value)
  }
  const newCaseModal = () => {
    return (
      <Modal
        okText={t("isok.confirm")}
        cancelText={t("isok.cancel")}
        visible={isNewCaseModalVisible}
        onOk={isSaveOk}
        onCancel={isSaveCancel}
        title={t("file.add file")}
      >
        <p>{t("file.file name")}</p>
        <AutoComplete
          options={initCaseList}
          value={caseName}
          onChange={onSaveChange}
          style={{ width: "100%" }}
        />
      </Modal>
    )
  }
  const isSaveOk = async () => {
    if (!caseName) {
      message.error("请输入文件名称")
      return
    }
    optionList.unshift(caseName)
    setOptionList(optionList)
    selectChange(optionList[0])
    let isHasCase = false
    initCaseList.forEach((item) => {
      if (item.value === caseName) {
        isHasCase = true
        axios
          .get("/js/" + caseName + ".js")
          .then((res) => {
            setEditorValue(res.data)
            newFile[caseName] = res.data
            saveCase()
            setCaseName("")
            setIsNewCaseModalVisible(false)
          })
          .catch((error) => {
            setEditorValue("//please")
            newFile[caseName] = "//please"
            saveCase()
            setCaseName("")
            setIsNewCaseModalVisible(false)
          })
      }
    })
    if (!isHasCase) {
      setEditorValue("//please")
      newFile[caseName] = "//please"
      saveCase()
      setCaseName("")
      setIsNewCaseModalVisible(false)
    }
  }
  const isSaveCancel = () => {
    setIsNewCaseModalVisible(false)
    setCaseName("")
  }
  // 删除一个文件
  const deleteItem = async (e, name) => {
    e.preventDefault()
    e.stopPropagation()
    const arr = JSON.parse(JSON.stringify(optionList))
    delete newFile[name]
    const formData = new FormData()
    const obj = {}
    for (const key in newFile) {
      obj[key] = newFile[key]
    }
    formData.append("user_id", auth.user_id)
    formData.append("project_id", projectId)
    formData.append("code", JSON.stringify(obj))
    await saveProject(formData)
    message.success("已移除")
    arr.splice(arr.indexOf(name), 1)
    setOptionList(arr)
    selectChange(arr[0])
  }
  const aceRef = useRef(null)
  const exportFn = () => {
    aceRef.current.exportFile()
  }
  const leftOperations = () => {
    // return (
    // 	<div className='computer_left_operation'>
    // 		<ul>
    // 			<li>
    // 				<span className='computer_left_operation_item' onClick={saveCase}></span>
    // 			</li>
    // 			<li>
    // 				<span className='computer_left_operation_item' onClick={addNew}></span>
    // 			</li>
    // 			<li>
    // 				<span className='computer_left_operation_item' onClick={selectRun}></span>
    // 			</li>
    // 			<li>
    // 				<span className='computer_left_operation_item' onClick={selectShow}></span>
    // 			</li>
    // 		</ul>
    // 	</div>
    // )
    return (
      <div className="ide_top_menu">
        <div className="ide_top_menu_left">
          <span onClick={addNew}>{t("ideMenu.construction")}</span>
          <span onClick={saveCase}>{t("ideMenu.save")}</span>
          <span onClick={selectShow}>{t("ideMenu.window")}</span>
          <span onClick={exportFn}>{t("ideMenu.export")}</span>
          <span onClick={selectRun}>{t("ideMenu.model")}</span>
        </div>
        <div></div>
        {/* <span>提交</span> */}
      </div>
    )
  }
  // 控制显示视图
  const [isSelectShowModalVisible, setIsSelectModalVisible] = useState(false)
  const [options, setOptions] = useState([
    {
      label: "B" + t("view.view"),
      value: "B",
    },
    {
      label: "C" + t("view.view"),
      value: "C",
    },
    {
      label: "D" + t("view.view"),
      value: "D",
    },
  ])
  const [checkedModeList, setCheckedModeList] = useState(["B", "C", "D"])
  const onModeChange = (list) => {
    setCheckedModeList(list)
  }
  const selectShowModal = () => {
    return (
      <Modal
        okText={t("isok.confirm")}
        cancelText={t("isok.cancel")}
        visible={isSelectShowModalVisible}
        onOk={isSelectShowOk}
        onCancel={isSelectShowCancel}
        title={t("view.Choose View")}
      >
        <p>{t("view.Choose View show")}</p>
        <Checkbox.Group
          options={options}
          value={checkedModeList}
          onChange={onModeChange}
        ></Checkbox.Group>
      </Modal>
    )
  }
  const selectShow = () => {
    setIsSelectModalVisible(true)
  }
  const isSelectShowOk = () => {
    setIsSelectModalVisible(false)
    isShowRight()
    // isShowA()
    isShowB()
    isShowC()
    isShowD()
    isShowRealB()
    isShowRealC()
    isShowRealD()
  }
  const isSelectShowCancel = () => {
    setIsSelectModalVisible(false)
  }
  const [isShowAMode, setIsShowAMode] = useState(true)
  const [isShowBMode, setIsShowBMode] = useState(true)
  const [isShowCMode, setIsShowCMode] = useState(true)
  const [isShowDMode, setIsShowDMode] = useState(true)
  const [isShowRightMode, setIsShowRightMode] = useState(true)
  const [isShowRealBmode, setShowRealBmode] = useState(false)
  const [isShowRealCmode, setShowRealCmode] = useState(false)
  const [isShowRealDmode, setShowRealDmode] = useState(false)
  const isShowA = () => {
    return setIsShowAMode(checkedModeList.includes("A"))
  }
  const isShowB = () => {
    return setIsShowBMode(checkedModeList.includes("B"))
  }
  const isShowC = () => {
    return setIsShowCMode(checkedModeList.includes("C"))
  }
  const isShowD = () => {
    return setIsShowDMode(checkedModeList.includes("D"))
  }
  const isShowRealB = () => {
    return setShowRealBmode(checkedModeList.includes("BarChart"))
  }
  const isShowRealC = () => {
    return setShowRealCmode(
      checkedModeList.includes(t("compile.before compile"))
    )
  }
  const isShowRealD = () => {
    return setShowRealDmode(
      checkedModeList.includes(t("compile.before compile"))
    )
  }
  const isShowRight = () => {
    if (
      !checkedModeList.includes("C") &&
      !checkedModeList.includes("B") &&
      !checkedModeList.includes("D") &&
      !checkedModeList.includes("BarChart") &&
      !checkedModeList.includes(t("compile.before compile")) &&
      !checkedModeList.includes(t("compile.after compile"))
    ) {
      setIsShowRightMode(false)
    } else {
      setIsShowRightMode(true)
    }
  }

  // 真机 模拟器切换
  const [runProgramName, setRunProgramName] = useState("Run Program")
  const [isSelectRunModalVisible, setIsSelectRunModalVisible] = useState(false)
  const [runValue, setRunValue] = useState("JavaScript_simulator")
  const onSelectRunChange = (e) => {
    setRunValue(e.target.value)
  }
  // 模拟器用户禁用其他选项

  const selectRunModal = () => {
    return (
      <Modal
        okText={t("isok.confirm")}
        cancelText={t("isok.cancel")}
        visible={isSelectRunModalVisible}
        onOk={isSelectRunOk}
        onCancel={isSelectRunCancel}
        title={t("switchingmode.switching mode")}
      >
        <p> {t("switchingmode.Choose mode")}</p>
        <Radio.Group onChange={onSelectRunChange} value={runValue}>
          <Radio
            disabled={auth.user_type == 1 ? true : false}
            value={"sqcg_cluster"}
          >
            {t("switchingmode.Quantum cluster")}{" "}
          </Radio>
          <Radio disabled={auth.user_type == 1 ? true : false} value={"sqcg"}>
            {t("switchingmode.Quantum computer")}
          </Radio>
          <Radio disabled={auth.user_type == 1 ? true : false} value={"qiskit"}>
            python{t("switchingmode.simulator")}
          </Radio>
          <Radio value={"JavaScript_simulator"}>
            JavaScript{t("switchingmode.simulator")}
          </Radio>
          <Radio value={"analysis"}>analysis </Radio>
        </Radio.Group>
      </Modal>
    )
  }

  const isSelectRunOk = () => {
    setBackcolor("black")
    // 先把分析模式关闭 再根据模式显示相关内容
    setIsAnlysis(false)
    if (
      runValue === "sqcg" ||
      runValue === "sqcg_cluster" ||
      runValue === "qiskit"
    ) {
      setRunProgramName("Submit Task")
      setIsShowBMode(false)
      setIsShowCMode(false)
      setIsShowDMode(false)
      setShowRealBmode(true)
      setShowRealCmode(true)
      setShowRealDmode(true)
      setCheckedModeList([
        "BarChart",
        t("compile.before compile"),
        t("compile.before compile"),
      ])
      setOptions([
        {
          label: "BarChart",
          value: "BarChart",
        },
        {
          label: t("compile.before compile"),

          value: t("compile.before compile"),
        },
        {
          label: t("compile.before compile"),
          value: t("compile.before compile"),
        },
      ])
    } else if (runValue === "JavaScript_simulator") {
      setRunProgramName("Run Program")
      setIsShowBMode(true)
      setIsShowCMode(true)
      setIsShowDMode(true)
      setShowRealBmode(false)
      setShowRealCmode(false)
      setShowRealDmode(false)
      setCheckedModeList(["B", "C", "D"])
      setOptions([
        {
          label: "B" + t("view.view"),
          value: "B",
        },
        {
          label: "C" + t("view.view"),
          value: "C",
        },
        {
          label: "D" + t("view.view"),
          value: "D",
        },
      ])
    } else if (runValue === "analysis") {
      setIsAnlysis(true)
      setRunProgramName("Run Program")
      setBackcolor("#fff")
    }

    setIsSelectRunModalVisible(false)
  }
  const selectRun = () => {
    setIsSelectRunModalVisible(true)
  }
  const isSelectRunCancel = () => {
    setIsSelectRunModalVisible(false)
  }
  // 提交任务modal
  const [submitModalVisible, setSubmitModalVisible] = useState(false)
  const [isSubmitModalLoading, setIsSubmitModalLoading] = useState(false)
  const [form] = Form.useForm()
  const { Option } = Select
  // 获取计算机列表
  const [computerList, setComputerList] = useState([])
  const getComListFn = async () => {
    const formData = new FormData()
    formData.append("filter", JSON.stringify({ update_code: -1 }))
    const { data } = await getComList(formData)
    // 老板要求前端加一个数据 看见别慌
    setComputerList([
      ...data.com_list,
      ...[
        {
          chip_id: 20,
          chip_name: "python" + t("switchingmode.simulator"),
          com_status: 0,
          qubits_number: 20,
        },
      ],
    ])
  }
  const getComListOpts = computerList.map((item) => (
    <Option value={item.chip_name} key={item.chip_id}>
      {item.chip_name}
    </Option>
  ))
  // 加载项目
  const loadProFn = async () => {
    if (!optionList.length) {
      const arr = [projectName]
      setOptionList(arr)
      selectChange(arr[0])
    }
    const formData = new FormData()
    formData.append("project_id", projectId)
    const { data } = await loadPro(formData)
    if (JSON.stringify(data.code) !== "{}") {
      const arr = JSON.parse(JSON.stringify(optionList))
      for (const key in data.code) {
        arr.unshift(key)
        newFile[key] = data.code[key]
      }
      setOptionList(arr)
      selectChange(arr[0])
    }
  }
  useEffect(() => {
    getComListFn()
    if (projectId) {
      loadProFn()
    }
  }, [])

  const submitTaskModal = () => {
    // 在集群模式下可以select框可以多选
    let ismodern = ""
    if (runValue == "sqcg_cluster") {
      ismodern = "multiple"
    }
    return (
      <Modal
        okText={t("isok.confirm")}
        cancelText={t("isok.cancel")}
        visible={submitModalVisible}
        onOk={isSubmitOk}
        onCancel={isSubmitCancel}
        title={t("Submittask.Submit task")}
        confirmLoading={isSubmitModalLoading}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="sample"
            label={t("Submittask.Sampling frequency")}
            rules={[
              { required: true, message: t("Submittask.Sampling frequency") },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="comName"
            label={t("Submittask.Computer of choice")}
            rules={[
              { required: true, message: t("Submittask.Computer of choice") },
            ]}
          >
            <Select
              mode={ismodern}
              placeholder={t("Submittask.Computer of choice")}
              allowClear
            >
              {getComListOpts}
              {/* <Option key={9} value="python模拟器">python模拟器</Option>
							 <Option key={10} value="模拟器1">模拟器1</Option>
							 <Option key={11} value="模拟器2">模拟器2</Option> */}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
  const isSubmitOk = () => {
    form.validateFields().then((value) => {
      runProgram(Number(value.sample))
    })
  }
  const isSubmitCancel = () => {
    form.resetFields()
    setSubmitModalVisible(false)
  }
  // 分析模式
  const [isAnlysis, setIsAnlysis] = useState(false)
  // 切换成分析模式
  const changeIsAnlysis = () => {
    setIsAnlysis(true)
  }

  return (
    <Layout isIde={true}>
      {/* <ComponentTitle name={'IDE'}></ComponentTitle> */}
      {leftOperations()}
      <div className="App" style={{ backgroundColor: backcolor }}>
        <div
          className="left-div"
          style={{
            display: isShowAMode ? "block" : "none",
            width: isShowRightMode ? "28%" : "100%",
            marginRight: isShowRightMode ? "5px" : "0",
          }}
        >
          <Ace
            changCircuit={changCircuit}
            changeIsAnlysis={changeIsAnlysis}
            runProgram={dispathRun}
            runProgramName={runProgramName}
            selectChange={selectChange}
            onChange={onChange}
            editorValue={editorValue}
            optionList={optionList}
            initOption={initOption}
            deleteItem={deleteItem}
            ref={aceRef}
          ></Ace>
          <ConsoleComponent consoleValue={consoleValue}></ConsoleComponent>
        </div>
        <div
          className="right-div"
          style={{
            width: isShowAMode ? "calc(72% - 5px)" : "100%",
            display: isShowRightMode ? "block" : "none",
          }}
        >
          {isAnlysis ? (
            <AnalysisCircuitPage analysisQc={analysisQc} />
          ) : (
            <Right
              isShowBMode={isShowBMode}
              isShowCMode={isShowCMode}
              isShowDMode={isShowDMode}
              isShowRealB={isShowRealBmode}
              isShowRealC={isShowRealCmode}
              isShowRealD={isShowRealDmode}
              changeType={changeType}
              isSimple={isSimple}
              circuit={circuit}
            ></Right>
          )}
        </div>
      </div>
      {selectShowModal()}

      {selectRunModal()}
      {submitTaskModal()}
      {newCaseModal()}
    </Layout>
  )
}

export default App
