// 后台管理用户接口
import instance from './http'
// 注册
export const getUserList = (data) => {
	return instance.post('/user/userListFilter', data)
}
