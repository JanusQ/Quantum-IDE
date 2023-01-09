import React, { useEffect, useState } from "react"
import AdminLayout from "./AdminLayout"
import "../styles/NoticeDetail.css"
import { useParams } from "react-router-dom"
import { getNotice } from "../../api/notice"
import Editor from "md-editor-rt"
import "md-editor-rt/lib/style.css"
// import '../styles/CommonAntDesign.css'
const AdminNoticeDetail = () => {
  const { noticeId } = useParams()
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
    <AdminLayout>
      <div className="notice_detail">
        {/* <div className='notice_detail_title'>
					<div className='notice_detail_name'>关于量子计算最新的算法公告</div>
					<div className='notice_detail_time'>发布时间：2022-04-02 19:00:00</div>
				</div> */}

        <div className="notice_detail_content">
          <div className="notice_detail_detail">
            <Editor
              modelValue={text}
              previewOnly={true}
              previewTheme="github"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminNoticeDetail
