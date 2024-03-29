import React, { useEffect, useState } from "react"
import Layout from "./Layout"
import { Table, Input, Select, Drawer, Button, Switch } from "antd"
import { Link } from "react-router-dom"
import { SearchOutlined } from "@ant-design/icons"
import "../styles/Project.css"
import { recieve_from_real } from "../../api/test_circuit"
import {
  computerParamsChat,
  computerD3,
} from "../../helpers/computerParamsChart"
import { taskTypeArr } from "../../helpers/auth"
import { getTaskList, getTaskResult } from "../../api/project"
import { useParams } from "react-router-dom"
import { taskTypeName } from "../../helpers/auth"
import "../styles/Task.css"
import "../styles/Computer.css"
import { filter } from "mathjs"
import QCEngine from "../../simulator/MyQCEngine"
import iojson from "iojson"
// import '../styles/CommonAntDesign.css'
import ComponentTitle from "./ComponentTitle"
import { useTranslation } from "react-i18next"

const Task = () => {
  // 中英切换
  const { t, i18n } = useTranslation()
  const _ = require("lodash")
  const columns = [
    {
      title: t("taskList.serial number"),
      dataIndex: "index",
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1
      },
      className: "number",
    },
    {
      title: t("taskList.task number"),
      dataIndex: "task_id",
      key: "task_id",
    },
    {
      title: t("taskList.name of computer"),
      dataIndex: "computer_name",
      key: "computer_name",
    },

    {
      title: t("taskList.running status"),
      dataIndex: "task_status",
      key: "task_status",
      render: (text) => {
        return (
          <span
            style={{
              color:
                text === 0 ? "#74cf6f" : text === 1 ? "#3e3e3e" : "#ff0200",
            }}
          >
            {/* {taskTypeName(text)} */}
            {text == 1 ? t("taskList.succeed") : t("taskList.failed")}
          </span>
        )
        // return taskTypeName(text)
      },
    },
    {
      title: t("taskList.running time"),
      dataIndex: "running_time",
      key: "running_time",
    },
    {
      title: t("taskList.creation time"),
      dataIndex: "submit_time",
      key: "submit_time",
    },
    Table.EXPAND_COLUMN,
    {
      title: t("taskList.operation"),
      dataIndex: "step",
      key: "step",
      render: (text, record) => {
        return (
          <Button
            type="link"
            onClick={() => lookResult(record.task_id)}
            disabled={record.task_status !== 1}
            style={{ padding: 0 }}
          >
            {t("taskList.View the results")}
          </Button>
        )
      },
    },
  ]
  const { taskId, projectName } = useParams()
  const data = [
    {
      key: "1",
      name: "123",
      age: 32,
      address: "111",
      tags: ["nice", "developer"],
    },
  ]
  const { Search } = Input
  const { Option } = Select
  const [statusType, setStatusType] = useState(-1)
  const [taskList, setTaskList] = useState([])
  const getTaskListFn = async () => {
    const formData = new FormData()
    formData.append("project_id", taskId)
    if (statusType !== -1) {
      formData.append("filter", JSON.stringify({ task_status: statusType }))
    } else {
      formData.append("filter", JSON.stringify({}))
    }
    const { data } = await getTaskList(formData)
    setTaskList(data.task_list.reverse())
  }
  const statusChange = async (value) => {
    setStatusType(value)
  }
  useEffect(() => {
    getTaskListFn()
  }, [statusType])
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
  const [visible, setVisible] = useState(false)
  const compare = (property) => {
    return function (a, b) {
      const value1 = a[property]
      const value2 = b[property]
      return value1 - value2
    }
  }
  const [resultData, setResultData] = useState(null)
  const [visibleTitle, setVisibleTitle] = useState(-1)
  const lookResult = async (id) => {
    // setVisible(true)
    if (expandedRowKeys[0] === id) {
      setExpandedRowKeys([])
      return
    }
    setExpandedRowKeys([id])
    const formData = new FormData()
    formData.append("task_id", id)
    const { data } = await getTaskResult(formData)
    // const qc = new QCEngine()
    setResultData(data)
    drawFn(data, id)
    if (!isSimple) {
      setIsSimple(true)
    } else {
      drawChart(id, data)
    }
  }
  const onClose = () => {
    setVisible(false)
  }
  const taskTypeArr = [
    {
      code: -1,
      name: t("taskList.all"),
    },
    {
      code: 0,
      name: t("taskList.waiting"),
    },
    {
      code: 1,
      name: t("taskList.succeed"),
    },
    {
      code: 2,
      name: t("taskList.failed"),
    },
  ]
  const taskTypeOperations = taskTypeArr.map((item) => (
    <Option key={item.code} value={item.code}>
      {item.name}
    </Option>
  ))
  const [isSimple, setIsSimple] = useState(true)
  const changeType = (isFirst, checked) => {
    // setIsSimple(checked)
    // console.log(isFirst)
    if (!isFirst) {
      setIsSimple(!isSimple)
    }
    // if (!checked) {
    //   setIsSimple(!isSimple)
    // }
  }
  const drawChart = (id, data) => {
    if (!data) {
      data = resultData
    }
    if (!isSimple) {
      const echartsData = []
      const dataKeys = Object.keys(data.result)
      const arr = []
      dataKeys.forEach((item) => {
        arr.push({ form: item, to: parseInt(item, 2) })
      })
      arr.sort(compare("to"))
      // dataKeys.sort
      arr.forEach((item) => {
        echartsData.push({
          yValue: data.result[item.form],
          xValue: item.form,
        })
      })
      // console.log(qc.import(data.compiled_qc))
      computerParamsChat(
        echartsData,
        `computer_params_chart_${id}`,
        `computer_params_chart_svg_${id}`,
        false
      )
      // if(isSimple)
    } else {
      const echartsData = []
      const dataKeys = Object.keys(data.probs)
      const arr = []
      dataKeys.forEach((item) => {
        arr.push({ form: item, to: item })
      })
      arr.sort(compare("to"))
      // dataKeys.sort
      arr.forEach((item) => {
        echartsData.push({
          yValue: _.parseInt(_.multiply(data.probs[item.form], data.sample)),
          xValue: item.form,
        })
      })
      computerParamsChat(
        echartsData,
        `computer_params_chart_${id}`,
        `computer_params_chart_svg_${id}`,
        true
      )
    }
  }
  useEffect(() => {
    if (resultData) {
      drawChart(expandedRowKeys[0])
    }
  }, [isSimple])
  const drawFn = (data, id) => {
    // console.log(data,'587587')
    let qc = new QCEngine()
    qc.import(data.origin_circuit)
    computerD3(
      qc.circuit,
      `task_before_chart_svg_${id}`,
      `task_before_chart_g_${id}`
    )
    let qcAfter = new QCEngine()
    qcAfter.import(data.compiled_circuit[0])
    computerD3(
      qcAfter.circuit,
      `task_after_chart_svg_${id}`,
      `task_after_chart_g_${id}`
    )
  }
  // 导出
  const downloadFn = (id) => {
    iojson.exportJSON(resultData, `${id}.json`)
  }
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  return (
    <Layout>
      <ComponentTitle name={t("task.Task details")}></ComponentTitle>
      <div className="task_div">
        <div className="task_search_div">
          <Select
            placeholder="请选择运行状态"
            style={{ width: 225, float: "right" }}
            onChange={statusChange}
            value={statusType}
          >
            {taskTypeOperations}
          </Select>
          {/* <Select
						placeholder='请选择项目阶段'
						style={{ width: 200, marginLeft: '20px' }}
						onChange={statusChange}
					>
						<Option value='1'>已启动</Option>
					</Select> */}
        </div>
        <Table
          columns={columns}
          dataSource={taskList}
          pagination={false}
          rowKey="task_id"
          onRow={(record) => {
            return {
              onClick: (event) => {
                document.querySelectorAll("tr").forEach((item) => {
                  item.classList.remove("tr_active")
                })
                if (expandedRowKeys[0] !== record.task_id) {
                  event.target.parentNode.parentNode.parentNode.classList.add(
                    "tr_active"
                  )
                }
              },
            }
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <>
                  <div className="computer_params_btn">
                    {/* <Button onClick={() => changeType(false)} type='primary'>
											{isSimple ? 'Corrected' : 'Raw'}
										</Button> */}
                    <Button
                      onClick={() => downloadFn(record.task_id)}
                      type="primary"
                      style={{ float: "right", marginTop: "9px" }}
                      size="small"
                    >
                      Download
                    </Button>
                    <Switch
                      checkedChildren={t("task.open read correction")}
                      unCheckedChildren={t("task.close read correction")}
                      defaultChecked={false}
                      onChange={(checked) => changeType(false)}
                      checked={isSimple}
                      style={{ float: "right", marginTop: "10px" }}
                    />
                  </div>
                  <div
                    className="computer_params_div"
                    id={`computer_params_chart_${record.task_id}`}
                  >
                    <svg
                      id={`computer_params_chart_svg_${record.task_id}`}
                      style={{ width: "100%", height: "100%" }}
                    ></svg>
                  </div>
                  <div className="task_two_svg_div">
                    <div className="task_number_div">
                      <div className="task_number_title">
                        {t("task.before compile")}
                      </div>
                      <div className="task_before_chart">
                        <svg id={`task_before_chart_svg_${record.task_id}`}>
                          <g id={`task_before_chart_g_${record.task_id}`}></g>
                        </svg>
                      </div>
                    </div>
                    <div className="task_number_div">
                      <div className="task_number_title">
                        {t("task.after compile")}
                      </div>
                      <div className="task_after_chart">
                        <svg id={`task_after_chart_svg_${record.task_id}`}>
                          <g id={`task_after_chart_g_${record.task_id}`}></g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )
            },
            expandIcon: () => {
              return false
            },
            expandedRowKeys: expandedRowKeys,
          }}
        />
      </div>
    </Layout>
  )
}

export default Task
