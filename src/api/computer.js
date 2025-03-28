// 计算机相关接口
import instance from './http'
// 获取计算机列表
export const getComList = (data) => {
  return instance.post('/computer/getComList', data)
}
// 获取计算机详情
export const getComDetil = (data) => {
  return instance.post('/computer/getComDetail', data)
}

// 获取芯片列表
export const getChipList = (data) => {
  return instance.get('/chip/getChipList', data)
}
