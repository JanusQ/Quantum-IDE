import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import CGate from './Gate/CGate'
import HGate from './Gate/HGate'
import NcphaseGate from './Gate/NcphaseGate'
import RxGate from './Gate/RxGate'
import RzGate from './Gate/RzGate'
import SwapGate from './Gate/SwapGate'
import XGate from './Gate/XGate'
import RyGate from './Gate/RyGate'
import Cu1Gate from './Gate/Cu1Gate'
import { Popover } from 'antd'

export default function Gate(props) {
  // console.log(props, 'gate')
  let gate1 = ''
  const G = useRef()
  useEffect(() => {
    d3.select(G.current).attr(
      'transform',
      `translate(${props.x ? props.x + props.index * 40 : 0}, ${
        props.y ? props.y : 0
      })`
    )
  })

  if (props.gate !== null) {
    // console.log(props.gate)
    gate1 = props.gate
    var content = (
      <div>
        <p>{gate1.name}</p>
      </div>
    )
  }

  return (
    <>
      <Popover content={content}>
        <g className="gate" ref={G}>
        {(() => {
            switch (gate1.name) {
              case 'h':
                return <HGate />
              case 'rx':
                return <RxGate />
              case 'ry':
                return <RyGate />
              case 'cx':
                if (gate1.isConnector) return <XGate />
                return <CGate />
              case 'cxx':
                if (gate1.isConnector) return <XGate />
                return <CGate />
              case 'x':
                return <XGate />
              case 'rz':
                return <RzGate />
              case 'crx':
                if (gate1.isConnector) return <RxGate />
                return <CGate />
              case 'swap':
                return <SwapGate />
              case 'crz':
                if (gate1.isConnector) return <RzGate />
                return <CGate />
              case 'cry':
                if (gate1.isConnector) return <RyGate />
                return <CGate />
              case 'ncphase':
                if (gate1.isConnector) return <NcphaseGate />
                return <NcphaseGate />
              case 'ncnot':
                if (gate1.isConnector) return <XGate />
                return <CGate />
              case 'cu1':
                if (gate1.isConnector) return <Cu1Gate />
                return <CGate />
              case 'cz':
                return <CGate />
              default:
                return null
            }
          })()}
        </g>
      </Popover>
    </>
  )
}
