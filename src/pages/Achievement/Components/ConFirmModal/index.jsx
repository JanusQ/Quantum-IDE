import React from 'react'
import { Modal, Space } from 'antd'
import ChipModal from '../ChipModal'

export default function ConFirmModal({
  confirmModalOpen,
  setConfirmModalOpen,
  confimTitle,
  confirmFunction,
}) {
  const confirm = () => {
    confirmFunction()
    setConfirmModalOpen(false)
  }

  return (
    <Modal
      title={confimTitle}
      width={650}
      open={confirmModalOpen}
      onCancel={() => {
        setConfirmModalOpen(false)
      }}
      onOk={confirm}
      // footer={null}
    >
      <div className="content" style={{ padding: 20 }}>
        <Space>
          <ChipModal title={'模型校准'} />
          <ChipModal title={'模型保真'} />
        </Space>
      </div>
      确认{confimTitle}？
    </Modal>
  )
}
