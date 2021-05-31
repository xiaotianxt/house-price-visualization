/*
 * @Author: 小田
 * @Date: 2021-05-29 14:08:24
 * @LastEditTime: 2021-05-31 19:44:05
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

export var view = null; // 地图对象的视角
export var map = null; // 整个地图对象
var pointLayer = null; // 用于标记点图层
var pointSource = null; // 用于标记点图层的数据

import { addTag, changeCenter, initMap, showInfo } from "./map";
import { init } from "./ui";
import { xiaoquSearch } from "./server";

$(function () {
  initMap(view, map);

  init();

  // 小区搜索函数
  $("#xiaoqu-locate").on("submit", xiaoquSearch);
});

exports.map = map;
