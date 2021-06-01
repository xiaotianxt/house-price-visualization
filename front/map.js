/*
 * @Author: 小田
 * @Date: 2021-05-31 01:00:05
 * @LastEditTime: 2021-06-01 16:48:55
 */
import "ol/ol.css";
import { Map, View, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import { Polygon, MultiPolygon, Point } from "ol/geom";
import { OSM, Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";

const geom = require("ol/geom");
const proj = require("ol/proj");
const interaction = require("ol/interaction");
const layer = require("ol/layer");
const style = require("ol/style");
import { Draw, Modify, Select, Snap } from "ol/interaction";
import { polygonSearch } from "./server";
// jQuery
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

export var map = null;
export var view = null;

export var isDrawing = false;
export var polygonSource = null; // 多边形矢量
export var polygonLayer = null; // 多边形矢量图层
export var polygonDraw = null; // 绘制多边形
export var polygonModify = null; // 编辑多边形
export var polygonSelect = null; // 选择多边形
export var polygonSnap = null;

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
  const vectorSource = new polygonSource.Vector({
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

  initMapClick();
}

function initInteraction() {
  polygonDraw = new Draw({
    source: polygonSource,
    type: "Polygon",
  });
  polygonModify = new Modify({
    source: polygonSource,
  });
  polygonSelect = new Select({});
  polygonSnap = new Snap({
    source: polygonSource,
  });
}

function removeInteraction() {
  map.removeInteraction(polygonModify);
  map.removeInteraction(polygonSelect);
  map.removeInteraction(polygonSnap);
  map.removeInteraction(polygonDraw);
}

function initMapClick() {
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

export function initPolygonEdit() {
  polygonSource = new VectorSource({ wrapX: false });
  polygonLayer = new VectorLayer({
    source: polygonSource,
    usage: "polygon",
    style: new style.Style({
      fill: new style.Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new style.Stroke({
        color: "#ffcc33",
        width: 2,
      }),
    }),
  });
  map.addLayer(polygonLayer);
  initInteraction();
}

export function addPolygon(e) {
  // 添加多边形
  if (polygonLayer == null) {
    initPolygonEdit();
  }

  map.addInteraction(polygonDraw);
  map.addInteraction(polygonSnap);
}

export function editPolygon(e) {
  if (polygonLayer == null) {
    return; // 此时不需要考虑编辑多边形, 失效
  }
  removeInteraction();

  map.addInteraction(polygonModify);
  map.addInteraction(polygonSelect);
  map.addInteraction(polygonSnap);
}

export function finishPolygon(e) {
  removeInteraction();

  var polygons = polygonSource.getFeatures().map((feature) => {
    return feature.getGeometry();
  });
  var multipolygon = new MultiPolygon(polygons);
}

export function removePolygon(e) {
  if (polygonLayer == null) {
    // 此时不需要考虑删除多边形, 因为压根没有编辑多边形
  }
}

export function removeAllPolygon(e) {}

export function stopDraw() {
  removeInteraction();
  map.addInteraction(polygonSelect);
  map.addInteraction(polygonSnap);
  polygonDraw = null;
}

export function showInfo(item) {
  console.log(item);
}
