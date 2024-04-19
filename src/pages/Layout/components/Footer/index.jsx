import React from "react"
import { Layout, Row, Col } from "antd"
import styles from "./index.module.scss"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export default function Footer() {
  const { Footer } = Layout
  const { t, i18n } = useTranslation()
  const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#000",
    padding: "86px 144px 93px 144px",
  }
  return (
    <div className={styles.root}>
      <Footer style={footerStyle}>
        <div className="footer_content">
          <div className="footer_menu">
            <Row>
              <Col lg={6} sm={24} xs={24}>
                <ul>
                  <li className="footer_menu_title">
                    <span>{t("footer.COMMON LINKS")}</span>
                  </li>

                  <li>
                    <a href="http://www.cs.zju.edu.cn/">
                      {t(
                        "footer.School of Computer Science, Zhejiang University"
                      )}
                    </a>
                  </li>
                  <li>
                    <a href="http://physics.zju.edu.cn/">
                      {t("footer.School of Physics, Zhejiang University")}
                    </a>
                  </li>
                </ul>
              </Col>
              <Col lg={6} sm={24} xs={24}>
                <ul>
                  <li className="footer_menu_title">
                    <span>{t("footer.USER GUIDE")}</span>
                  </li>
                  <li>
                    <Link to="/home/document">{t("footer.USER GUIDE")}</Link>
                  </li>
                  <li></li>
                </ul>
              </Col>
              <Col lg={6} sm={24} xs={24}>
                <ul>
                  <li className="footer_menu_title">
                    <span>{t("footer.QUANTUM APPLICATIONS")}</span>
                  </li>
                  <li>
                    <Link to="/notFound">{t("footer.Solutions")}</Link>
                  </li>
                </ul>
              </Col>
              <Col lg={6} sm={24} xs={24}>
                <div className="footer_phone">
                  <p className="footer_phone_title">{t("footer.CONTACT US")}</p>
                  <p>{t("footer.Address")}</p>
                  <p>{t("footer.Telephone")}:0571-81951139</p>
                  <p>{t("footer.Zip code")}:310028</p>
                </div>
              </Col>
            </Row>

            {/* <div className='footer_commen_btn'>加入我们</div> */}
          </div>
        </div>
      </Footer>
      <Row justify="center" className="bottom-bar">
        <Col>
          <span style={{ marginRight: 12 }}> {t("footer.copyright")}</span>
          <span style={{ marginRight: 12 }}>
            {t("footer.All rights reserved")}
          </span>
        </Col>
      </Row>
    </div>
  )
}
