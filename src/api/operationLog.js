import request from "./request"

export const uploadOperation = (data) =>{
  return request.post('/log/submitLog',data)
}
// 获取操作日志列表
export const getOperationLogList = (data)=>{
  return request.post('/log/getLogList',data)
}