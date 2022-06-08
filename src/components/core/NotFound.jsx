import React from 'react'
import '../styles/NotFount.css'
import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="box">
      <div className="margin-top"></div>
  	<div className="errorpPage-box">
		<h1>敬请期待！</h1>
		<h2>coming soon ！</h2>
		<div className="errorpPage-operate">
			{/* <a href="javascript:window.location.reload()" className="operateBtn" title="刷新试试">刷新试试</a> */}
			{/* <a href="/404pages/index.html" className="operateBtn" title="返回首页">返回首页</a> */}
        <Link to='/'>
      <div className="operateBtn">返回首页</div></Link>
        
		</div>
	</div>
  </div>
  )
}
