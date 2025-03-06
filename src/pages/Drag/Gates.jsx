import React, { useState, useEffect } from 'react'
import Cz from './Gate/Cz'
import U3 from './Gate/U3'
import U1 from './Gate/U1'
import U2 from './Gate/U2'
import Rxgate from './Gate/Rxgate'
import Rygate from './Gate/Rygate'
import Rzgate from './Gate/Rzgate'
import H from './Gate/H'
import Ygate from './Gate/Ygate'
import Zgate from './Gate/Zgate'
import Xgate from './Gate/Xgate'
import MeasurGate from './Gate/MeasurGate'
import Cx from './Gate/Cx'
import Cy from './Gate/Cy'
import Crx from './Gate/Crx'
import Cry from './Gate/Cry'
import Crz from './Gate/Crz'
import Cgate from './Gate/Cgate'
import SquareGate from './Gate/SquareGate'
import CustomTowBitGat from './Gate/CustomTowBitGat'

export default function Gates() {
  const [OneBitGateList, setOneBitGateList] = useState([
    {
      name: 'h',
      gate: <H />,
      bit: 1,
    },
    {
      name: 'x',
      gate: <Xgate />,
      bit: 1,
    },
    {
      name: 'y',
      gate: <Ygate />,
      bit: 1,
    },
    {
      name: 'z',
      gate: <Zgate />,
      bit: 1,
    },
    // {
    //   name: 'rx',
    //   gate: <Rxgate />,
    //   bit: 1,
    // },
    // {
    //   name: 'ry',
    //   gate: <Rygate />,
    //   bit: 1,
    // },
    // {
    //   name: 'rz',
    //   gate: <Rzgate />,
    //   bit: 1,
    // },
    // {
    //   name: 'u1',
    //   gate: <U1 />,
    //   bit: 1,
    // },
    // {
    //   name: 'u2',
    //   gate: <U2 />,
    //   bit: 1,
    // },
    // {
    //   name: 'u3',
    //   gate: <U3 />,
    //   bit: 1,
    // },
    {
      name: 'measure',
      gate: <MeasurGate />,
      bit: 1,
    },
  ])
  const [TowBitGateList, setTowBitGateList] = useState([
    {
      name: 'cx',
      gate: <Cx />,
      bit: 2,
    },
    // {
    //   name: 'cy',
    //   gate: <Cy />,
    //   bit: 2,
    // },
    // {
    //   name: 'cz',
    //   gate: <Cz />,
    //   bit: 2,
    // },
    // {
    //   name: 'crx',
    //   gate: <Crx />,
    //   bit: 2,
    // },
    // {
    //   name: 'cry',
    //   gate: <Cry />,
    //   bit: 2,
    // },
    // {
    //   name: 'crz',
    //   gate: <Crz />,
    //   bit: 2,
    // },
  ])

  return { OneBitGateList, TowBitGateList }
}
