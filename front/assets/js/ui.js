/*
 * @Author: 小田
 * @Date: 2021-05-31 11:26:45
 * @LastEditTime: 2021-06-07 19:51:25
 */

import Chart from "chart.js/auto";

import { priceSearch } from "./server";
import {
  clearTransportLocate,
  drawTransportLocate,
  getTransportPoint,
} from "./map";
export var chart = null;
export var data = null;

// 演示用
const dates = ["2015", "2016", "2017", "2018", "2019", "2020", "2021"];

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

export function getTransportRange() {
  if (!$("#transport-checkbox").is(":checked")) {
    return null;
  }

  var transportType = $(".transport-type:checked").attr("id");
  var time = parseInt($("#transport-time").val());
  var geometry = getTransportPoint();

  if (geometry == null) {
    return null;
  }

  return { type: transportType, time: time, coordinates: geometry };
}

export function initUI() {
  initSliders();
  initChart();

  $("#search-result-info-back").on("click", function (e) {
    $("#info-prev").trigger("click");
  });
}

export function showInfo(item) {
  var firstpage = $(".carousel-item").eq(0);
  if (firstpage.hasClass("active")) {
    $("#info-next").trigger("click");
  }

  priceSearch(item);
  $("#search-result-info-title").html(item.properties.xiaoqu);
}

export function updateChart(prices) {
  initChart();
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

function initSliders() {
  const func = function (contents, buttons) {
    contents.find(".close").on("click", function (e) {
      var index = contents.find(".close").index(this);
      contents.eq(index).slideUp(() => {
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

  $("#transport-choose-locate").on("click", function (e) {
    if ($(this).hasClass("active")) {
      // 如果已经在active状态, 那么用户取消绘制中心点
      clearTransportLocate();

      $(this).removeClass("active");
    } else {
      // 否则用户需要开始绘制一个中心点
      drawTransportLocate();

      $(this).addClass("active");
    }
  });
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
