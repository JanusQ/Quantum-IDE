import React, { useEffect, useState } from 'react'
import { Anchor, Row, Col, Affix, Button } from 'antd'
export default function Index() {
  const topRef = React.useRef(null)
  const [targetOffset, setTargetOffset] = useState()
  useEffect(() => {
    setTargetOffset(topRef.current?.clientHeight)
  }, [])
  const onClick = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <Row>
      <Col span={8}>
        <Affix offsetTop={200}>
          <a onClick={() => onClick('box1')}>
            <Button>box1</Button>
          </a>
          <a onClick={() => onClick('box2')}>
            <Button>box2</Button>
          </a>
          <a onClick={() => onClick('box3')}>
            <Button>box3</Button>
          </a>
          <a onClick={() => onClick('box4')}>
            <Button>box4</Button>
          </a>
          <a onClick={() => onClick('box5')}>
            <Button>box5</Button>
          </a>
        </Affix>
      </Col>
      <Col span={16}>
        <div style={{ width: 100, height: 200 }} id="box1">
          box1{' '}
        </div>
        <div style={{ width: 100, height: 200 }} id="box2">
          box2{' '}
        </div>
        <div style={{ width: 100, height: 200 }} id="box3">
          box3{' '}
        </div>
        <div style={{ width: 100, height: 200 }} id="box4">
          box4{' '}
        </div>
        <div style={{ width: 100, height: 200 }} id="box5">
          box5{' '}
        </div>
      </Col>
    </Row>
  )
}
