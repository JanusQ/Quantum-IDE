import React, { useState, useEffect } from 'react'
import { Card, Form, Button, Input, Checkbox, message } from 'antd'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styles from './index.module.scss'
import { loginThunk } from '@/store/user/slice'
import encypt from '@/utils/crypto'
import { useSelector } from 'react-redux'
import { getVertifyImg, VertifyImgCode } from '@/api/auth'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const { t, i18n } = useTranslation()

  const { userData } = useSelector((store) => store.userData)
  const [namePass] = Form.useForm()
  const [isRember, setIsRember] = useState(true)
  let localName = localStorage.getItem('keyName')
  let localPassword = localStorage.getItem('keyPass')
  const onCheckChange = (e) => {
    if (e.target.checked) {
      setIsRember(true)
    } else {
      setIsRember(false)
      localStorage.removeItem('keyPass')
    }
  }
  useEffect(() => {
    if (localPassword) {
      setIsRember(true)
      namePass.setFieldsValue({
        email: localName,
        password: localPassword,
      })
    }
  }, [])
  useEffect(() => {
    if (userData.username) {
      navigate(-1)
    }
  }, [userData])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loaction = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const onFinish = async (values) => {
    const { email, password } = values
    // 记住账号密码
    if (isRember) {
      localStorage.setItem('keyName', email)
      localStorage.setItem('keyPass', password)
    }
    const loginData = {
      email,
      password: encypt(password), // 密码加密
    }
    try {
      const data = dispatch(loginThunk(loginData))
    } catch (e) {}
  }
  // 获取登录前验证图片
  const [imagedata, setImageData] = useState('')
  const getImage = async () => {
    try {
      const data = await getVertifyImg()
      setImageData(data.data)
    } catch (error) {
      // console.log(error, 999)
      getImage()
    }
  }
  // 验证码
  const checkauth = async (rule, value) => {
    const data = await VertifyImgCode({
      code: value,
      uuid: imagedata.uuid,
    })
    switch (data.status) {
      case 200:
        return Promise.resolve()

      case 404:
        getImage()
        return Promise.reject(t('login.code error'))

      case 409:
        getImage()
        return Promise.reject(t('login.code error'))

      default:
    }
  }
  useEffect(() => {
    getImage()
  }, [])
  const onRegister = () => {
    navigate('/register')
  }
  return (
    <div className={styles.root}>
      <Card className="login-container">
        <Form
          form={namePass}
          initialValues={{
            remember: false,
          }}
          onFinish={onFinish}
          size="large"
          validateTrigger={['onChange', 'onBlur']}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t('login.Email') },
              { type: 'email', message: t('login.Email error') },
            ]}
          >
            <Input placeholder={t('login.Email')} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: t('login.Password') }]}
          >
            <Input.Password placeholder={t('login.Password')} />
          </Form.Item>
          <Form.Item
            validateTrigger="onBlur"
            name="code"
            rules={[{ validator: checkauth }]}
            label={t('login.code')}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <div onClick={getImage} className="valiadteImg">
            <img
              style={{ width: 300, height: 100, cursor: 'pointer' }}
              src={`data:image/jpeg;base64,${imagedata.img}`}
              alt=""
            />
            <span
              style={{
                fontSize: 16,
                display: 'displayIlilneBlokc',
              }}
            >
              {t('login.Change')}
            </span>
          </div>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox checked={isRember} onChange={onCheckChange}>
              Remember me
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              block
              className="login-submit"
              htmlType="submit"
              loading={isLoading}
              type="primary"
            >
              {t('login.Log in')}
            </Button>
          </Form.Item>
        </Form>
        <span className="register" onClick={onRegister}>
          {t('login.No account')}
        </span>
      </Card>
    </div>
  )
}
