import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import ConFirmModal from '../ConFirmModal'
import ChipDrawer from '../ChipDrawer'
import {
  Space,
  Button,
  Row,
  Col,
  ConfigProvider,
  Form,
  Input,
  Select,
  message,
} from 'antd'
import Circuit from '@/components/Circuit'
import BarChartEchart from '../BarChartEchart'
import { PlayCircleOutlined } from '@ant-design/icons'
import {
  circuitBug,
  circuitAnalysis,
  circuitConfig,
  circuitpredict,
  circuitTime,
} from '@/api/test_circuit'
import QCEngine from '@/simulator/MyQCEngine'
import {
  getNoiseData,
  runReadoutCalibration,
  readCalibrationData,
} from '@/api/janusq'
import { getChipList } from '@/api/computer'

export default function NewMode({ qcData, runSubmit }) {
  const [form] = Form.useForm()

  const [name2index, setName2index] = useState([])
  const addLables = () => {}
  // 获取芯片列表
  const [chipList, setChipList] = useState([])
  // 选中的芯片
  const [chip, setChip] = useState({})
  const getChipListData = async () => {
    const { data } = await getChipList()
    setChipList(data.chips)
    setChip(data.chips[0])
  }
  useEffect(() => {
    getChipListData()
  }, [])

  useEffect(() => {
    if (qcData?.name2index) {
      setName2index(
        Object.entries(qcData?.name2index)?.map(
          ([name, [firstValue, secondValue]]) => ({
            name,
            value: [firstValue, secondValue],
          })
        )
      )
    }
  }, [qcData])
  // 编译
  const compile = async () => {
    const qc = runSubmit()
    const { data } = await circuitAnalysis({
      parameter: {
        layout: '',
        routing: '',
        translation: '',
        optimization: '',
      },
      coms: 'N36U19_0',
      qasm: qc.newexport(),
    })
    let newQcEngine = new QCEngine()
    newQcEngine.import(data.compiled_qc.qasm)
    setCompileData(newQcEngine.circuit.gates)
    message.success('success')
  }
  // 运行电路噪音分析数据
  const [circuitNoiseData, setCircuitNoiseData] = useState([])
  // 读取校准数据
  const [ReadoutCalibrationData, setReadoutCalibrationData] = useState([])
  // 运行电路
  const [runCircuitData, setRunCircuitData] = useState({})
  const [loading, setloading] = useState(false)
  const runCircuit = async () => {
    setloading(true)
    const { sample } = form.getFieldsValue()
    const qc = runSubmit()
    const { data } = await getNoiseData({
      qasm: qc.newexport(),
      chip: chip.chip_name,
      sample,
    })
    setRunCircuitData(data)
    setCircuitNoiseData(data.output_noise_result)
    setloading(false)
    setConfirmModalOpen(false)
    message.success('success')
  }
  // 读取校准
  const readCalibration = async () => {
    const { chip, output_noise, sample, qubit } = runCircuitData
    const { data } = await readCalibrationData({
      output_noise,
      chip,
      sample,
      qubit,
    })
    setReadoutCalibrationData(data.output_calibrate_result)
    message.success('success')
  }
  // confirmModalOpen
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confimTitle, setConfimTitle] = useState('')
  const [confirmFunction, setConfirmFunction] = useState(() => {})

  // 拓扑图draweropen
  const [drawerOpen, setdrawerOpen] = useState(false)
  // 编译数据
  const [compileData, setCompileData] = useState(null)
  // 噪音分析
  const [gateError, setEateError] = useState(null)
  const [predictData, setPredictData] = useState(0.95)
  const noiseAnalysis = async () => {
    const qc = runSubmit()
    const { data } = await circuitAnalysis({
      parameter: {
        layout: '',
        routing: '',
        translation: '',
        optimization: '',
      },
      coms: 'N36U19_0',
      qasm: qc.newexport(),
    })
    let newQcEngine = new QCEngine()
    newQcEngine.import(data.compiled_qc.qasm)
    setCompileData(newQcEngine.circuit.gates)
    const { data: data1 } = await circuitpredict({
      qasm: data.compiled_qc.qasm,
    })
    setEateError(data1.gate_errors)
    setPredictData(data1.circuit_predict)
    message.success('success')
  }

  return (
    <div className={styles.root}>
      <div className="operate_content">
        <Space size={20}>
          {/* <ChipDrawer drawerOpen={drawerOpen} setdrawerOpen={setdrawerOpen} /> */}
          <Space>
            <div>Chip:</div>
            <Select
              onChange={(value) => {
                setChip(chipList.find((item) => item.chip_name === value))
              }}
              value={chip.chip_name}
              style={{ width: 120 }}
              options={chipList.map((item) => ({
                value: item.chip_name,
                label: item.chip_name,
              }))}
            />
          </Space>
        </Space>
        <Space size={20}>
          <Button
            onClick={() => {
              compile()
              // setConfirmModalOpen(true)
              // setConfimTitle('编译')
              // setConfirmFunction(() => compile)
            }}
          >
            Compile
          </Button>
          <Button onClick={noiseAnalysis}> Predict fidelity</Button>

          <Button
            onClick={() => {
              if (!compileData)
                return message.error('Please compile the circuit first')
              if (chip.chip_qubit !== compileData.length)
                return message.error('Please select the correct chip')
              setConfirmModalOpen(true)
              setConfimTitle(' Simulate with noise')
              setConfirmFunction(() => runCircuit)
            }}
          >
            Simulate with noise
          </Button>
          <Button
            onClick={() => {
              if (circuitNoiseData.length === 0)
                return message.error('Please run the circuit first')
              readCalibration()
              // setConfirmModalOpen(true)
              // setConfimTitle('读取校准')
              // setConfirmFunction(() => readCalibration)
            }}
          >
            Calibrate readout error
          </Button>
        </Space>
      </div>
      <div className="circuit_content">
        <div className="title">Original Circuit</div>

        <div className="circuit_item">
          <Circuit
            gates={qcData?.circuit?.gates}
            name2index={name2index}
            labels={qcData?.labels}
            addLables={addLables}
          />
        </div>
        <div className="title">Compiled Circit</div>

        <div className="circuit_item">
          <Circuit
            gates={compileData}
            gateError={gateError}
            predictData={predictData}
          />
        </div>
      </div>
      <div className="resoult_content">
        <Row gutter={[10, 10]}>
          {/* <Col span={8}>
            <div className="title">保真度结果</div>
            <div className="resoult_item"></div>
          </Col> */}
          <Col span={12}>
            <div className="title">Noisy Result</div>
            <div className="resoult_item">
              {circuitNoiseData?.length > 0 ? (
                <BarChartEchart chartData={circuitNoiseData} />
              ) : null}
            </div>
          </Col>
          <Col span={12}>
            <div className="title">Calibrated Result</div>
            <div className="resoult_item">
              {ReadoutCalibrationData?.length > 0 ? (
                <BarChartEchart chartData={ReadoutCalibrationData} />
              ) : null}
            </div>
          </Col>
        </Row>
      </div>
      <ConFirmModal
        confirmModalOpen={confirmModalOpen}
        setConfirmModalOpen={setConfirmModalOpen}
        confimTitle={confimTitle}
        confirmFunction={confirmFunction}
      >
        {confimTitle == ' Simulate with noise' ? (
          <div>
            <Form
              initialValues={{
                sample: 1000,
                chip: 'dense_5',
              }}
              form={form}
              layout="vertical"
            >
              <Form.Item
                rules={[{ required: true }]}
                name="sample"
                label="sampling number"
              >
                <Input />
              </Form.Item>
              <Form.Item label={null}>
                <Space>
                  <Button onClick={() => setConfirmModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button loading={loading} onClick={runCircuit} type="primary">
                    Submit
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        ) : null}
      </ConFirmModal>
    </div>
  )
}
