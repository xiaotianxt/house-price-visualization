/*
 * @Author: 小田
 * @Date: 2021-05-29 14:08:24
 * @LastEditTime: 2021-06-07 19:52:00
 */
// jQuery
import $ from "jquery";
window.jQuery = $;
jQuery = $;
window.$ = window.jQuery;
global.$ = $;

import {
  initMap,
  editPolygon,
  addPolygon,
  finishPolygon,
  removePolygon,
  removeAllPolygon,
} from "./map";
import { initUI } from "./ui";
import { simpleNameSearch, advancedSearch } from "./server";

// 网页载入初始化
$(function () {
  // 初始化地图要素
  initMap();

  // 初始化交互控制模块
  initUI();

  // 小区搜索函数
  $("#xiaoqu-locate").on("submit", simpleNameSearch);
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
  $(".loader-wrapper").fadeOut("s");
});
