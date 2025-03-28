import instance from './http'

// 获取芯片列表
export const getChipList = (data) => {
  return instance.get('/chip/list', data)
}
// 添加芯片
export const addChip = (data) => {
  return instance.post('/chip/add', data)
}

// 获取芯片详情
export const getChipDetail = (params) => {
  return instance.get('/chip/detail', { params })
}

// 修改芯片
export const updateChip = (data) => {
  return instance.post('/chip/updateDetail', data)
}
// 添加耦合度数据
export const addCoupling = (data) => {
  return instance.post('/chip/addCuopler', data)
}

// 删除耦合度数据
export const deleteCoupling = (data) => {
  return instance.post('/chip/deleteCuopler', data)
}
