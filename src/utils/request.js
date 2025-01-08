import axios from 'axios'
import { getToken, removeToken } from './storage'
import { message } from 'antd'
const request = axios.create({
  baseURL: '/api1',
  timeout: 5000,
})

request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么

    const token = getToken()
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  // eslint-disable-next-line func-names
  function (response) {
    // 对响应数据做点什么
    switch (response.data.status) {
      case 407:
        message.error(response.data.msg, 1)
        window.location.href = '/'
        removeToken()

        break
      default:
    }
    return response
  },
  // eslint-disable-next-line func-names
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
export default request
