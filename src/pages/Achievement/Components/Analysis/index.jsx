import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import Circuit from '@/components/Circuit'
import {
  Space,
  Button,
  Row,
  Col,
  ConfigProvider,
  Select,
  message,
  Table,
  Tabs,
} from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import {
  circuitBug,
  circuitAnalysis,
  circuitConfig,
  circuitpredict,
  circuitTime,
} from '@/api/test_circuit'
import QCEngine from '@/simulator/MyQCEngine'
import Title from '../Title'
import RadarChart from '../RadarChart'
import { useTranslation } from 'react-i18next'

export default function Analysis({ qcData, runSubmit }) {
  // 中英切换
  const { t } = useTranslation()
  const [name2index, setName2index] = useState([])
  const [qasm, setQasm] = useState(null)

  const addLables = () => {}

  useEffect(() => {
    if (qcData?.name2index) {
      setQasm(qcData.newexport())
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

  const [runTime, setRunTime] = useState(null)
  const getcircuitTime = async () => {
    const { data } = await circuitTime()
    setRunTime(data.time)
  }
  useEffect(() => {
    getcircuitTime()
  }, [])
  const columnsChips = [
    {
      title: 'Chips',
      dataIndex: 'chipName',
      render: (text) => <a>{text}</a>,
      align: 'center',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: 'Qubit number',
      dataIndex: 'qubitNumber',
      align: 'center',
    },
    {
      title: 'Chip topology',
      dataIndex: 'chipTopology',
      align: 'center',
    },
  ]
  const dataChips = [
    {
      key: '1',
      chipName: 'N36U19_0',
      description: 'N36U19_0 is a part of N36U19 with chained 5 qubits ',
      qubitNumber: 5,
      chipTopology: 'one dimension chain',
    },
    {
      key: '2',
      chipName: 'N36U19_1',
      description: 'N36U19_1 is a part of N36U19 with chained 5 qubits',
      qubitNumber: 5,
      chipTopology: 'one dimension chain',
    },
    {
      key: '3',
      chipName: 'N36U19',
      description: 'N36U19 is a 10 qubit chip with chained topologys ',
      qubitNumber: 10,
      chipTopology: 'one dimension chain',
    },
  ]
  const columnsLayout = [
    {
      title: 'Method',
      dataIndex: 'methodName',
      render: (text) => <a>{text}</a>,
      align: 'center',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: 'Estimated cost time',
      dataIndex: 'time',
      width: 180,
      align: 'center',
    },
  ]
  const dataLayout = [
    {
      key: '1',
      methodName: 'Trivial',
      description:
        'Choose a Layout by assigning n circuit qubits to device qubits 0, .., n-1 using a simple round-robin order.',
      time: runTime?.layout[0],
    },
    {
      key: '2',
      methodName: 'Dense ',
      description:
        'Choose a Layout by finding the most connected subset of qubits.',
      time: runTime?.layout[1],
    },
    {
      key: '3',
      methodName: 'noise adapative',
      description:
        'Choose a noise-adaptive Layout based on current calibration data for the backend',
      time: runTime?.layout[2],
    },
    {
      key: '4',
      methodName: 'sabre',
      description:
        'Choose a Layout via iterative bidirectional routing of the input circuit. The algorithm iterates a number of times until it finds an initial_layout that reduces full routing cost.',
      time: runTime?.layout[3],
    },
  ]
  const columnsRouting = [
    {
      title: 'Method',
      dataIndex: 'methodName',
      render: (text) => <a>{text}</a>,
      align: 'center',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: 'Estimated cost time',
      dataIndex: 'time',
      width: 180,
      align: 'center',
    },
  ]
  const dataRouting = [
    {
      key: '1',
      methodName: 'Basic',
      description:
        'The basic mapper is a minimum effort to insert swap gates to map the DAG onto a coupling map. it inserts one or more swaps in front to make all multi-qubits gates compatible.',
      time: runTime?.routing[0],
    },
    {
      key: '2',
      methodName: 'Lookahead ',
      description:
        'This algorithm searches through the available combinations of SWAP gates by means of a narrowed best first/beam search. Refer to https://medium.com/qiskit/improving-a-quantum-compiler-48410d7a7084.',
      time: runTime?.routing[1],
    },
    {
      key: '3',
      methodName: 'Stochastic',
      description:
        'This algorithm uses a randomized algorithm to map a DAGCircuit onto a coupling_map by adding swap gates.',
      time: runTime?.routing[2],
    },
    {
      key: '4',
      methodName: 'Sabre',
      description:
        'This algorithm starts from an initial layout of virtual qubits onto physical qubits, and iterates over the circuit DAG until all gates are exhausted, inserting SWAPs along the way. Refer to https://arxiv.org/pdf/1809.02573.pdf.',
      time: runTime?.routing[3],
    },
  ]
  const columnsTranslation = [
    {
      title: 'Method',
      dataIndex: 'methodName',
      render: (text) => <a>{text}</a>,
      align: 'center',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: 'Estimated cost time',
      dataIndex: 'time',
      width: 180,
      align: 'center',
    },
  ]
  const dataTranslation = [
    {
      key: '1',
      methodName: 'Unroller',
      description:
        'Unroll non-basis, non-opaque instructions recursively to a desired basis, using decomposition rules defined for each instruction.',
      time: runTime?.translation[0],
    },
    {
      key: '2',
      methodName: 'Translator',
      description:
        'Translates gates to a target basis by searching for a set of translations from a given EquivalenceLibrary.',
      time: runTime?.translation[1],
    },
    {
      key: '3',
      methodName: 'Synthesis',
      description:
        'Synthesize gates according to their basis gates and synthesize unitaries over some basis gates. It can approximate 2-qubit unitaries given some approximation closeness measure. ',
      time: runTime?.translation[2],
    },
    {
      key: '4',
      methodName: 'Sabre',
      description:
        'This algorithm starts from an initial layout of virtual qubits onto physical qubits, and iterates over the circuit DAG until all gates are exhausted, inserting SWAPs along the way. Refer to https://arxiv.org/pdf/1809.02573.pdf.',
      time: runTime?.translation[3],
    },
  ]
  const dataOptimizations = [
    {
      key: '1',
      methodName: 'GatesOptimize',
      description:
        'Optimize chains of single-qubit u1, u2, u3 gates by combining them into a single gate.',
      time: runTime?.optimization[0],
    },
    {
      key: '2',
      methodName: 'CXCancellation',
      description: 'Cancel back-to-back cx gates in dag. ',
      time: runTime?.optimization[1],
    },
    {
      key: '3',
      methodName: 'OptimizeCliffords',
      description:
        'Combine consecutive Cliffords over the same qubits. This serves as an example of extra capabilities enabled by storing Cliffords natively on the circuit.',
      time: runTime?.optimization[2],
    },
    {
      key: '4',
      methodName: 'GatesDecomposition',
      description:
        'Optimize chains of single-qubit gates by combining them into a single gate.',
      time: runTime?.optimization[3],
    },
    {
      key: '5',
      methodName: 'CommutativeCancellation',
      description:
        'Cancel the redundant self-adjoint gates through commutation relations. The cancellation utilizes the commutation relations in the circuit. ',
      time: runTime?.optimization[4],
    },
    {
      key: '6',
      methodName: 'DynamicDecoupling',
      description:
        'This method scans the circuit for idle periods of time and inserts a DD sequence of gates in those spots. These gates amount to the identity, so do not alter the logical action of the circuit, but have the effect of mitigating decoherence in those idle periods. ',
      time: runTime?.optimization[5],
    },
  ]
  const chipSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setComputer([selectedRows[0].chipName])
    },
  }
  const layoutSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setLayoutValue([selectedRows[0].methodName])
    },
  }
  const routingSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRouting([selectedRows[0].methodName])
    },
  }
  const TranslationSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setTranslation([selectedRows[0].methodName])
    },
  }
  const OptimizationsSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let optimizationArr = []
      selectedRows.forEach((item) => {
        optimizationArr.push(item.methodName)
        setOptimization(optimizationArr)
      })
    },
  }
  const configItems = [
    {
      label: <div>{t('analysis.Chip')}</div>,
      key: '1',
      children: (
        <Table
          align="center"
          pagination={{
            position: ['none'],
          }}
          scroll={{
            y: 240,
          }}
          rowSelection={{
            type: 'radio',
            ...chipSelection,
          }}
          columns={columnsChips}
          dataSource={dataChips}
        />
      ),
    },
    {
      label: <div>{t('analysis.Qubit mapping')}</div>,
      key: '2',
      children: (
        <Table
          align="center"
          pagination={{
            position: ['none'],
          }}
          scroll={{
            y: 240,
          }}
          rowSelection={{
            type: 'radio',
            ...layoutSelection,
          }}
          columns={columnsLayout}
          dataSource={dataLayout}
        />
      ),
    },
    {
      label: <div>{t('analysis.Qubit routing')}</div>,
      key: '3',
      children: (
        <Table
          align="center"
          pagination={{
            position: ['none'],
          }}
          scroll={{
            y: 240,
          }}
          rowSelection={{
            type: 'radio',
            ...routingSelection,
          }}
          columns={columnsRouting}
          dataSource={dataRouting}
        />
      ),
    },
    {
      label: <div>{t('analysis.Gate decomposition')}</div>,
      key: '4',
      children: (
        <Table
          scroll={{
            y: 240,
          }}
          align="center"
          pagination={{
            position: ['none'],
          }}
          rowSelection={{
            type: 'radio',
            ...TranslationSelection,
          }}
          columns={columnsTranslation}
          dataSource={dataTranslation}
        />
      ),
    },
    {
      label: <div>{t('analysis.Opimization')}</div>,
      key: '5',
      children: (
        <Table
          scroll={{
            y: 240,
          }}
          align="center"
          pagination={{
            position: ['none'],
          }}
          rowSelection={{
            type: 'checkbox',
            ...OptimizationsSelection,
          }}
          columns={columnsTranslation}
          dataSource={dataOptimizations}
        />
      ),
    },
  ]
  const [raderData, setRaderData] = useState([])

  // 提交配置
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
      message.success('提交成功', 1)
    } catch (error) {
      message.error('提交失败', 1)
    }
  }

  // bug检测
  const [bugGates, setBugGates] = useState([])
  const bugClick = async () => {
    try {
      const qc = runSubmit()
      const { data } = await circuitBug({ qasm: qc.newexport() })
      setBugGates(data.bug_positions)
      message.success('检测成功', 1)
    } catch (error) {
      message.error('检测失败', 1)
    }
  }
  // 编译
  const [analysisData, setanalysisData] = useState(null)

  const [compiledQasm, setcompiledQasm] = useState(null)
  const analysisClick = async () => {
    setEateError(null)

    try {
      const qc = runSubmit()

      const { data } = await circuitAnalysis({
        parameter: {
          layout: layoutValue,
          routing: routing,
          translation: translation,
          optimization: optimization,
        },
        coms: computer,
        qasm: qc.newexport(),
      })
      setcompiledQasm(data.compiled_qc.qasm)
      let newQcEngine = new QCEngine()
      newQcEngine.import(data.compiled_qc.qasm)
      setanalysisData(newQcEngine.circuit.gates)

      // setanalysisData(newQcEngine.import(data.compiled_qc.qasm).circuit.gates)
      message.success('编译成功', 1)
    } catch (error) {
      console.log(error, 8888)

      message.error('编译失败', 1)
    }
  }
  const [gateError, setEateError] = useState(null)
  const [predictData, setPredictData] = useState(0.95)
  const predictClick = async () => {
    try {
      if (compiledQasm !== null) {
        const { data } = await circuitpredict({ qasm: compiledQasm })
        setEateError(data.gate_errors)
        setPredictData(data.circuit_predict)
        if (raderData.length === 5) {
          let rader = raderData
          rader[4] = data.circuit_predict
          setRaderData(raderData)
        }
        message.success('预测成功', 1)
      } else {
        message.error('请先编译')
      }
    } catch (error) {}
  }
  const [layoutValue, setLayoutValue] = useState([])
  const [routing, setRouting] = useState([])
  const [translation, setTranslation] = useState([])
  const [optimization, setOptimization] = useState([])
  const [computer, setComputer] = useState([])
  const computerList = ['N36U19_0', 'N36U19_1', 'N36U19']
  useEffect(() => {
    if (computer[0]) {
      submitConfig()
    }
  }, [layoutValue, routing, translation, optimization, computer])
  return (
    <div className={styles.root}>
      {/* <div className="operate_content">
        <Space size={20}>
          <div className="div"></div>
        </Space>
        <Space size={20}>
         
        </Space>
      </div> */}
      <div className="config_content">
        <Title title={t('analysis.Configuration')} />

        <div className="config_item">
          <Space style={{ marginBottom: '10px' }}>
            <Button onClick={submitConfig}>{t('analysis.Submit')}</Button>
            <Button onClick={analysisClick}>{t('analysis.Compile')}</Button>
            <Button onClick={bugClick}>{t('analysis.Detect bug')}</Button>
            <Button onClick={predictClick}>
              {t('analysis.Predict fidelity')}
            </Button>
          </Space>
          <div className="configs_detail">
            <div className="configs_detail_content">
              <Tabs items={configItems} defaultActiveKey="1"></Tabs>
            </div>
            <div className="Radarchart_Content">
              <RadarChart raderData={raderData} />
            </div>
          </div>
        </div>
      </div>
      <div className="circuit_content">
        <Title title={t('Original Circuit')} />

        <div className="circuit_item">
          <Circuit
            gates={qcData?.circuit?.gates}
            name2index={name2index}
            labels={qcData?.labels}
            addLables={addLables}
            bugGates={bugGates}
          />
        </div>
        <Title title={t('Compiled Circuit')} />
        <div className="circuit_item">
          <Circuit
            gates={analysisData}
            gateError={gateError}
            predictData={predictData}
          />
        </div>
      </div>
    </div>
  )
}
