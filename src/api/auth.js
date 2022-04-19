import axios from "./http"
// 注册
export const register = (data)=>{
    return axios.post('/circuit/register',data)
}
// 登录
export const login = (data)=>{
    return axios.post('/circuit/login',data)
}
