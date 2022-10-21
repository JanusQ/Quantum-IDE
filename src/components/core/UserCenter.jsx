import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import '../styles/UserCenter.css'
import {
  Route,
  Switch,
  Redirect,
  Link,
  useHistory,
  useParams,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Form, Input, message, Select } from 'antd'
import { getUserInfo, updateUserInfo, updateUserPassword } from '../../api/auth'
import { isAuth, companyName } from '../../helpers/auth'
import ComponentTitle from './ComponentTitle'

const UserCenter = () => {
  const history = useHistory()
  const goto = (url) => {
    history.push(url)
  }
  const { type } = useParams()
  // 基本信息
  const auth = isAuth()
  const { Option } = Select
  const onFinish = async (value) => {
    // value.user_id = auth.user_id
    await updateUserInfo(auth.user_id, value)
    message.success('已保存')
    getUserInfoFn()
  }
  const [userInfo, setUserInfo] = useState({})
  const getUserInfoFn = async () => {
    const params = {}
    params.user_id = auth.user_id
    const { data } = await getUserInfo(auth.user_id)
    setUserInfo(data)
    editForm.setFieldsValue(data)
  }
  const editUserInfo = () => {
    const { ...rest } = userInfo
    editForm.setFieldsValue(rest)
  }
  useEffect(() => {
    getUserInfoFn()
  }, [])
  const [editForm] = Form.useForm()
  const userInfoForm = () => {
    return (
      <Form
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        autoComplete="off"
        className="usercenter_form"
        requiredMark={false}
        form={editForm}
      >
        <Form.Item
          label="手机号码："
          name="telephone"
          rules={[
            {
              required: true,
              message: '请输入手机号',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="电子邮箱："
          name="email"
          rules={[
            {
              required: true,
              message: '请输入电子邮箱',
            },
            {
              type: 'email',
              message: '邮箱格式错误',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="单位名称："
          name="company_name"
          rules={[
            {
              required: true,
              message: '请输入单位名称',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="单位类型："
          name="company_type"
          rules={[{ required: true, message: '请选择单位类型' }]}
        >
          <Select placeholder="请选择单位类型">
            <Option value={0}>科研院所</Option>
            <Option value={1}>学校</Option>
            <Option value={2}>企业</Option>
            <Option value={3}>个人</Option>
            <Option value={4}>其它</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="单位地址："
          name="company_address"
          rules={[{ required: true, message: '请输入单位地址' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <Button htmlType="submit" type="primary" style={{ width: '100%' }}>
            保存
          </Button>
        </Form.Item>
      </Form>
    )
  }
  // 修改密码

  const onPwdFinish = async (value) => {
    const { confirm, ...rest } = value
    await updateUserPassword(auth.user_id, rest)
    // console.log(data, 'usecontext')
    // message.success(data.msg)
    // editPasswordForm.resetFields()
  }
  const [editPasswordForm] = Form.useForm()
  const editPwdForm = () => {
    return (
      <Form
        onFinish={onPwdFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        className="usercenter_form"
        requiredMark={false}
        autoComplete="off"
        form={editPasswordForm}
      >
        <Form.Item
          label="原始密码："
          name="old_password"
          rules={[
            {
              required: true,
              message: '请输入原始密码',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="密码："
          name="new_password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="确认密码："
          name="confirm"
          rules={[
            {
              required: true,
              message: '请确认密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <Button htmlType="submit" type="primary" style={{ width: '100%' }}>
            保存
          </Button>
        </Form.Item>
      </Form>
    )
  }
  const [activeIndex, setActiveIndex] = useState(Number(type))
  const tabsClick = (index) => {
    history.push(`/usercenter/${index}`)
  }
  useEffect(() => {
    setActiveIndex(Number(type))
  }, [type])
  return (
    <Layout>
      <ComponentTitle name={'个人中心'}></ComponentTitle>
      <div className="user_center">
        <div className="user_tabs_div">
          <div
            className={activeIndex === 1 ? 'active' : ''}
            onClick={() => tabsClick(1)}
          >
            编辑信息
          </div>
          <div
            className={activeIndex === 2 ? 'active' : ''}
            onClick={() => tabsClick(2)}
          >
            修改密码
          </div>
        </div>
        <div>
          {activeIndex === 1 && userInfoForm()}
          {activeIndex === 2 && editPwdForm()}
        </div>

        {/* <div className='user_center_left_menu'>
					<div className='user_center_left_menu_title'>个人中心</div>
					<ul className='user_center_left_menu_list'>
						<li className={isUserInfo} onClick={() => goto('/usercenter/userInfo')}>
							个人中心
						</li>
						<li className={isResetPassword} onClick={() => goto('/usercenter/resetPassword')}>
							修改密码
						</li>
					</ul>
				</div>
				<div className='user_center_right_menu'>
					<Switch>
						<Route path='/usercenter/userInfo' component={UserInfo}></Route>
						<Route path='/usercenter/resetPassword' component={ResetPassword}></Route>
						<Redirect from='/usercenter' to='/usercenter/userInfo'></Redirect>
					</Switch>
				</div> */}
      </div>
    </Layout>
  )
}

export default UserCenter
