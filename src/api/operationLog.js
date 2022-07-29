import instance from "./http";

export const uploadOperation = (data) =>{
  return instance.get('/log/sbumitLog',data)
}
// 获取操作日志列表
export const getOperationLogList = (data)=>{
  return instance.get('/log/getLogList',data)
}