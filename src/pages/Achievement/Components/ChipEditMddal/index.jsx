import React, { useEffect } from 'react'
import { Modal, Space, Button, Form, Input, Select } from 'antd'

export default function ChipEditMddal({
  chipEditMddalOpen,
  setChipEditMddalOpen,
  title,
  selectNodeData,
  setSelectNodeData,
}) {
  const confirm = () => {
    setChipEditMddalOpen(false)
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
      onOk={confirm}
      // footer={null}
    >
      <div>
        <Form
          form={form}
          // initialValues={{
          //   ...selectNodeData,
          // }}
        >
          <Form.Item
            name="name"
            label="名称："
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            name="T1"
            label="T1"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="T2"
            label="T2"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          {/* <Form.Item
            name="err"
            label="err"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="" />
          </Form.Item> */}
          <Form.Item
            name="x"
            label="X"
            rules={[{ required: true, message: '' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="x"
            label="Y"
            rules={[{ required: true, message: '' }]}
          >
            <Input placeholder="" />
          </Form.Item>
        </Form>
        {title == '编辑' ? (
          <Space>
            <Button>删除</Button>
            <Button>新增连接</Button>
          </Space>
        ) : null}
      </div>
    </Modal>
  )
}
