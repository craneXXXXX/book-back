import React, { Component } from "react";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import orderAxios from "../../model/order";

export default class line extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: [],
      date: [],
      sales: [],
      person: [],
      ordernum: [],
    };
  }
  componentDidMount() {
    orderAxios.searchorderlist().then((res) => {
      let originDate = [];
      let d = "";
      res.data.forEach((item) => {
        this.setState({
          source: res.data,
        });
        if (item.receivetimes != null) {
          d = item.receivetimes.split(" ");
          originDate.push(d[0]);
        }
      });
      let originDate1 = new Set(originDate);
      let singleDate = Array.from(originDate1);
      singleDate.sort(
        (a, b) =>
          Date.parse(a.replace(/-/g, "/")) - Date.parse(b.replace(/-/g, "/"))
      );
      let sales = [];
      let person = [];
      let ordernum = [];
      singleDate.forEach((outeritem, outerindex) => {
        sales[outerindex] = 0;
        person[outerindex] = [];
        ordernum[outerindex] = 0;
        this.state.source.map((item) => {
          if (item.receivetimes != null) {
            d = item.receivetimes.split(" ");
            if (d[0] == singleDate[outerindex]) {
              sales[outerindex] += item.buynum - 0;
              person[outerindex].push(item.userid);
              ordernum[outerindex]++;
            }
          }
        });
      });
      person = person.map((item) => {
        let item2 = new Set(item);
        let item1 = Array.from(item2);
        return item1.length - 0;
      });
      this.setState({
        date: singleDate,
        sales: sales,
        person: person,
        ordernum: ordernum,
      });
      var myChart = echarts.init(document.getElementById("line"));
      let option = {
        title: {
          text: "最近销售情况",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["订单数量", "销量", "今日用户数"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.state.date,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "订单数量",
            type: "line",
            stack: "总量",
            data: this.state.ordernum,
          },
          {
            name: "销量",
            type: "line",
            stack: "总量",
            data: this.state.sales,
          },
          {
            name: "今日用户数",
            type: "line",
            stack: "总量",
            data: this.state.person,
          },
        ],
      };
      myChart.setOption(option);
    });
  }
  render() {
    return <div id="line" style={{ width: 780, height: 780,float:'left' }}></div>;
  }
}
