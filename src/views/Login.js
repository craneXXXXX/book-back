import React, { Component } from "react";
import { message } from "antd";
import "../assets/css/backlogin.css";
import mineAxios from '../model/mine'

export default class Login extends Component {
  render() {
    return (
      <div className="back-login">
        <div className="back-login-box">
          <div className="back-login-header">登录页面</div>
          <input type="text" className="login-input" ref="loginname"/>
          <input type="text" className="login-input" ref="loginpwd" />
          <button className="back-login-btn" onClick={
              ()=>{
                  mineAxios
                    .login(this.refs.loginname.value,this.refs.loginpwd.value, 2)
                    .then((res) => {
                      console.log(res.data);
                      if (res.data.code !== 1) {
                        message.warning(res.data.msg);
                      } else {
                        message.success(res.data.msg);
                        window.localStorage.setItem(
                          "loginName",
                          this.refs.loginname.value
                        );
                        window.localStorage.setItem("loginId", res.data.userid);
                        this.props.history.push('/home');
                      }
                    });
              }
          }>登录</button>
          <div className="back-login-register-box">
            <a href="#/register" className="back-login-register-btn">
              去注册
            </a>
          </div>
        </div>
      </div>
    );
  }
}
