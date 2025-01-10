import React from 'react'
import Bracket from '../Bracket'
import RowBracket from '../RowBracket'
export default function DrawBracket({ name2index, labels, gates }) {
  return (
    <g>
      {name2index?.map((item, index) => (
        <g key={index} transform="translate(20)">
          <Bracket value={item.value} name={item.name} item={item} />
        </g>
      ))}
      {labels?.map((item, index) => (
        <g key={index}>
          <RowBracket item={item} key={index} gates={gates} />
        </g>
      ))}
    </g>
  )
}
