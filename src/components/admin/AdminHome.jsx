import React, { useEffect, useState } from "react"
import AdminLayout from "./AdminLayout"
import "../adminStyles/AdminHome.css"
import { DatePicker, Button } from "antd"
import moment from "moment"
import * as echarts from "echarts/core"
import { GridComponent, TooltipComponent } from "echarts/components"
import { BarChart } from "echarts/charts"
import { CanvasRenderer } from "echarts/renderers"
import ComponentTitle from "../core/ComponentTitle"
// import "../styles/CommonAntDesign.css"
echarts.use([GridComponent, BarChart, CanvasRenderer, TooltipComponent])
const AdminHome = () => {
  const { RangePicker } = DatePicker
  const staticDiv = () => {
    return (
      <div className="admin_home_static_div">
        <div className="admin_home_static_item">
          <p className="admin_home_static_number">2000</p>
          <p className="admin_home_static_name">累计任务总数</p>
        </div>
        <div className="admin_home_static_item">
          <p className="admin_home_static_number">2000</p>
          <p className="admin_home_static_name">处理中任务数</p>
        </div>
        <div className="admin_home_static_item">
          <p className="admin_home_static_number">2000</p>
          <p className="admin_home_static_name">计算机总数</p>
        </div>
        <div className="admin_home_static_item">
          <p className="admin_home_static_number">2000</p>
          <p className="admin_home_static_name">用户总数</p>
        </div>
      </div>
    )
  }
  const [dateValue, setDateValue] = useState([])
  const dateChange = (date) => {
    setDateValue(date)
  }
  const setTime = (value) => {
    setDateValue([moment(), moment().add(value, "d")])
  }
  const selectTime = () => {
    return (
      <div className="admin_home_select_time">
        <RangePicker
          value={dateValue}
          onChange={dateChange}
          style={{ float: "right" }}
        ></RangePicker>
        <Button
          style={{ float: "right", marginRight: "10px" }}
          onClick={() => setTime(30)}
        >
          近30天
        </Button>
        <Button
          style={{ float: "right", marginRight: "10px" }}
          onClick={() => setTime(15)}
        >
          近15天
        </Button>
        <Button
          style={{ float: "right", marginRight: "10px" }}
          onClick={() => setTime(7)}
        >
          近7天
        </Button>
      </div>
    )
  }
  const staticEcharts = () => {
    return (
      <div className="admin_home_echarts_div">
        <div className="admin_home_echarts">
          <div className="admin_home_echarts_header">任务数量</div>
          <div
            id="admin_tesk_number"
            className="admin_home_echarts_content"
          ></div>
        </div>
        <div className="admin_home_echarts">
          <div className="admin_home_echarts_header">用户注册量</div>
          <div
            id="admin_user_number"
            className="admin_home_echarts_content"
          ></div>
        </div>
      </div>
    )
  }
  const createChart = (id) => {
    const chartDom = document.getElementById(id)
    const myChart = echarts.init(chartDom)

    const option = {
      color: [
        {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#225fff", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#29cfcc", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: 22,
          data: [10, 52, 200, 334, 390, 330, 220],
          itemStyle: {
            borderRadius: 10,
          },
        },
      ],
    }

    option && myChart.setOption(option)
  }
  useEffect(() => {
    createChart("admin_tesk_number")
    createChart("admin_user_number")
  }, [])
  return (
    <AdminLayout>
      <ComponentTitle name="后台数据"></ComponentTitle>
      {staticDiv()}
      {selectTime()}
      {staticEcharts()}
    </AdminLayout>
  )
}

export default AdminHome
