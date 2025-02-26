import request from './request'
import instance from './http'

//获取用户信息
// 获取noise数据
// export const getNoiseData = (data) => {
//   request({
//     url: '/circuit/runCircuitNoise',
//     method: 'post',
//     data,
//   })
// }
export const getNoiseData = (data) => {
  return request.post('/circuit/runCircuitNoise', data)
}
// 读取校准数据
export const readCalibrationData = (data) => {
  return request.post('/circuit/calibration', data)
}
// 运行readout_calibration
export const runReadoutCalibration = (data) => {
  return request.post('/circuit/readoutCalibration', data)
}
