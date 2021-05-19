/*
 * @Author: 小田
 * @Date: 2021-05-18 20:55:07
 * @LastEditTime: 2021-05-18 22:39:27
 */

import { load } from "@amap/amap-jsapi-loader";

var map = null;
load({
  key: "e0dcec85bfafdc23020f5bbd88c3ddec", // 申请好的Web端开发者Key，首次调用 load 时必填
  plugins: ["AMap.Scale", "AMap.ToolBar"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  version: "2.0",
  AMapUI: {
    // 是否加载 AMapUI，缺省不加载
    version: "1.1", // AMapUI 缺省 1.1
    plugins: [], // 需要加载的 AMapUI ui插件
  },
  Loca: {
    // 是否加载 Loca， 缺省不加载
    version: "1.3.2", // Loca 版本，缺省 1.3.2
  },
})
  .then((AMap) => {
    map = new AMap.Map("container");
  })
  .catch((e) => {
    console.log(e);
  });

function setPosition(lng, lat) {
  map.setCenter(new AMap.LngLat(lng, lat));
  map.setZoom(16);
}
