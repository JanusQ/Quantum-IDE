import React, { useState, useEffect } from 'react'
import { getComList, getComDetil } from '@/api/computer'

export default function GetComputerList() {
  const [computersGraph, setComputersGraph] = useState({})
  const [computerList, setComputerList] = useState([])
  const getComListFn = async () => {
    const formData = new FormData()
    const obj = {
      update_code: 0,
    }
    // if (searchValue) {
    //   obj.com_name = searchValue
    // }
    formData.append('filter', JSON.stringify(obj))
    const { data } = await getComList(formData)
    setComputerList(data.com_list)
    for (let i = 0; i < data.com_list.length; i++) {
      const element = data.com_list[i]
      delComputerGraphData(element.chip_id)
    }
  }
  // 处理成graph数据格式
  const delComputerGraphData = async (chip_id) => {
    const formData = new FormData()
    formData.append('chip_id', chip_id)
    const { data } = await getComDetil(formData)
    const { qubits, couplers } = data.computer
    const validQubits = data.computer.valid_qubits

    const GraphNodeList = []
    const GraphLinksList = []
    const arr = []
    const arr1 = []
    const arr3 = []
    for (const key in qubits) {
      arr3.push(qubits[key])
      if (qubits[key].err !== null) {
        arr.push({
          name: key,
          value: qubits[key].err,
        })
      }
      GraphNodeList.push({
        color: validQubits.includes(qubits[key].bit_name)
          ? '#003f88'
          : '#f5f5f5',
        name: qubits[key].bit_name,
        x: qubits[key].position_x,
        y: qubits[key].position_y,
        T1: qubits[key].T1,
        T2: qubits[key].T2,
      })
    }
    for (const key in couplers) {
      if (couplers[key].err !== null) {
        arr1.push({
          name: `${couplers[key].qubit1_name},${couplers[key].qubit2_name}`,
          value: couplers[key].err,
        })
      }
      GraphLinksList.push({
        color: 'red',
        source: couplers[key].qubit1_name,
        target: couplers[key].qubit2_name,
        selfDefine: couplers[key].coupler_name,
        label: {
          show: true,
          fontSize: 12,
          padding: [0, 0, 4, 0],
          formatter: (obj) => {
            return `${obj.data.selfDefine}`
          },
        },
      })
    }
    setComputersGraph({
      GraphNodeList,
      GraphLinksList,
    })
  }
  useEffect(() => {
    getComListFn()
  }, [])
  return {
    computersGraph,
    computerList,
  }
}
