import React from "react"
import { Link } from "react-router-dom"
import styles from "./index.module.scss"
import { useTranslation } from "react-i18next"

export default function Foot() {
  const { t, i18n } = useTranslation()

  return (
    <div className={styles.root}>
      <div className="footer_content">
        <div className="footer_menu">
          <ul>
            <li className="footer_menu_title">
              <span>{t("footer.COMMON LINKS")}</span>
            </li>
            <li>
              <a href="http://physics.zju.edu.cn/">
                {" "}
                {t("footer.School of Physics, Zhejiang University")}
              </a>{" "}
            </li>
            <li>
              <a href="http://www.cs.zju.edu.cn/">
                {" "}
                {t("footer.School of Computer Science, Zhejiang University")}
              </a>{" "}
            </li>
          </ul>
          <ul>
            <li className="footer_menu_title">
              <span>{t("footer.USER GUIDE")}</span>
            </li>
            <li>
              <Link to="/home/document">{t("footer.USER GUIDE")}</Link>
            </li>
            <li></li>
          </ul>
          <ul>
            <li className="footer_menu_title">
              <span>{t("footer.QUANTUM APPLICATIONS")}</span>
            </li>
            <li>
              <Link to="/notFound">{t("footer.Solutions")}</Link>
            </li>
          </ul>
          <div className="footer_phone">
            <p className="footer_phone_title">{t("footer.CONTACT US")}</p>
            <p>{t("footer.Address")}</p>
            <p>{t("footer.Telephone")}:0571-0000000</p>
            <p>{t("footer.Zip code")}:310000</p>
          </div>
          {/* <div className='footer_commen_btn'>加入我们</div> */}
        </div>
        <div className="footer_ban_quan">
          {t("footer.copyright")}
          <span style={{ marginLeft: "20px" }}>
            {" "}
            {t("footer.All rights reserved")}
          </span>
        </div>
      </div>
    </div>
  )
}
