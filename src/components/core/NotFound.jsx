import React from "react";
import Layout from "./Layout";
import "../styles/NotFount.css";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
        <Layout>

    <div className="notfound-box">
      <div className="margin-top"></div>
      <div className="errorpPage-box">
        <h1>项目正在开发中，敬请期待...</h1>
        <h2>The project is under development, please look forward to...！</h2>
        <div className="errorpPage-operate">
          <Link to="/">
            <div className="operateBtn">返回首页</div>
          </Link>
        </div>
      </div>
    </div>
        </Layout>

  );
}
