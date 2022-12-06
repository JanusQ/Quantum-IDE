import instance from './http'
// 发数据到真机
export const send_to_real = (data) => {
	return instance.post('/circuit/run', data)
}
// 从真机收数据
export const recieve_from_real = (params) => {
	return instance.get('/circuit/result', { params })
}
// 分析数据
export const circuitAnalysis  = (data) => {
	return instance.post('/circuit/analysis', data)
}
// 电路预测
export const circuitpredict = (data) => {
	return instance.post('/circuit/predict', data)
}
// 创建项目
export const createPro = (data) => {
    return instance.post('/ide/createPro', data)
}
// 保存项目
export const saveProject = (data) => {
	return instance.post('/ide/savePro', data)
}
// 提交任务
export const submitTask = (data) => {
	return instance.post('/ide/submitTask', data)
}
// 加载项目
export const loadPro = (data) => {
	return instance.post('/ide/loadPro', data)
}




