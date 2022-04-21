// 通知相关接口
import instance from './http'
// 获取通知列表
export const getNoticeList = (data) => {
	return instance.post('/notice/getNoticeList', data)
}
