import React, { useState, useEffect, useRef } from "react"
import "./ReferenceDoc.css"
import "markdown-navbar/dist/navbar.css"
import { getDocList, getDoc } from "@/api/doc"
import { MdPreview, MdCatalog } from "md-editor-rt"
import "md-editor-rt/lib/preview.css"
import { message, Affix, Button } from "antd"
import { useParams } from "react-router-dom"
import { FileTextOutlined, ArrowUpOutlined } from "@ant-design/icons"
import ComponentTitle from "@/components/componentTitle"
import { useTranslation } from "react-i18next"
const ReferenceDoc = () => {
  const scrollElement = document.documentElement
  const [id] = useState("preview-only")

  const { t, i18n } = useTranslation()
  const { docId } = useParams()
  const getDocListFn = async () => {
    const { data } = await getDocList()
    let ZHlist = []
    let ENlist = []
    let docList = data.doc_list.filter(
      (item) => item.doc_id !== 15 && item.doc_id !== 16
    )
    // 根据上传者的名字来区分中英文档
    ENlist = docList.filter((item) => item.author == "huguangze")
    ZHlist = docList.filter((item) => item.author == "wangxuanhe")
    setDocList(docList.reverse())
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
      if (i18n.resolvedLanguage === "zh") {
        getDocFn(ZHlist[0].doc_id)
        setActiveId(ZHlist[0].doc_id)
      } else {
        getDocFn(ENlist[0].doc_id)
        setActiveId(ENlist[0].doc_id)
      }
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
      //   console.log(data)
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
  const elementRef = useRef()

  // 点击按钮时触发滚动到顶部的函数
  const handleScrollToTop = () => {
    const md = document.querySelector(".md-editor")

    if (md) {
      md.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
  return (
    <div className="document_container">
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
          {/* <ul
            className="doc_left_menu_list"
            style={{
              width: isShowMenu ? "200px" : "0",
            }}
          >
            {docLi}
            
          </ul> */}
          <div className="doc_ment_list">
            {isShowMenu &&
              docList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => getDocFn(item.doc_id)}
                  className={item.doc_id === activeId ? "active list" : "list"}
                >
                  {item.doc_title}
                </div>
              ))}
          </div>
        </div>
        <div ref={elementRef} className="doc_content">
          <MdPreview editorId={id} modelValue={text} />

          {/* 目录 */}
          {/* <MdCatalog editorId={id} scrollElement={scrollElement} /> */}
        </div>
        <div className="toTop">
          <Button
            onClick={handleScrollToTop}
            ghost
            style={{ borderColor: "#b9b9b9", color: "#b9b9b9" }}
            shape="circle"
            icon={<ArrowUpOutlined />}
          ></Button>
        </div>
      </div>
    </div>
  )
}

export default ReferenceDoc
