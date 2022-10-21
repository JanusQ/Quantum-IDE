// import SignLayout from './SignLayout'
import Layout from './Layout'
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Checkbox, message, Select } from 'antd'
import { getCookie, isAuth, delCookie, setCookie } from '../../helpers/auth'
// import { Redirect } from 'react-router-dom'
import '../styles/SignIn.css'
import { Link, Redirect, useParams } from 'react-router-dom'
import {
  login,
  register,
  registerDiscuz,
  getVertifyImg,
  VertifyImgCode,
} from '../../api/auth'
import { useHistory } from 'react-router-dom'
import { setToken, removeToken } from '../../api/storage'
import encypt from '../../util/crypto'
const SignIn = () => {
  const { type } = useParams()
  const history = useHistory()
  const onFinish = async (value) => {
    const { email, password } = value
    // 密码加密
    const loginData = {
      email,
      password: encypt(password),
    }
    const { data } = await login(loginData)
    message.success('登录成功')
    if (isRember) {
      setCookie('email', value.email, 7)
      setCookie('password', value.password, 7)
    }
    setToken(data.token)
    localStorage.setItem('jwt', JSON.stringify(data))
    history.push('/')
  }
  const redirectToHome = () => {
    const auth = isAuth()
    if (auth) {
      return <Redirect to="/"></Redirect>
    }
  }
  // 记住密码
  const cookiePassword = getCookie('password')
  const cookieEmail = getCookie('email')
  const [form] = Form.useForm()
  const [isRember, setIsRember] = useState(false)
  const onCheckChange = (e) => {
    if (e.target.checked) {
      setIsRember(true)
    } else {
      setIsRember(false)
      delCookie('email')
      delCookie('password')
    }
  }
  // 获取登录前验证图片
  const [imagedata, setImageData] = useState('')
  const getImage = async () => {
    const res = await getVertifyImg()
    setImageData(res.data)
    // console.log(res, 'img')
  }
  useEffect(() => {
    getImage()
  }, [])
  // 验证码
  const checkauth = async (rule, value) => {
    const data = await VertifyImgCode({
      code: value,
      uuid: imagedata.uuid,
    })
    switch (data.status) {
      case 200:
        return Promise.resolve()
        break
      case 404:
        getImage()
        return Promise.reject('验证码错误,请重新输入')
        break
      case 409:
        getImage()
        return Promise.reject('验证码错误,请重新输入')

      default:
    }
  }

  const signinForm = () => {
    return (
      <div className="sign_in_form">
        <Form
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          form={form}
        >
          <Form.Item
            validateTrigger={'onBlur'}
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式错误' },
            ]}
          >
            <Input placeholder="请输入您的邮箱" />
          </Form.Item>
          <Form.Item
            validateTrigger={'onBlur'}
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入您的密码" />
          </Form.Item>

          <Form.Item
            validateTrigger="onBlur"
            autoComplete="off"
            name="code"
            rules={[{ validator: checkauth }]}
            label="验证码"
          >
            <Input />
          </Form.Item>
          <div className="valiadteImg">
            <img
              style={{ width: 300, height: 100 }}
              src={`data:image/jpeg;base64,${imagedata.img}`}
              alt=""
            />
            <span
              onClick={getImage}
              style={{ fontSize: 16, display: 'displayIlilneBlokc' }}
            >
              换一张
            </span>
          </div>

          <Form.Item style={{ marginBottom: '20px' }}>
            <div className="sign_in_form_operation">
              <Checkbox onChange={onCheckChange} checked={isRember}>
                记住密码
              </Checkbox>
              {/* <span style={{ float: 'right' }}>
								{' '}
								<Link to='/findPassword'>忘记密码？</Link>{' '}
							</span> */}
            </div>
          </Form.Item>
          <Form.Item style={{ marginBottom: '10px' }}>
            <Button htmlType="submit" style={{ width: '100%' }} type="primary">
              登录
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: '0px' }}>
            <p className="sign_in_to_signup" style={{ marginBottom: '0px' }}>
              <Link to="/signin/2">没有账号？立即注册</Link>
            </p>
          </Form.Item>
        </Form>
      </div>
    )
  }
  useEffect(() => {
    if (cookiePassword) {
      setIsRember(true)
      form.setFieldsValue({
        email: cookieEmail,
        password: cookiePassword,
      })
    }
  }, [])
  const [activeIndex, setActiveIndex] = useState(1)
  const tabsClick = (index) => {
    // setActiveIndex(index)
    history.push(`/signin/${index}`)
    singUpform.resetFields()
    form.resetFields()
  }
  useEffect(() => {
    setActiveIndex(Number(type))
  }, [type])
  const { Option } = Select
  const [singUpform] = Form.useForm()
  // 注册
  const onSignUpFinish = async (value) => {
    const params = {}
    params.username = value.username
    params.password = value.password
    params.passwordConfirmation = value.password
    params.nickname = value.username
    const { data } = await registerDiscuz(params)
    if (data.Code === 0) {
      const regdata = await register(value)
      message.success('注册成功')
      singUpform.resetFields()
      history.push('/signin/1')
    } else {
      message.error(data.Message)
    }
  }
  const testluntan = async () => {}
  const signupForm = () => {
    return (
      <div className="sign_in_form">
        <Form
          onFinish={onSignUpFinish}
          form={singUpform}
          autoComplete="off"
          validateTrigger={'onBlur'}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
              {
                max: 15,
                message: '用户名至多15个字符',
              },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="telephone"
            rules={[
              {
                required: true,
                message: '请输入手机号',
              },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="confirm"
            rules={[
              {
                required: true,
                message: '请确认密码',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认密码" />
          </Form.Item>
          <Form.Item
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
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="company_name"
            rules={[
              {
                required: true,
                message: '请输入单位名称',
              },
            ]}
          >
            <Input placeholder="请输入单位名称" />
          </Form.Item>
          <Form.Item
            name="company_type"
            rules={[{ required: true, message: '请选择单位类型' }]}
          >
            <Select placeholder="请选择单位类型">
              <Option value="0">科研院所</Option>
              <Option value="1">学校</Option>
              <Option value="2">企业</Option>
              <Option value="3">个人</Option>
              <Option value="4">其它</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="company_address"
            rules={[{ required: true, message: '请输入单位地址' }]}
          >
            <Input placeholder="请输入单位地址" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ width: '100%' }}>
              注册
            </Button>
          </Form.Item>
          <Form.Item>
            <div>
              <span
                className="signup_to_in"
                style={{
                  textAlign: 'center',
                  width: '100%',
                  display: 'inline-block',
                }}
              >
                <Link to="/signin/1">已经有账户了？点击登录</Link>
              </span>
            </div>
          </Form.Item>
        </Form>
      </div>
    )
  }
  return (
    <Layout isLogin={true}>
      {redirectToHome()}
      <div className="sign_in_div">
        <div className="sign_box_div">
          <div className="sign_tabs_div">
            <div
              className={activeIndex === 1 ? 'active' : ''}
              onClick={() => tabsClick(1)}
            >
              账户登入
            </div>
            <div
              className={activeIndex === 2 ? 'active' : ''}
              onClick={() => tabsClick(2)}
            >
              新用户注册
            </div>
          </div>
          <div>
            {activeIndex === 1 && signinForm()}
            {activeIndex === 2 && signupForm()}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SignIn
