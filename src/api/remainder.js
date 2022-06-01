// 通知相关接口
import instance from './http'
// 获取通知列表
export const getRemainderList = (data) => {
	return instance.post('/remainder/getRemainderList', data)
}
// 用户读消息
export const readRemainder = (data) => {
	return instance.post('/remainder/readRemainder', data)
}


