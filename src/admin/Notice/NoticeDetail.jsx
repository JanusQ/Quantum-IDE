import React, { useEffect, useState } from "react"
import "./NoticeDetail.css"
import { useLocation } from "react-router-dom"
import { getNotice } from "@/api/notice"
import { MdPreview, MdCatalog } from "md-editor-rt"
import "md-editor-rt/lib/preview.css"
const AdminNoticeDetail = () => {
  const scrollElement = document.documentElement
  const [id] = useState("preview-only")
  const { noticeId } = useLocation().state

  const getNoticeDetail = async () => {
    const formData = new FormData()
    formData.append("notice_id", noticeId)
    const { data } = await getNotice(formData)
    setText(data)
  }
  const [text, setText] = useState("loading...")
  useEffect(() => {
    getNoticeDetail()
  }, [])
  return (
    <>
      <div className="notice_detail">
        {/* <div className='notice_detail_title'>
					<div className='notice_detail_name'>关于量子计算最新的算法公告</div>
					<div className='notice_detail_time'>发布时间：2022-04-02 19:00:00</div>
				</div> */}

        <div className="notice_detail_content">
          <div className="notice_detail_detail">
            <MdPreview editorId={id} modelValue={text} />
            <MdCatalog editorId={id} scrollElement={scrollElement} />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminNoticeDetail
