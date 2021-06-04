/*
 * @Author: 小田
 * @Date: 2021-05-31 11:26:45
 * @LastEditTime: 2021-06-05 00:03:47
 */

import Chart from "chart.js/auto";

import { getPrice } from "./server";
export var chart = null;
export var data = null;

function initSliders() {
  const func = function (contents, buttons) {
    contents.find(".close").on("click", function (e) {
      var index = contents.find(".close").index(this);
      contents.eq(index).slideUp((e) => {
        buttons.eq(index).slideDown(10);
      });
    });

    buttons.on("click", function (e) {
      var index = buttons.index(this);
      buttons.eq(index).slideUp(10, (e) => {
        contents.eq(index).slideDown();
      });
    });
    contents.find(".close");
  };

  var leftContents = $(".sidebar-left .sidebar-item-content");
  var rightContents = $(".sidebar-right .sidebar-item-content");

  var leftButtons = $(".sidebar-left .sidebar-item-button");
  var rightButtons = $(".sidebar-right .sidebar-item-button");

  func(leftContents, leftButtons);
  func(rightContents, rightButtons);
}

function initChart() {
  data = {
    labels: [],
    datasets: [
      {
        label: "平均成交价格",
        backgroundColor: "#3579f6",
        borderColor: "#3579f6",
        data: [],
        tension: 0.4,
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
    scales: {
      y: {
        ticks: {
          color: "#00ff00",
        },
      },
    },
  };
  if (chart != null) {
    chart.destroy();
  }
  chart = new Chart(document.getElementById("myChart"), config);
  chart.scales.y.callback = function (label, index, labels) {
    return label / 1000 + "k";
  };
}

export function init() {
  initSliders();
  initChart();

  $("#search-result-info-back").on("click", function (e) {
    $("#info-prev").trigger("click");
  });
}

export function getPriceRange() {
  if (!$("#price-checkbox").is(":checked")) {
    return { min: 0, max: 0xffffff }; // not checked
  }
  var minPrice = $(
    "#price-range > div > div.input-group.mb-3 > input:nth-child(1)"
  ).val();
  minPrice = minPrice != "" ? minPrice : 0;
  var maxPrice = $(
    "#price-range > div > div.input-group.mb-3 > input:nth-child(3)"
  ).val();
  maxPrice = maxPrice != "" ? maxPrice : 0xffffff;

  return { min: parseInt(minPrice), max: parseInt(maxPrice) };
}

export function showInfo(item) {
  console.log(item);

  var firstpage = $(".carousel-item").eq(0);
  if (firstpage.hasClass("active")) {
    $("#info-next").trigger("click");
  }

  getPrice(item);

  $("#search-result-info-title").html(item.properties.xiaoqu);
}

const dates = ["2015", "2016", "2017", "2018", "2019", "2020", "2021"];

export function updateChart(prices) {
  initChart();
  console.log(prices);
  dates.forEach((item, index) => {
    chart.data.labels.push(item);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(
        prices[0]["_id"]["price"] *
          (1 + (1 - Math.random() + 0.3 * index) * 0.01)
      );
    });
    chart.update();
  });
}
