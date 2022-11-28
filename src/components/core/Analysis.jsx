import React, { useState, useRef, useEffect } from "react";
import "../styles/Analysis.scss";
import { Progress, Card, Table, Select, Radio,Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
export default function Analysis(props) {
  const main = useRef();
  const option = {
    title: {
      text: "预期结果",
    },
    radar: {
      indicator: [
        { name: "门数量", max: 6500 },
        { name: "深度", max: 52000 },
        { name: "保真度", max: 38000 },
        { name: "编译速度", max: 30000 },
        { name: "并行度", max: 16000 },
      ],
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        data: [
          {
            value: [4200, 3000, 8000, 6000, 5000, 5000],
            name: "Allocated Budget",
            areaStyle: {
              color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                {
                  color: "rgba(24, 144, 255, 0.5)",
                  offset: 0,
                },
                {
                  color: "rgba(24, 144, 255, 0.9)",
                  offset: 1,
                },
              ]),
            },
          },
        ],
      },
    ],
  };
  const LayoutData = ["trivial", "dense", "noise_adaptive", "sabre"];
  const RoutingData = ["basic", "lookahead", "stochastic", "sabre", "toqm"];
  const TranslationData = ["unroller", "translator", "synthesis"];
  const optimizationData = [
    "GatesOptimize",
    "CXCancellation",
    "OptimizeCliffords",
    "GatesDecomposition",
    "CommutativeCancellation",
  ];
  const [layoutValue, setLayoutValue] = useState([]);
  const [routing, setRouting] = useState([]);
  const [translation, setTranslation] = useState([]);
  const [optimization, setOptimization] = useState([]);
  // const [parameter, setParameter] = useState({
  //   'layout':layoutValue,
  //   "routing":routing,
  //   "translation":translation,
  //   "optimization":optimization

  // })
  let parameter={
       'layout':layoutValue,
    "routing":routing,
    "translation":translation,
    "optimization":optimization
  }
  const onChangeLayout = (e) => {
    console.log("radio checked", e.target.value);
    setLayoutValue([e.target.value]);
   
  };
  const onChangeRouting = (e) => {
    console.log("radio checked", e.target.value);
    setRouting([e.target.value]);
  };
  const onChangeTranslation = (e) => {
    console.log("radio checked", e.target.value);
    setTranslation([e.target.value]);
  };
  const onChangeOptimization = (list) => {
    // console.log("radio checked", e.target.value);
    setOptimization(list);
  };
  const test = () =>{
    console.log(parameter,88);

  }
  // 取消单选框
  const cancle = (type) =>{
    switch (type) {
      case 'translation':
        setTranslation([]);
        break;
      case 'routing':
        setRouting([]) 
       break;
      case 'layout':
        setLayoutValue([]) 
       break;
      default:
        break;
    }
  }
  useEffect(() => {
    const myChart = echarts.init(main.current);
    myChart.setOption(option);
  }, []);
  useEffect(()=>{
    props.parameter(parameter)
console.log('执行了');
  },[layoutValue,routing,translation,optimization])
  return (
    <div className="compile">
      <span>编译</span>
      <div className="top">
        <div className="circuit"></div>
        <div className="chart">
          <div ref={main} className="radarChart"></div>
        </div>
      </div>
      <div className="middle">
        <div onClick={test}>配置</div>
        <div className="config">
          <div
            style={{
              width: "50%",
              height: 23,
              backgroundColor: "rgb(51, 129, 253)",
              marginLeft: 0,
            }}
            className="Progress"
          ></div>
        </div>
      </div>
      <div className="down">
        <div className="optimized">
          <div className="header">
            <span>layout</span>
            <div className="icon">
              <SettingOutlined />
            </div>
          </div>
          <div className="selectOptimized">
            <Radio.Group  onChange={onChangeLayout} value={layoutValue[0]}>
              {LayoutData.map((item, index) => (
                <div>
                  <Radio onClick={()=>cancle('layout')} key={index} value={item}>
                    {item}
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        </div>
        <div className="optimized">
          <div className="header">
            <span>routing</span>
            <div className="icon">
              <SettingOutlined />
            </div>
          </div>
          <div className="selectOptimized">
            <Radio.Group onChange={onChangeRouting} value={routing[0]}>
              {RoutingData.map((item, index) => (
                <div>
                  <Radio onClick={()=>cancle('routing')} key={index} value={item}>
                    {item}
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        </div>
        <div className="optimized">
          <div className="header">
            <span>translation</span>
            <div className="icon">
              <SettingOutlined />
            </div>
          </div>
          <div className="selectOptimized">
            <Radio.Group onChange={onChangeTranslation} value={translation[0]}>
              {TranslationData.map((item, index) => (
                <div>
                  <Radio onClick={()=>cancle('translation')} key={index} value={item}>
                    {item}
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        </div>
        <div className="optimized">
          <div className="header">
            <span>optimization</span>
            <div className="icon">
              <SettingOutlined />
            </div>
          </div>
          <div className="selectOptimized">
                  <Checkbox.Group value={optimization} options={optimizationData} onChange={onChangeOptimization}>
                  </Checkbox.Group>
          </div>
        </div>
      </div>
    </div>
  );
}
