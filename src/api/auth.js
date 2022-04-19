import instance from "./http"
// 注册
export const register = (data)=>{
    return instance.post('/circuit/register',data)
}
// 登录
export const login = (data)=>{
    return instance.post('/circuit/login',data)
}
