import React from "react"

export default function OtherGate({ name }) {
  function generateRGB(letter) {
    var charCode = letter.charCodeAt(0)
    var r = (charCode * 43) % 256
    var g = (charCode * 67) % 256
    var b = (charCode * 97) % 256

    return "rgb(" + r + ", " + g + ", " + b + ")"
  }
  let color = generateRGB(name)
  return (
    <g>
      <rect y="0" type="h" fill={color} width="32" height="32"></rect>
      <text
        textAnchor="middle"
        alignmentBaseline="middle"
        width="32"
        height="32"
        x="14.21875"
        y="18"
        fill="#ffffff"
      >
        {name}
      </text>
    </g>
  )
}
