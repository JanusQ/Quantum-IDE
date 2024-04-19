import React from 'react'
import { Button, Form, Input, Checkbox, message, Select } from 'antd'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styles from './index.module.scss'
import { register, registerDiscuz } from '@/api/auth'
import { useTranslation } from 'react-i18next'

export default function Registerpage() {
  const { t, i18n } = useTranslation()

  const { Option } = Select
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const [singUpform] = Form.useForm()
  const navigate = useNavigate()
  // 注册
  const onSignUpFinish = async (value) => {
    // const params = {}
    // params.username = value.username
    // params.password = value.password
    // params.passwordConfirmation = value.password
    // params.nickname = value.username
    // const { data } = await registerDiscuz(params)
    const data = await register(value)

    if (data.status == 200) {
      message.success(data.msg)
      navigate('/signin')
    }
    // if (data.Code === 0) {
    //   const regdata = await register(value)
    //   message.success("注册成功")
    //   singUpform.resetFields()
    //   navigate("/signin")
    //   // history.push("/signin/1")
    // } else {
    //   message.error(data.Message)
    // }
  }

  return (
    <div className={styles.root}>
      <Form
        autoComplete="off"
        form={singUpform}
        onFinish={onSignUpFinish}
        size="large"
        validateTrigger="onBlur"
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: t('login.Username'),
            },
            {
              max: 15,
              message: t('login.username error'),
            },
          ]}
        >
          <Input placeholder={t('login.Username')} />
        </Form.Item>
        <Form.Item
          name="telephone"
          rules={[
            {
              required: true,
              message: t('login.Telephone'),
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: t('login.Telephone error'),
            },
          ]}
        >
          <Input placeholder={t('login.Telephone')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: t('login.Password'),
            },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message: t('login.Password format'),
            },
          ]}
        >
          <Input.Password placeholder={t('login.Password')} />
        </Form.Item>
        <Form.Item
          name="confirm"
          rules={[
            {
              required: true,
              message: t('login.Confirm your password'),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(t('login.Password different')))
              },
            }),
          ]}
        >
          <Input.Password placeholder={t('login.Confirm your password')} />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: t('login.Email'),
            },
            {
              type: 'email',
              message: t('login.Email error'),
            },
          ]}
        >
          <Input placeholder={t('login.Email')} />
        </Form.Item>
        <Form.Item
          name="company_name"
          rules={[
            {
              required: true,
              message: t('login.Institution'),
            },
          ]}
        >
          <Input placeholder={t('login.Institution')} />
        </Form.Item>
        <Form.Item
          name="company_type"
          rules={[
            {
              required: true,
              message: t('login.The type of your institution'),
            },
          ]}
        >
          <Select placeholder={t('login.The type of your institution')}>
            <Option value="0">
              {t('login.scientific research institutions')}{' '}
            </Option>
            <Option value="1">{t('login.university')}</Option>
            <Option value="2">{t('login.enterprise')}</Option>
            <Option value="3">{t('login.preson')}</Option>
            <Option value="4">{t('login.else')}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="company_address"
          rules={[
            {
              required: true,
              message: t('login.The address of your institution'),
            },
          ]}
        >
          <Input placeholder={t('login.The address of your institution')} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" style={{ width: '100%' }} type="primary">
            {t('login.Sign up')}
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
              <Link to="/signin">
                {t('login.Already have an account? Login here')}
              </Link>
            </span>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
