// 文档接口
import instance from './http'
import axios from 'axios'
// 获取文档列表
export const getDocList = (data) => {
	return instance.post('/doc/getDocList', data)
}
// 删除文档
export const deleteDocAdmin = (data) => {
	return instance.post('/doc/deleteDocAdmin', data)
}
// 添加文档
export const addDocAdmin = (data) => {
	return instance.post('/doc/addDocAdmin', data)
}
// 更新文档
export const updateDocAdmin = (data) => {
	return instance.post('/doc/updateDocAdmin', data)
}
// 获取文档内容
export const getDoc = (data) => {
	return axios.post('/doc/getDoc', data)
}
