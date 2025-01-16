import React from 'react'
import { Modal, Space } from 'antd'

export default function ChipEditMddal({
  chipEditMddalOpen,
  setChipEditMddalOpen,
}) {
  const confirm = () => {
    setChipEditMddalOpen(false)
  }

  return (
    <Modal
      title={'编辑'}
      width={650}
      open={chipEditMddalOpen}
      onCancel={() => {
        setChipEditMddalOpen(false)
      }}
      onOk={confirm}
      // footer={null}
    ></Modal>
  )
}
