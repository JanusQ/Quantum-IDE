import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { Button } from "antd"
const Lang = styled.div`
  display: flex;
  margin-right: 25px;
  display: inline-block;
  color: #fff;
  vertical-align: baseline;
`
const Langitem = styled.span`
  width: 50px;
  line-height: 60px;
  text-align: center;
  opacity: 0.6;
  font-size: 14px;
  cursor: pointer;
  vertical-align: baseline;
  display: inline-block;
  &.active {
    font-weight: 600;
    opacity: 1;
  }
`
const LangDivider = styled.span`
  line-height: 80px;
  width: 2px;
  color: #979797;
  vertical-align: baseline;
  display: inline-block;
`
export default function Language() {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    if (i18n.language === "en") {
      setlanguage("中文")
    }
  }, [])
  const [language, setlanguage] = useState("中文")
  const changeLanguage = (check) => {
    if (language === "English") {
      i18n.changeLanguage("en")
      setlanguage("中文")
    } else if (language === "中文") {
      i18n.changeLanguage("zh")
      setlanguage("English")
    }
    // switch (check) {
    //   case "zh":
    //     i18n.changeLanguage("zh")
    //     setlanguage("zh")
    //     break
    //   case "en":
    //     i18n.changeLanguage("en")
    //     setlanguage("en")
    //     break
    //   default:
    // }

    // i18n.changeLanguage(lang)
  }
  return (
    // <Lang>
    //   <Langitem
    //     onClick={() => changeLanguage("zh")}
    //     className={i18n.resolvedLanguage === "zh" ? "active" : ""}
    //   >
    //     中
    //   </Langitem>
    //   <LangDivider>|</LangDivider>
    //   <Langitem
    //     onClick={() => changeLanguage("en")}
    //     className={i18n.resolvedLanguage === "en" ? "active" : ""}
    //   >
    //     EN
    //   </Langitem>
    // </Lang>
    <div
      style={{
        padding: "0 20px",
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Button
        style={{ borderColor: "#fff", color: "#fff" }}
        size="small"
        onClick={changeLanguage}
        ghost
      >
        {language}
      </Button>
    </div>
  )
}
