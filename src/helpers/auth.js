


export const isAuth = () => {
  const jwt = localStorage.getItem('jwt')
  if (jwt) return JSON.parse(jwt)
  return false
}
// 用户类型
export const userTypeArr = [
  {
    code: 0,
    name: '管理员',
  },
  {
    code: 1,
    name: '模拟器用户',
  },
  {
    code: 2,
    name: '模拟器/量子计算机用户',
  },
]
// 用户状态
export const userStatusArr = [
  {
    code: 0,
    name: '待审核',
  },
  {
    code: 1,
    name: '正常',
  },
  {
    code: 2,
    name: '异常',
  },
]
// 单位类型
export const companyTypeArr = [
  {
    code: 0,
    name: '科研院所',
  },
  {
    code: 1,
    name: '学校',
  },
  {
    code: 2,
    name: '企业',
  },
  {
    code: 3,
    name: '个人',
  },
  {
    code: 4,
    name: '其它',
  },
]
// 任务状态
export const taskTypeArr = [
  {
    code: -1,
    name: '全部',
  },
  {
    code: 0,
    name: '等待中',
  },
  {
    code: 1,
    name: '已完成',
  },
  {
    code: 2,
    name: '已失败',
  },
]
// 映射单位类型
export const companyName = (type) => {
  let str = ''
  companyTypeArr.forEach((item) => {
    if (item.code === type) {
      str = item.name
    }
  })
  return str
}
// 映射用户状态
export const userStatusName = (type) => {
  let str = ''
  userStatusArr.forEach((item) => {
    if (item.code === type) {
      str = item.name
    }
  })
  return str
}
// 映射用户类型
export const userTypeName = (type) => {
  let str = ''
  userTypeArr.forEach((item) => {
    if (item.code === type) {
      str = item.name
    }
  })
  return str
}
// 映射任务类型
export const taskTypeName = (type) => {
  let str = ''
  taskTypeArr.forEach((item) => {
    if (item.code === type) {
      str = item.name
    }
  })
  return str
}
// 设置cookie
export const setCookie = (name, value, day) => {
  const date = new Date()
  date.setDate(date.getDate() + day)
  document.cookie = name + '=' + value + ';expires=' + date + ';secure'
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
