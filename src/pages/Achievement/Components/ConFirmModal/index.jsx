import React from 'react'
import { Modal, Space } from 'antd'
import ChipModal from '../ChipModal'

export default function ConFirmModal({
  confirmModalOpen,
  setConfirmModalOpen,
  confimTitle,
  confirmFunction,
  children,
  setloading,
}) {
  // console.log(children, 'children')

  const confirm = () => {
    confirmFunction()
    // setConfirmModalOpen(false)
  }

  return (
    <Modal
      title={confimTitle}
      width={650}
      open={confirmModalOpen}
      onCancel={() => {
        setConfirmModalOpen(false)
        setloading(false)
      }}
      onOk={confirm}
      footer={null}
    >
      {children}
    </Modal>
  )
}
