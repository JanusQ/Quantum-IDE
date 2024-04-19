import React from "react"
import styles from "./index.module.scss"

export default function RealeCircuit() {
  return (
    <div className={styles.root}>
      <div className="realeCircuit">
        <div className="chart"></div>
        <div className="beforcompile"></div>
        <div className="aftercompile"></div>
      </div>
    </div>
  )
}
