import React, { useContext } from 'react'
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
import CircleGate from './Gate/CircleGate'
import SquareGate from './Gate/SquareGate'
import * as d3 from 'd3'
import { delGateDataContext } from './context'

export default function Y({ gate, x, y }) {
  const { handleAddGate, handleDeleteGate } = useContext(delGateDataContext)
  let drag = false

  const dragUpGate = (e) => {
    //  selGate(x, gate)
    e.stopPropagation()
    if (e.button == 2) return
    drag = true
    const dragEleWidth = 32
    let dragEleHeight = 32
    let lineHeight = 0
    if (gate.qubits.length > 1) {
      dragEleHeight =
        (gate.qubits[gate.qubits.length - 1] - gate.qubits[0] + 1) * 40
      lineHeight = (gate.qubits[gate.qubits.length - 1] - gate.qubits[0]) * 40
    }
    let svg = d3
      .select('body')
      .append('svg')
      .attr('width', dragEleWidth)
      .attr('height', dragEleHeight)
      .attr('id', 'movesvg')
    // const svg = d3.select("svg")

    let g = svg.append('g')
    // 创建rect元素，并设置其属性
    switch (gate?.qubits.length) {
      case 2:
        let line = g.append('line')
        line
          .attr('x1', 16)
          .attr('x2', 16)
          .attr('y1', 16)
          .attr('y2', lineHeight + 16)
          .attr('stroke', 'rgb(0, 45, 156)')
          .attr('stroke-width', 2)
        for (let index = 0; index < gate?.qubits.length; index++) {
          let cy =
            16 +
            (gate.qubits[gate.qubits.length - 1] - gate.qubits[0]) * 40 * index

          if (index == 0) {
            let circle = g.append('circle')
            circle
              .attr('cx', 16)
              .attr('cy', cy)
              .attr('r', 4)
              .attr('fill', 'rgb(0, 45, 156)')
          } else {
            let circle1 = g.append('circle')
            circle1
              .attr('cx', 16)
              .attr('cy', cy)
              .attr('r', 16)
              .attr('fill', 'rgb(0, 45, 156)')
            let text
            if (gate.name.length === 3) {
              text = gate.name.substring(1).toUpperCase()
            } else {
              text = gate.name.toUpperCase()
            }
            g.append('text')
              .attr('x', 8)
              .attr('y', cy + 5)
              .attr('fill', '#ffffff')
              .attr('stroke', 'transparent')
              .text(text)
          }
        }

        break
      case 1:
        if (gate.name == 'x' || gate.name == 'y' || gate.name == 'z') {
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(0, 45, 160)')
        }
        if (
          gate.name == 'rx' ||
          gate.name == 'ry' ||
          gate.name == 'u1' ||
          gate.name == 'u2' ||
          gate.name == 'u3'
        ) {
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(159, 24, 83)')
        }
        if (gate.name == 'rz') {
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(51, 177, 255)')
        }
        if (gate.name == 'h') {
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(250, 77, 86)')
        }
        g.append('text')
          .attr('x', 8)
          .attr('y', 21.5)
          .attr('fill', '#ffffff')
          .text(gate.name.toUpperCase())
        if (gate.name == 'measure') {
          let d =
            'M25.2941 11.584H22.7981L25.2301 8.008V7H21.6141V8H23.9101L21.4861 11.576V12.584H25.2941V11.584ZM15.5662 23.4664C15.5662 24.0836 15.0658 24.584 14.4485 24.584C13.8313 24.584 13.3309 24.0836 13.3309 23.4664C13.3309 22.8621 13.8104 22.3699 14.4096 22.3494L17.1775 17.9208C16.3359 17.5757 15.4144 17.3855 14.4485 17.3855C10.4729 17.3855 7.25 20.6084 7.25 24.584H6C6 19.918 9.78254 16.1355 14.4485 16.1355C15.658 16.1355 16.8081 16.3896 17.8483 16.8474L19.5068 14.1939L20.5668 14.8564L18.9545 17.4361C21.3236 18.9327 22.8971 21.5746 22.8971 24.584H21.6471C21.6471 22.0216 20.3082 19.7719 18.2919 18.4962L15.4698 23.0116C15.5317 23.1505 15.5662 23.3044 15.5662 23.4664Z'
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(168, 168, 168)')

          g.append('path').attr('d', d).attr('fill', '#000')
        }
        if (
          gate.name !== 'h' &&
          gate.name !== 'x' &&
          gate.name !== 'y' &&
          gate.name !== 'z' &&
          gate.name !== 'rx' &&
          gate.name !== 'ry' &&
          gate.name !== 'rz' &&
          gate.name !== 'u1' &&
          gate.name !== 'u2' &&
          gate.name !== 'u3' &&
          gate.name !== 'measure'
        ) {
          g.append('rect')
            .attr('width', dragEleWidth)
            .attr('height', dragEleHeight)
            .style('fill', 'rgb(0, 45, 160)')
          g.append('text')
            .attr('x', 8)
            .attr('y', 21.5)
            .attr('fill', '#ffffff')
            .text(gate.name.toUpperCase())
        }
        break
      default:
        break
    }
    const svgNS = svg.node().namespaceURI
    svg.node().setAttributeNS(null, 'style', 'position: fixed')
    svg.node().style.display = 'none'
    document.addEventListener('mousemove', function (e) {
      svg.node().style.cursor = 'grabbing'
      svg.node().style.left = `${e.clientX - 16}px`
      svg.node().style.top = `${e.clientY - 16}px`
      svg.node().style.display = 'block'
      if (!drag) {
        svg.remove()
      }
    })
    svg.node().addEventListener('mouseup', function (e) {
      let mysvg = document.getElementById('mycircuitsvg')
      const mousex = e.clientX - mysvg.getBoundingClientRect().left
      const mousey = e.clientY - mysvg.getBoundingClientRect().top
      const x =
        Math.ceil((mousex - 131) / 48 - 1) < 0
          ? 0
          : Math.ceil((mousex - 130) / 48 - 1)
      const y =
        Math.ceil((mousey + 20) / 40 - 3) < 0
          ? 0
          : Math.ceil((mousey + 20) / 40 - 3)
      drag = false
      handleDeleteGate(gate.id)
      if (gate.qubits.length == 1) {
        handleAddGate(gate.name, x, y)
      }
      if (gate.qubits.length == 2) {
        handleAddGate(gate.name, x, [y, gate.qubits[1] - gate.qubits[0] + y])
      }
      //  delGate(delx, gate)
      //  dragChangeGate(x, y, gate)
      //  selGate(x, null)
    })
  }
  const onMouseLeave = () => {
    if (!drag) {
      d3.select('#removesvg').remove()
    }
  }
  return (
    <g
      style={{ cursor: 'grab' }}
      onMouseDown={dragUpGate}
      onMouseLeave={onMouseLeave}
    >
      {gate.qubits.length > 1 && (
        <line
          strokeWidth="2"
          stroke="rgb(0, 45, 156)"
          x1={16}
          x2={16}
          y1={gate.qubits[0] * 40 + 40}
          y2={gate.qubits[1] * 40 + 40}
        ></line>
      )}
      {gate &&
        gate.qubits.map((qubits, index) => (
          <g transform={`translate(0,${qubits * 40 + 24})`} key={index}>
            {(() => {
              switch (gate?.name) {
                case 'h':
                  return <H />
                case 'x':
                  return <Xgate />
                case 'y':
                  return <Ygate />
                case 'x':
                  return <Xgate />
                case 'z':
                  return <Zgate />
                case 'rx':
                  return <Zgate />
                case 'z':
                  return <Rxgate />
                case 'ry':
                  return <Rygate />
                case 'rz':
                  return <Rzgate />
                case 'u1':
                  return <U1 />
                case 'u2':
                  return <U2 />
                case 'u3':
                  return <U3 />
                case 'cx':
                  if (gate.qubits.length == index + 1) return <Xgate />
                  return <Cgate />
                case 'cy':
                  if (gate.qubits.length == index + 1) return <Ygate />
                  return <Cgate />
                case 'cx':
                  if (gate.qubits.length == index + 1) return <Xgate />
                  return <Cgate />
                case 'measure':
                  return <MeasurGate />
                // default:
                //   return <SquareGate name={gate?.name} />
              }
            })()}
          </g>
        ))}
    </g>
  )
}
