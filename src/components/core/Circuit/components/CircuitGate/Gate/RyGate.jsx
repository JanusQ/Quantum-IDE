import React from "react";

export default function RyGate() {
  return (
    <g>
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="rgb(0, 45, 156)"
        strokeWidth="2"
        stroke="rgb(0, 45, 156)"
        paintOrder="stroke"
      ></circle>
      <g>
        <path
          fill="#FFFFFF"
          d="M20.1,17.1L17,10.9h1.4l1.3,2.9c0.3,0.8,0.6,1.5,1,2.2h0.1c0.4-0.8,0.7-1.5,1-2.2l1.3-2.9h1.3l-3.1,6.3v4h-1.3V17.1z"
        ></path>
      </g>
      <g>
        <path
          fill="#FFFFFF"
          d="M15.2,21.1l-2.5-4.4h-1.8v4.4H9.5V10.9h3.2c2.1,0,3.6,0.7,3.6,2.9c0,1.6-0.9,2.5-2.3,2.9l2.6,4.5H15.2zM10.8,15.7h1.7c1.6,0,2.5-0.6,2.5-2c0-1.4-0.9-1.8-2.5-1.8h-1.7V15.7z"
        ></path>
      </g>
    </g>
  );
}
