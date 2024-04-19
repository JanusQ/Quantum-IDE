import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { saveSvg } from "react-svg-canvas"

function SvgExporter({ svgElement }) {
  const svgString = renderToStaticMarkup(svgElement)

  return (
    <button onClick={() => saveSvg(svgString, "mySvgFile")}>Export SVG</button>
  )
}
