import axios from 'axios'
import instance from './http'
// 注册
export const register = (data) => {
	return instance.post('/user/register', data)
}
// 登录
export const login = (data) => {
	return instance.post('/user/login', data)
}
// 基本信息获取
export const getUserInfo = (data) => {
	return instance.post('/user/userInfo', data)
}
// 变更个人信息
export const updateUserInfo = (data) => {
	return instance.post('/user/updateUserInfo', data)
}
// 修改密码
export const updateUserPassword = (data) => {
	return instance.post('/user/updateUserPassword', data)
}
// 注册论坛
export const registerDiscuz = (data)=>{
	return axios.post('/api/v3/users/username.register', data)
}
