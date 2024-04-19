import React from "react"
import styled from "styled-components"

const FooterWrapper = styled.footer`
  background-color: #333;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 208px;
  padding-top: 50px;
`

function Footer({ children }) {
  return <FooterWrapper>{children}</FooterWrapper>
}

export default Footer
