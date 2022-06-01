// 通知相关接口
import instance from './http'
import axios from 'axios'
// 获取通知列表
export const getNoticeList = (data) => {
	return instance.post('/notice/getNoticeList', data)
}
// 添加通知
export const addNoticeAdmin = (data) => {
	return instance.post('/notice/addNoticeAdmin', data)
}
// 删除通知
export const deleteNoticeAdmin = (data) => {
	return instance.post('/notice/deleteNoticeAdmin', data)
}
// 编辑通知
export const updateNoticeAdmin = (data) => {
	return instance.post('/notice/updateNoticeAdmin', data)
}
// 获取通知内容
export const getNotice = (data) => {
	return axios.post('/notice/getNotice', data)
}
