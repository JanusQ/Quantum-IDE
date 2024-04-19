import React, { Suspense } from "react"
import { Spin } from "antd"

export default function LazyLoad(Comp) {
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        />
      }
    >
      <Comp />
    </Suspense>
  )
}
