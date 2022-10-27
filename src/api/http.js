import axios from 'axios'
import { message } from 'antd'
import qs from 'qs'
import { getToken, removeToken } from './storage'
message.config({
  maxCount: 1,
})
const tip = (msg) => {
  message.error(msg, 1)
}

const errorHandle = (status, other) => {
  switch (status) {
    default:
      tip(other)
      break
  }
}
var instance = axios.create({
  timeout: 1000 * 50,
})
// const history = useHistory()
// // 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const isUserModule = config.url.substring(1, 5)
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      return config
    }
    if (config.method === 'get' && isUserModule !== 'user') {
      config.paramsSerializer = function (params) {
        // 序列化参数
        return qs.stringify(params, {
          arrayFormat: 'repeat',
        })
      }
      return config
    } else {
      return config
    }
  },
  (error) => Promise.error(error)
)
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.data.status === 0) {
      return Promise.resolve(res.data)
    } else if (res.data.status === 200) {
      return Promise.resolve(res.data)
    } else if (res.data.status === 409) {
      return Promise.resolve(res.data)
      return Promise.resolve(res.data)
    } else if (res.data.status === 404) {
      message.error(res.data.msg, 1)
      return Promise.resolve(res.data)
    } else if (res.data.status === 409) {
      return Promise.resolve(res.data)
    } else if (res.data.status === 407) {
      message.error(res.data.msg, 1)
      // history.replace({
      //   pathname: 'signin/1#/signin/1',
      // })
      window.location.href = 'signin/1'
      localStorage.removeItem('jwt')
      removeToken()
      return Promise.resolve(res.data)
    } else {
      errorHandle(res.data.status, res.data.msg, 78977)
      return Promise.reject(res.data)
    }
    // return Promise.resolve(res.data)
  },
  (error) => {
    if (error.message.includes('timeout')) {
      tip('请求超时，请重试')
    }
    return Promise.reject(error)
  }
)
export default instance
