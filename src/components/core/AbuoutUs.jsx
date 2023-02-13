import React from "react"
import "../styles/AboutUs.css"
import Layout from "./Layout"
import { useTranslation } from "react-i18next"
// import aboutUs from "../../images/aboutUS.png";
export default function AbuoutUs() {
  const { t, i18n } = useTranslation()
  return (
    <Layout>
      <div>
        <div className="aboutUs">
          <h2>{t("auboutUs.auboutUs")}</h2>
          {/* <div className="usImg">
            <img src={aboutUs} alt="" />
          </div> */}
          <div className="usFount">
            <div className="usComtent">
              <p>
                <span></span>
                {t("auboutUs.Relying on")}
              </p>
              <p>
                <span></span>
                {t("auboutUs.The hardware")}
              </p>
              <p>
                <span></span>
                {t("auboutUs.This platform")}
              </p>
            </div>
            <p> {t("auboutUs.References")}：</p>
            <p>
              [1]
              <a
                target="_blank"
                href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180511"
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
              >
                2022-Science 《Observing the quantum topology of light》
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
