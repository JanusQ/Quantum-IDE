import React, { useState, useEffect } from "react"
import Right from "../Right"
import { InputNumber, Radio, Space, Button, QRCode, message } from "antd"
import { PayCircleOutlined } from "@ant-design/icons"
import wechart from "@/assets/image/pay/wechat-icon.png"
import { payment, paymentSuccess } from "@/api/topUp"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
export default function Buy() {
  NProgress.configure({ easing: "ease", speed: 500, showSpinner: false })
  const rechargeData = [10, 30, 50, 100, 200]
  const [rechargeMoney, setRechargeMoney] = useState(null)
  const [payType, setTayType] = useState(null)
  const [qrCodeUrl, setqrCodeUrl] = useState(null)
  const [paySuccess, setPaySuccess] = useState(false)
  const [timeId, setTimeId] = useState(undefined)
  const onChange = (e) => {
    setRechargeMoney(e)
  }
  const onFocus = (e) => {
    setRechargeMoney(null)
    setqrCodeUrl(null)
  }
  const chosePaytype = (e) => {
    setTayType(null)
    setqrCodeUrl(null)
    setTayType(e.target.value)
  }

  const pay = async () => {
    NProgress.start()
    let payData = {
      amount: rechargeMoney * 100,
      payment_type: "RECHARGE",
      payment_mode: payType,
    }
    const { data } = await payment(payData)
    let payId = data.payment_id
    NProgress.done()
    if (data.payment_mode === "WX_NATIVE") {
      setqrCodeUrl(null)
      setqrCodeUrl(data.code_url)
    } else if (data.payment_mode === "ALIPAY_PAGE") {
      setqrCodeUrl(null)
      setqrCodeUrl(data.code_url)
    }

    const intervalId = setInterval(async () => {
      const { data } = await paymentSuccess(payId)
      if (data.payment_status == "SUCCESS") {
        setPaySuccess(true)
        message.success("支付成功", 1)
      }
    }, 2000)
    setTimeId(intervalId)
  }
  useEffect(() => {
    // 支付成功时清除定时器
    if (paySuccess) {
      clearInterval(timeId)
      setPaySuccess(false)
      setRechargeMoney(null)
      setqrCodeUrl(null)
    }
  }, [paySuccess])
  useEffect(() => {
    // 离开页面时清除定时器
    return () => {
      clearInterval(timeId)
    }
  })
  useEffect(() => {
    if (rechargeMoney && payType) {
      pay()
    } else {
      message.config("请选择支付金额或支付方式", 0.5)
    }
  }, [rechargeMoney, payType])
  return (
    <Right title={"购买量子币"}>
      <div className="pay_bcoin_recharge_content">
        <div className="pay_bcoin_recharge_content_title">购买数量</div>
        <div className="pay_rechange_panel_box">
          {rechargeData.map((item, index) => (
            <div
              onClick={() => setRechargeMoney(item)}
              key={index}
              className={
                item === rechargeMoney
                  ? "pay_rechange_item pay_rechange_item_selected"
                  : "pay_rechange_item"
              }
            >
              <span>
                <PayCircleOutlined style={{ marginRight: 10 }} />
                {item}
              </span>
            </div>
          ))}
          <div className="pay_recharge_diy_wp">
            <InputNumber
              placeholder="自定义金额"
              prefix="￥"
              onFocus={onFocus}
              onChange={onChange}
              size="large"
              min={1}
              style={{
                height: 80,
                width: "100%",
                fontSize: 30,
                lineHeight: 80,
              }}
            />
          </div>
        </div>
        <div className="pay_rechange_qr_wp">
          <div className="select_pay_type">
            <p>请选择支付方式</p>
            <Radio.Group onChange={chosePaytype}>
              <Space>
                <Radio checked={payType === "5555"} value="WX_NATIVE">
                  <div className="wx_pay">
                    <img src={wechart} alt="" />
                  </div>
                </Radio>
                {/* <Radio value="ALIPAY_PAGE">
                  <div className="zfb_pay">
                    <img src={alipayimg} alt="" />
                  </div>
                </Radio> */}
              </Space>
            </Radio.Group>
            <div className="qrcode">
              {/* {qrCodeUrl && payType === "ALIPAY_PAGE" && (
                <iframe
                  style={{ width: "100%", height: "100%" }}
                  title="支付宝"
                  src={qrCodeUrl}
                ></iframe>
              )} */}
              {rechargeMoney && qrCodeUrl && payType === "WX_NATIVE" && (
                <div style={{ marginTop: 30 }}>
                  <QRCode errorLevel="H" value={qrCodeUrl} icon={wechart} />
                  <div style={{ marginLeft: 10 }}>
                    微信扫码支付:{rechargeMoney}.00元
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Right>
  )
}
