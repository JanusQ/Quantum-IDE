import React, { useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import styles from "./index.module.scss"
import "swiper/scss"
import "swiper/scss/pagination"
import "swiper/scss/navigation"
import { Autoplay, Pagination, Navigation } from "swiper"
import { useTranslation } from "react-i18next"
import tianMuImage from "@/assets/image/banner_6.jpg"
import banner3 from "@/assets/image/banner_3.png"
import banner4 from "@/assets/image/banner_4.png"
import banner5 from "@/assets/image/banner_5.png"
import achievement from "@/assets/image/achievement.png"
import { useNavigate } from "react-router-dom"
import { Modal, Input, message, Button, Tooltip } from "antd"
import Icon, { DownOutlined, CopyOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux"
import { createPro } from "@/api/test_circuit"
import { v4 as uuidv4 } from "uuid"
import { CopyToClipboard } from "react-copy-to-clipboard"

export default function Introduce() {
  const { TextArea } = Input
  // 中英切换
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { userData } = useSelector((store) => store.userData)
  const apikeyref = useRef()
  const copyText = () => {
    message.success("Copy success")
  }
  // 创建项目
  const [isSaveCaseModalVisible, setIsSaveCaseModalVisible] = useState(false)
  const [projectName, setProjectName] = useState("")
  const gotoComputer = () => {
    // const startDate = new Date('2024-04-16')
    // const endDate = new Date('2024-04-29')

    // // 创建要检查的日期对象
    // const checkDate = new Date() // 默认为当前日期，你也可以指定一个特定日期

    // // 判断日期是否在范围内
    // if (checkDate >= startDate && checkDate <= endDate) {
    //   // setIsSaveCaseModalVisible(true)
    //   // navigate('/aceComputer')
    //   isSaveOk()
    // } else {
    //   if (!userData.token) {
    //     message.error('请先登录')
    //     navigate('/signin')
    //     return
    //   }
    // }
    navigate("/examples")

    // if (userData.token) {
    //   isSaveOk()
    // } else {
    //   navigate('/examples')
    // }
    // setIsSaveCaseModalVisible(true)
  }
  const onSaveChange = (e) => {
    setProjectName(e.target.value)
  }
  const isSaveOk = async () => {
    // if (!projectName) {
    //   message.error('请输入项目名称')
    //   return
    // }
    const formdata = new FormData()
    formdata.append("user_id", userData.user_id)

    formdata.append("project_name", `test${uuidv4()}`)
    const { data } = await createPro(formdata)
    if (data.msg === "成功") {
      message.success("创建成功")
      navigate("/aceComputer", {
        state: { projectName: projectName, projectId: data.project_id },
      })
    }
    // console.log(data, 66)

    setIsSaveCaseModalVisible(false)
  }
  const isSaveCancel = () => {
    setIsSaveCaseModalVisible(false)
    setProjectName("")
  }

  return (
    <div className={styles.root}>
      <Modal
        okText={t("isok.confirm")}
        cancelText={t("isok.cancel")}
        open={isSaveCaseModalVisible}
        onOk={isSaveOk}
        onCancel={isSaveCancel}
        title={t("Home.stored item")}
      >
        <p>{t("Home.project name")}</p>
        <Input value={projectName} onChange={onSaveChange}></Input>
      </Modal>
      <div className="introduce">
        <div className="start">
          <Swiper
            // loop={true}
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: true,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper swiper-v"
            style={{ width: "100%", height: "100%" }}
          >
            <SwiperSlide>
              <div className="SwiperSlide">
                <div className="banner">
                  <h2 className="title">{t("Home.title")}</h2>
                  <div className="content">{t("Home.content")}</div>

                  {userData.token && (
                    <div
                      style={{
                        width: 360,
                        wordWrap: "break-word",
                        textAlign: "justify",
                      }}
                    >
                      <span style={{ fontSize: 20 }}>API_KEY:</span>
                      <div
                        style={{
                          border: "1px solid rgba(255, 255, 255, 0.44)",
                          display: "inline-block",
                          width: 360,
                          borderRadius: 5,
                          padding: 10,
                          marginTop: 10,
                          userSelect: "all",
                          zIndex: 1000,
                          color: "#000",
                          opacity: 1,
                          backgroundColor: "#fff",
                        }}
                      >
                        {userData.token}
                        <CopyToClipboard text={userData.token}>
                          <Tooltip title="copy">
                            <CopyOutlined
                              onClick={copyText}
                              style={{
                                color: "#000",
                                cursor: "pointer",
                                marginLeft: 5,
                              }}
                            />
                          </Tooltip>
                        </CopyToClipboard>
                      </div>
                    </div>
                  )}
                  <div onClick={gotoComputer} className="btn">
                    {t("Home.start")}
                  </div>
                  <span className="line" key="line" />
                </div>
              </div>
            </SwiperSlide>
            {/* <SwiperSlide>
              <div className="SwiperSlide">
                <div className="banner">
                  <div className="title">{t("Home.title")}</div>
                  <div className="content">{t("Home.content")}</div>
                  <div onClick={gotoComputer} className="btn">
                    <span> {t("Home.start")}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide> */}
          </Swiper>
          <Icon component={DownOutlined} className="down" />
        </div>
        <div className="chips">
          <div className="swiperAre">
            <Swiper
              loop={true}
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: true,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className="mySwiper swiper-v"
              style={{ width: "100%", height: "100%" }}
            >
              <SwiperSlide>
                <div className="SwiperSlide">
                  <div className="img">
                    <img src={tianMuImage} alt="" />
                  </div>
                  <div className="line"></div>
                  <div className="introduce">
                    <div className="title">
                      {" "}
                      {t("quantumchips.quantumchips")}
                    </div>
                    {/* <div className="titleEn">QUANTUM CHIPS</div> */}
                    <div className="chipsName"> {t("quantumchips.name")}</div>
                    <div className="detail">{t("quantumchips.content")}</div>
                    <div className="detailBtn">
                      <a
                        target="_blank"
                        href="https://hic.zju.edu.cn/2021/1220/c56173a2452801/page.htm"
                        rel="noreferrer"
                      >
                        {t("quantumchips.details")}
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="SwiperSlide">
                  <div className="img">
                    <img src={tianMuImage} alt="" />
                  </div>
                  <div className="line"></div>
                  <div className="introduce">
                    <div className="title">
                      {" "}
                      {t("quantumchips.quantumchips")}
                    </div>
                    <div className="titleEn">QUANTUM CHIPS</div>
                    <div className="chipsName"> {t("quantumchips.name")}</div>
                    <div className="detail">{t("quantumchips.content")}</div>
                    <div className="detailBtn">
                      <a
                        target="_blank"
                        href="https://hic.zju.edu.cn/2021/1220/c56173a2452801/page.htm"
                        rel="noreferrer"
                      >
                        {t("quantumchips.details")}
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div className="cloud">
          {/* <div className="cloundMain">

          </div> */}
          <div className="cloudContent">
            <div className="main">
              <div className="line"></div>
              <div className="clondIntroduce">
                <div className="cloudTitle">
                  {" "}
                  {t("quantumchips.quantumcloud")}
                </div>
                {/* <div className="cloudTitleEn">QUANTUM CLOUD</div> */}
                <div className="cloundDetail">{t("middle.support")}</div>
              </div>
              <div className="useCloud">
                <div onClick={gotoComputer} className="router router1">
                  <div className="icon1 icon"></div>
                  <div className="useCloundContent">
                    <div className="startIde"> {t("middle.Start")}</div>
                    <div className="routerline"></div>
                    <div className="CloudDetail">
                      {t("middle.Start quantum IDE")}
                      <br />
                      {/* 编写程序并提交任务 */}
                    </div>
                    <div className="throIcon"></div>
                  </div>
                </div>
                <div
                  onClick={() => navigate("/projects")}
                  className="router router2"
                >
                  <div className="icon2 icon"></div>
                  <div className="useCloundContent">
                    <div className="startIde">
                      {" "}
                      {t("middle.Project Status")}
                    </div>
                    <div className="routerline"></div>
                    <div className="CloudDetail">
                      {t("middle.Edit and view the project status")}
                      <br />
                      {/* 并获取已提交任务的 */}
                      <br />
                      {/* 运行结果 */}
                    </div>
                    <div className="throIcon"></div>
                  </div>
                </div>
                <div
                  onClick={() => navigate("/computers")}
                  className="router router3"
                >
                  <div className="icon3 icon"></div>
                  <div className="useCloundContent">
                    <div className="startIde">{t("middle.Recourses")}</div>
                    <div className="routerline"></div>
                    <div className="CloudDetail">
                      {t("middle.View the status and details")} <br />
                      {/* 的服务状态与详细信息 */}
                    </div>
                    <div className="throIcon"></div>
                  </div>
                </div>
                <div
                  onClick={() => navigate("/documents")}
                  className="router router4"
                >
                  <div className="icon4 icon"></div>
                  <div className="useCloundContent">
                    <div className="startIde">
                      {t("middle.Tutorials and Documentation")}
                    </div>
                    <div className="routerline"></div>
                    <div className="CloudDetail">
                      {t("middle.View the introduction")}
                      <br />
                      {/* 与API文档等信息 */}
                    </div>
                    <div className="throIcon"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="achievement">
          <div className="achievementContent">
            <div className="achievementTitle">
              {t("middle.Achievement exhibition")}
            </div>
            <div className="achievementTime">
              2021～2022 {t("middle.Partial paper presentation")}
            </div>
            <div className="achievementSwiper">
              <Swiper
                slidesPerView={3}
                spaceBetween={30}
                // slidesPerGroup={3}
                loop={true}
                loopFillGroupWithBlank={true}
                pagination={{
                  clickable: true,
                }}
                centeredSlides={true}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <div className="shade"></div>
                  <a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511">
                    <img
                      style={{ width: "316px", height: "240px" }}
                      src={banner3}
                      alt=""
                    />
                  </a>
                  <div className="swiperTitle">
                    <a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511">
                      10-Qubit Entanglement and Parallel Logic Operations with a
                      Superconducting Circuit
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="shade"></div>
                  <a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511">
                    <img
                      style={{ width: "316px", height: "240px" }}
                      src={banner4}
                      alt=""
                    />
                  </a>
                  <div className="swiperTitle">
                    <a href="https://www.science.org/doi/10.1126/science.aay0600">
                      Observation of multi-component atomic Schr ̈odinger cat
                      states of up to 20 qubits{" "}
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="shade"> </div>

                  <a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511">
                    <img
                      style={{ width: "316px", height: "240px" }}
                      src={banner5}
                      alt=""
                    />
                  </a>
                  <div className="swiperTitle">
                    <a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.127.240502">
                      Stark Many-Body Localization on a Superconducting Quantum
                      Processor
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="shade"> </div>

                  <a href="https://micro2023.hotcrp.com/paper/411">
                    <img
                      style={{ width: "316px", height: "240px" }}
                      src={achievement}
                      alt=""
                    />
                  </a>
                  <div className="swiperTitle">
                    <a href=" https://micro2023.hotcrp.com/paper/411">
                      QuCT: A Framework for Analyzing Quantum Circuit by
                      Extracting Contextual and Topological Features
                    </a>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
