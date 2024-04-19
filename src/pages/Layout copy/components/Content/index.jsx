import React from "react"
import styled from "styled-components"

const ContentWrapper = styled.div`
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.25s ease-out;
  min-height: 800px;

  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`

function Content({ children }) {
  const Wrapper = ContentWrapper
  return <Wrapper>{children}</Wrapper>
}

export default Content
