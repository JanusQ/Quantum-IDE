import React, { useEffect, useState } from 'react'
import { Menu, Dropdown, message } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isAuth } from '../../helpers/auth'
import '../styles/Layout.css'
import { getRemainderList } from '../../api/remainder'
import { getUserInfo } from '../../api/auth'
import AbuoutUs from './AbuoutUs'
function useActive(currentPath, path) {
  return currentPath === path ? 'active' : ''
}
function useActiveAct(currentPath, path) {
  return currentPath.indexOf(path) === -1 ? '' : 'active'
}
const Navigation = ({ isIde }) => {
  const history = useHistory()
  const router = useSelector((state) => state.router)
  const pathname = router.location.pathname
  const isHome = useActive(pathname, '/')
  const isComputer = useActive(pathname, '/computer')
  // const isApp = useActive(pathname, '/app')
  // const isNotice = useActive(pathname, '/notice')
  // const isNoticeDetail = useActive(pathname, '/noticedetail')
  const isProject = useActive(pathname, '/project')
  const isReferenceDoc = useActiveAct(pathname, '/referenceDoc')
  const isaboutUs = useActiveAct(pathname, '/aboutUs')
  const auth = isAuth()
  const [remainNum, setRemainNum] = useState(1)
  let interval = null
  const getRemainderListFn = async () => {
    const formData = new FormData()
    formData.append('user_id', auth.user_id)
    const { data } = await getRemainderList(formData)
    setRemainNum(data.remainder_list.length)
  }
  const logOut = () => {
    localStorage.removeItem('jwt')
    history.push('/signin/1')
  }
  useEffect(() => {
    if (!interval && isAuth()) {
      getRemainderListFn()
      interval = setInterval(() => {
        getRemainderListFn()
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [])
  const lookRemainder = () => {
    if (remainNum) {
      history.push('/message')
    }
  }
  // 获取用户信息 判断是否是管理员 能否访问后台管理系统
  const getUserInfoFn = async () => {
    const params = {}
    params.user_id = auth.user_id
    const { data } = await getUserInfo(params)
    setadmin(data.user_type)
  }
  useEffect(() => {
    getUserInfoFn()
  }, [])
  const [admin, setadmin] = useState(null)
  // 下拉菜单
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/usercenter/1">个人中心</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/usercenter/2">修改密码</Link>
      </Menu.Item>
      {admin === 0 ? (
        <Menu.Item key="3">
          <Link to="/admin">后台管理</Link>
        </Menu.Item>
      ) : (
        false
      )}
      <Menu.Item key="4" onClick={logOut}>
        退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <>
      <ul
        className="front_menu_list"
        style={{ paddingTop: isIde ? '1px' : '15px' }}
      >
        <li className={isHome}>
          <Link to="/">首页</Link>
        </li>
        <li className={isComputer}>
          <Link to="/computer">计算资源</Link>
        </li>
        <li className={isProject}>
          <Link to="/project">项目管理</Link>
        </li>
        <li className={isReferenceDoc}>
          <Link to="/referenceDoc/all">教程与文档</Link>
        </li>
        <li>
          <a target="_blank" href="http://janusq.zju.edu.cn:10213/">
            社区论坛
          </a>
        </li>
        <li className={isaboutUs}>
          {' '}
          <Link to="/aboutUs">关于我们</Link>
        </li>
      </ul>

      <ul
        className="front_menu_list front_menu_list_second"
        style={{ paddingTop: isIde ? '1px' : '15px' }}
      >
        {!isAuth() && (
          <>
            <li>
              <Link to="/signin/1">登录</Link>
            </li>
            <li style={{ marginLeft: '25px' }}>
              <Link to="/signin/2">注册</Link>
            </li>
          </>
        )}
        {isAuth() && (
          <>
            <li className="front_menu_user">
              <Dropdown overlay={menu}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="front_user_name">{auth.username}</span>
                  <DownOutlined />
                </a>
              </Dropdown>
            </li>
            <li className="menu_notice_li">
              <span className="front_ling_dang" onClick={lookRemainder}></span>
              <span
                className="front_tip_num"
                style={{ display: remainNum > 0 ? 'inline-block' : 'none' }}
              >
                {remainNum}
              </span>
            </li>
          </>
        )}
      </ul>
    </>
  )
}
export default Navigation
