import React from "react";

export default function NcphaseGate() {
  return (
    <g>
      <circle
        cx="16"
        cy="16"
        r="14"
        // fill="rgb(0, 45, 156)"
        strokeWidth="2"
        stroke="rgb(0, 45, 156)"
        paintOrder="stroke"
      ></circle>
      <circle
        cx="16"
        cy="16"
        r="4"
        // fill="rgb(0, 45, 156)"
        strokeWidth="2"
        stroke=" #fff"
        paintOrder="stroke"
      ></circle>
      <line
        x1="24"
        y1="8"
        x2="8"
        y2="24"
        strokeWidth="1.25"
        stroke="#fff"
      ></line>
    </g>
  );
}
