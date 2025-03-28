import React, { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  Input,
  Form,
  Select,
  Row,
  Col,
  message,
  Space,
} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { addCoupling } from '@/api/chip'
export default function AddCouplerModal({
  graphNodeList,
  chipId,
  getChipDetailGraphData,
}) {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const onFinish = async (values) => {
    const { data } = await addCoupling({
      couplers: values.couplers.map((item) => ({ ...item, chip_id: chipId })),
    })
    message.success('添加成功')
    getChipDetailGraphData()
  }
  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        添加耦合器
      </Button>
      <Modal
        // width={1000}
        title="添加耦合器"
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        zIndex={10000}
        footer={null}
      >
        <Form
          name="form"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          // autoComplete="off"
        >
          <Form.List name="couplers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: 'flex',
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'qubit1_id']}
                      rules={[
                        {
                          required: true,
                          message: '',
                        },
                      ]}
                    >
                      <Select
                        onChange={(value) => {
                          console.log(8899)
                        }}
                        options={graphNodeList.map((node) => ({
                          value: node.qubitid,
                          label: node.name,
                        }))}
                        placeholder="选择量子比特1"
                        style={{ width: 200 }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'qubit2_id']}
                      rules={[
                        {
                          required: true,
                          message: '',
                        },
                      ]}
                    >
                      <Select
                        options={graphNodeList.map((node) => ({
                          value: node.qubitid,
                          label: node.name,
                        }))}
                        placeholder="选择量子比特2"
                        style={{ width: 200 }}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    新增耦合器节点
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space size={30}>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
              <Button
                onClick={() => {
                  form.resetFields()
                  setVisible(false)
                }}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
