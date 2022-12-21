import React, { useState } from "react"
import Circuit from "../../Circuit"
import QCEngine from "../../../../simulator/MyQCEngine"
export default function AnalysisCircuit(props) {
  let gates = []
  let gateError = false
  if (props.analysisData) {
    let newQcEngine = new QCEngine()
    newQcEngine.import(props.analysisData)
    gates = newQcEngine.circuit.gates
  }
  if (props.gateError) {
    gateError = props.gateError
  }
  return (
    <div className="circuitDiv">
      <Circuit
        isAnalysis={"编译后电路"}
        predictData={props.predictData}
        gateError={gateError}
        gates={gates}
      />
    </div>
  )
}
