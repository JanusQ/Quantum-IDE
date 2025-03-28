import React, { useState } from 'react'
import { Drawer, Button, Space } from 'antd'
import './index.scss'
import GetComputerList from '../../Hooks/GetComputerList'
import GraphEcharts from '../GraphEcharts'
import { GatewayOutlined } from '@ant-design/icons'
import ChipEditMddal from '../ChipEditMddal'
import GetChipDetailGraph from '../../Hooks/GetChipDetailGraph'
import AddCouplerModal from '@/components/AddCouplerModal'

export default function ChipDrawer({ drawerOpen, setdrawerOpen, chipId }) {
  const { graphNodeList, graphLinks, getChipDetailGraphData } =
    GetChipDetailGraph(chipId)
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
          <AddCouplerModal
            getChipDetailGraphData={getChipDetailGraphData}
            chipId={chipId}
            graphNodeList={graphNodeList}
          />
          <GraphEcharts
            drawerOpen={drawerOpen}
            setTitle={setTitle}
            linksData={graphLinks}
            data={graphNodeList}
            chipEditMddalOpen={chipEditMddalOpen}
            setChipEditMddalOpen={setChipEditMddalOpen}
            setSelectNodeData={setSelectNodeData}
            getChipDetailGraphData={getChipDetailGraphData}
          />
        </div>
      </Drawer>
      <ChipEditMddal
        n_qubits={graphNodeList.length}
        chipId={chipId}
        setSelectNodeData={setSelectNodeData}
        selectNodeData={selectNodeData}
        title={title}
        chipEditMddalOpen={chipEditMddalOpen}
        setChipEditMddalOpen={setChipEditMddalOpen}
        getChipDetailGraphData={getChipDetailGraphData}
      />
    </div>
  )
}
