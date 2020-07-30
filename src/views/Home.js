import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import "../assets/css/app.css";
import { HashRouter as Router,Route, Link,Switch } from "react-router-dom";
import HomeHome from "./home/HomeHome";
import HomeGoodsList from "./goods/HomeGoodsList";
import HomeOrderList from "./order/HomeOrderList";
import HomeGoodsClassify from "./goods/HomeGoodsClassify";
import HomeBrandManage from "./goods/HomeBrandManage";
import ReturnGoods from "./order/ReturnGoods";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default class Home extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
              <Menu.Item
                key="1"
                onClick={() => {
                  this.props.history.push("/home");
                }}
              >
                首页
              </Menu.Item>
              {/* <Menu.Item key="2">个人</Menu.Item> */}
              <Menu.Item
                key="3"
                onClick={() => {
                  window.localStorage.removeItem("loginId");
                  this.props.history.push("/login");
                }}
              >
                退出
              </Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%", borderRight: 0 }}
              >
                <Menu.Item icon={<UserOutlined />} key="4">
                  首页<Link to="/home/home"></Link>
                </Menu.Item>
                <SubMenu key="sub2" icon={<LaptopOutlined />} title="商品">
                  <Menu.Item key="5">
                    商品列表<Link to="/home/goodslist"></Link>
                  </Menu.Item>
                  <Menu.Item key="6">
                    商品分类<Link to="/home/goodsclassify"></Link>
                  </Menu.Item>
                  <Menu.Item key="7">
                    品牌管理<Link to="/home/brandmanage"></Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu
                  key="sub3"
                  icon={<NotificationOutlined />}
                  title="订单"
                >
                  <Menu.Item key="8">
                    订单列表<Link to="/home/orderlist"></Link>
                  </Menu.Item>
                  <Menu.Item key="9">
                    退货申请处理<Link to="/home/returngoods"></Link>
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout style={{ padding: "0 24px 24px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                }}
              >
                <Switch>
                  <Route path="/home" component={HomeHome} exact></Route>
                  <Route path="/home/home" component={HomeHome} exact></Route>
                  <Route
                    path="/home/goodslist"
                    component={HomeGoodsList}
                  ></Route>
                  <Route
                    path="/home/orderlist"
                    component={HomeOrderList}
                  ></Route>
                  <Route
                    path="/home/goodsclassify"
                    component={HomeGoodsClassify}
                  ></Route>
                  <Route
                    path="/home/brandmanage"
                    component={HomeBrandManage}
                  ></Route>
                  <Route
                    path="/home/returngoods"
                    component={ReturnGoods}
                  ></Route>
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    );
  }
}
