import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import './index.scss'
import GetComputerList from '../../Hooks/GetComputerList'
import GraphEcharts from '../GraphEcharts'
export default function ChipModal({ title }) {
  const { computerList, computersGraph } = GetComputerList()
  const [shipModalOpen, setShipModalOpen] = useState(false)
  return (
    <div>
      <Button onClick={() => setShipModalOpen(true)}>{title}</Button>
      <Modal
        width={650}
        open={shipModalOpen}
        onCancel={() => {
          setShipModalOpen(false)
        }}
        footer={null}
      >
        <div className="ChipModal_Content">
          <GraphEcharts
            linksData={computersGraph.GraphLinksList}
            data={computersGraph.GraphNodeList}
          />
        </div>
      </Modal>
    </div>
  )
}
