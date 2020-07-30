import React, { Component } from 'react'
import {Switch,Route} from 'react-router-dom'
import Home from '../views/Home'
import Login from '../views/Login';
import Register from '../views/Register';
import HomeHome from '../views/home/HomeHome';

export default class AppRouter extends Component {
    
    render() {
        let routes = [
          {
            path: "/",
            component: Login,
            exact: true,
          },
          {
            path: "/login",
            component: Login,
          },
          {
            path: "/register",
            component: Register,
          },
          {
            path: "/home",
            component: Home,
            exact: true,
          },
          {
            path: "/home/home",
            component: Home,
            exact: true,
          },
          {
            path: "/home/goodslist",
            component: Home,
          },
          {
            path: "/home/goodsclassify",
            component: Home,
          },
          {
            path: "/home/brandmanage",
            component: Home,
          },
          {
            path: "/home/orderlist",
            component: Home,
          },
          {
            path: "/home/returngoods",
            component: Home,
          },
        ];
        let AppRouter = routes.map((item, index) => (
          <Route
            key={index}
            path={item.path}
            component={item.component}
            exact={item.exact}
          ></Route>
        ));
        return <Switch>{AppRouter}</Switch>;
    }
}
