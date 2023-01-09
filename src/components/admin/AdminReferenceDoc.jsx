import AdminLayout from "./AdminLayout"
import React, { useState, useEffect } from "react"
import "../adminStyles/AdminNotice.css"
import { Table, Button, Modal, Form, Input, Upload, message } from "antd"
import { Link, useHistory } from "react-router-dom"
import { UploadOutlined } from "@ant-design/icons"
import {
  addDocAdmin,
  deleteDocAdmin,
  getDocList,
  updateDocAdmin,
} from "../../api/doc"
import { isAuth } from "../../helpers/auth"
import moment from "moment"
import ComponentTitle from "../core/ComponentTitle"
// import '../styles/CommonAntDesign.css'
import TreeDocManage from "../core/TreeDocManage"
// import Editor from 'md-editor-rt'
// import 'md-editor-rt/lib/style.css'
const AdminReferenceDoc = () => {
  const auth = isAuth()
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1
      },
    },
    {
      title: "文档名称",
      dataIndex: "doc_title",
      key: "doc_title",
      render: (text, record) => {
        return <a onClick={() => lookDetail(record.doc_id)}>{text}</a>
      },
    },
    {
      title: "发布人",
      dataIndex: "author",
      key: "author",
    },

    {
      title: "更新时间",
      dataIndex: "update_time",
      key: "update_time",
      render: (text) => {
        return moment(text).format("YYYY-MM-DD HH:MM:SS")
      },
    },
    {
      title: "操作",
      dataIndex: "step",
      key: "step",
      render: (text, record) => {
        return (
          <span>
            <a
              style={{ marginRight: "10px" }}
              onClick={() => edit(record.doc_id)}
            >
              编辑
            </a>
            <a onClick={() => deleteNotice(record.doc_id)}>删除</a>
          </span>
        )
      },
    },
  ]
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(100)
  const [pageSize, setPageSize] = useState(10)
  const onChange = (page, pageSize) => {
    setPageSize(pageSize)
    setCurrent(page)
  }
  const pagination = {
    current: current,
    total: total,
    pageSize: pageSize,
    onChange: onChange,
    showTotal: (total) => `共 ${total} 条数据`,
    showQuickJumper: true,
  }
  const [addForm] = Form.useForm()
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const addCancel = () => {
    addForm.resetFields()
    setIsAddModalVisible(false)
  }
  const addOk = () => {
    addForm.validateFields().then(async (value) => {
      const formData = new FormData()
      if (editId === -1) {
        formData.append("doc_content", value.file.file)
        formData.append("doc_title", value.notice_title)
        formData.append("author", auth.username)
        await addDocAdmin(formData)
        message.success("上传成功")
        setIsAddModalVisible(false)
        getNoticeListFn()
        addForm.resetFields()
      } else {
        formData.append("doc_content", value.file.file)
        formData.append("doc_id", editId)
        await updateDocAdmin(formData)
        message.success("修改成功")
        setIsAddModalVisible(false)
        getNoticeListFn()
        setEditId(-1)
        addForm.resetFields()
      }
      setFileList([])
    })
  }

  const [fileList, setFileList] = useState([])
  const uploadChange = (info) => {
    let fileList = [...info.fileList]
    fileList = fileList.slice(-1)
    setFileList(fileList)
  }
  const beforeUpload = (file) => {
    return false
  }
  const removeFile = () => {
    setFileList([])
  }
  useEffect(() => {
    if (!fileList.length) {
      addForm.resetFields(["file"])
    }
  }, [fileList])
  const addModal = () => {
    return (
      <Modal
        visible={isAddModalVisible}
        onCancel={addCancel}
        onOk={addOk}
        title={editId === -1 ? "添加文档" : "修改文档"}
        width={820}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="notice_title"
            label="文档标题"
            rules={[{ required: editId === -1, message: "请输入文档标题" }]}
            style={{ display: editId === -1 ? "flex" : "none" }}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="文档上传"
            name="file"
            rules={[{ required: true, message: "请上传文档" }]}
          >
            <Upload
              multiple={false}
              fileList={fileList}
              onChange={uploadChange}
              beforeUpload={beforeUpload}
              onRemove={removeFile}
              accept=".md"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
  const addNotice = () => {
    setIsAddModalVisible(true)
  }
  // 获取文档列表
  const [noticeList, setNoticeList] = useState([])
  const getNoticeListFn = async () => {
    const { data } = await getDocList()
    setNoticeList(data.doc_list)
  }
  useEffect(() => {
    getNoticeListFn()
  }, [])
  // 删除
  const deleteNotice = (id) => {
    Modal.confirm({
      title: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        const formData = new FormData()
        formData.append("doc_id", id)
        await deleteDocAdmin(formData)
        message.success("已删除")
        getNoticeListFn()
      },
    })
  }
  // 编辑
  const [editId, setEditId] = useState(-1)
  const edit = (id) => {
    setEditId(id)
    setIsAddModalVisible(true)
  }
  // 详情
  const history = useHistory()
  const lookDetail = (id) => {
    history.push(`/referenceDoc/${id}`)
  }
  return (
    <AdminLayout>
      <TreeDocManage></TreeDocManage>
      <ComponentTitle name={"文档管理"}></ComponentTitle>
      <div className="admin_notice_operation">
        <Button type="primary" onClick={addNotice}>
          添加
        </Button>
      </div>
      <div className="admin_notice_div">
        <Table
          columns={columns}
          dataSource={noticeList}
          pagination={false}
          rowKey="doc_id"
        />
      </div>
      {addModal()}
    </AdminLayout>
  )
}

export default AdminReferenceDoc
