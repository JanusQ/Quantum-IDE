import React, { useState, useEffect, useRef } from 'react'
import styles from './index.module.scss'
import Editor from './Components/Editor'
import { Space, Button, Row, Col, ConfigProvider, Select } from 'antd'
import NewMode from './Components/NewMode'
import JsSimulator from './Components/JsSimulator'
import QuantumComputer from './Components/QuantumComputer'
import PySimulator from './Components/PySimulator'
import Analysis from './Components/Analysis'
export default function Achievement() {
  const [qcData, setQcData] = useState('')
  const modeList = [
    { label: 'Calibration', value: 'Calibration' },
    {
      label: 'Analysis',
      value: 'Analysis',
    },
    {
      label: 'Backend simulator',
      value: 'Python_simulator',
    },
    // {
    //   label: 'Quantum cumputer',
    //   value: 'Quantum_cumputer',
    // },

    {
      label: 'Frontend simulator',
      value: 'JavaScript_simulator',
    },
  ]
  const projectList = [
    {
      value: 'ghz_state',
      label: 'GHZ state',
    },
    // {
    //   value: 'w_state',
    //   label: 'W state',
    // },
    // {
    //   value: 'time_crystal',
    //   label: 'Time crystal',
    // },
    // {
    //   value: 'VQA',
    //   label: 'Quantum Neural Network',
    // },
  ]
  const [currentProject, setCurrentProject] = useState(projectList[0].value)
  const [mode, setMode] = useState('Calibration')
  const childRef = useRef()
  const runSubmit = () => {
    if (childRef.current) {
      const qc = childRef.current.submit()
      return qc
    }
  }
  // python模拟器modle
  const [submitModal, setSubmitModal] = useState(false)

  return (
    <div className={styles.root}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'rgb(0, 45, 156)',
            borderRadius: 0,
          },
        }}
      >
        <div className="achievement_content">
          <div className="left">
            <Editor
              projectList={projectList}
              currentProject={currentProject}
              setCurrentProject={setCurrentProject}
              ref={childRef}
              modeList={modeList}
              mode={mode}
              setMode={setMode}
              setQcData={setQcData}
              setSubmitModal={setSubmitModal}
            />
          </div>
          {mode === 'Calibration' ? (
            <NewMode qcData={qcData} runSubmit={runSubmit} />
          ) : null}
          {mode === 'JavaScript_simulator' ? (
            <JsSimulator qcData={qcData} />
          ) : null}
          {mode === 'Analysis' ? (
            <Analysis runSubmit={runSubmit} qcData={qcData} />
          ) : null}
          {mode === 'Python_simulator' ? (
            <PySimulator
              currentProject={currentProject}
              runSubmit={runSubmit}
              qcData={qcData}
              submitModal={submitModal}
              setSubmitModal={setSubmitModal}
            />
          ) : null}
          {mode === 'Quantum_cumputer' ? (
            <QuantumComputer
              currentProject={currentProject}
              runSubmit={runSubmit}
              qcData={qcData}
            />
          ) : null}
        </div>
      </ConfigProvider>
    </div>
  )
}
