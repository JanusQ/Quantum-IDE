import React, { useRef, useEffect } from 'react'
import Gate from '../CircuitGate'
import * as d3 from 'd3'
export default function Qubit(props) {
  const line = useRef()
  const lineStyle = d3.select(line.current).style('stroke-width', 1)
  return (
    <>
      <g
        transform={`translate(60,${
          20 + props.index * 40 ? props.index * 40 : 0
        })`}
        width={200}
        height={200}
      >
        <g transform="translate(-14,4)">
          <text
            x="38.4"
            y="36"
            dy=".3em"
            fill="rgb(111, 111, 111)"
            fontWeight="400"
            textAnchor="end"
            fontSize='14px'
           
          >
            <tspan>q[{props.index}]</tspan>
          </text>
        </g>
      </g>
      <g>
        {props.gates.map((gate, index) => (
          <Gate
            index={index}
            x={95}
            y={25 + props.index * 40}
            key={index}
            gate={gate}
          ></Gate>
        ))}
      </g>
    </>
  )
}
