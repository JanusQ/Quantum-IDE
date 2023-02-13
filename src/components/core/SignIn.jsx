// import SignLayout from './SignLayout'
import Layout from "./Layout"
import React, { useState, useEffect } from "react"
import { Button, Form, Input, Checkbox, message, Select } from "antd"
import { getCookie, isAuth, delCookie, setCookie } from "../../helpers/auth"
// import { Redirect } from 'react-router-dom'
import "../styles/SignIn.css"
import { Link, Redirect, useParams } from "react-router-dom"
import {
  login,
  register,
  registerDiscuz,
  getVertifyImg,
  VertifyImgCode,
} from "../../api/auth"
import { useHistory } from "react-router-dom"
import { setToken, removeToken } from "../../api/storage"
import encypt from "../../util/crypto"
import { useTranslation } from "react-i18next"
const SignIn = () => {
  const { t, i18n } = useTranslation()
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
    message.success(t("login.login successfully"))
    if (isRember) {
      setCookie("email", value.email, 7)
      setCookie("password", value.password, 7)
    }
    setToken(data.token)
    localStorage.setItem("jwt", JSON.stringify(data))
    history.push("/")
  }
  const redirectToHome = () => {
    const auth = isAuth()
    if (auth) {
      return <Redirect to="/"></Redirect>
    }
  }
  // 记住密码
  const cookiePassword = getCookie("password")
  const cookieEmail = getCookie("email")
  const [form] = Form.useForm()
  const [isRember, setIsRember] = useState(false)
  const onCheckChange = (e) => {
    if (e.target.checked) {
      setIsRember(true)
    } else {
      setIsRember(false)
      delCookie("email")
      delCookie("password")
    }
  }
  // 获取登录前验证图片
  const [imagedata, setImageData] = useState("")
  const getImage = async () => {
    try {
      const res = await getVertifyImg()
      setImageData(res.data)
    } catch (error) {
      console.log(error, 999)
    }
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
        return Promise.reject(t("login.code error"))
        break
      case 409:
        getImage()
        return Promise.reject(t("login.code error"))

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
            validateTrigger={"onBlur"}
            name="email"
            rules={[
              { required: true, message: t("login.Email") },
              { type: "email", message: t("login.Email error") },
            ]}
          >
            <Input placeholder={t("login.Email")} />
          </Form.Item>
          <Form.Item
            validateTrigger={"onBlur"}
            name="password"
            rules={[{ required: true, message: t("login.Password") }]}
          >
            <Input.Password placeholder={t("login.Password")} />
          </Form.Item>

          <Form.Item
            validateTrigger="onBlur"
            autoComplete="off"
            name="code"
            rules={[{ validator: checkauth }]}
            label={t("login.code")}
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
              style={{
                fontSize: 16,
                display: "displayIlilneBlokc",
                cursor: "default",
              }}
            >
              {t("login.Change")}
            </span>
          </div>

          <Form.Item style={{ marginBottom: "20px" }}>
            <div className="sign_in_form_operation">
              <Checkbox onChange={onCheckChange} checked={isRember}>
                {t("login.Remember me")}
              </Checkbox>
              {/* <span style={{ float: 'right' }}>
								{' '}
								<Link to='/findPassword'>忘记密码？</Link>{' '}
							</span> */}
            </div>
          </Form.Item>
          <Form.Item style={{ marginBottom: "10px" }}>
            <Button htmlType="submit" style={{ width: "100%" }} type="primary">
              {t("login.login")}
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <p className="sign_in_to_signup" style={{ marginBottom: "0px" }}>
              <Link to="/signin/2"> {t("login.No account")}</Link>
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
      message.success(t("login.registered successfully"))
      singUpform.resetFields()
      history.push("/signin/1")
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
          validateTrigger={"onBlur"}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: t("login.Username"),
              },
              {
                max: 15,
                message: t("login.username error"),
              },
            ]}
          >
            <Input placeholder={t("login.Username")} />
          </Form.Item>
          <Form.Item
            name="telephone"
            rules={[
              {
                required: true,
                message: t("login.Telephone"),
              },
              {
                pattern:
                  // /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
                  /^1[3-9]\d{9}$/,
                message: t("login.Telephone error"),
              },
            ]}
          >
            <Input placeholder={t("login.Telephone")} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: t("login.Password"),
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: t("login.Password format"),
              },
            ]}
          >
            <Input.Password placeholder={t("login.Password")} />
          </Form.Item>
          <Form.Item
            name="confirm"
            rules={[
              {
                required: true,
                message: t("login.Confirm your password"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error(t("login.Password different"))
                  )
                },
              }),
            ]}
          >
            <Input.Password placeholder={t("login.Confirm your password")} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: t("login.Email"),
              },
              {
                type: "email",
                message: t("login.Email error"),
              },
            ]}
          >
            <Input placeholder={t("login.Email")} />
          </Form.Item>
          <Form.Item
            name="company_name"
            rules={[
              {
                required: true,
                message: t("login.Institution"),
              },
            ]}
          >
            <Input placeholder={t("login.Institution")} />
          </Form.Item>
          <Form.Item
            name="company_type"
            rules={[
              {
                required: true,
                message: t("login.The type of your institution"),
              },
            ]}
          >
            <Select placeholder={t("login.The type of your institution")}>
              <Option value="0">
                {t("login.scientific research institutions")}
              </Option>
              <Option value="1">{t("login.university")}</Option>
              <Option value="2">{t("login.enterprise")}</Option>
              <Option value="3">{t("login.preson")}</Option>
              <Option value="4">{t("login.else")}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="company_address"
            rules={[
              {
                required: true,
                message: t("login.The address of your institution"),
              },
            ]}
          >
            <Input placeholder={t("login.The address of your institution")} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ width: "100%" }}>
              {t("login.Sign up")}
            </Button>
          </Form.Item>
          <Form.Item>
            <div>
              <span
                className="signup_to_in"
                style={{
                  textAlign: "center",
                  width: "100%",
                  display: "inline-block",
                }}
              >
                <Link to="/signin/1">
                  {t("login.Already have an account? Login here")}
                </Link>
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
              className={activeIndex === 1 ? "active" : ""}
              onClick={() => tabsClick(1)}
            >
              {t("login.Log in")}
            </div>
            <div
              className={activeIndex === 2 ? "active" : ""}
              onClick={() => tabsClick(2)}
            >
              {t("login.Sign up")}
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
