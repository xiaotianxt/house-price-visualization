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
const $ = require("jquery");
window.jQuery = $;
jQuery = $;
window.$ = window.jQuery;

// 小工具

var pointLayer = null; // 用于标记点图层
var pointSource = null; // 用于标记点图层的数据

import { initMap, editPolygon, addPolygon, finishPolygon } from "./map";
import { init } from "./ui";
import { xiaoquSearch } from "./server";

$(function () {
  initMap();

  init();

  // 小区搜索函数
  $("#xiaoqu-locate").on("submit", xiaoquSearch);

  // 多边形的编辑工具
  $("#add-polygon").on("click", addPolygon);
  $("#edit-polygon").on("click", editPolygon);
  $("#finish-polygon").on("click", finishPolygon);
});

exports.map = map;
