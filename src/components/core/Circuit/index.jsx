import React from "react";
import Qubit from "./components/Qubit";
export default function Circuit(props) {
  let circuitGate = [[]];
  let gateError = [[]];
  let bugPositions=[]
  circuitGate = props.circuitData.gates;
  gateError = props.circuitPreditt.gate_errors;
  bugPositions=props.circuitPreditt.bug_positions

  let maxColor = 0;
  let svgWidth = 1110;
  let svgHeight = 500;
  let gates1 = [];
  let gateLine = [];
  let precent = []
  // 计算渐变色
  const getColorByBaiFenBi = (bili) => {
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
  if(props.circuitType&&circuitGate&&gateError){
    maxColor = Math.max(...gateError.flat());
    // 百分比数据处理
    for (let i = 0; i <5; i++) {
      precent.push(Math.round(maxColor*i/5*10000)/100)
      
    }
  }
  if (circuitGate !== undefined) {   
    gates1 = circuitGate;
    svgWidth = gates1[0].length * 40 + 200;
    svgHeight = gates1.length * 40 + 200;
    if(props.circuitType&&gateError&&bugPositions){
      for (let index = 0; index < bugPositions.length; index++) {
       let i= bugPositions[index][0]
       let j= bugPositions[index][1]
       if( gates1[i]&& gates1[i][j]){
        gates1[i][j].bug=true

       }

        
      }
      for (let i = 0; i < gates1.length; i++) {
        for (let j = 0; j < gates1[1].length; j++) {
          if (gates1[i][j] && gateError[i]) {
            const operation = gates1[i][j];
            operation.line = i;
            operation.col = j;
            operation.gate_error = gateError[i][j];

          }
        }
      }
    }else{
      for (let i = 0; i < gates1.length; i++) {
        for (let j = 0; j < gates1[1].length; j++) {
          if (gates1[i][j]) {
            const operation = gates1[i][j];
            operation.line = i;
            operation.col = j;
          }
        }
      }
    }
    let aaa = gates1.flat();
    let bbb = aaa.filter((item) => item !== null);
    const findDuplicates = (aaa) => {
      const output = [];
      Object.values(
        aaa.reduce((res, obj) => {
          let key = obj.id;
          res[key] = [...(res[key] || []), { ...obj }];
          return res;
        }, {})
      ).forEach((arr) => {
        if (arr.length > 1) {
          output.push(...arr);
        }
      });
      return output;
    };
    const ccc = findDuplicates(bbb);
    ccc.forEach((item) => {
      gates1[item.line][item.col].isManyQubit = true;
    });
    const arrayTwo = Object.values(
      ccc.reduce((res, item) => {
        res[item.id] ? res[item.id].push(item) : (res[item.id] = [item]);
        return res;
      }, {})
    );
    // console.log(arrayTwo, 888)
    let connectorMaxgate = [];
    arrayTwo.forEach((item) => {
      let max = item[0];
      for (var i = 1; i < item.length; i++) {
        let cur = item[i];
        // cur > max ? (max = cur) : null
        if (cur.connector > max.connector) {
          max = cur;
        }
      }
      connectorMaxgate.push(max);
      // console.log(max, 9999)
    });
    // console.log(connectorMaxgate, 999)

    connectorMaxgate.forEach((item) => {
      // console.log(item.col,item.line);
      gates1[item.line][item.col].isConnector = true;
    });
    // console.log(gates1,'成功了吗');
    // // console.log(arrayTwo,888)
    // console.log(ccc, 66)
    var map = {};
    // var gateLine = []
    for (var i = 0; i < ccc.length; i++) {
      var ai = ccc[i];
      if (!map[ai.id]) {
        let lineColor = 'rgb(0, 45, 156)'
        if(ai.gate_error){
            // 计算渐变色
          lineColor=getColorByBaiFenBi(ai.gate_error/maxColor)
        }
        gateLine.push({
          id: ai.id,
          col: ai.col,
          name: ai.name,
          options: ai.options,
          x: ai.x,
          lineArr: [{ line: ai.line }],
          lineColor
        });
        map[ai.id] = ai.id;
      } else {
        for (var j = 0; j < gateLine.length; j++) {
          var dj = gateLine[j];
          if (dj.id == ai.id) {
            dj.lineArr.push({ line: ai.line });
            break;
          }
        }
      }
    }
  }
  return (
    <svg
      style={{ overflow: "hidden" }}
      width={svgWidth > 1100 ? svgWidth : 1100}
      height={svgHeight > 500 ? svgHeight : 500}
    >
      
      <rect
        stroke="#C4C4C4"
        width={"100%"}
        height={"100%"}
        fill="transparent"
      ></rect>
     <foreignObject x="2" y="40" width="32" height="160">
      <div  style={{width:30,height:160,backgroundImage: 'linear-gradient(to top, rgba(126, 191, 236),rgba(254, 236, 218), rgba(237, 97, 69))'}}></div>
     </foreignObject>
     <g>
      {precent.map((item,index)=>(
             < text x='34' key={index} y={200-index*37}>{item}%</text>
      ))}
      <text  x='10' y='25'>predict:{ Math.round( props?.circuitPreditt?.circuit_predict*100)/100||''}</text>
     </g>
    <g transform='translate(20)'>
      {gates1.map((qubit, index) => (
        <g
          key={index}
          transform={`translate(60,${20 + index * 40 ? index * 40 : 0})`}
        >
          <line
            className="qubit"
            strokeWidth="2"
            x1="30"
            y1="40"
            x2={qubit.length * 40 + 100 > 1060 ? qubit.length * 40 + 50 : 1060}
            y2="40"
            data-dis="0"
            stroke="#C4C4C4"
          ></line>
        </g>
      ))}
      {gateLine.map((item, index) => (
        <g key={index}>
          <line
            x1={16 + 40 * item.col + 95}
            y1={item.lineArr[0].line * 40 + 40}
            x2={16 + 40 * item.col + 95}
            y2={item.lineArr[item.lineArr.length - 1].line * 40 + 40}
            strokeWidth="1.25"
            stroke={item.lineColor}
          ></line>
        </g>
      ))}
      {gates1.map((qubit, index) => (
        <Qubit
          maxColor={maxColor}
          key={index}
          index={index}
          gates={qubit}
        ></Qubit>
      ))}
      </g>
    </svg>
  );
}
