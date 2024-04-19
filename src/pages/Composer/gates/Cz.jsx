import React from "react"

export default function cz({ color }) {
  return (
    <circle
      cx="16"
      cy="16"
      r="4"
      fill={color ? color : "rgb(126, 164, 248)"}
    ></circle>
  )
}
