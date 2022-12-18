import React, { useState } from "react"
import Circuit from "../../Circuit"
import QCEngine from "../../../../simulator/MyQCEngine"
export default function AnalysisCircuit(props) {
  let gates = []
  let gateError=false
  if (props.analysisData) {
    let newQcEngine = new QCEngine()
    console.log(props.analysisData, 666)
    newQcEngine.import(props.analysisData)
    console.log(newQcEngine.circuit)
    gates = newQcEngine.circuit.gates
  }
  if(props.gateError){
    gateError=props.gateError
  }
  return (
    <div>
      <Circuit isAnalysis={'分析后电路'} predictData={props.predictData} gateError={gateError} gates={gates} />
    </div>
  )
}
