import React from "react";
import "../styles/AboutUs.css";
import Layout from "./Layout";
import aboutUs from "../../images/aboutUS.png";
export default function AbuoutUs() {
  return (
    <Layout isAboutUs={false}>
      <div>
        <div className="aboutUs">
          <h2>关于我们</h2>
          <div className="usImg">
            <img src={aboutUs} alt="" />
          </div>
          <div className="usFount">
            <h3>团队介绍内容：</h3>
            <h4>平台简介</h4>
            <div className="usComtent">
              <p>
                <span></span>
                XX量子云平台依托于浙江大学物理学院和浙江大学计算机学院共同创建，致力于向大众免费提供先进的量子计算机的云服务。
              </p>
              <p>
                <span></span>
                本平台量子计算机硬件依托于浙江大学超导量子计算团队。经过十余年建设，团队在超导量子芯片的设计、制备、测控等方面具备丰富的技术积累，近年来相继研发了10比特、20比特、30比特的超导量子芯片，取得了丰硕的研究成果。2017年，团队在10比特超导量子芯片上生成了最大纠缠态[1]。2019年，团队实现了20个量子比特的薛定谔猫态[2]，成果发布在Science杂志上。2021年，团队与浙江杭州国际科创中心合作发布了两款性能优异的超导量子芯片“天目1号”和“莫干1号”。
                同年，团队在“莫干1号”量子芯片上实现了多体局域化[3]，超越了经典计算资源能够模拟的极限。2022年，团队在“天目1号”量子芯片上采取数字化量子门电路的方式，对拓扑时间晶体进行模拟，成果发表在[1]杂志上。除此以外，团队在量子机器学习、量子错误缓解、量子光学、量子线路误差标定等方面进行了深入研究。
              </p>
              <p>
                <span></span>
                本平台量子计算机软件与算法依托于浙江大学计算机学院的计算机系统结构研究所（CCNT实验室），致力于新一代计算技术与系统的研究与开发。本团队在服务计算与分布式计算、计算机体系结构、程序语言等领域有很强的研究基础。在量子计算领域，经过一年多的积淀，与物理学院共同设计并改进了量子测控软件，使测控效率提高10倍以上；协助创新研究院新实验室进行量子计算机的设备搭建和软件调试；设计了量子计算模拟器V1.0，可以为用户提供一个基于Web的量子电路编译器，实现量子算法到量子电路的编译。未来将致力于研究量子计算模拟器、量子操作系统、量子算法及应用等，积极推动量子算法相关应用，加强量子计算与人工智能、医药、化学、金融、社会学等交叉学科研究。
              </p>
            </div>
            <p>参考链接：</p>
            <p>
              [1]
              <a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511">
                https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511
              </a>
            </p>
            <p>
              [2]
              <a href=" https://www.science.org/doi/10.1126/science.aay0600">
                https://www.science.org/doi/10.1126/science.aay0600
              </a>
            </p>
            <p>
              [3]
              <a href=" https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.127.240502">
                https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.127.240502
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
