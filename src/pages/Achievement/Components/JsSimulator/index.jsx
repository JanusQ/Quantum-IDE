import React, { useState } from 'react'
import Circuit from '@/components/Circuit'
import styles from './index.module.scss'
import Ccomponent from './components/Ccomponent/Ccomponent'
import Dcomponent from './components/Dcomponent/Dcomponent'
export default function JsSimulator({ qcData }) {
  const [labelObj, setlabelObj] = useState(null)
  let qc = qcData
  let name2index
  if (qcData?.name2index) {
    name2index = Object.entries(qcData?.name2index)?.map(
      ([name, [firstValue, secondValue]]) => ({
        name,
        value: [firstValue, secondValue],
      })
    )
  }
  const addLables = (x, y) => {
    const label = qcData.createlabel(x, y + 1)
    console.log(label, 'label')

    setlabelObj(label)
    // console.log(qcData, 'qcData')
  }
  // console.log(name2index)
  return (
    <div className={styles.root}>
      <div className="JsSimulator_top">
        <Circuit
          type={'JsSimulator'}
          gates={qcData?.circuit?.gates}
          qcData={qcData}
          name2index={name2index}
          labels={qcData?.labels}
          addLables={addLables}
        />
      </div>
      <div className="JsSimulator_down">
        <Dcomponent qc={qcData} labelObj={labelObj} />
        <Ccomponent qc={qcData} />
      </div>
    </div>
  )
}
