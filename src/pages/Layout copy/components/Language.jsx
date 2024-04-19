import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

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
  line-height: 60px;
  width: 2px;
  color: #979797;
  vertical-align: baseline;
  display: inline-block;
`
export default function Language() {
  const { t, i18n } = useTranslation()

  const [language, setlanguage] = useState("zh")
  const changeLanguage = (check) => {
    switch (check) {
      case "zh":
        i18n.changeLanguage("zh")
        setlanguage("zh")
        break
      case "en":
        i18n.changeLanguage("en")
        setlanguage("en")
        break
      default:
    }

    // i18n.changeLanguage(lang)
  }
  return (
    <Lang>
      <Langitem
        onClick={() => changeLanguage("zh")}
        className={
          language == "zh" || i18n.resolvedLanguage === "zh" ? "active" : ""
        }
      >
        中
      </Langitem>
      <LangDivider>|</LangDivider>
      <Langitem
        onClick={() => changeLanguage("en")}
        className={
          language == "en" || i18n.resolvedLanguage === "en" ? "active" : ""
        }
      >
        EN
      </Langitem>
    </Lang>
  )
}
