import React, { useEffect, useState } from "react"
import Right from "../Right"
import { Table } from "antd"
import { getUserRecords } from "@/api/topUp"
import { useSelector } from "react-redux"

export default function Record() {
  const columns = [
    {
      title: "交易时间",
      dataIndex: "created_time",
      key: "created_time",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "交易金额",
      dataIndex: "credit",
      key: "credit",
      render: (text) => <p>{text / 100}</p>,
    },
    {
      title: "交易id",
      dataIndex: "pay_record_id",
      key: "pay_record_id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "交易方式",
      dataIndex: "pay_type",
      key: "pay_type",
      render: (text) => <p>{text == 1 ? "微信" : "支付宝"}</p>,
    },
    {
      title: "项目编号",
      dataIndex: "task_id",
      key: "task_id",
      render: (text) => <p>{text == -1 ? "-" : text}</p>,
    },
    {
      title: "任务编号",
      dataIndex: "user_id",
      key: "user_id",
      render: (text) => <p>{text == -11 || 60 ? "-" : text}</p>,
    },
  ]
  const { userData } = useSelector((store) => store.userData)
  const [recordList, setrecordList] = useState()
  const userCredits = async () => {
    const formData = new FormData()
    formData.append("user_id", userData.user_id)

    const { data } = await getUserRecords(formData)
    setrecordList(data.record_list)
  }
  useEffect(() => {
    userCredits()
  }, [])
  return (
    <Right title={"交易记录"}>
      <Table
        columns={columns}
        dataSource={recordList}
        rowKey="pay_record_id"
      ></Table>
    </Right>
  )
}
