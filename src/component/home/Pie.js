import React, { Component } from "react";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import orderAxios from "../../model/order";
Date.prototype.format = function (str) {
  let year = this.getFullYear();
  let month = this.getMonth() + 1;
  let day = this.getDate();
  str = str.replace("yyyy", year).replace("MM", month).replace("dd", day);
  return str;
};

export default class Pie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: [],
    };
  }
  componentDidMount() {
    orderAxios.searchorderlist().then((res) => {
      this.setState({
        source: res.data,
      });
      let visited = 0;
      let visitednum = 0;
      let addshoppingcar = [];
      let addshoppingcarnum = 0;
      let neworder = 0;
      let finished = 0;
      let nowDate = new Date().format("yyyy-MM-dd");
      visited = res.data.filter((item) => {
        if (item.buytimes) {
          item.buytimes = item.buytimes.split(" ")[0];
          if (item.buytimes == nowDate) {
            return item;
          }
        }
      });
      visitednum = visited.map((item) => item.userid);
      let visitednum1 = new Set(visitednum);
      let visitednumfinish = Array.from(visitednum1).length;
      addshoppingcar = res.data.filter((item) => {
        if (item.buytimes) {
          item.buytimes = item.buytimes.split(" ")[0];
          if (item.buytimes == nowDate) {
            return item;
          }
        }
      });
      addshoppingcar.forEach((item) => {
        addshoppingcarnum += item.buynum - 0;
      });

      res.data.filter((item) => {
        if (item.paytimes) {
          item.paytimes = item.paytimes.split(" ")[0];
          if (item.paytimes == nowDate) {
            neworder++;
            return item;
          }
        }
      });

      res.data.filter((item) => {
        if (item.receivetimes) {
          item.receivetimes = item.receivetimes.split(" ")[0];
          if (item.receivetimes == nowDate) {
            finished++;
            return item;
          }
        }
      });
      var myChart = echarts.init(document.getElementById("pie"));
      let option = {
        title: {
          text: "今日销售情况",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["访问数", "加购数", "下单数", "成交数"],
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              {
                value: visitednumfinish ? visitednumfinish : 0,
                name: "访问数",
              },
              {
                value: addshoppingcarnum ? addshoppingcarnum : 0,
                name: "加购数",
              },
              { value: neworder ? neworder : 0, name: "下单数" },
              { value: finished ? finished : 0, name: "成交数" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    });
  }
  render() {
    return (
      <div
        id="pie"
        style={{
          width: 600,
          height: 600,
          marginTop: "100px",
          float: "left",
          marginLeft: "200px",
        }}
      ></div>
    );
  }
}
