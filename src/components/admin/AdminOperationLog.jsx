import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { Table, Modal } from 'antd'
import { getOperationLogList } from '../../api/operationLog'
export default function AdminOperationLog() {
  const [operationList, setOperationList] = useState([])
  const [page_size, setPageSize] = useState(10)
  const [page_num, setpageNumber] = useState(1)
  const [showCodeVisible, setshowCodeVisible] = useState(false)
  const [code, setcode] = useState('')
  const getLogList = async () => {
   try {
     const res = await getOperationLogList({ page_size, page_num, filter: {} })
    
   } catch (e) {
     const list = JSON.parse(e.data.log_list)

     setOperationList(list)
    
   }
  }
  const showcode = (text) => {
    setcode(text)
    setshowCodeVisible(true)
  }
  const closeCode = () => {
    setshowCodeVisible(false)
  }
  useEffect(() => {
    getLogList()
  }, [page_num])
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: '用户名',
      render: (text) => text,
    },
    {
      title: '操作时间',
      dataIndex: 'log_time',
      key: '操作时间',
      render: (text) => text,
    },
    {
      title: '用户操作',
      dataIndex: 'user_operation',
      key: '用户操作',
      render: (text) => text,
    },
    {
      title: '用户提交的代码',
      dataIndex: 'user_code',
      key: '用户提交的代码',
      render: (text) => <a onClick={() => showcode(text)}> 查看代码</a>,
    },
    {
      title: '提交代码报错信息',
      dataIndex: 'error_information',
      key: '提交代码报错信心',
      render: (text) => <div>{text}</div>,
    },
  ]
  return (
    <AdminLayout>
      <div className="operationMargintop" style={{ marginTop: 100 }}></div>
      <Table
        rowKey="user_id"
        dataSource={operationList}
        columns={columns}
      ></Table>

      <Modal onCancel={closeCode} footer={false} visible={showCodeVisible}>
        {code}
      </Modal>
    </AdminLayout>
  )
}
