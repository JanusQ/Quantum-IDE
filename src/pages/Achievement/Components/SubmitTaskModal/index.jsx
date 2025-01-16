import React from 'react'
import { Modal, Button, Form, Input, Select } from 'antd'
export default function SubmitTaskModal({
  setSubmitModal,
  submitModal,
  runProgram,
  type,
}) {
  const [form] = Form.useForm()
  const onFinish = async (values) => {
    runProgram(values)
  }
  const PySimulatorLisr = [
    { value: 'python simulator', label: 'python simulator' },
  ]
  const QuantumComputerList = [{ value: 'Tianmu-1', label: 'Tianmu-1' }]
  return (
    <Modal
      open={submitModal}
      onCancel={() => setSubmitModal(false)}
      title="Submit task"
      onOk={() => form.submit()}
      okText="Submit"
    >
      <Form
        initialValues={{
          sample: 3000,
          computer_name: type === 'quantum' ? 'Tianmu-1' : 'python simulator',
        }}
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          rules={[{ required: true }]}
          name="sample"
          label="sampling number"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          name="computer_name"
          label="your resources"
        >
          <Select
            options={type === 'quantum' ? QuantumComputerList : PySimulatorLisr}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
