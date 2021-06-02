/*
 * @Author: 小田
 * @Date: 2021-05-29 14:08:24
 * @LastEditTime: 2021-06-02 23:17:59
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
  $(".loader-wrapper").fadeOut("s");
});
