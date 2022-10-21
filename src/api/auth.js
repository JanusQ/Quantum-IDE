import axios from 'axios'
import instance from './http'
// 注册
export const register = (data) => {
  return instance.post('/user/register/', data)
}
// 登录
export const login = (data) => {
  return instance.post('/user/login/', data)
}
// 获取登录前验证图片
export const getVertifyImg = () => {
  return instance.get('/user/imageCode/')
}
// 获取登录前验证图片
export const VertifyImgCode = (data) => {
  return instance.post('/user/imageCode/', data)
}
// 基本信息获取
export const getUserInfo = (data) => {
  return instance.get(`/user/${data}/partial_list/`)
}
// 变更个人信息
export const updateUserInfo = (id, data) => {
  return instance.patch(`/user/${id}/`, data)
}
// 修改密码
export const updateUserPassword = (id, data) => {
  return instance.post(`/user/updatePassword/${id}/`, data)
}
// 注册论坛
export const registerDiscuz = (data) => {
  return axios.post('/api/v3/users/username.register', data)
}
