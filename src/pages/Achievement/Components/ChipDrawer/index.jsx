import React, { useState } from 'react'
import { Drawer, Button, Space } from 'antd'
import './index.scss'
import GetComputerList from '../../Hooks/GetComputerList'
import GraphEcharts from '../GraphEcharts'
import { GatewayOutlined } from '@ant-design/icons'
import ChipEditMddal from '../ChipEditMddal'

export default function ChipDrawer({ drawerOpen, setdrawerOpen }) {
  const { computerList, computersGraph } = GetComputerList()
  const [chipEditMddalOpen, setChipEditMddalOpen] = useState(false)
  const [title, setTitle] = useState('')
  // 点击的节点数据
  const [selectNodeData, setSelectNodeData] = useState({})
  return (
    <div>
      <Button
        icon={<GatewayOutlined />}
        type="link"
        onClick={() => setdrawerOpen(true)}
      >
        拓扑图
      </Button>
      <Drawer
        width={650}
        open={drawerOpen}
        onClose={() => {
          setdrawerOpen(false)
        }}
        footer={null}
      >
        <div
          style={{
            height: 650,
            width: 650,
          }}
          className="ChipModal_Content"
        >
          <Button
            onClick={() => {
              setChipEditMddalOpen(true)
              setTitle('新增')
            }}
          >
            新增
          </Button>
          <GraphEcharts
            setTitle={setTitle}
            linksData={computersGraph.GraphLinksList}
            data={computersGraph.GraphNodeList}
            chipEditMddalOpen={chipEditMddalOpen}
            setChipEditMddalOpen={setChipEditMddalOpen}
            setSelectNodeData={setSelectNodeData}
          />
          <Space size={20}>
            <Button>校准模型</Button>
            <Button>保真模型</Button>
          </Space>
        </div>
      </Drawer>
      <ChipEditMddal
        setSelectNodeData={setSelectNodeData}
        selectNodeData={selectNodeData}
        title={title}
        chipEditMddalOpen={chipEditMddalOpen}
        setChipEditMddalOpen={setChipEditMddalOpen}
      />
    </div>
  )
}
