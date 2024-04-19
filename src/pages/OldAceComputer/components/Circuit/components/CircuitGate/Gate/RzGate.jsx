import React from "react";

export default function RzGate() {
  return (
    <g>
      <g>
        <circle
          cx="16"
          cy="16"
          r="14"
          // fill="rgb(0, 45, 156)"
          // strokeWidth="2"
          // stroke="rgb(0, 45, 156)"
          paintOrder="stroke"
        ></circle>

        <text
          x="16"
          y="16"
          dy=".3em"
          fontSize="14"
          fontWeight="400"
          textAnchor="middle"
          fill="rgb(255, 255, 255)"
        >
          RZ
        </text>
      </g>
    </g>
  );
}
