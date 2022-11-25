import React, { useState, useRef, useEffect } from 'react'
import '../styles/Analysis.scss'
import { Progress, Card, Table } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import * as echarts from 'echarts'
export default function Five() {
  const main = useRef()
  const option = {
    title: {
      text: '预期结果',
    },
    radar: {
      indicator: [
        { name: '门数量', max: 6500 },
        { name: '深度', max: 52000 },
        { name: '保真度', max: 38000 },
        { name: '编译速度', max: 30000 },
        { name: '并行度', max: 16000 },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 8000, 6000, 5000, 5000],
            name: 'Allocated Budget',
            areaStyle: {
              color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                {
                  color: 'rgba(24, 144, 255, 0.5)',
                  offset: 0,
                },
                {
                  color: 'rgba(24, 144, 255, 0.9)',
                  offset: 1,
                },
              ]),
            },
          },
        ],
      },
    ],
  }
  useEffect(() => {
    const myChart = echarts.init(main.current)
    myChart.setOption(option)
  }, [])
  return (
    <div style={{ height: '100%' }}>
      <div className="compile">
        <span>编译</span>
        <div className="top">
          <div className="circuit"></div>
          <div className="chart">
            <div ref={main} className="radarChart"></div>
          </div>
        </div>
        <div className="middle">
          <div>配置</div>
          <div className="config">
            <div
              style={{
                width: '50%',
                height: 23,
                backgroundColor: 'rgb(51, 129, 253)',
                marginLeft: 0,
              }}
              className="Progress"
            ></div>
          </div>
        </div>
        <div className="down">
          <div className="noise">
            <div className="header">
              <span>噪音优化</span>
              <div className="icon">
                <SettingOutlined />
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style={{ width: 80, textAlign: 'center' }}></th>
                  <th style={{ width: 80, textAlign: 'center' }}>优化步骤</th>
                  <th style={{ width: 80, textAlign: 'center' }}>预期耗时</th>
                  <th style={{ width: 80, textAlign: 'center' }}>预期效果</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: 80, textAlign: 'center' }}>
                    <input type="checkbox"></input>
                  </td>
                  <td style={{ width: 80, textAlign: 'center' }}>门保护</td>
                  <td style={{ width: 80, textAlign: 'center' }}>1s</td>
                  <td style={{ width: 80, textAlign: 'center' }}> 5</td>
                </tr>
                <tr>
                  <td style={{ width: 80, textAlign: 'center' }}>
                    <input type="checkbox"></input>
                  </td>
                  <td style={{ width: 80, textAlign: 'center' }}>门保护</td>
                  <td style={{ width: 80, textAlign: 'center' }}>1s</td>
                  <td style={{ width: 80, textAlign: 'center' }}> 5</td>
                </tr>
                <tr>
                  <td style={{ width: 80, textAlign: 'center' }}>
                    <input type="checkbox"></input>
                  </td>
                  <td style={{ width: 80, textAlign: 'center' }}>门保护</td>
                  <td style={{ width: 80, textAlign: 'center' }}>1s</td>
                  <td style={{ width: 80, textAlign: 'center' }}> 5</td>
                </tr>
              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
          <div className="hardware">
            <div className="header">
              <span>硬件约束优化</span>
              <div className="icon">
                <SettingOutlined />
              </div>
            </div>
            <table>
              <colgroup span="4" className="columns"></colgroup>
              <tr>
                <th style={{ width: 80, textAlign: 'center' }}></th>
                <th style={{ width: 80, textAlign: 'center' }}>优化步骤</th>
                <th style={{ width: 80, textAlign: 'center' }}>预期耗时</th>
                <th style={{ width: 80, textAlign: 'center' }}>预期效果</th>
              </tr>
              <tr>
                <td style={{ width: 80, textAlign: 'center' }}>
                  <input type="checkbox"></input>
                </td>
                <td style={{ width: 80, textAlign: 'center' }}>门保护</td>
                <td style={{ width: 80, textAlign: 'center' }}>1s</td>
                <td style={{ width: 80, textAlign: 'center' }}> 5</td>
              </tr>
              <tr>
                <td style={{ width: 80, textAlign: 'center' }}>
                  <input type="checkbox"></input>
                </td>
                <td style={{ width: 80, textAlign: 'center' }}>门保护</td>
                <td style={{ width: 80, textAlign: 'center' }}>1s</td>
                <td style={{ width: 80, textAlign: 'center' }}> 5</td>
              </tr>
              <tr>
                <td style={{ width: 80, textAlign: 'center' }}>
                  <input type="checkbox"></input>
                </td>
                <td style={{ width: 80, textAlign: 'center' }}>门保护</td>
                <td style={{ width: 80, textAlign: 'center' }}>1s</td>
                <td style={{ width: 80, textAlign: 'center' }}> 5</td>
              </tr>
            </table>
          </div>
          <div className="efficiency">
            <div className="header">
              <span>执行效率优化</span>
              <div className="icon">
                <SettingOutlined />
              </div>
            </div>
            <table>
              <colgroup span="4" className="columns"></colgroup>
              <tr>
                <th style={{ width: 80, textAlign: 'center' }}></th>
                <th style={{ width: 80, textAlign: 'center' }}>优化步骤</th>
                <th style={{ width: 80, textAlign: 'center' }}>预期耗时</th>
                <th style={{ width: 80, textAlign: 'center' }}>预期效果</th>
              </tr>
              <tr>
                <td style={{ width: 80, textAlign: 'center' }}>
                  <input type="checkbox"></input>
                </td>
                <td style={{ width: 80, textAlign: 'center' }}>门保护</td>
                <td style={{ width: 80, textAlign: 'center' }}>1s</td>
                <td style={{ width: 80, textAlign: 'center' }}> 5</td>
              </tr>
              <tr>
                <td style={{ width: 80, textAlign: 'center' }}>
                  <input type="checkbox"></input>
                </td>
                <td style={{ width: 80, textAlign: 'center' }}>门保护</td>
                <td style={{ width: 80, textAlign: 'center' }}>1s</td>
                <td style={{ width: 80, textAlign: 'center' }}> 5</td>
              </tr>
              <tr>
                <td style={{ width: 80, textAlign: 'center' }}>
                  <input type="checkbox"></input>
                </td>
                <td style={{ width: 80, textAlign: 'center' }}>门保护</td>
                <td style={{ width: 80, textAlign: 'center' }}>1s</td>
                <td style={{ width: 80, textAlign: 'center' }}> 5</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
