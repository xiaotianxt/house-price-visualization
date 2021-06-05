/*
 * @Author: 小田
 * @Date: 2021-05-31 13:24:12
 * @LastEditTime: 2021-06-05 16:06:36
 */

// jQuery
const $ = require("jquery");
window.jQuery = $;
jQuery = $;
window.$ = window.jQuery;

// map.js
import { changeCenter, addTag, getMultiPolygon, addSelect } from "./map";
import { getPriceRange, showInfo, updateChart, getTransportRange } from "./ui";
import { transform } from "ol/proj";

const url = "https://localhost:5000";
const search_url = url + "/search";
export const searchPanel = $("#search-result-panel"); // 结果记录位置
export var searchResults; // 小区搜索结果

import olpjch from "ol-proj-ch";
/* GCJ02 */
const GCJ02 = olpjch.GCJ02;
const code = GCJ02.CODE;

export const priceFormatter = function (price) {
  if (price >= 1000) {
    return Math.round(price / 1000).toString() + "k";
  } else {
    return "暂无";
  }
};

export function xiaoquSearch(e) {
  e.preventDefault();
  showList();
  var xiaoqu = $("#xiaoqu-locate input").val();
  fetch(search_url, {
    mode: "cors",
    method: "post",
    body: JSON.stringify({
      xiaoqu: xiaoqu,
      type: "xiaoqu",
    }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then(solveResult);
}

function showList() {
  var firstpage = $(".carousel-item").eq(0);
  if (!firstpage.hasClass("active")) {
    $("#info-prev").trigger("click");
  }
}
function insertOneItem(element, index) {
  var $elem = $(
    `
              <a href="#" _id="${index}" class="list-group-item list-group-item-action flex-column align-items-start">
                  <div class="d-flex w-100 justify-content-between">
                      <h6 class="mb-1">${element.properties.xiaoqu}</h6>
                      <h6 class="text-right badge badge-primary text-nowrap">${priceFormatter(
                        element.properties.price
                      )}</h6>
                  </div>
                  <p class="mb-1">${element.properties.district}区，${
      element.properties.area
    }</p>
              </a>
          `
  );
  var coordinates = transform(element.geometry.coordinates, code, "EPSG:3857");
  addTag(coordinates, index);
  $elem.on("click", function (elem) {
    // 获得选择的小区
    var item_index = $(this).attr("_id");
    var item = searchResults[item_index];
    // 重新定位到该小区
    var transformedCor = transform(
      item.geometry.coordinates,
      code,
      "EPSG:3857"
    );
    changeCenter(transformedCor);
    addSelect(transformedCor);
    showInfo(item);
  });
  searchPanel.append($elem);
}

function insertItem(js) {
  js.forEach((element, index) => insertOneItem(element, index));
}

export function advancedSearch(e) {
  e.preventDefault();
  showList();
  var multipolygon = getMultiPolygon();
  var price = getPriceRange();
  var transport = getTransportRange();

  var data = {
    polygon: multipolygon,
    price: price,
    transport: transport,
    type: "advanced",
  };
  console.log(data);
  fetch(search_url, {
    mode: "cors",
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  })
    .then((response) => response.json())
    .then(solveResult);
}

function solveResult(js) {
  searchResults = js;
  searchPanel.children().remove(); // remove items

  if ($("#result-card").css("display") == "none") {
    $("#result-button").trigger("click");
  }

  insertItem(js);
}

export function polygonSearch(polygons) {
  polygons.forEach((item) => {
    console.log(item);
  });
}

export function getPrice(item) {
  var data = {
    item: item.properties,
    type: "prices",
  };
  console.log(JSON.stringify(item));
  return fetch(search_url, {
    mode: "cors",
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((js) => {
      updateChart(js);
    });
}
