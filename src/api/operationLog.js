import request from "./request"
import instance from "./http"
export const uploadOperation = (data) =>{
  return instance.post('/log/submitLog',data)
}
// 获取操作日志列表
export const getOperationLogList = (data)=>{
  return instance.post('/log/getLogList',data)
}