import React, { useEffect, useState } from "react"
import Circuit from "../../Circuit"
export default function NormalCircuit(props) {
  return (
    <div className="circuitDiv">
      <Circuit
        isAnalysis={"编译前电路"}
        bugGates={props.bugGates}
        gates={props.normalGates}
      />
    </div>
  )
}
