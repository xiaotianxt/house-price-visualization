/*
 * @Author: 小田
 * @Date: 2021-05-29 14:08:24
 * @LastEditTime: 2021-05-31 01:21:29
 */

// openlayers
import "ol/ol.css";
import * as ol from "ol";
import { Map, View, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
const geom = require("ol/geom");
const proj = require("ol/proj");
const interaction = require("ol/interaction");
const layer = require("ol/layer");
const source = require("ol/source");
const style = require("ol/style");

// coordinates
const coordtransform = require("coordtransform");
var gcj2wgs = coordtransform.gcj02towgs84;
var gcj2web = function (item) {
  return proj.transform(gcj2wgs(item[0], item[1]), "EPSG:4326", "EPSG:3857");
};
var wgs2web = function (item) {
  return proj.transform(item, "EPSG:4326", "EPSG:3857");
};
var web2wgs = function (item) {
  return proj.transform(item, "EPSG:3857", "EPSG:4326");
};
var web2gcj = function (item) {
  item = web2wgs(item);
  return coordtransform.wgs84togcj02(item[0], item[1]);
};

// jQuery
const $ = require("jquery");
window.jQuery = $;
jQuery = $;
window.$ = window.jQuery;

// 小工具
const priceFormatter = function (price) {
  if (price >= 1000) {
    return Math.round(price / 1000).toString() + "k";
  } else {
    return "暂无交易";
  }
};

const url = "http://localhost:5000";
const searchPanel = $("#search-result-panel"); // 结果记录位置
var searchResultsXiaoqu; // 小区搜索结果
var view = null; // 地图对象的视角
var map = null; // 整个地图对象
var pointLayer = null; // 用于标记点图层
var pointSource = null; // 用于标记点图层的数据

function applyInitialUIState() {
  if (isConstrained()) {
    $(".sidebar-left .sidebar-body").fadeOut("slide");
    $(".sidebar-right .sidebar-body").fadeOut("slide");
    $(".mini-submenu-left").fadeIn();
    $(".mini-submenu-right").fadeIn();
  }
}

function changeCenter(coordinates) {
  view.animate({
    center: gcj2web(coordinates),
    zoom: 17,
    duration: 1000,
  });
}

function deleteTag(coordinates) {
  pointSource.forEachFeature((item) => {
    pointSource.removeFeature(item);
  });
  map.removeLayer(ponitLayer);
}

$(function () {
  view = new View({
    center: proj.transform(
      [116.39091924126066, 39.90675052053757],
      "EPSG:4326",
      "EPSG:3857"
    ),
    zoom: 10,
  });

  map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: view,
  });

  map.on("singleclick", function (e) {
    console.log(
      proj.transform(
        map.getEventCoordinate(e.originalEvent),
        "EPSG:3857",
        "EPSG:4326"
      )
    );
    console.log(`web: ${map.getEventCoordinate(e.originalEvent)}`);
    console.log(`wgs: ${web2gcj(map.getEventCoordinate(e.originalEvent))}`);
  });

  $(".sidebar-left .slide-submenu")
    .on("click", function () {
      var thisEl = $(this);
      thisEl.closest(".sidebar").fadeOut("slide", function () {
        $(".mini-submenu-left").toggle();
      });
    })
    .trigger("click");

  $(".mini-submenu-left").on("click", function () {
    var thisEl = $(this);
    $(".sidebar-left").toggle("slide");
    thisEl.hide();
  });

  $(".sidebar-right .slide-submenu")
    .on("click", function () {
      var thisEl = $(this);
      thisEl.closest(".sidebar").fadeOut("slide", function () {
        $(".mini-submenu-right").fadeIn();
      });
    })
    .trigger("click");

  $(".mini-submenu-right").on("click", function () {
    var thisEl = $(this);
    $(".sidebar-right").toggle("slide");
    thisEl.hide();
  });

  // 小区搜索函数
  $("#xiaoqu-locate").on("submit", function (e) {
    e.preventDefault();
    var xiaoqu = $("#xiaoqu-locate input").val();
    fetch(url + "/search?" + "xiaoqu=" + xiaoqu + "&type=xiaoqu", {
      mode: "cors",
      method: "get",
    })
      .then((res) => {
        return res.json();
      })
      .then((js) => {
        searchResultsXiaoqu = js;
        searchPanel.children().remove();
        js.forEach((element, index) => {
          console.log(element);
          var $elem = $(
            `
                <a href="#" _id="${index}" class="list-group-item list-group-item-action flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${element.properties.xiaoqu}</h5>
                        <h6 class="text-right badge badge-primary">${priceFormatter(
                          element.properties.price
                        )}</h6>
                    </div>
                    <p class="mb-1">${element.properties.district}区${
              element.properties.area
            }</p>
                </a>
            `
          );
          $elem.on("click", function (elem) {
            var item_index = $(this).attr("_id");
            var item = searchResultsXiaoqu[item_index];
            changeCenter(item.geometry.coordinates);
            addTag(item.geometry.coordinates);
          });
          searchPanel.append($elem);
        });
      });
  });
});
exports.map = map;
