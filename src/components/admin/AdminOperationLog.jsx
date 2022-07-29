import React from 'react'
import { useEffect, useState } from 'react';
import AdminLayout from "./AdminLayout";
import { Card,Table } from 'antd';
import { getOperationLogList } from '../../api/operationLog';
import { log } from 'mathjs';
export default function AdminOperationLog() {
  const [operationList, setOperationList] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setpageNumber] = useState(1)

  useEffect(()=>{
  const getLogList = async()=>{
  const res = await getOperationLogList({ pageSize, pageNumber });
  console.log(res);
  
  
}
getLogList();
    

  
  },[])
  const columns = [
    {
      title: "用户名",
      dataIndex: "用户名",
      key: "用户名",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "操作时间",
      dataIndex: "操作时间",
      key: "操作时间",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "用户操作",
      dataIndex: "用户操作",
      key: "用户操作",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "用户提交的代码",
      dataIndex: "用户提交的代码",
      key: "用户提交的代码",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "提交代码报错信息",
      dataIndex: "提交代码报错信息",
      key: "提交代码报错信心",
      render: (text) => <a>{text}</a>,
    },
  ];
  return (
    <AdminLayout>
      <Card>
        <Table columns={columns}></Table>
      </Card>
    </AdminLayout>
  );
}
