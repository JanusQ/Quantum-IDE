// 将token储存到logcalStorage中及token的删除 从logcalStorage中获取
const TOKEN_KEY = 'QUANTUM'
const USERDATA_KEY = 'USERDATA'
// export const getToken = () => (localStorage.getItem(TOKEN_KEY) || '{}')
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  return token
}
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)
export const setUserData = (userData) =>
  localStorage.setItem(USERDATA_KEY, JSON.stringify(userData))
export const getUserData = () =>
  JSON.parse(localStorage.getItem(USERDATA_KEY) || noLogin() || {})
export const removeUserData = () => localStorage.removeItem(USERDATA_KEY)

export const isAuth = () => !!getToken()
// 日期在2024年4月27日至2024年4月28日之间对所以操作开发
export const noLogin = () => {
  // 创建要比较的日期对象
  const startDate = new Date('2024-04-16')
  const endDate = new Date('2024-04-29')

  // 创建要检查的日期对象
  const checkDate = new Date() // 默认为当前日期，你也可以指定一个特定日期

  // 判断日期是否在范围内
  if (checkDate >= startDate && checkDate <= endDate) {
    return JSON.stringify({
      // token:
      // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzMzM1MDQ3LCJpYXQiOjE3MTMzMjQyNDcsImp0aSI6IjA4Y2ZmN2ViODY4YTRhYWY5NzAzM2IxMzExYzJhOTIzIiwidXNlcl9pZCI6MTE0LCJuYW1lIjoiMjU4MTUwNDZAcXEuY29tIn0.Gtxjv5MUH2GSMLSHqTiUCRMffy4AZ52Hmq4OUo4JRho',
      user_id: 114,
      user_type: 0,
      username: '没有人登录的账号',
      user_id: 114,
      // login: true,
    })
  } else {
    return JSON.stringify({})
  }
}
