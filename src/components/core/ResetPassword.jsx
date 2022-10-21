import React, { useState } from 'react'
import '../styles/UserInfo.css'
import { Button, Form, Input, message, Result, Select } from 'antd'
import { Link } from 'react-router-dom'
import { updateUserPassword } from '../../api/auth'
import { isAuth } from '../../helpers/auth'
const ResetPassword = () => {
  const auth = isAuth()
  const { Option } = Select
  const onFinish = async (value) => {
    // console.log(value)
    const { confirm, ...rest } = value
    rest.user_id = auth.user_id
    await updateUserPassword(rest)
    message.success('修改成功')
    editForm.resetFields()
  }
  const [editForm] = Form.useForm()
  const userInfoForm = () => {
    return (
      <Form
        onFinish={onFinish}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        autoComplete="off"
        form={editForm}
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

        <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
          <Button htmlType="submit" type="primary">
            保存
          </Button>
        </Form.Item>
      </Form>
    )
  }
  return (
    <div className="user_info_div">
      <div className="user_info_title">
        <span className="user_info_name">修改密码</span>
      </div>
      <div className="user_info_content">{userInfoForm()}</div>
    </div>
  )
}

export default ResetPassword
