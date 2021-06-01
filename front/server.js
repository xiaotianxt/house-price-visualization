/*
 * @Author: 小田
 * @Date: 2021-05-31 13:24:12
 * @LastEditTime: 2021-06-01 15:44:24
 */

// jQuery
const $ = require("jquery");
window.jQuery = $;
jQuery = $;
window.$ = window.jQuery;

// map.js
import { changeCenter, addTag, showInfo } from "./map";

export const url = "http://10.128.169.80:5000";
export const searchPanel = $("#search-result-panel"); // 结果记录位置
export var searchResults; // 小区搜索结果

export const priceFormatter = function (price) {
  if (price >= 1000) {
    return Math.round(price / 1000).toString() + "k";
  } else {
    return "暂无";
  }
};

export function xiaoquSearch(e) {
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
      searchResults = js;
      searchPanel.children().remove();
      if ($("#result-card").css("display") == "none") {
        $("#result-button").trigger("click");
      }
      js.forEach((element, index) => {
        console.log(element);
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
        $elem.on("click", function (elem) {
          var item_index = $(this).attr("_id");
          var item = searchResults[item_index];
          changeCenter(item.geometry.coordinates);
          addTag(item.geometry.coordinates);
          showInfo(item);
        });
        searchPanel.append($elem);
      });
    });
}

export function polygonSearch(polygons) {
  polygons.forEach((item) => {
    console.log(item);
  });
}
