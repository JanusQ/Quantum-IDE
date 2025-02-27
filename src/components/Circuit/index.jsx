import React, { useEffect, useState } from 'react'
import Qubit from './components/Qubit'
import { getColorByBaiFenBi } from '@/utils/getColorByBaiFenBi'
import DrawBracket from './components/DrawBracket'
import { lineIndexStore, labelsStroe } from '@/store/line'
import { drawLineChart } from '@/pages/Achievement/Components/JsSimulator/drawLine'
export default function Circuit(props) {
  const [showLine, setShowLine] = useState(null)
  const { updateLineIndex, lineIndex } = lineIndexStore()
  const { labels, updateLabels } = labelsStroe()

  // 框选坐标
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(null)
  const [endX, setEndX] = useState(null)
  const handleMouseDown = (event) => {
    document.removeEventListener('mousedown', handleMouseDown)
    setIsMouseDown(true)
    setStartX(event.clientX)
    setEndX(event.clientX)
  }

  const handleMouseMove = (event) => {
    if (startX !== null && isMouseDown) {
      const currentX = event.clientX

      if (currentX < startX) {
        setEndX(startX)
        setStartX(currentX)
      } else {
        setEndX(currentX)
      }
    }
  }

  const handleMouseUp = (event) => {
    setIsMouseDown(false)
    const xstart =
      Math.ceil((startX - 115) / 40 - 1) < 0
        ? 0
        : Math.ceil((startX - 115) / 40 - 1)
    const xend =
      Math.ceil((endX - 115) / 40 - 1) < 0
        ? 0
        : Math.ceil((endX - 115) / 40 - 1)
    // 添加框选的lables
    if (xend > xstart) {
      props.addLables(xstart, xend)
      if (labels) {
        updateLabels([
          ...labels,
          {
            end_operation: xend,
            start_operation: xstart,
            text: (labels.length - props.labels.length + 1).toString(),
            id: labels.length + 1,
          },
        ])
      } else if (!labels) {
        updateLabels([
          ...props.labels,
          {
            end_operation: xend,
            start_operation: xstart,
            text: '1',
            id: props.labels.length + 1,
          },
        ])
      }
    }
    setEndX(null)
    setStartX(null)
  }

  let svgWidth = '100%'
  let svgHeight = '100%'
  let gateLine = []
  let gates1 = []
  let gateError = false
  let precent = false
  let maxColor = false
  let data = 20
  if (props.gateError) {
    gateError = props.gateError
    maxColor = Math.max(...gateError.flat())
    precent = []
    for (let i = 0; i < 5; i++) {
      precent.push(Math.round(((maxColor * i) / 5) * 10000) / 100)
    }
  }
  if (props.gates?.length > 1) {
    gates1 = props.gates
    svgWidth = gates1[0].length * 40 + 200
    svgHeight = gates1.length * 40 + 50
    if (props.type == 'JsSimulator') {
      drawLineChart(gates1[0].length, svgWidth, props.qcData)
    }
    for (let i = 0; i < gates1.length; i++) {
      for (let j = 0; j < gates1[1].length; j++) {
        if (gates1[i][j]) {
          const operation = gates1[i][j]
          // operation.x = this.operationX(j)
          operation.line = i
          operation.col = j
        }
      }
    }
    // 当父组件传过来一个buggates属性时 把这个数据加到gates里面
    if (props.bugGates?.length) {
      for (let index = 0; index < props.bugGates.length; index++) {
        let i = props.bugGates[index][0]
        let j = props.bugGates[index][1]
        if (gates1[i] && gates1[i][j]) {
          gates1[i][j].bug = true
        }
      }
    }
    // 当父组件传过来一个gateError属性时 把这个数据加到gates里面
    if (gateError) {
      for (let i = 0; i < gates1.length; i++) {
        for (let j = 0; j < gates1[1].length; j++) {
          if (gates1[i][j] && gateError[i]) {
            const operation = gates1[i][j]
            operation.gate_error = gateError[i][j]
          }
        }
      }
    }
    for (let i = 0; i < gates1.length; i++) {
      for (let j = 0; j < gates1[1].length; j++) {
        if (gates1[i][j] && gateError[i]) {
          const operation = gates1[i][j]
          operation.gate_error = gateError[i][j]
        }
      }
    }
    let aaa = gates1.flat()
    let bbb = aaa.filter((item) => item !== null)
    const findDuplicates = (aaa) => {
      const output = []
      Object.values(
        aaa.reduce((res, obj) => {
          let key = obj.id
          res[key] = [...(res[key] || []), { ...obj }]
          return res
        }, {})
      ).forEach((arr) => {
        if (arr.length > 1) {
          output.push(...arr)
        }
      })
      return output
    }
    const ccc = findDuplicates(bbb)
    ccc.forEach((item) => {
      gates1[item.line][item.col].isManyQubit = true
    })
    const arrayTwo = Object.values(
      ccc.reduce((res, item) => {
        res[item.id] ? res[item.id].push(item) : (res[item.id] = [item])
        return res
      }, {})
    )
    let connectorMaxgate = []
    arrayTwo.forEach((item) => {
      let max = item[0]
      for (var i = 1; i < item.length; i++) {
        let cur = item[i]
        // cur > max ? (max = cur) : null
        if (cur.connector > max.connector) {
          max = cur
        }
      }
      connectorMaxgate.push(max)
      // console.log(max, 9999)
    })
    // console.log(connectorMaxgate, 999)

    connectorMaxgate.forEach((item) => {
      // console.log(item.col,item.line);
      gates1[item.line][item.col].isConnector = true
    })
    // console.log(gates1,'成功了吗');
    // // console.log(arrayTwo,888)
    // console.log(ccc, 66)
    var map = {}
    // var gateLine = []
    for (var i = 0; i < ccc.length; i++) {
      var ai = ccc[i]
      if (!map[ai.id]) {
        let lineColor = 'rgb(0, 45, 156)'
        if (ai.gate_error !== undefined) {
          // 计算渐变色
          lineColor = getColorByBaiFenBi(ai.gate_error / maxColor)
        }
        gateLine.push({
          id: ai.id,
          col: ai.col,
          name: ai.name,
          options: ai.options,
          x: ai.x,
          lineArr: [{ line: ai.line }],
          lineColor,
        })
        map[ai.id] = ai.id
      } else {
        for (var j = 0; j < gateLine.length; j++) {
          var dj = gateLine[j]
          if (dj.id == ai.id) {
            dj.lineArr.push({ line: ai.line })
            break
          }
        }
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', userSelect: 'none' }}>
      <svg
        style={{}}
        width={svgWidth}
        height={svgHeight}
        // width={svgWidth > 1100 ? svgWidth : 1100}
        // height={svgHeight > 100 ? svgHeight : 100}
        // onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseMove}
        // onMouseUp={handleMouseUp}
      >
        {/* <rect
          stroke="#C4C4C4"
          width={'100%'}
          height={'100%'}
          fill="transparent"
        ></rect> */}
        {/* 渐变块 */}
        {/* <text fill="rgb(0, 45, 156)" x='100' y='15'>{props.isAnalysis}</text> */}
        {precent
          ? precent.map((item, index) => (
              <text x="34" key={index} y={200 - index * 37}>
                {item}%
              </text>
            ))
          : ''}
        {precent ? (
          <foreignObject x="2" y="40" width="32" height="160">
            <div
              style={{
                width: 30,
                height: 160,
                backgroundImage:
                  'linear-gradient(to top, rgba(126, 191, 236),rgba(254, 236, 218), rgba(237, 97, 69))',
              }}
            ></div>
          </foreignObject>
        ) : (
          ''
        )}
        {gateError ? (
          <text x="10" y="25">
            predict:{Math.round(props.predictData * 100) / 100 || ''}
          </text>
        ) : (
          ''
        )}
        {/* 框选块 */}
        <rect
          x={startX}
          y={30}
          width={Math.abs(endX - startX)}
          height={gates1.length * 40}
          fill="rgb(214, 214, 214)"
        />
        <g transform="translate(20)">
          {/* 括号 */}
          <DrawBracket
            name2index={props.name2index}
            labels={props.labels || []}
            gates={gates1}
          />
          {gates1.map((qubit, index) => (
            <g
              key={index}
              transform={`translate(60,${20 + index * 40 ? index * 40 : 0})`}
            >
              <line
                className="qubit"
                strokeWidth="2"
                x1="30"
                y1="40"
                x2={
                  qubit.length * 40 + 100 > 1060 ? qubit.length * 40 + 50 : 1060
                }
                y2="40"
                data-dis="0"
                stroke="#C4C4C4"
              ></line>
            </g>
          ))}

          {gateLine.map((item, index) => (
            <g key={index}>
              <line
                x1={16 + 40 * item.col + 95}
                y1={item.lineArr[0].line * 40 + 40}
                x2={16 + 40 * item.col + 95}
                y2={item.lineArr[item.lineArr.length - 1].line * 40 + 40}
                strokeWidth="1.25"
                stroke={item.lineColor}
              ></line>
            </g>
          ))}
          {gates1.map((qubit, index) => (
            <Qubit
              maxColor={maxColor}
              key={index}
              index={index}
              gates={qubit}
            ></Qubit>
          ))}
          {gates1[0]?.map((item, index) => (
            <g key={index}>
              <line
                onMouseEnter={() => setShowLine(index)}
                onClick={() => updateLineIndex(index)}
                x1={index * 40 + 50 + 80}
                y1={40}
                strokeWidth="20"
                x2={index * 40 + 50 + 80}
                y2={gates1.length * 40}
                stroke="blue"
                opacity={0}
                cursor="pointer"
              ></line>
              {showLine == index ? (
                <line
                  x1={index * 40 + 50 + 80}
                  y1={40}
                  stroke="#C4C4C4"
                  strokeWidth="1.25"
                  x2={index * 40 + 50 + 80}
                  y2={gates1.length * 40}
                ></line>
              ) : (
                ''
              )}
              {index == lineIndex ? (
                <g>
                  <line
                    x1={index * 40 + 50 + 80}
                    y1={40}
                    stroke="#C4C4C4"
                    strokeWidth="1.25"
                    x2={index * 40 + 50 + 80}
                    y2={gates1.length * 40}
                  ></line>
                  <g
                    transform={`translate(${index * 40 + 50 + 80 - 4},${
                      gates1.length * 40
                    })`}
                  >
                    <path
                      d="M 0 0 L 8 0 L 4 6.928203230275509 Z"
                      stroke="#C4C4C4"
                      fill="#C4C4C4"
                      transform="rotate(180 4 3.4641)"
                    />
                  </g>
                  <g
                    transform={`translate(${index * 40 + 50 + 80 - 4},${
                      40 - 6
                    })`}
                  >
                    <path
                      d="M 0 0 L 8 0 L 4 6.928203230275509 Z"
                      stroke="#C4C4C4"
                      fill="#C4C4C4"
                    />
                  </g>
                </g>
              ) : (
                ''
              )}
            </g>
          ))}
        </g>
      </svg>
      {props.gates ? (
        <div className="line_chart_div">
          <svg id="line_chart_svg">
            <g id="lineChart_graph"></g>
          </svg>
        </div>
      ) : null}
    </div>
  )
}
