import React, { useEffect } from "react"
import { computerD3 } from "@/helpers/computerParamsChart"
import QCEngine from "@/simulator/MyQCEngine"
export default function CircuitDiagram(props) {
  useEffect(() => {
    const qcAfter = new QCEngine()
    qcAfter.import(props.circuitData)
    computerD3(
      qcAfter.circuit,
      `real_chart_svg${props.svgIndex}`,
      `real_chart_g${props.svgIndex}`
    )
  }, [props.circuitData, props.svgIndex])

  return (
    <div className="task_number_div">
      <div className="task_number_title">{`编译后子电路${
        props.svgIndex + 1
      }`}</div>
      <div className="task_after_chart">
        <svg id={`real_chart_svg${props.svgIndex}`}>
          <g id={`real_chart_g${props.svgIndex}`}></g>
        </svg>
      </div>
    </div>
  )
}
