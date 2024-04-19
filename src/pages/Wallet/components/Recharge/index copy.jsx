import React, { useState } from "react"
import Right from "../Right"
import { Button, Form, Input, Radio, Card, Space, InputNumber } from "antd"
import { CheckOutlined } from "@ant-design/icons"
export default function Buy() {
  const [form] = Form.useForm()
  const [isSelefMoney, setisSelefMoney] = useState(false)
  const onFinish = async (value) => {
    let amount
    if (value.money == "selefvalue") {
      amount = value.selfmoney
    } else {
      amount = value.money
    }
    let payDada = {
      amount,
      payment_type: "RECHARGE",
      payment_mode: value.payment_mode,
    }
    // const data = await payment(payDada)
    // console.log(data)
    form.resetFields()
  }

  const selectmoney = (e) => {
    if (e.target.value == "selefvalue") {
      setisSelefMoney(true)
    } else {
      setisSelefMoney(false)
    }
  }
  const onFinishFailed = () => {}
  return (
    <Right title={"购买量子币"}>
      <div className="pay_bcoin_recharge_content">
        <div className="pay_bcoin_recharge_content_title">购买数量</div>
        <div className="pay_rechange_panel_box">
          <Form
            form={form}
            name="basic"
            // initialValues={{  }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="money"
              rules={[
                {
                  required: true,
                  message: "请选择充值金额",
                },
              ]}
            >
              <Radio.Group onChange={selectmoney}>
                <Space wrap>
                  <Radio.Button value="10">
                    10元 <CheckOutlined />
                  </Radio.Button>
                  <Radio.Button value="20">20元</Radio.Button>
                  <Radio.Button value="30">100元</Radio.Button>
                  <Radio.Button value="selefvalue">其他金额</Radio.Button>
                </Space>
              </Radio.Group>
            </Form.Item>
            {isSelefMoney && (
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "请输入充值金额",
                  },
                ]}
                label="自定义金额"
                name="selfmoney"
              >
                <InputNumber
                  autoComplete="off"
                  min={1}
                  style={{ width: 100 }}
                />
              </Form.Item>
            )}

            <Form.Item
              name="payment_mode"
              rules={[
                {
                  required: true,
                  message: "请选中支付方式",
                },
              ]}
            >
              <Radio.Group>
                <Space wrap>
                  <Radio.Button value="WX_NATIVE">
                    微信支付 <CheckOutlined />
                  </Radio.Button>
                  <Radio.Button value="ALIPAY_PAGE">支付宝支付</Radio.Button>
                </Space>
              </Radio.Group>
            </Form.Item>
            {/* <p>应付金额：{form}</p> */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                下一步
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="pay_rechange_qr_wp"></div>
      </div>
    </Right>
  )
}
