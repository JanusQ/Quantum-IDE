import axios from 'axios'
import { message } from 'antd'
import qs from 'qs'
// import { getToken, removeToken } from './storage'
import { removeToken, removeUserData } from '@/utils/storage'
import { useNavigate } from 'react-router-dom'
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
  baseURL: '/api1',
  timeout: 1000 * 50,
})
// const history = useHistory()
// // 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const isUserModule = config.url.substring(1, 5)
    const locaToken = localStorage.getItem('QUANTUM')
    const mytoken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODYwMzk5LCJpYXQiOjE3MTM4NDk1OTksImp0aSI6IjM5MzBjZTI4NWZhMTQ2MWFiOGExYWYwZWM3MjVkYmJjIiwidXNlcl9pZCI6MTE0LCJuYW1lIjoiMjU4MTUwNDZAcXEuY29tIn0.PxEfEBOEATGHQWFOW2y_snBXGiE_JNfbwNwDGlFrkhc'
    let token = locaToken ? locaToken : mytoken
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
      const navigate = useNavigate()
      // navigate('/')
      window.location.href = '/'
      removeToken()
      removeUserData()
      message.warning('请重新登录')
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
