import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Layout from './Layout'
import '../styles/Home.css'
import { Button, Modal, Input, message } from 'antd'
import { Link, Router } from 'react-router-dom'
import { getNoticeList } from '../../api/notice'
import { createPro } from '../../api/test_circuit'
import { useHistory } from 'react-router-dom'
import { isAuth } from '../../helpers/auth'
import moment from 'moment'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y } from 'swiper'
import { useTranslation } from 'react-i18next'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
const Home = () => {
  // 中英切换
  const { t, i18n } = useTranslation()

  const history = useHistory()
  const state = useSelector((state) => state)
  const [noticeList, setNoticeList] = useState([])
  const getNoticeListFn = async () => {
    const { data } = await getNoticeList()
    setNoticeList(data.notice_list)
  }
  const lookDetail = (id) => {
    history.push(`/noticedetail/${id}`)
  }
  const noticeLi = noticeList.map((item) => (
    <li className="home_notice_list" key={item.notice_id}>
      <div className="home_notice_list_title">
        <span className="home_notice_list_circle"></span>
        <span className="home_notice_list_name">{item.notice_title}</span>
      </div>
      <div className="home_notice_list_content"></div>
      <div className="home_notice_list_footer">
        <span>{moment(item.update_time).format('YYYY-MM-DD')}</span>
        <span style={{ margin: '0 10px', display: 'inline-block' }}>|</span>
        <a onClick={() => lookDetail(item.notice_id)}>查看更多</a>
      </div>
    </li>
  ))

  useEffect(() => {
    getNoticeListFn()
  }, [])
  // 创建项目
  const [isSaveCaseModalVisible, setIsSaveCaseModalVisible] = useState(false)
  const auth = isAuth()
  const [caseName, setCaseName] = useState('')
  const gotoComputer = () => {
    if (!auth) {
      message.error('请先登录')
      history.push('/signin/1')
      return
    }
    setIsSaveCaseModalVisible(true)
  }
  const gotoRouter = (router) => {
    if (!auth) {
      message.error('请先登录')
      history.push('/signin/1')
      return
    }
    history.push(router)
  }
  const onSaveChange = (e) => {
    setCaseName(e.target.value)
  }
  const saveCaseModal = () => {
    return (
      <Modal
        visible={isSaveCaseModalVisible}
        onOk={isSaveOk}
        onCancel={isSaveCancel}
        title={t('Home.stored item')}
      >
        <p>{t('Home.project name')}</p>
        <Input value={caseName} onChange={onSaveChange}></Input>
      </Modal>
    )
  }

  const isSaveOk = async () => {
    if (!caseName) {
      message.error('请输入项目名称')
      return
    }
    const formdata = new FormData()
    formdata.append('user_id', auth.user_id)
    formdata.append('project_name', caseName)
    const { data } = await createPro(formdata)
    history.push({ pathname: `/aceComputer/${caseName}/${data.project_id}` })
    setIsSaveCaseModalVisible(false)
  }
  const isSaveCancel = () => {
    setIsSaveCaseModalVisible(false)
    setCaseName('')
  }
  const [bannerSwiper, setBannerSwiper] = useState(null)
  const homeBanner = () => {
    return (
      <div className="home_banner">
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, A11y]}
          loop={true}
          onSwiper={setBannerSwiper}
          navigation
          pagination={{ clickable: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <SwiperSlide>
            <div className="home_banner_item home_banner_item_1">
              <div className="home_banner_text">
                <div className="home_banner_title">{t('Home.title')}</div>
                <div className="home_banner_content">{t('Home.content')}</div>
                <div
                  className="home_banner_btn common_btn"
                  onClick={gotoComputer}
                >
                  {t('Home.start')}
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="home_banner_item home_banner_item_2">
              <div className="home_banner_text">
                <div className="home_banner_title">{t('Home.title')}</div>
                <div className="home_banner_content">{t('Home.content')}</div>
                <div
                  className="home_banner_btn common_btn"
                  onClick={gotoComputer}
                >
                  {t('Home.start')}
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    )
  }
  const [productionSwiper, setProductionSwiper] = useState(null)
  const productionMessage = () => {
    return (
      <div className="home_production_div">
        <div className="home_production_content">
          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, A11y]}
            loop={true}
            onSwiper={setProductionSwiper}
            navigation
            pagination={{ clickable: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <SwiperSlide>
              <div className="home_production_item">
                <div className="home_production_item">
                  <div className="home_production_pic home_production_pic_2"></div>
                  <div className="home_production_border"></div>
                  <div className="home_production_contet">
                    <div className="home_production_title">量子芯片</div>
                    <div className="home_production_title_2">QUANTUM CHIPS</div>
                    <div className="home_production_name">天目1号</div>
                    <div className="home_production_detail">
                      2021年12月17日，发布“莫干1号”“天目1号”超导量子芯片，宣告浙江量子科技迈向新发展阶段。
                      “莫干1号”是一款专用量子芯片，采用了全连通架构，适用于实现针对特定问题的量子模拟和量子态的精确调控。“天目1号”芯片则面向通用量子计算，采用较易扩展的近邻连通架构。
                    </div>
                    <div
                      className="home_banner_btn common_btn"
                      style={{ float: 'right' }}
                    >
                      <a href="https://hic.zju.edu.cn/2021/1220/c56173a2452801/page.htm">
                        点击详情
                      </a>{' '}
                    </div>{' '}
                  </div>
                  {/* <div className=''></div> */}
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    )
  }
  const thirdDiv = () => {
    return (
      <div className="home_third_div">
        <div className="home_third_div_content">
          <div className="home_third_div_border"></div>
          <div className="home_third_div_text">
            <div className="home_third_div_title">量子云</div>
            <div className="home_third_div_title_2">QUANTUM CLOUD</div>
            <div className="home_production_detail">
              支持在线构建算法、实时调用多台量子计算机
            </div>
            {/* <div className='home_third_div_name'>量子云计算资源</div>
						<div className='home_third_div_name_2'>多比特超导量子计算机</div> */}
            {/* <div className='home_third_div_btn_g'>
							<div className='common_btn'>BUTTON1</div>
							<div className='common_btn'>BUTTON2</div>
						</div> */}
          </div>
          <div className="home_third_router">
            <div
              className="home_third_router_item home_third_router_item_1"
              onClick={gotoComputer}
            >
              <div className="home_third_router_icon"></div>
              <div className="home_third_content">
                <div className="home_third_name">
                  启动<span style={{ fontSize: '24px' }}>IDE</span>
                </div>
                <div className="home_third_border"></div>
                <div className="home_third_detail">
                  启动量子IDE,
                  <br />
                  编写程序并提交任务
                </div>
              </div>
              <div className="home_third_trow_icon"></div>
            </div>
            <div
              className="home_third_router_item home_third_router_item_2"
              onClick={() => gotoRouter('/project')}
            >
              <div className="home_third_router_icon"></div>
              <div className="home_third_content">
                <div className="home_third_name">项目状态</div>
                <div className="home_third_border"></div>
                <div className="home_third_detail">
                  编辑与查看项目状态,
                  <br />
                  并获取已提交任务的
                  <br />
                  运行结果
                </div>
              </div>
              <div className="home_third_trow_icon"></div>
            </div>
            <div
              className="home_third_router_item home_third_router_item_3"
              onClick={() => gotoRouter('/computer')}
            >
              <div className="home_third_router_icon"></div>
              <div className="home_third_content">
                <div className="home_third_name">服务资源</div>
                <div className="home_third_border"></div>
                <div className="home_third_detail">
                  查看当前量子计算机
                  <br />
                  的服务状态与详细信息
                </div>
              </div>
              <div className="home_third_trow_icon"></div>
            </div>
            <div
              className="home_third_router_item home_third_router_item_4"
              onClick={() => gotoRouter('/referenceDoc/all')}
            >
              <div className="home_third_router_icon"></div>
              <div className="home_third_content">
                <div className="home_third_name">教程与文档</div>
                <div className="home_third_border"></div>
                <div className="home_third_detail">
                  查看介绍、教程
                  <br />
                  与API文档等信息
                </div>
              </div>
              <div className="home_third_trow_icon"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const [fourthSwiper, setFourthSwiper] = useState(null)
  const fourthDiv = () => {
    return (
      <div className="home_fourth_div">
        <div className="home_fourth_content">
          <div className="home_fourth_title">成果展示</div>
          <div className="home_fourth_second_title">
            <span>2021～2022年的部分论文展示</span>
          </div>
          <div className="home_fourth_switch">
            <Swiper
              // install Swiper modules
              modules={[Navigation, Pagination, A11y]}
              loop={true}
              onSwiper={setFourthSwiper}
              slidesPerView={3}
              spaceBetween={30}
              centeredSlides={true}
              navigation
              pagination={{ clickable: true }}
              style={{ width: '100%', height: '100%' }}
            >
              <SwiperSlide>
                <div className="home_meng_ban"></div>
                <a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511">
                  <img
                    src={require('../../images/banner_3.png')}
                    style={{ width: '316px', height: '240px' }}
                  />
                </a>
                <div className="home_swiper_title">
                  <a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511">
                    10-Qubit Entanglement and Parallel Logic Operations with a
                    Superconducting Circuit
                  </a>
                </div>
                {/* <div className='common_btn'><a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511">BUTTON</a></div> */}
              </SwiperSlide>
              <SwiperSlide>
                <div className="home_meng_ban"></div>
                <a href="https://www.science.org/doi/10.1126/science.aay0600">
                  <img
                    src={require('../../images/banner_4.png')}
                    style={{ width: '316px', height: '240px' }}
                  />
                </a>
                <div className="home_swiper_title">
                  <a href="https://www.science.org/doi/10.1126/science.aay0600">
                    {' '}
                    Observation of multi-component atomic Schr ̈odinger cat
                    states of up to 20 qubits{' '}
                  </a>
                </div>
                {/* <div className='common_btn'><a href=" https://www.science.org/doi/10.1126/science.aay0600">BUTTON</a></div> */}
              </SwiperSlide>
              <SwiperSlide>
                <div className="home_meng_ban"></div>
                <a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.127.240502">
                  <img
                    src={require('../../images/banner_5.png')}
                    style={{ width: '316px', height: '240px' }}
                  />
                </a>
                <div className="home_swiper_title">
                  <a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.127.240502">
                    {' '}
                    Stark Many-Body Localization on a Superconducting Quantum
                    Processor
                  </a>
                </div>
                {/* <div className='common_btn'><a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.127.240502">BUTTON</a></div> */}
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    )
  }
  return (
    <Layout isHome={true}>
      <div className="home_div">
        {homeBanner()}
        {productionMessage()}
        {thirdDiv()}
        {fourthDiv()}
        {saveCaseModal()}
        {/* <div className='home_left_div'>
					<div className='home_title'>Welcome</div>
					<div className='home_banner'>
						<Button type='primary' className='home_banner_btn' onClick={gotoComputer}>
							Launch Quantum IDE
						</Button>
					</div>
				</div>

				<div className='home_notice'>
					<div className='home_notice_head'>
						<span className='home_notice_title'>通知</span>
						<span style={{ float: 'right' }}>
							<Link to='/notice'>查看全部</Link>
						</span>
					</div>
					<ul className='home_notice_list_ul'>{noticeLi}</ul>
				</div>
				 */}
      </div>
    </Layout>
  )
}
export default Home
