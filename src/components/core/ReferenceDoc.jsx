import React, { useState, useEffect } from "react"
import Layout from "./Layout"
import ReactMarkdown from "react-markdown"
import gfm from "remark-gfm"
import "../styles/ReferenceDoc.css"
import MarkNav from "markdown-navbar"
import "markdown-navbar/dist/navbar.css"
import axios from "axios"
import { getDocList, getDoc } from "../../api/doc"
import Editor from "md-editor-rt"
import "md-editor-rt/lib/style.css"
import { log, string } from "mathjs"
import { message } from "antd"
import { useParams } from "react-router-dom"
import { FileTextOutlined } from "@ant-design/icons"
import ComponentTitle from "./ComponentTitle"
import { useTranslation } from "react-i18next"
const ReferenceDoc = () => {
  const { t, i18n } = useTranslation()
  const { docId } = useParams()
  const getDocListFn = async () => {
    const { data } = await getDocList()
    let ZHlist = []
    let ENlist = []
    // 根据上传者的名字来区分中英文档
    ENlist = data.doc_list.filter((item) => item.author == "zju-01")
    ZHlist = data.doc_list.filter((item) => item.author == "wangxuanhe")
    setDocList(data.doc_list.reverse())
    if (i18n.resolvedLanguage === "zh") {
      setDocList(ZHlist.reverse())
    } else {
      setDocList(ENlist.reverse())
    }

    if (docId === "all") {
      if (i18n.resolvedLanguage === "zh") {
        getDocFn(ZHlist[0].doc_id)
        setActiveId(ZHlist[0].doc_id)
      } else {
        getDocFn(ENlist[0].doc_id)
        setActiveId(ENlist[0].doc_id)
      }
      //   getDocFn(data.doc_list[0].doc_id)
      //   setActiveId(data.doc_list[0].doc_id)
    } else {
      getDocFn(docId)
      setActiveId(Number(docId))
    }
  }
  const [docList, setDocList] = useState([])
  //   const [ZHdocList, setZHDocList] = useState([])
  //   const [ENdocList, setEnDocList] = useState([])
  const [text, setText] = useState("loading...")
  const [activeId, setActiveId] = useState(-1)
  const [isShowMenu, setIsShowMenu] = useState(true)
  const docLi = docList.map((item) => (
    <li
      style={{ display: isShowMenu ? "block" : "none" }}
      className={item.doc_id === activeId ? "active" : ""}
      onClick={() => getDocFn(item.doc_id)}
      key={item.doc_id}
    >
      <span className="content_text">
        <span className="content_icon">
          <FileTextOutlined style={{ fontSize: "28px" }} />
        </span>
        <span className="content_text_detail" title={item.doc_title}>
          {item.doc_title}
        </span>
      </span>
    </li>
  ))

  const getDocFn = async (id) => {
    try {
      setActiveId(id)
      const formData = new FormData()
      formData.append("doc_id", id)
      const { data } = await getDoc(formData)
      setText(data)
      console.log(data)
    } catch {
      message.error("请求文档失败")
    }
  }
  useEffect(() => {
    getDocListFn()
  }, [i18n.resolvedLanguage])

  const menuClick = () => {
    setIsShowMenu(!isShowMenu)
  }

  return (
    <Layout>
      <ComponentTitle name={t("document")}></ComponentTitle>
      <div className="doc_div">
        <div
          className="doc_left_menu"
          style={{ width: isShowMenu ? "200px" : "66px" }}
        >
          <div className="doc_left_menu_title">
            <span
              className="doc_left_menu_title_icon"
              onClick={menuClick}
            ></span>
          </div>
          <ul
            className="doc_left_menu_list"
            style={{
              width: isShowMenu ? "200px" : "0",
            }}
          >
            {docLi}
          </ul>
        </div>
        <div className="doc_content">
          {/* <ReactMarkdown plugins={[[gfm, { singleTilde: false }]]} allowDangerousHtml>
						{md}
					</ReactMarkdown> */}
          <Editor modelValue={text} previewOnly={true} previewTheme="github" />
        </div>
      </div>
    </Layout>
  )
}

export default ReferenceDoc
