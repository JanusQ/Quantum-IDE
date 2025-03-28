import React, { useState, useEffect } from 'react'
import { Button, Modal, Input, Form, Select, Row, Col, message } from 'antd'
import GraphEcharts from '../GraphEcharts'
import { addChip, getChipDetail } from '@/api/chip'
export default function AddChipModal({ getChipListData }) {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [graphData, setGraphData] = useState([])
  const [qubitNum, setQubitNum] = useState(5)
  // c
  const createGraphData = () => {
    const data = []
    // 棋盘参数
    const rows = 2
    const cols = 5
    const cellSize = 80 // 每个格子像素大小
    for (let i = 0; i < qubitNum; i++) {
      const row = Math.floor(i / cols) // 行索引 (0-1)
      const col = i % cols // 列索引 (0-4)
      data.push({
        name: `q${i + 1}`,
        value: Math.random() * 100,
        x: col * cellSize + cellSize / 2, // 水平居中
        y: row * cellSize + cellSize / 2, // 垂直居中,
        color: '#003f88',
      })
    }
    console.log(data, 88)

    setGraphData(data)
  }
  useEffect(() => {
    createGraphData()
  }, [qubitNum])

  // 生成连线数据
  const [linkData, setLinkData] = useState([])

  // 创建芯片
  const createChip = async (values) => {
    const { data } = await addChip({ ...values })
    message.success('创建成功')
    getChipListData()
  }

  return (
    <div>
      <Button onClick={() => setVisible(true)} type="primary">
        创建芯片
      </Button>
      <Modal
        width={1000}
        title="创建芯片"
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <div className="create_modal_content" style={{ display: 'flex' }}>
          <div className="form_content" style={{ width: '50%' }}>
            <Form
              initialValues={{
                chip_qubit: qubitNum,
              }}
              onFinish={createChip}
              form={form}
              layout="vertical"
            >
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入芯片名称',
                  },
                ]}
                label="芯片名称"
                name="chip_name"
              >
                <Input />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请选择比特数',
                  },
                ]}
                label="比特数"
                name="chip_qubit"
              >
                <Select
                  value={qubitNum}
                  onChange={(value) => setQubitNum(value)}
                >
                  {Array.from({ length: 100 }).map((_, index) => {
                    return (
                      <Select.Option key={index} value={index + 1}>
                        {index + 1}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入芯片名称',
                  },
                ]}
                label="basis_single_gates"
                name="basis_single_gates"
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: '100%',
                  }}
                  placeholder="Please select"
                  defaultValue={['rx', 'h']}
                  options={[
                    {
                      value: 'rx',
                      label: 'RX',
                    },
                    {
                      value: 'ry',
                      label: 'RY',
                    },
                    {
                      value: 'rz',
                      label: 'RZ',
                    },
                    {
                      value: 'h',
                      label: 'H',
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入芯片名称',
                  },
                ]}
                label="single_qubit_gate_time"
                name="single_qubit_gate_time"
              >
                <Input />
              </Form.Item>

              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入芯片名称',
                  },
                ]}
                label="basis_two_gates"
                name="basis_two_gates"
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: '100%',
                  }}
                  placeholder="Please select"
                  defaultValue={['rz']}
                  options={[
                    {
                      value: 'rz',
                      label: 'rz',
                    },
                    {
                      value: 'rx',
                      label: 'rx',
                    },
                    {
                      value: 'ry',
                      label: 'ry',
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入芯片名称',
                  },
                ]}
                label="two_qubit_gate_time"
                name="two_qubit_gate_time"
              >
                <Input />
              </Form.Item>

              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="grap_content" style={{ width: '50%', height: 500 }}>
            <GraphEcharts linksData={linkData} data={graphData} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
