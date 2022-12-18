import React, { useState, useRef, useEffect } from "react"
import {
  Radio,
  Checkbox,
  Button,
  Drawer,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd"
import { SettingOutlined } from "@ant-design/icons"
import * as echarts from "echarts"
import AnalysisCircuit from "./components/AnalysisCircuit"
import NormalCircuit from "./components/NormalCircuit"
import RealeCircuit from "../RealeCircuit"
import RadarChart from "./components/RadarChart"
import styles from "./index.module.scss"
import QCEngine from "../../../simulator/MyQCEngine"
import {  circuitBug,
  circuitAnalysis,
  circuitConfig,
  circuitpredict, } from "../../../api/test_circuit"
import { getComList } from "../../../api/computer"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
// import { useSelector } from "react-redux"
// import { submitTask } from "@/api/test_circuit"
export default function AnalysisCircuitPage(props) {
  // const { userData } = useSelector((store) => store.userData)
  const { projectName, projectId } = useParams()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { Option } = Select
  let newQcEngine = new QCEngine()
  const Gates = props.analysisQc.circuit?.gates
  const [normalGates, setNormalGates] = useState([[]])
  const [qasm, setQasm] = useState(null)
  // 在提交后将页面切换为真机
  const [showReal, setShowReal] = useState(false)
  useEffect(() => {
    if (props.analysisQc.circuit) {
      setNormalGates(Gates)
      let qasm_ = ""
      qasm_ = props.analysisQc.export()
      setQasm(qasm_)
      setanalysisData(null)
      setPredictData(null)
      setBugGates([])
      setEateError(null)
    }
  }, [Gates, props])
  
  // bug检测
  const [bugGates, setBugGates] = useState([])
  const bugClick = async () => {
    try {
      if(qasm!==null){
        const {
          data
        } = await circuitBug({ qasm: qasm })
        setBugGates(data.bug_positions)
        message.success("检测成功", 1)
      }else{
        message.error("请先运行项目代码", 1)

      }
    
    } catch (error) {
      message.error("检测失败", 1)
    }
  }
  // 确认分析
  const [analysisData, setanalysisData] = useState(null)
  // const [compiledQasm, setcompiledQasm] = useState(null)
  const analysisClick = async () => {
    setEateError(null)

    try {
      if(qasm!==null){
        const {
          data
        } = await circuitAnalysis({
          parameter: {
            layout: layoutValue,
            routing: routing,
            translation: translation,
            optimization: optimization,
          },
          coms: computer,
          qasm: qasm,
        })
        console.log(data,8888);
        setanalysisData(data.compiled_qc.qasm)
        message.success("分析成功", 1)
      }else{
        message.error("请先运行项目代码", 1)

      }
    
    } catch (error) {
      message.error("分析失败", 1)
    }
  }
  // 噪音预测
  const [gateError, setEateError] = useState(null)
  const [predictData, setPredictData] = useState(0.95)
  const [raderData, setRaderData] = useState([])
  const predictClick = async () => {
    try {
      if (analysisData !== null) {
        const {
          data
        } =await circuitpredict({ qasm: analysisData })
        setEateError(data.gate_errors)
        setPredictData(data.circuit_predict)
        if(raderData.length===5){
          let rader=raderData
          rader[4]=data.circuit_predict
          setRaderData(raderData)
          console.log(rader,55);
        }
     
        // setRaderData(rader)
        // console.log(rader,55555555555555555555);
        message.success("预测成功", 1)

        console.log(data, 888)
      } else {
        message.error("请先分析")
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
  // 分析配置
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
  const onChangeOptimization = (list) => {
    // console.log("radio checked", e.target.value);
    setOptimization(list)
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
      const {
        data
      } = await circuitConfig(configData)
      let rader =[...data.rader_data.score,predictData]
      setRaderData(rader)
      message.success('提交成功',1)
      setOpen(false)
    } catch (error) {
      message.error('提交失败',1)
    }
   

  }
 
  return (
    <>
      <div className={styles.root}>
        <div className="opearation">
          <div>
            <Button onClick={setClick}>编译设置</Button>
            <Button onClick={bugClick}>bug检测</Button>
            <Button onClick={analysisClick} analysis>
              确认分析
            </Button>
            <Button onClick={predictClick}>噪音预测</Button>
            <Button onClick={submitClick}>提交</Button>
            {showReal ? (
              <Button onClick={() => setShowReal(false)}>返回analysis</Button>
            ) : (
              ""
            )}
          </div>
        </div>
        {showReal ? (
          <RealeCircuit />
        ) : (
          <div className="circuit">
            <div className="Circuit_top">
              <div className="normalCircuit">
                {/* <p>分析前</p> */}
                <NormalCircuit bugGates={bugGates} normalGates={normalGates} />
              </div>
              <div className="radom">
                <RadarChart raderData={raderData}/>
              </div>
            </div>
            <div className="Circuit_down">
              <div className="analysisCircuit">
                <AnalysisCircuit predictData={predictData} gateError={gateError} analysisData={analysisData} />
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
        <Drawer
          size="large"
          getContainer={false}
          open={open}
          onClose={() => setOpen(false)}
          extra={
            <Space>
              <Button onClick={() => setOpen(false)}>取消</Button>
              <Button type="primary" onClick={submitConfig}>
                提交
              </Button>
            </Space>
          }
        >
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
        </Drawer>
      </div>
    </>
  )
}
