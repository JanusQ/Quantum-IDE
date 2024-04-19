import React from 'react'
import styles from './index.module.scss'
import { useTranslation } from 'react-i18next'
import janus from '@/assets/image/janusSwiper/janus.png'
import jianweiyin from '@/assets/image/janusSwiper/JianweiYin.png'
import liqianglu from '@/assets/image/janusSwiper/liqianglu.jpg'
import tansiwei from '@/assets/image/janusSwiper/tansiwei.png'
import wuweitian from '@/assets/image/janusSwiper/wuweitian.png'
import { Avatar } from 'antd'
export default function AboutUs() {
  const { t, i18n } = useTranslation()
  const organizerData = [
    {
      name: 'Jianwei Yin',
      photo: jianweiyin,
      introduce:
        'Jianwei Yin is currently a full professor in the College of Computer Science, Zhejiang University (ZJU), China. He haspublished more than 100 papers in top international journals and conferences. His current research interests include quantum computing, service computing and business process management. He is also the Associate Editor of the IEEE Transactions on Services Computing.',
    },
    {
      name: 'Liqiang Lu',
      photo: liqianglu,
      introduce:
        'Liqiang Lu is a ZJU100 Young Professor in the College of Computer Science, Zhejiang University (ZJU), China. His research interests include quantum computing, computer architecture, deep learning accelerator, and software-hardware codesign. He has authored more than 20 scientific publications in premier international journals and conferences in related  domains, including ISCA, MICRO, HPCA, FCCM, DAC, IEEE Micro, and TCAD. He also serves as a TPC member in the premier conferences in the related domain,including ICCAD,FPT,HPCC etc. ',
    },
    {
      name: 'Siwei Tan',
      photo: tansiwei,
      introduce:
        'Siwei Tan is a 5th year PhD student at Zhejiang University. His interests include the quantum algorithm and computer architecture.',
    },
  ]
  return (
    <div className={styles.root}>
      <div className="aboutUs">
        <h2>{t('auboutUs.auboutUs')}</h2>
        {/* <div className="usImg">
            <img src={aboutUs} alt="" />
          </div> */}
        <div className="usFount">
          <div className="usComtent">
            <p>
              <span></span>
              We are the Taiyuan Quantum Computing Research Group, a quantum
              computing team from the College of Computer Science and Technology
              at Zhejiang University. We are an efficient and dynamic team
              dedicated to developing software and architecture for
              future-oriented quantum computing. We are at the forefront of
              international research in fields such as superconducting quantum
              control systems, quantum compilers, and quantum algorithms,
              constantly striving to surpass boundaries and advance the
              capabilities of quantum computing. Our group has the following
              four research directions.
              {/* {t('auboutUs.Relying on')} */}
            </p>
            <p>
              <span></span>
              1. Taiyuan Superconducting Quantum Computing Cloud Platform In
              July 2022, we launched the first superconducting quantum computing
              cloud platform named “Taiyuan 1”, which supports computational
              visualization and distributed parallel scheduling. This platform
              enables remote access to Zhejiang University's independently
              developed “Tianmu 1” quantum chip, providing 20-qubit computing
              power. The cloud platform, accessible via the domain
              janusq.zju.edu.cn, is open to the public. By employing a visual
              programming environment, this platform reduces the barriers to
              entry for quantum computing, leading the international research
              wave in the design of quantum computer software, hardware, system
              architecture, and algorithm development. Notably, renowned
              universities and leading companies both domestically and
              internationally, including Microsoft, the University of Sydney,
              Huawei, and Tencent, have registered to use this cloud platform.
              {/* {t('auboutUs.The hardware')} */}
            </p>
            <p>
              <span></span>
              {/* {t('auboutUs.This platform')} */}
              2. Full-stack Quantum Architecture Framework for Software and
              Hardware The realization of quantum computing relies on a
              synergistic design of software and hardware. Our research group
              has introduced the first full-stack quantum architecture framework
              in Zhejiang University. This framework is built upon independently
              developed programming languages, frameworks, compilers,
              instruction sets, control devices, and chips. The Taiyuan Quantum
              Architecture introduces several optimization techniques, including
              interactive programming through visualization, chip
              virtualization, waveform acceleration based on reuse, and pipeline
              design, achieving over 90% chip utilization.
            </p>
            <p>
              <span></span>
              {/* {t('auboutUs.This platform')} */}
              3. Taiyuan Quantum Software Optimization Platform The Taiyuan
              Quantum Software Optimization Platform achieves optimization
              across the entire quantum application lifecycle, from compilation
              and deployment to control and readout processes. This platform
              introduces the first configurable self-optimizing compilation
              technology, supporting visual compiler configuration and adaptive
              analysis for compilation quality and latency. It integrates a
              range of technologies such as quantum computer cluster
              optimization, quantum circuit noise analysis, automatic synthesis
              and correction of quantum circuits, and acceleration of quantum
              waveform compilation.
            </p>
            <p>
              <span></span>
              {/* {t('auboutUs.This platform')} */}
              4. Applications of Quantum Computing We explore the intersection
              of “Quantum + X” applications across various fields such as
              finance, biomedical pharmaceutical simulations, machine learning,
              artificial intelligence, and so on. The research group is
              currently leading national and provincial-level projects related
              to these domains.
            </p>
          </div>
          <h2>Team</h2>
          <div className="team">
            <div className="speakers">
              <div className="speaker_title">
                <h1 style={{ textAlign: 'left', fontSize: '1.5rem' }}>
                  Organizers and presenters
                </h1>
              </div>
              {organizerData.map((item, index) => (
                <div className="speakers_1 speaker">
                  <div className="photo">
                    <Avatar src={item.photo} shape="square" size={100} />
                  </div>
                  <div className="speakers_1_content speaker_content">
                    {item.introduce}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p> {t('auboutUs.References')}：</p>
          <div className="refence_link">
            <p>
              [1]
              <a
                target="_blank"
                href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511"
                rel="noreferrer"
              >
                2017-Phys. Rev. Lett.《10-Qubit Entanglement and Parallel Logic
                Operations with a Superconducting Circuit》
              </a>
            </p>
            <p>
              [2]
              <a
                target="_blank"
                href="https://www.science.org/doi/10.1126/science.aay0600"
                rel="noreferrer"
              >
                2019-Science Advances《Generation of multicomponent atomic
                Schrödinger cat states of up to 20 qubits》
              </a>
            </p>
            <p>
              [3]
              <a
                target="_blank"
                href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.127.240502"
                rel="noreferrer"
              >
                2021-Phys. Rev. Lett. 《Stark Many-Body Localization on a
                Superconducting Quantum Processor》
              </a>
            </p>
            <p>
              [4]
              <a
                target="_blank"
                href="https://www.nature.com/articles/s41586-022-04854-3"
                rel="noreferrer"
              >
                2022-Nature 《Digital quantum simulation of Floquet
                symmetry-protected topological phases》
              </a>
            </p>
            <p>
              [5]
              <a
                target="_blank"
                href="https://www.science.org/doi/10.1126/science.ade6219"
                rel="noreferrer"
              >
                2022-Science 《Observing the quantum topology of light》
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
