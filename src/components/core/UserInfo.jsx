import React, { useEffect, useState } from 'react'
import '../styles/UserInfo.css'
import { Button, Form, Input, message, Select } from 'antd'
import { Link } from 'react-router-dom'
import { getUserInfo, updateUserInfo } from '../../api/auth'
import { isAuth, companyName } from '../../helpers/auth'
const UserInfo = () => {
  const auth = isAuth()
  const { Option } = Select
  const onFinish = async (value) => {
    if (!isEdit) {
      message.warn('暂未修改')
      return
    }
    value.user_id = auth.user_id
    await updateUserInfo(value)
    message.success('已保存')
    setIsEdit(false)
    getUserInfoFn()
  }
  const [userInfo, setUserInfo] = useState({})
  const getUserInfoFn = async () => {
    const params = {}
    params.user_id = auth.user_id
    const { data } = await getUserInfo(auth.user_id)
    setUserInfo(data)
  }
  const [isEdit, setIsEdit] = useState(false)
  const editUserInfo = () => {
    setIsEdit(!isEdit)
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
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        autoComplete="off"
        form={editForm}
      >
        {/* <Form.Item
					label='用户名称：'
					name='username'
					rules={[
						{
							required: true,
							message: '请输入用户名',
						},
					]}
				>
					
				</Form.Item> */}
        <Form.Item
          label="手机号码："
          style={{ display: isEdit ? 'none' : 'flex' }}
        >
          <span>{userInfo.telephone}</span>
        </Form.Item>
        <Form.Item
          label="手机号码："
          name="telephone"
          rules={[
            {
              required: true,
              message: '请输入手机号',
            },
          ]}
          style={{ display: isEdit ? 'flex' : 'none' }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="电子邮箱："
          style={{ display: isEdit ? 'none' : 'flex' }}
        >
          <span>{userInfo.email}</span>
        </Form.Item>
        <Form.Item
          label="电子邮箱："
          name="email"
          style={{ display: isEdit ? 'flex' : 'none' }}
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
          style={{ display: isEdit ? 'none' : 'flex' }}
        >
          <span>{userInfo.company_name}</span>
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
          style={{ display: isEdit ? 'flex' : 'none' }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="单位类型："
          style={{ display: isEdit ? 'none' : 'flex' }}
        >
          <span>{companyName(userInfo.company_type)}</span>
        </Form.Item>
        <Form.Item
          label="单位类型："
          name="company_type"
          rules={[{ required: true, message: '请选择单位类型' }]}
          style={{ display: isEdit ? 'flex' : 'none' }}
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
          style={{ display: isEdit ? 'none' : 'flex' }}
        >
          <span>{userInfo.company_address}</span>
        </Form.Item>
        <Form.Item
          label="单位地址："
          name="company_address"
          rules={[{ required: true, message: '请输入单位地址' }]}
          style={{ display: isEdit ? 'flex' : 'none' }}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
          <Button style={{ marginRight: '10px' }} onClick={editUserInfo}>
            {isEdit ? '取消' : '编辑'}
          </Button>
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
        <span className="user_info_name">基本信息</span>
      </div>
      <div className="user_info_content">{userInfoForm()}</div>
    </div>
  )
}

export default UserInfo
