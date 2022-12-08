import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import CGate from "./Gate/CGate";
import HGate from "./Gate/HGate";
import NcphaseGate from "./Gate/NcphaseGate";
import RxGate from "./Gate/RxGate";
import RzGate from "./Gate/RzGate";
import SwapGate from "./Gate/SwapGate";
import XGate from "./Gate/XGate";
import RyGate from "./Gate/RyGate";
import Cu1Gate from "./Gate/Cu1Gate";
import { Popover } from "antd";

export default function Gate(props) {
  // console.log(props, 'gate')
  let gate1 = "";
  let rgb = "rgb(0, 45, 156)";
  const G = useRef();
  useEffect(() => {
    d3.select(G.current).attr(
      "transform",
      `translate(${props.x ? props.x + props.index * 40 : 0}, ${
        props.y ? props.y : 0
      })`
    );
  });
  // 计算渐变颜色
  // 127, 191, 236b
  // 237, 99, 71r
  const getColorByBaiFenBi = (bili, range) => {
    // console.log(bili,'bill');
    let r = 0;
    let g = 0;
    let b = 0;
    if (bili < 0.5) {
      r = 94 * bili + 125;
      g = 38 * bili + 190;
      b = 236 - bili * 9;
    }

    if (bili >= 0.5) {
      r = 254 - bili * 17;
      g = 234 - bili * 137;
      b = 215 - bili * 146;
    }
    r = parseInt(r); // 取整
    g = parseInt(g); // 取整
    b = parseInt(b); // 取整
    return "rgb(" + r + "," + g + "," + b + ")";
  };
  if (props.gate !== null) {
    gate1 = props.gate;
    let changeColor = gate1.gate_error / props.maxColor;

    rgb = getColorByBaiFenBi(changeColor);

    var content = (
      <div>
        <p>name:{gate1.name}</p>
        <p>gate_error:{Math.round(gate1.gate_error * 10000) / 100}%</p>
      </div>
    );
  }

  return (
    <>
      <Popover content={content}>
        <g fill={gate1.gate_error==undefined?"rgb(0, 45, 156)":rgb} className="gate" ref={G}>
          {(() => {
            switch (gate1.name) {
              case "h":
                return <HGate />;
              case "rx":
                return <RxGate />;
              case "ry":
                return <RyGate />;
              case "cx":
                if (gate1.isConnector) return <XGate />;
                return <CGate />;
              case "cxx":
                if (gate1.isConnector) return <XGate />;
                return <CGate />;
              case "x":
                return <XGate />;
              case "rz":
                return <RzGate />;
              case "crx":
                if (gate1.isConnector) return <RxGate />;
                return <CGate />;
              case "swap":
                return <SwapGate rgb={gate1.gate_error==undefined?"rgb(0, 45, 156)":rgb} />;
              case "crz":
                if (gate1.isConnector) return <RzGate />;
                return <CGate />;
              case "cry":
                if (gate1.isConnector) return <RyGate />;
                return <CGate />;
              case "ncphase":
                if (gate1.isConnector) return <NcphaseGate />;
                return <NcphaseGate />;
              case "ncnot":
                if (gate1.isConnector) return <XGate />;
                return <CGate />;
              case "cu1":
                if (gate1.isConnector) return <Cu1Gate />;
                return <CGate />;
              case "cz":
                return <CGate />;
              default:
                return null;
            }
          })()}
        </g>
      </Popover>
    </>
  );
}
