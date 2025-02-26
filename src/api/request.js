import axios from 'axios'
import NProgress from '@/utils/nprogress'
const request = axios.create({
  baseURL: '/janusq',
  timeout: 50000 * 50000,
})
request.interceptors.request.use(
  function (config) {
    NProgress.start()
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    NProgress.done()
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    NProgress.done()
    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    NProgress.done()
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
export default request
