import React from "react"

export default function SimpleGate({ color }) {
  return (
    <circle
      cx="16"
      cy="16"
      r="4"
      fill={color ? color : "rgb(126, 164, 248)"}
      stroke="black"
      strokeWidth="1"
    ></circle>
  )
}
