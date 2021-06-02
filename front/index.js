/*
 * @Author: 小田
 * @Date: 2021-05-29 14:08:24
 * @LastEditTime: 2021-06-01 15:21:05
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

// jQuery
import $ from "jquery";
window.jQuery = $;
jQuery = $;
window.$ = window.jQuery;
global.$ = $;

require("jquery-range/jquery.range.css");
require("jquery-range/jquery.range");

// 小工具

var pointLayer = null; // 用于标记点图层
var pointSource = null; // 用于标记点图层的数据

import {
  initMap,
  editPolygon,
  addPolygon,
  finishPolygon,
  removePolygon,
  removeAllPolygon,
} from "./map";
import { init } from "./ui";
import { xiaoquSearch, advancedSearch } from "./server";

$(function () {
  initMap();

  init();

  // 小区搜索函数
  $("#xiaoqu-locate").on("submit", xiaoquSearch);
  $("#advanced-search-button").on("click", advancedSearch);

  // 多边形的编辑工具
  $(".polygon-control-btns button").on("click", function () {
    $("#polygon-checkbox").prop("checked", true);
  });

  $("#add-polygon").on("click", addPolygon);
  $("#edit-polygon").on("click", editPolygon);
  $("#finish-polygon").on("click", finishPolygon);
  $("#remove-polygon").on("click", removePolygon);
  $("#remove-all-polygon").on("click", removeAllPolygon);
});

exports.map = map;
