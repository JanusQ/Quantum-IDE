// 后台管理用户接口
import instance from './http'
// 注册
export const getUserList = (data) => {
	return instance.post('/user/userListFilter', data)
}
// 管理员获取用户信息
export const adminUserDetailedInfo = (data) => {
	return instance.post('/user/userDetailedInfo', data)
}
// 管理员编辑用户信息
export const updateUserAdmin = (data) => {
	return instance.post('/user/updateUserAdmin', data)
}
// 管理员删除
export const userDelete = (data)=>{
	return instance.post('/user/userDelete', data)
}