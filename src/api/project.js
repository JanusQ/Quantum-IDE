// 项目相关接口
import instance from './http'
// 获取项目列表
export const getProList = (data) => {
	return instance.post('/project/getProList', data)
}
// 删除项目
export const delPro = (data) => {
	return instance.post('/project/delPro', data)
}
// 获取任务
export const getTaskList = (data) => {
	return instance.post('/project/getTaskList', data)
}
// 查看任务结果
export const getTaskResult = (data)=>{
	return instance.post('/project/getTaskResult', data)
}
