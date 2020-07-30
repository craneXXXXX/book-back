import React, { Component } from "react";
import {  message } from "antd";
import "../assets/css/backlogin.css";
import mineAxios from '../model/mine'

export default class Register extends Component {
  render() {
    return (
      <div className="back-login">
        <div className="back-login-box">
          <div className="back-login-header">注册页面</div>
          <input type="text" className="login-input" ref="registername" />
          <input type="text" className="login-input" ref="registerpwd" />
          <button
            className="back-login-btn"
            onClick={() => {
              mineAxios
                .register(
                  this.refs.registername.value,
                  this.refs.registerpwd.value,
                  2
                )
                .then((res) => {
                  console.log(res.data);
                  if (res.data.code !== 1) {
                    message.warning(res.data.msg);
                  } else {
                    message.success(res.data.msg);
                    this.props.history.push('/login')
                  }
                });
            }}
          >
            注册
          </button>
          <div className="back-login-register-box">
            <a href="#/login" className="back-login-register-btn">
              去登录
            </a>
          </div>
        </div>
      </div>
    );
  }
}
