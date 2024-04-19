import instance from './http'
// 支付接口
export const payment = (data) => {
  return instance.post('/test/payment/pay/', data)
}
// 支付成功查询
export const paymentSuccess = (data) => {
  return instance.get(`/test/payment/query/${data}/`)
}

// 计算扣费价格

export const getPrice = (data) => {
  return instance.post('/premium/getPrice', data)
}
// 获取用户钱包余额
export const getUserCredits = (data) => {
  return instance.post('/premium/getUserCredits', data)
}
// 充值记录
export const getUserRecords = (data) => {
  return instance.post('/premium/getUserRecords', data)
}
