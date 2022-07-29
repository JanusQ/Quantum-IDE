import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { Card, Table, Modal } from "antd";
import { getOperationLogList } from "../../api/operationLog";
import { log } from "mathjs";
export default function AdminOperationLog() {
  const [operationList, setOperationList] = useState([]);
  const [page_size, setPageSize] = useState(10);
  const [page_num, setpageNumber] = useState(1);
  const [showCodeVisible, setshowCodeVisible] = useState(false)
  const [code, setcode] = useState('')
  const getLogList = async () => {
    const res = await getOperationLogList({ page_size, page_num, filter: {} });
    const list = JSON.parse(res.data.data.log_list);
   
    setOperationList(list);
  };
  const showcode = (text) => {
    setcode(text);
    setshowCodeVisible(true);
  };
    const closeCode =()=>{
        setshowCodeVisible(false)
    }
  useEffect(() => {
    getLogList();
  }, [page_num]);
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "用户名",
      render: (text) => text,
    },
    {
      title: "操作时间",
      dataIndex: "log_time",
      key: "操作时间",
      render: (text) => text,
    },
    {
      title: "用户操作",
      dataIndex: "user_operation",
      key: "用户操作",
      render: (text) => text,
    },
    {
      title: "用户提交的代码",
      dataIndex: "user_code",
      key: "用户提交的代码",
      render: (text) => <a onClick={()=>showcode(text)}> code</a>,
    },
    {
      title: "提交代码报错信息",
      dataIndex: "error_information",
      key: "提交代码报错信心",
      render: (text) => <a>{text}</a>,
    },
  ];
  return (
    <AdminLayout>
      <Table
        rowKey="user_id"
        dataSource={operationList}
        columns={columns}
      ></Table>

      <Modal onCancel={closeCode} title="代码" visible={showCodeVisible}>
        {code}
      </Modal>
    </AdminLayout>
  );
}
