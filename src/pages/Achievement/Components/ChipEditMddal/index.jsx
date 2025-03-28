import React, { useEffect } from 'react'
import { Modal, Space, Button, Form, Input, Select, message } from 'antd'
import { updateChip } from '@/api/chip'
export default function ChipEditMddal({
  chipEditMddalOpen,
  setChipEditMddalOpen,
  title,
  selectNodeData,
  setSelectNodeData,
  chipId,
  getChipDetailGraphData,
  n_qubits,
}) {
  const confirm = async (values) => {
    const { data } = await updateChip({
      ...values,
      id: selectNodeData.qubitid,
    })
    message.success('修改成功')
    getChipDetailGraphData()

    // setChipEditMddalOpen(false)
  }
  const [form] = Form.useForm()
  useEffect(() => {
    if (selectNodeData && chipEditMddalOpen && form) {
      form.setFieldsValue({ ...selectNodeData })
      // console.log(selectNodeData, 6666)
    }
  }, [selectNodeData, chipEditMddalOpen])

  return (
    <Modal
      title={title}
      width={650}
      open={chipEditMddalOpen}
      onCancel={() => {
        setChipEditMddalOpen(false)
        setSelectNodeData(null)
        form.resetFields()
      }}
      onOk={form.submit}
      // footer={null}
    >
      <div>
        <Form
          form={form}
          onFinish={confirm}
          // initialValues={{
          //   ...selectNodeData,
          // }}
        >
          <Form.Item
            name="name"
            label="名称："
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input disabled placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            name="t1"
            label="T1"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="t2"
            label="T2"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="fs_1q"
            label="fs_1q"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="fs_2q"
            label="fs_2q"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="rd_0_1"
            label="rd_0_1"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="rd_1_0"
            label="rd_1_0"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="err"
            label="err"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="topology"
            label="topology"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Select mode="multiple" allowClear>
              {Array.from({ length: n_qubits }).map((_, index) => {
                return (
                  <Select.Option key={index} value={index}>
                    {index}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
