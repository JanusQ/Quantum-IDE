import React, { useEffect, useState } from 'react'
import { Menu, Dropdown, message, Switch } from 'antd'
import { DownOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isAuth } from '../../helpers/auth'
import '../styles/Layout.css'
import { getRemainderList } from '../../api/remainder'
import { getUserInfo } from '../../api/auth'
import AbuoutUs from './AbuoutUs'
import { removeToken } from '../../api/storage'
import { useTranslation } from 'react-i18next'
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
    removeToken()
    history.push('/signin/1')
  }
  useEffect(() => {
    if (!interval && isAuth()) {
      getRemainderListFn()
      // interval = setInterval(() => {
      //   getRemainderListFn()
      // }, 5000)
    }
    return () => clearInterval(interval)
  }, [])
  const lookRemainder = () => {
    if (remainNum) {
      history.push('/message')
    }
  }
  // 切换语言
  const [lang, setLang] = useState('en')

  useEffect(() => {
    // 首次加载为中文
    i18n.changeLanguage(lang)
  }, [lang])

  const { t, i18n } = useTranslation()
  const changeLanguage = (check) => {
    switch (check) {
      case true:
        setLang('zh')
        break
      case false:
        setLang('en')
        break
      default:
    }

    // i18n.changeLanguage(lang)
  }
  // 获取用户信息 判断是否是管理员 能否访问后台管理系统
  // const getUserInfoFn = async () => {
  //   const params = {}
  //   params.user_id = auth.user_id
  //   const { data } = await getUserInfo(params.user_id)
  //   console.log(data)
  //   setadmin(auth.user_type)
  //   console.log(auth.user_type, 'auth.user_type')
  // }
  // useEffect(() => {
  //   getUserInfoFn()
  // }, [])
  // const [admin, setadmin] = useState(null)
  // 下拉菜单
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/usercenter/1">{t('menu.personalCenter')}</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/usercenter/2">{t('menu.changePassword')}</Link>
      </Menu.Item>
      {auth.user_type === 0 ? (
        <Menu.Item key="3">
          <Link to="/admin">{t('menu.backgroundSystem')}</Link>
        </Menu.Item>
      ) : (
        false
      )}
      <Menu.Item key="4" onClick={logOut}>
        {t('menu.logOut')}
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
          <Link to="/">{t('nav.home')}</Link>
        </li>
        <li className={isComputer}>
          <Link to="/computer">{t('nav.computingResource')}</Link>
        </li>
        <li className={isProject}>
          <Link to="/project">{t('nav.pm')}</Link>
        </li>
        <li className={isReferenceDoc}>
          <Link to="/referenceDoc/all">{t('nav.document')}</Link>
        </li>
        <li>
          <a target="_blank" href="http://janusq.zju.edu.cn:10213/">
            {t('nav.forum')}
          </a>
        </li>
        <li className={isaboutUs}>
          {' '}
          <Link to="/aboutUs">{t('nav.aboutUs')}</Link>
        </li>
        <li>
          <Switch
            onChange={changeLanguage}
            checkedChildren="中文"
            unCheckedChildren="English"
            defaultChecked={false}
          />
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
