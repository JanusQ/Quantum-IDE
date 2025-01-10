import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import Editor from './Components/Editor'
import { Space, Button, Row, Col, ConfigProvider } from 'antd'
import Circuit from '@/components/Circuit'
import BarChartEchart from './Components/BarChartEchart'
import ConFirmModal from './Components/ConFirmModal'
export default function Achievement() {
  const [qcData, setQcData] = useState('')
  const [name2index, setName2index] = useState([])
  const addLables = () => {}
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
  const compile = () => {}
  // 保真度预测
  const fidelity = () => {}

  // 读取校准
  const readCalibration = () => {}
  // 运行
  const runProgram = () => {}

  // confirmModalOpen
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confimTitle, setConfimTitle] = useState('')
  const [confirmFunction, setConfirmFunction] = useState(() => {})

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
            <Editor setQcData={setQcData} />
          </div>
          <div className="right">
            <div className="operate_content">
              <Space size={20}>
                <Button
                  onClick={() => {
                    setConfirmModalOpen(true)
                    setConfimTitle('编译')
                    setConfirmFunction(() => compile)
                  }}
                >
                  编译
                </Button>
                <Button
                  onClick={() => {
                    setConfirmModalOpen(true)
                    setConfimTitle('保真度预测')
                    setConfirmFunction(() => compile)
                  }}
                >
                  保真度预测
                </Button>
                <Button
                  onClick={() => {
                    setConfirmModalOpen(true)
                    setConfimTitle('读取校准')
                    setConfirmFunction(() => compile)
                  }}
                >
                  读取校准
                </Button>
                <Button
                  onClick={() => {
                    setConfirmModalOpen(true)
                    setConfimTitle('运行')
                    setConfirmFunction(() => compile)
                  }}
                >
                  运行
                </Button>
              </Space>
            </div>
            <div className="circuit_content">
              <div className="title">编译前电路</div>

              <div className="circuit_item">
                <Circuit
                  gates={qcData?.circuit?.gates}
                  name2index={name2index}
                  labels={qcData.labels}
                  addLables={addLables}
                />
              </div>
              <div className="title">编译后电路</div>

              <div className="circuit_item"></div>
            </div>
            <div className="resoult_content">
              <Row gutter={[10, 10]}>
                <Col span={8}>
                  <div className="title">保真度结果</div>
                  <div className="resoult_item"></div>
                </Col>
                <Col span={8}>
                  <div className="title">电路运行结果</div>
                  <div className="resoult_item">
                    <BarChartEchart chartData={[1, 2, 3]} />
                  </div>
                </Col>
                <Col span={8}>
                  <div className="title">读取校准结果</div>
                  <div className="resoult_item">
                    <BarChartEchart chartData={[1, 2, 3]} />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </ConfigProvider>

      <ConFirmModal
        confirmModalOpen={confirmModalOpen}
        setConfirmModalOpen={setConfirmModalOpen}
        confimTitle={confimTitle}
        confirmFunction={confirmFunction}
      />
    </div>
  )
}
