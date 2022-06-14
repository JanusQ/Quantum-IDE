import React from 'react'
import Navigation from './Navigation'
import { PageHeader } from 'antd'
import '../styles/Layout.css'
import { useHistory } from 'react-router-dom'
import Footer from './Footer'
const Layout = ({ children, isHome, isLogin, isIde }) => {
  const history = useHistory();
  const backHome = () => {
    return history.push("/");
  };
  return (
    <div
      style={{
        background:  "#eaeff5" ,
        height: isLogin ? "calc(100% - 80px)" : isIde ? "100%" : "auto",
      }}
    >
      <div className="front_header">
        <div className="front_menu_div">
          <span className="front_logo_title" onClick={backHome}>
            太元量子计算
          </span>
          <Navigation />
        </div>
      </div>
      <div
        className={
          isHome || isLogin || isIde ? "front_content" : "common_content"
        }
        style={{
          height: isLogin ? "100%" : isIde ? "calc(100% - 80px)" : "auto",
          marginBottom: isHome || isIde ? "0" : "100px",
        }}
      >
        {children}
      </div>
      <Footer isLogin={isLogin} />
    </div>
  );
};
export default Layout
