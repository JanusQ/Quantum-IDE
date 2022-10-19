import axios from 'axios'
import { message } from 'antd'
import qs from 'qs'
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
// // 请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
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
