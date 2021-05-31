/*
 * @Author: 小田
 * @Date: 2021-05-31 01:00:05
 * @LastEditTime: 2021-05-31 19:08:57
 */
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
const $ = require("jquery");

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

var map = null;
var view = null;

export function addTag(coordinates) {
  map.getLayers().forEach((item, index) => {
    console.log("选择了第：" + index + "项");
    console.log(item);
    if (index != 0 && item.values_.usage == "xiaoqu") {
      map.removeLayer(item);
    }
  });
  const features = [
    new Feature({
      geometry: new geom.Point(gcj2web(coordinates)),
    }),
  ];
  // create the source and layer for random features
  const vectorSource = new source.Vector({
    features,
  });
  const vectorLayer = new layer.Vector({
    source: vectorSource,
    style: new style.Style({
      image: new style.Circle({
        radius: 8,
        stroke: new style.Stroke({
          color: "#0D7FFB",
          width: 3,
        }),
        fill: new style.Fill({
          color: "#3395FF",
        }),
      }),
    }),
    usage: "xiaoqu",
  });
  map.addLayer(vectorLayer);
}

export function changeCenter(coordinates) {
  view.animate({
    center: gcj2web(coordinates),
    zoom: 17,
    duration: 1000,
  });
}

export function initMap() {
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
}

export function showInfo(item) {
  console.log(item);
}
