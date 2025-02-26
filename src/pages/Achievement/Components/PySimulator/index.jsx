import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import Circuit from '@/components/Circuit'
import { Space, Button, Row, Col, ConfigProvider, Select, message } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import BarChartEchart from '../BarChartEchart'
import SubmitTaskModal from '../SubmitTaskModal'
import { submitTask } from '@/api/test_circuit'
import QCEngine from '@/simulator/MyQCEngine'

export default function PySimulator({
  qcData,
  runSubmit,
  currentProject,
  submitModal,
  setSubmitModal,
}) {
  // const { userData } = useSelector((store) => store.userData)
  const [probs, setProbs] = useState([])
  const [name2index, setName2index] = useState([])
  const addLables = () => {}
  const [afterCircuit, setAfterCircuit] = useState([])
  const runProgram = async ({ sample, computer_name }) => {
    const qc = runSubmit()

    const formData = new FormData()
    formData.append('project_id', 220)
    formData.append('project_name', 'test22')
    formData.append('computer_name', computer_name)
    formData.append('sample', sample)
    formData.append('export_qasm', qc.newexport())
    formData.append('run_type', 'qiskit')
    formData.append('user_id', 114)
    formData.append('label', currentProject)
    const { data } = await submitTask(formData)
    if (data.is_submit_success) {
      message.success('Success!')
      setProbs(data.probs)
      let qcAfter = new QCEngine()
      qcAfter.import(data.task_info.compiled_circuit)
      setAfterCircuit(qcAfter.circuit.gates)
      setSubmitModal(false)
    } else {
      message.error('Failed!')
    }

    // console.log('formData', formData)
  }

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
  return (
    <div className={styles.root}>
      {/* <div className="operate_content">
        <Space style={{ display: 'none' }} size={20}>
          <div className="div"></div>
        </Space>
        <Space  size={20}>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => {
              setSubmitModal(true)
            }}
          >
            Submit
          </Button>
        </Space>
      </div> */}
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
          <Circuit gates={afterCircuit} />
        </div>
      </div>
      <div className="resoult_content">
        <div className="title">Result</div>
        <div className="resoult_item">
          {probs.length > 0 ? <BarChartEchart chartData={probs} /> : null}
        </div>
      </div>
      <SubmitTaskModal
        type={'pysimulator'}
        runProgram={runProgram}
        submitModal={submitModal}
        setSubmitModal={setSubmitModal}
      />
    </div>
  )
}
