import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Right from "../Right"
import { getUserCredits } from "@/api/topUp"
import { useSelector } from "react-redux"

export default function Count() {
  const navigate = useNavigate()
  const [credits, setcredits] = useState("")
  const { userData } = useSelector((store) => store.userData)

  const userCredits = async () => {
    const { data } = await getUserCredits({ user_id: userData.user_id })
    setcredits(data.credits)
  }
  useEffect(() => {
    userCredits()
  }, [])
  return (
    <Right title={"量子币账户"}>
      <div className="couten_balance">账号余额</div>
      <div className="pay_bcoin_index_box">
        <div className="pay_bcoin_num">{credits / 100}量子币</div>
        <div
          className="pay_bcoin_two"
          onClick={() => navigate("/wallet/recharge")}
        >
          购买量子币
        </div>
      </div>
    </Right>
    // <div className="pay_bcoin_index_wp">
    //   <div className="pay_bcoin_index_title">量子币账户</div>
    //   <div className="pay_bcoin_index_content">
    //     <div className="couten_balance">账号余额</div>
    //     <div className="pay_bcoin_index_box">
    //       <div className="pay_bcoin_num">100000量子币</div>
    //       <div
    //         className="pay_bcoin_two"
    //         onClick={() => navigate("/wallet/recharge")}
    //       >
    //         购买量子币
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
