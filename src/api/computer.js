import instance from "./http"
// 获取计算机列表
export const getComList = (data)=>{
    return instance.post('/circuit/getComList',data)
}

