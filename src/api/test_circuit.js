import instance from "./http"
// 发数据到真机
export const send_to_real = (data)=>{
    return instance.post('/circuit/run',data)
}
// 从真机收数据
export const recieve_from_real = (data)=>{
    return instance.get('/circuit/result',{data})
}
