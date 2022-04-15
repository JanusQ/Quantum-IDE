export function isAuth(){
    const jwt = localStorage.getItem('jwt')
    if(jwt) return JSON.parse(jwt)
    return false
}
// 设置cookie
export const setCookie = (name, value, day) => {
    const date = new Date()
    date.setDate(date.getDate() + day)
    document.cookie = name + '=' + value + ';expires=' + date
}
// 获取cookie
export const getCookie = (name) => {
    const reg = RegExp(name + '=([^;]+)')
    const arr = document.cookie.match(reg)
    if (arr) {
        return arr[1]
    } else {
        return ''
    }
}
//删除cookie
export const delCookie = (name) => {
    setCookie(name, null, -1)
}