import React, { useState, useEffect } from 'react'
import { getChipDetail } from '@/api/chip'

export default function GetChipDetailGraph(chipId) {
  const [graphNodeList, setGraphNodeList] = useState([])
  const [graphLinks, setGraphLinks] = useState([])
  const getChipDetailGraphData = async () => {
    const { data } = await getChipDetail({ chip_id: chipId })
    const nodes = []
    const cols = 5
    const cellSize = 80
    for (let i = 0; i < data.details.length; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      // 删除data.details[i].id
      data.details[i].qubitid = data.details[i].id
      delete data.details[i].id
      nodes.push({
        name: `q${i + 1}`,

        ...data.details[i],

        x: col * cellSize + cellSize / 2, // 水平居中
        y: row * cellSize + cellSize / 2, // 垂直居中,
        color: '#003f88',
      })
    }
    let coupler = data.coupler.map((item) => ({
      ...item,
      links: [],
    }))
    for (let i = 0; i < coupler.length; i++) {
      for (let j = 0; j < data.details.length; j++) {
        if (
          coupler[i].qubit1_id === data.details[j].qubitid ||
          coupler[i].qubit2_id === data.details[j].qubitid
        ) {
          coupler[i].links.push(`q${j + 1}`)
        }
        // const element = array[j]
      }
    }
    let links = []
    for (let i = 0; i < coupler.length; i++) {
      links.push({
        source: coupler[i].links[0],
        target: coupler[i].links[1],
        coupler_id: coupler[i].id,
        selfDefine: `${coupler[i].links[0]}>${coupler[i].links[1]}`,

        color: 'red',
      })
    }
    setGraphLinks(links)

    setGraphNodeList(nodes)
  }
  useEffect(() => {
    if (!chipId) return
    getChipDetailGraphData()
  }, [chipId])
  return { graphNodeList, graphLinks, getChipDetailGraphData }
}
