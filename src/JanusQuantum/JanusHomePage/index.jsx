import React, { useEffect, useState, useRef } from "react"
import { Space, Table, Tag, Col, Row, Affix } from "antd"
import styles from "./index.module.scss"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper"
import "swiper/scss"
import "swiper/scss/pagination"
import "swiper/scss/navigation"
import janus from "@/assets/image/janusSwiper/janus.png"
import jianweiyin from "@/assets/image/janusSwiper/jianweiyin.png"
import liqianglu from "@/assets/image/janusSwiper/liqianglu.png"
import tansiwei from "@/assets/image/janusSwiper/tansiwei.png"
import wuweitian from "@/assets/image/janusSwiper/wuweitian.png"
import paper from "@/assets/image/janusSwiper/paper.png"
import Lightning from "@/assets/image/janusSwiper/Lightning.png"
import schude from "@/assets/image/janusSwiper/schude.png"
import { LinkOutlined } from "@ant-design/icons"
export default function JanusHomePage() {
  const articleContent = useRef()
  const Overview = useRef()
  const Schedule = useRef()
  const Organizer = useRef()
  const Speakers = useRef()
  const JanusQCloud = useRef()
  const RealtedPapers = useRef()
  const gitRpepos = useRef()
  const [windowHeight, setWindowHeight] = useState(0)
  const [showArticContentNav, setshowArticContentNav] = useState(false)
  // const articleNav = [
  //   "Overview",
  //   "Schedule",
  //   "RealtedPapers",
  //   "OrganizersAndPresenters",
  //   "JanusQCloud",
  //   "gitRpepos",
  // ]
  const articleNav = [
    {
      id: "Overview",
      name: "Abstract",
    },
    {
      id: "Schedule",
      name: "Schedule",
    },
    {
      id: "RealtedPapers",
      name: "Papers",
    },
    {
      id: "OrganizersAndPresenters",
      name: "Organizers",
    },
    {
      id: "JanusQCloud",
      name: "JanusQ Cloud",
    },
    {
      id: "gitRpepos",
      name: "Repository",
    },
  ]
  const [navAcitve, setnavAcitve] = useState("Overview")
  const toClickContent = (content) => {
    console.log(content, "content")
    switch (content) {
      case "Overview":
        document.documentElement.scrollTop = Overview.current.offsetTop
        setnavAcitve("Overview")
        break
      case "Schedule":
        document.documentElement.scrollTop = Schedule.current.offsetTop
        setnavAcitve("Schedule")

        break
      case "OrganizersAndPresenters":
        document.documentElement.scrollTop = Organizer.current.offsetTop
        setnavAcitve("OrganizersAndPresenters")

        break
      case "Speakers":
        document.documentElement.scrollTop = Speakers.current.offsetTop
        setnavAcitve("Speakers")

        break
      case "JanusQCloud":
        document.documentElement.scrollTop = JanusQCloud.current.offsetTop
        setnavAcitve("JanusQCloud")

        break
      case "RealtedPapers":
        document.documentElement.scrollTop = RealtedPapers.current.offsetTop
        setnavAcitve("RealtedPapers")

        break
      case "gitRpepos":
        document.documentElement.scrollTop = gitRpepos.current.offsetTop
        setnavAcitve("gitRpepos")

        break

      default:
        break
    }
  }
  useEffect(() => {
    setWindowHeight(document.body.clientHeight)
    window.addEventListener("scroll", articleContentOnScroll)
    return () => {
      window.addEventListener("scroll", articleContentOnScroll)
    }
  }, [])
  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", articleContentOnScroll)
    }
  }, [])

  const articleContentOnScroll = () => {
    let scrollTop =
      window.scrollY ||
      document?.documentElement?.scrollTop ||
      document.body.scrollTop
    const offsetTop = articleContent?.current?.offsetTop
    const articleContenttop = offsetTop - scrollTop
    if (articleContenttop < 220) {
      setshowArticContentNav(true)
    } else {
      // setshowArticContentNav(false)
    }

    if (scrollTop > Overview.current.offsetTop - 300) {
      setnavAcitve("Overview")
    }

    if (scrollTop > Schedule.current.offsetTop - 300) {
      setnavAcitve("Schedule")
    }
    if (scrollTop > RealtedPapers.current.offsetTop - 300) {
      setnavAcitve("RealtedPapers")
    }
    if (scrollTop > Organizer.current.offsetTop - 300) {
      setnavAcitve("OrganizersAndPresenters")
    }

    if (scrollTop > JanusQCloud.current.offsetTop - 350) {
      setnavAcitve("JanusQCloud")
    }

    if (scrollTop > gitRpepos.current.offsetTop - 400) {
      setnavAcitve("gitRpepos")
    }
  }
  const dataSource = [
    {
      key: "1",
      time: "5:00 PM EEST - 5:10 PM EEST(10:00 PM CST - 10:10 PM CST)",
      Agenda: "Keynote of Janus",
      Presenter: "Jiangwei Yin",
      Resources: "[Slides]",
    },
    {
      key: "2",
      time: "5:10 PM EEST - 5:50 PM EEST(10:10 PM CST - 10:50 PM CST",
      Agenda: "JanusQ: cloud platform",
      Presenter: "Siwei Tan",
      Resources: "[Slides]",
    },
    {
      key: "3",
      time: "5:50 PM EEST - 6:30 PM EEST(10:50 PM CST - 11:30 PM CST)",
      Agenda: "Janus-SAT: application deployment",
      Presenter: "Siwei Tan",
      Resources: "[Slides]",
    },
    {
      key: "4",
      time: "6:30 PM EEST - 6:40 PM EEST(11:30 PM CST - 11:40 PM CST)",
      Agenda: "Break",
    },
    {
      key: "5",
      time: "6:40 PM EEST - 7:20 PM EEST(11:40 PM CST - 0:20 AM CST)",
      Agenda: "Janus-CT: circuit-level compilation",
      Presenter: "Liqiang Lu",
      Resources: "[Slides]",
    },
    {
      key: "6",
      time: "7:20 PM EEST - 8:00 PM EEST(00:20 AM CST - 1:00 AM CST)",
      Agenda: "Janus-PulseLib",
      Presenter: "Wuwei Tian",
      Resources: "[Slides]",
    },
  ]
  const columns = [
    {
      title: "Time (2021 Oct 18)",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Agenda",
      dataIndex: "Agenda",
      key: "Agenda",
    },
    {
      title: "Presenter",
      dataIndex: "Presenter",
      key: "Presenter",
    },
    {
      title: "Resources",
      dataIndex: "Resources",
      key: "Resources",
    },
  ]

  const columns1 = [
    {
      title: "Topic-1. Introduction of Janus quantum cloud platform ",
      dataIndex: "Topic",
      key: "Topic",
    },
    {
      title: "0.25 hour",
      dataIndex: "hour",
      key: "hour",
    },
  ]
  const dataSource1 = [
    {
      key: "1",
      Topic: "Topic-2. Janus-CT Details",
      hour: "(2 hour)",
    },
    {
      key: "2",
      Topic: "\xa0  \xa0 \xa0 \xa0(a) Vectorization model and code examples",
      hour: "0.5 hour",
      indentSize: 20,
    },
    {
      key: "3",
      Topic:
        " \xa0  \xa0 \xa0 \xa0(b) Fidelity optimization using gate vectors",
      hour: "0.5 hour",
    },
    {
      key: "4",
      Topic: "\xa0  \xa0 \xa0 \xa0(c) Unitary decomposition using gate vectors",
      hour: "0.5 hour",
    },
    {
      key: "5",
      Topic:
        " \xa0  \xa0 \xa0 \xa0(d) Extending the framework yourself: other downstream tasks!",
      hour: "0.5 hour",
    },
    {
      key: "6",
      Topic: "Topic-3. Implementing quantum applications",
      hour: "(1.25 hour)",
    },
    {
      key: "7",
      Topic:
        "\xa0  \xa0 \xa0 \xa0(a) Introduction of SAT problem and time crystal",
      hour: "0.25 hour",
    },
    {
      key: "8",
      Topic:
        "\xa0  \xa0 \xa0 \xa0(b) Compilation optimizations for solving SAT problems",
      hour: "0.5 hour",
    },
    {
      key: "9",
      Topic:
        "\xa0  \xa0 \xa0 \xa0(c) Simulate time crystal on Janus quantum platform",
      hour: "0.5 hour",
    },
    {
      key: "10",
      Topic: "Topic-4. Q & A",
      hour: "0.5 hour",
    },
    {
      key: "11",
      Topic: "Total",
      hour: "4 hours(half day)",
    },
  ]
  const columns2 = [
    {
      width: 180,
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      width: 230,
      title: "Affiliation",
      dataIndex: "Affiliation",
      key: "Affiliation",
    },
    {
      title: "Short",
      dataIndex: "Short",
      key: "Short",
    },
  ]
  const dataSource2 = [
    {
      key: "1",
      Name: "Jianwei Yin\xa0 \xa0(Topic-1)",
      Affiliation: "Full professor, Zhejiang University",
      Short:
        "Jianwei Yin’s current research interests include quantum computing, service computing and business process management. Jianwei Yin has published more than 100 papers in top conferences and journals. He is also the Associate Editor of the IEEE Transactions on Services Computing.",
    },
    {
      key: "2",
      Name: "Liqiang Lu\xa0 \xa0(Topic-2)",
      Affiliation: "Assistant professor, Zhejiang University",
      Short:
        "Liqiang Lu’s current research interests include quantum computing and computer architectures. He has authored more than 20 scientific publications in related domains, including ISCA, MICRO, HPCA.",
    },
    {
      key: "3",
      Name: "Siwei Tan\xa0 \xa0(Topic-2 & 3)",
      Affiliation: "5th year PhD student, Zhejiang University",
      Short:
        "Siwei Tan’s research interests include the quantum algorithm and computer architecture.",
    },
    {
      key: "4",
      Name: "Xu Zhang\xa0 \xa0(Topic-3)",
      Affiliation: "5th year PhD student, Zhejiang University",
      Short:
        "Xu Zhang’s research interests include the superconducting quantum computing and quantum simulation.",
    },
  ]
  return (
    <div className={styles.root}>
      <div className="home_content">
        <div className="home_conten_item_1">
          <div className="entry_header">
            <div className="header_title">
              <span>
                Janus 2.0: A Software Framework for Analyzing Optimizing and
                Implementing Quantum Circuit
              </span>
            </div>

            {/* <h1 style={{ fontSize: "2.6rem" }}>Implementing Quantum Circuit</h1> */}
          </div>
          <div className="entry_image">
            <img src={janus} alt=""></img>
          </div>
        </div>
        <div className="home_conten_item_2">
          <div className="article_nav">
            <Affix offsetTop={0}>
              <div className="article_nav_content">
                {articleNav.map((item, index) => (
                  <div className="articleNav" key={index}>
                    <span
                      onClick={() => toClickContent(item.id)}
                      className={
                        navAcitve === item.id
                          ? "articleNav_active articleNav_item"
                          : "articleNav_item"
                      }
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </Affix>
          </div>
          <div
            className="article_content"
            onScroll={articleContentOnScroll}
            ref={articleContent}
          >
            <div className="article_overView">
              <div className="article_overView_titel">
                <h1
                  style={{
                    textAlign: "left",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                  ref={Overview}
                >
                  Abstract
                </h1>
              </div>
              <div className="articcle_overView_content">
                The paradigm of quantum computing exhibits a high potential to
                outperform classical computing in solving complex problems,
                e.g., cryptology, combinatorial optimization, and network
                analysis. However, achieving end-to-end speedup on the
                real-world quantum device is difficult as it involves a high
                degree of noise, high compilation overhead, and high cost of
                managing the quantum device. cost of managing the quantum
                device. In this tutorial, we present Janus 2.0, an open-source
                framework for analyzing and optimizing quantum circuit. This
                tutorial begins with a brief introduction of JanusQ cloud
                platform, which is equipped with several superconducting quantum
                chips, developed by Zhejiang University (Science 2019). Then, we
                present the tutorial of Janus 2.0 toolkit, from application
                -level to hardware-level. First, we introduce Janus-SAT, an
                application-software codesign technique for accelerating the
                solving of Boolean satisfiability (SAT) problems (HPCA 2023). We
                will provide the code and demo to demonstrate the speedup of
                Janus-SAT. Second, we introduce Janus-CT, a unified compilation
                framework that decouples analysis tasks into an upstream
                vectorization model and downstream models (MICRO 2023). In this
                tutorial, we provide the code and demo of two representative
                downstream tasks, including fidelity optimization and unitary
                decomposition. We will demonstrate that Janus-CT can enable
                various software-level optimization with high scalability.
                Finally, we introduce Janus-PulseLib, a hardware-level
                optimization for accelerating pulse generation (ICCAD 2023).
              </div>
            </div>
            <div className="article_Scheule">
              <div className="shedule_title">
                It is the first time to hold this tutorial!
              </div>
              <div className="article_Scheule_titel">
                <h1
                  style={{
                    textAlign: "left",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                  ref={Schedule}
                >
                  Schedule
                </h1>
              </div>
              <div className="articcle_Scheule_content">
                <Table
                  styles={{ fontSize: "1.8rem" }}
                  pagination={false}
                  dataSource={dataSource1}
                  columns={columns1}
                ></Table>
              </div>
              {/* <div className="Scheule_table">
                <Table
                  pagination={false}
                  dataSource={dataSource}
                  columns={columns}
                />
              </div> */}
            </div>

            <div className="realted_papers" ref={RealtedPapers}>
              <div className="realted_papers_title">
                <h1
                  style={{
                    textAlign: "left",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  Related papers:
                </h1>
              </div>

              <div className="realted_papers_content">
                <div className="paper_title">
                  (HPCA 2023) HyQSAT: A Hybrid Approach for 3-SAT Problems by
                  Integrating Quantum Annealer with CDCL
                </div>
                <div className="paper_team">
                  Siwei Tan, Mingqian Yu, Andre Python, Yongheng Shang, Tingting
                  Li, Liqiang Lu, Jianwei Yin (Zhejiang University)
                </div>
                <div className="link">
                  <div className="link_boder">
                    <img className="paper_icon" src={paper} alt=""></img>
                    Paper
                  </div>
                  <div className="link_boder">
                    <img className="lighting_icon" src={Lightning} alt=""></img>
                    Lightning Talk
                  </div>
                </div>
              </div>
              <div className="realted_papers_content">
                <div className="paper_title">
                  [MICRO 2023] QuCT: A Framework for Analyzing Quantum Circuit
                  by Extracting Contextual and Topological Features
                </div>
                <div className="paper_team">
                  Siwei Tan, Congliang Lang, Liang Xiang; Shudi Wang, Xinghui
                  Jia, Ziqi Tan, Tingting Li (Zhejiang University), Jieming Yin
                  (Nanjing University of Posts and Telecommunications); Yongheng
                  Shang, Andre Python, Liqiang Lu*, Jianwei Yin* (Zhejiang
                  University)
                </div>
                {/* <div className="link">
                  <div className="link_boder">
                    <img src={paper} alt=""></img>
                    Paper
                  </div>
                  <div className="link_boder">
                    <img src={Lightning} alt=""></img>
                    Lightning Talk
                  </div>
                </div> */}
                <div className="link">
                  <div className="link_boder">
                    <img className="paper_icon" src={paper} alt=""></img>
                    Paper
                  </div>
                  <div className="link_boder">
                    <img className="lighting_icon" src={Lightning} alt=""></img>
                    Lightning Talk
                  </div>
                </div>
              </div>
              <div className="realted_papers_content">
                <div className="paper_title">
                  [Nature 2022] Digital quantum simulation of Floquet
                  symmetry-protected topological phases
                </div>
                <div className="paper_team">
                  Xu Zhang (Zhejiang University), Wenjie Jiang (Tsinghua
                  University), Jinfeng Deng, Ke Wang, Jiachen Chen, Pengfei
                  Zhang, Wenhui Ren, Hang Dong, Shibo Xu, Yu Gao, Feitong Jin,
                  Xuhao Zhu, Qiujiang Guo, Hekang Li, Chao Song, Alexey V.
                  Gorshkov, Thomas Iadecola, Fangli Liu, Zhe-Xuan Gong, Zhen
                  Wang* (Zhejiang University), Dong-Ling Deng* (Tsinghua
                  University) & Haohua Wang (Zhejiang University)
                </div>
                <div className="link">
                  <div className="link_boder">
                    <img className="paper_icon" src={paper} alt=""></img>
                    Paper
                  </div>
                  <div className="link_boder">
                    <img className="lighting_icon" src={Lightning} alt=""></img>
                    Lightning Talk
                  </div>
                </div>
              </div>
              {/* <div className="realted_papers_content">
                <div className="paper_title">
                  (Science 2019) Generation of multicomponent atomic Schrödinger
                  cat states of up to 20 qubits
                </div>
                <div className="paper_team">
                  Chao Song, Kai Xu, Hekang Li, Yu-Ran Zhang, Xu Zhang, Wuxin
                  Liu, Qiujiang Guo, Zhen Wang, Wenhui Ren, Jie Hao, Hui Feng,
                  Heng Fan, Dongning Zheng, Da-Wei Wang, H. Wang*, Shi-Yao Zhu*
                  (Zhejiang University)
                </div>
                <div className="link">
                  <div className="link_boder">
                    <img src={paper} alt=""></img>
                    Paper
                  </div>
                  <div className="link_boder">
                    <img src={Lightning} alt=""></img>
                    Lightning Talk
                  </div>
                </div>
              </div> */}
            </div>

            {/* <div ref={Organizer} className="article_Organizer">
              <div className="article_Organizer_titel">
                <h1
                  style={{
                    textAlign: "left",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  Organizers and presenters
                </h1>
              </div>
              <div className="articcle_Organizer_all_content">
              <div className="photo">
                  <img src={jianweiyin} alt="" />
                </div>
                <div className="articcle_Organizer_content">
                  Jianwei Yin is currently a full professor in the College of
                  Computer Science, Zhejiang University (ZJU), China. He has
                  published more than 100 papers in top international journals
                  and conferences. His current research interests include
                  quantum computing, service computing and business process
                  management. He is also the Associate Editor of the IEEE
                  Transactions on Services Computing.
                </div>
              <div className="photo">
              <img src={liqianglu} alt="" />
                </div>
                <div className="articcle_Organizer_content">
                Liqiang Lu is a ZJU100 Young Professor in the College of
                  Computer Science, Zhejiang University (ZJU), China. His
                  research interests include quantum computing, computer
                  architecture, deep learning accelerator, and software-hardware
                  codesign. He has authored more than 20 scientific publications
                  in premier international journals and conferences in related
                  domains, including ISCA, MICRO, HPCA, FCCM, DAC, IEEE Micro,
                  and TCAD. He also serves as a TPC member in the premier
                  conferences in the related domain, including ICCAD, FPT, HPCC
                  etc.
                </div>
              <div className="photo">
              <img src={liqianglu} alt="" />
                </div>
                <div className="articcle_Organizer_content">
                Liqiang Lu is a ZJU100 Young Professor in the College of
                  Computer Science, Zhejiang University (ZJU), China. His
                  research interests include quantum computing, computer
                  architecture, deep learning accelerator, and software-hardware
                  codesign. He has authored more than 20 scientific publications
                  in premier international journals and conferences in related
                  domains, including ISCA, MICRO, HPCA, FCCM, DAC, IEEE Micro,
                  and TCAD. He also serves as a TPC member in the premier
                  conferences in the related domain, including ICCAD, FPT, HPCC
                  etc.
                </div>





                <Table
                  pagination={false}
                  dataSource={dataSource2}
                  columns={columns2}
                />
              </div>
            </div> */}

            <div ref={Organizer} className="speakers">
              <div className="speaker_title">
                <h1
                  style={{ textAlign: "left", fontSize: "1.5rem" }}
                  ref={Speakers}
                >
                  Organizers and presenters
                </h1>
              </div>
              <div className="speakers_1 speaker">
                <div className="photo">
                  <img src={jianweiyin} alt="" />
                </div>
                <div className="speakers_1_content speaker_content">
                  Jianwei Yin is currently a full professor in the College of
                  Computer Science, Zhejiang University (ZJU), China. He has
                  published more than 100 papers in top international journals
                  and conferences. His current research interests include
                  quantum computing, service computing and business process
                  management. He is also the Associate Editor of the IEEE
                  Transactions on Services Computing.
                </div>
              </div>
              <div className="speakers_1 speaker">
                <div className="photo">
                  <img src={liqianglu} alt="" />
                </div>
                <div className="speakers_1_content speaker_content">
                  Liqiang Lu is a ZJU100 Young Professor in the College of
                  Computer Science, Zhejiang University (ZJU), China. His
                  research interests include quantum computing, computer
                  architecture, deep learning accelerator, and software-hardware
                  codesign. He has authored more than 20 scientific publications
                  in premier international journals and conferences in related
                  domains, including ISCA, MICRO, HPCA, FCCM, DAC, IEEE Micro,
                  and TCAD. He also serves as a TPC member in the premier
                  conferences in the related domain, including ICCAD, FPT, HPCC
                  etc.
                </div>
              </div>
              <div className="speakers_2 speaker">
                <div className="photo">
                  <img src={tansiwei} alt="" />
                </div>
                <div className="speakers_1_content speaker_content">
                  Siwei Tan is a 5th year PhD student at Zhejiang University.
                  His interests include the quantum algorithm and computer
                  architecture. Wuwei Tian is a 4th year PhD student at Zhejiang
                  University.
                </div>
              </div>
              <div className="speakers_3 speaker">
                <div className="photo">
                  <img src={wuweitian} alt="" />
                </div>
                <div className="speakers_1_content speaker_content">
                  Wuwei Tian is a 4th year PhD student at Zhejiang University.
                  He is interested in the compiler design and quantum hardware.
                </div>
              </div>
            </div>
          </div>
          <div className="article_content_right"></div>
        </div>
        <div className="home_conten_item_3">
          <div className="home_conten_item_3_left"></div>
          <div className="home_conten_item_3_content">
            <div className="janusqCloud" ref={JanusQCloud}>
              <h1
                className="janusqCloud_title"
                style={{
                  textAlign: "left",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                Link of JanusQ Cloud:
              </h1>

              <a
                href="http://janusq.zju.edu.cn"
                target="_blank"
                rel="noreferrer"
              >
                janusq.zju.edu.cn
                <span className="LinkOutlined">
                  <LinkOutlined />
                </span>
              </a>
            </div>

            <div className="git_pepos" ref={gitRpepos}>
              <span>
                <svg
                  aria-hidden="true"
                  height="24"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="24"
                  data-view-component="true"
                >
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
              </span>
              <h1
                className="git_pepops_title"
                style={{
                  display: "inline-block",
                  marginLeft: 10,
                  textAlign: "left",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                Git Repository:
              </h1>
              <div className="gitHub_link">
                <a>
                  Janus-SAT
                  <span className="LinkOutlined">
                    <LinkOutlined />
                  </span>
                </a>
              </div>
              <div className="gitHub_link">
                <a>
                  Janus-CT
                  <span className="LinkOutlined">
                    <LinkOutlined />
                  </span>
                </a>
              </div>
              <div className="gitHub_link">
                <a>
                  Janus-PulseLib
                  <span className="LinkOutlined">
                    <LinkOutlined />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
