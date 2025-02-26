import React, { useEffect } from 'react'
import { Button, Form, Input, message, Select, Tooltip } from 'antd'
import Title from '@/components/componentTitle'
import { updateUserInfo, getUserInfo } from '@/api/auth'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Icon, { DownOutlined, CopyOutlined } from '@ant-design/icons'

export default function Useinfo() {
  const [form] = Form.useForm()
  const { Option } = Select
  const { userData } = useSelector((store) => store.userData)
  const getUserInfoFn = async () => {
    const params = {}
    params.user_id = userData.user_id
    const {
      data: { email, telephone, company_name, company_type, company_address },
    } = await getUserInfo(userData.user_id)
    form.setFieldsValue({
      email,
      telephone,
      company_name,
      company_type,
      company_address,
    })
  }
  const onFinish = async (value) => {
    await updateUserInfo(userData.user_id, value)
    message.success('已保存')
    getUserInfoFn()
  }
  useEffect(() => {
    getUserInfoFn()
  }, [])
  const copyText = () => {
    message.success('Copy success')
  }
  const userInfoForm = () => {
    return (
      <Form
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        autoComplete="off"
        className="usercenter_form"
        requiredMark={false}
        form={form}
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
  return (
    <div className={styles.root}>
      <div className="useContent">
        <Title name={'基本信息'} />

        <div className="useInfor">{userInfoForm()}</div>
        {userData.token && (
          <div
            style={{
              width: 600,
              wordWrap: 'break-word',
              textAlign: 'justify',
            }}
          >
            <span style={{ fontSize: 20 }}>API_KEY:</span>
            <div
              style={{
                border: '1px solid rgba(255, 255, 255, 0.44)',
                display: 'inline-block',
                width: 600,
                borderRadius: 5,
                padding: 10,
                userSelect: 'all',
                zIndex: 1000,
                color: '#000',
                opacity: 1,
                backgroundColor: '#fff',
              }}
            >
              {userData.token}
              <CopyToClipboard text={userData.token}>
                <Tooltip title="copy">
                  <CopyOutlined
                    onClick={copyText}
                    style={{
                      color: '#000',
                      cursor: 'pointer',
                      marginLeft: 5,
                    }}
                  />
                </Tooltip>
              </CopyToClipboard>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
