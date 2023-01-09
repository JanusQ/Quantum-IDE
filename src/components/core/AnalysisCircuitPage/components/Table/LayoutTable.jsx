import React, { useState, memo } from "react"
import {
  Checkbox,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
  Card,
  Radio,
  Table,
} from "antd"
export default memo(() => {
  const [check, setCheck] = useState("")

  const columnsChips = [
    {
      title: "chip name",
      dataIndex: "chipName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "description",
      dataIndex: "description",
    },
    {
      title: "qubit number",
      dataIndex: "qubitNumber",
    },
    {
      title: "chip topology",
      dataIndex: "chipTopology",
    },
  ]
  const chipSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRows[0].chipName, "5555")
      //   setComputer([selectedRows[0].chipName])
      setCheck(selectedRowKeys)
    },
  }
  const dataChips = [
    {
      key: "1",
      chipName: "N36U19_0",
      description: "N36U19_0 is a part of N36U19 with chained 5 qubits ",
      qubitNumber: 5,
      chipTopology: "N36U19_0 is a part of N36U19 with chained 5 qubits",
    },
    {
      key: "2",
      chipName: "N36U19_1",
      description: "N36U19_1 is a part of N36U19 with chained 5 qubits",
      qubitNumber: 5,
      chipTopology: "one dimension chain",
    },
    {
      key: "3",
      chipName: "N36U19",
      description: "N36U19 is a 10 qubit chip with chained topologys ",
      qubitNumber: 10,
      chipTopology: "one dimension chain",
    },
  ]
  console.log(check, 6666)
  return (
    <Table
      pagination={{
        position: ["none"],
      }}
      rowSelection={{
        type: "radio",
        ...chipSelection,
      }}
      columns={columnsChips}
      dataSource={dataChips}
      defaultSelectedRowKeys={[check]}
    />
  )
})
