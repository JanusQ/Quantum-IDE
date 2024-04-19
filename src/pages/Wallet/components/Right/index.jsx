import React from "react"

export default function Right({ title, children }) {
  return (
    <div className="pay_bcoin_index_wp">
      <div className="pay_bcoin_index_title">{title}</div>
      <div className="pay_bcoin_index_content">{children}</div>
    </div>
  )
}
