import React from "react";
import { computerD3 } from "../../helpers/computerParamsChart";
import QCEngine from "../../simulator/MyQCEngine";
export default function CircuitDiagram(props) {
  if (props.circuitData) {
      console.log(props.circuitData, 2277);

    let qcAfter = new QCEngine();
    qcAfter.import(props.circuitData);
    console.log(qcAfter.circuit, 555);
    computerD3(qcAfter.circuit, `real_chart_svg`, `real_chart_g`, 1200);
  }
  return (
    <div
      className="task_after_chart"
    >
      <svg id="real_chart_svg">
        <g id="real_chart_g"></g>
      </svg>
    </div>
  );
}
