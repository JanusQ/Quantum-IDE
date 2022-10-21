// 后台管理用户接口
import instance from './http'
// 注册
export const getUserList = (data) => {
  return instance.get(
    `/user/?page=${data.page_num}&page_size=${data.page_size}/`
  )
}
// 管理员获取用户信息
export const adminUserDetailedInfo = (data) => {
  return instance.get(`/user/${data}/`)
}
// 管理员编辑用户信息
export const updateUserAdmin = (id, data) => {
  return instance.patch(`/user/${id}/`, data)
}
// 管理员删除
export const userDelete = (id) => {
  return instance.delete(`/user/${id}/`)
}
