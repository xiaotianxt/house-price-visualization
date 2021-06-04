/*
 * @Author: 小田
 * @Date: 2021-05-31 01:00:05
 * @LastEditTime: 2021-06-04 23:32:43
 */

import { Map, View, Feature } from "ol";
import { OSM, Vector as VectorSource } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Point } from "ol/geom";
import { transform } from "ol/proj";
import { Style, Circle, Stroke, Fill } from "ol/style";
import { Draw, Modify, Select, Snap } from "ol/interaction";

import { GCJ02 } from "ol-proj-ch";
/* GCJ02 */
const code = GCJ02.CODE;

// jQuery
const $ = require("jquery");

export var map = null;
export var view = null;

// 小区点图层
export var xiaoquSource = null;
export var xiaoquLayer = null;
export var xiaoquSelect = null;

// 多边形编辑图层
export var polygonSource = null; // 多边形矢量
export var polygonLayer = null; // 多边形矢量图层
export var polygonDraw = null; // 绘制多边形
export var polygonModify = null; // 编辑多边形
export var polygonSelect = null; // 选择多边形
export var polygonSnap = null;

function initXiaoquLayer() {
  xiaoquSource = new VectorSource();
  xiaoquLayer = new VectorLayer({
    source: xiaoquSource,
    style: new Style({
      image: new Circle({
        radius: 8,
        stroke: new Stroke({
          color: "#0D7FFB",
          width: 3,
        }),
        fill: new Fill({
          color: "#3395FF",
        }),
      }),
    }),
    usage: "xiaoqu",
  });
  map.addLayer(xiaoquLayer);
}
export function addTag(coordinates) {
  if (xiaoquLayer == null) {
    initXiaoquLayer();
  }
  xiaoquSource.addFeature(
    new Feature({
      geometry: new Point(coordinates),
    })
  );
  console.log(xiaoquLayer.getSource());
}

export function changeCenter(coordinates) {
  view.animate({
    center: coordinates,
    zoom: 17,
    duration: 1000,
  });
}

export function initMap() {
  view = new View({
    center: transform(
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

  polygonSelect = new Select();
}

function initMapClick() {
  map.on("singleclick", function (e) {
    console.log(
      transform(
        map.getEventCoordinate(e.originalEvent),
        "EPSG:3857",
        "EPSG:4326"
      )
    );
    console.log(`web: ${map.getEventCoordinate(e.originalEvent)}`);
  });
}

export function initPolygonEdit() {
  polygonSource = new VectorSource({ wrapX: false });
  polygonLayer = new VectorLayer({
    source: polygonSource,
    usage: "polygon",
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.5)",
      }),
      stroke: new Stroke({
        color: "#ffcc33",
        width: 2,
      }),
    }),
  });
  map.addLayer(polygonLayer);
  initInteraction();
}

export function addPolygon(e) {
  e.preventDefault();
  removeInteraction();
  // 添加多边形
  if (polygonLayer == null) {
    initPolygonEdit();
  }

  map.addInteraction(polygonDraw);
  map.addInteraction(polygonSnap);
}

export function editPolygon(e) {
  e.preventDefault();
  if (polygonLayer == null) {
    return; // 此时不需要考虑编辑多边形, 失效
  }
  removeInteraction();

  map.addInteraction(polygonModify);
  map.addInteraction(polygonSelect);
  map.addInteraction(polygonSnap);
}

export function finishPolygon(e) {
  e.preventDefault();
  removeInteraction();
}

export function getMultiPolygon() {
  if (polygonSource == null) {
    return null;
  }
  if (!$("#polygon-checkbox").is(":checked")) {
    return null;
  }
  var polygons = polygonSource
    .getFeatures()
    .map((feature) => {
      return feature.getGeometry();
    })
    .map((polygon) => {
      var coord = polygon.getCoordinates()[0];
      console.log(coord);
      return [coord.map((coord) => transform(coord, "EPSG:3857", code))];
    });

  // 需要将所有坐标转化成其他的
  console.log(polygons);
  return polygons;
}

export function removePolygon(e) {
  e.preventDefault();
  removeInteraction();

  map.addInteraction(polygonSelect);

  if (polygonLayer == null) {
    // 此时不需要考虑删除多边形, 因为压根没有编辑多边形
  }
  polygonSelect.on("select", function (e) {
    e.preventDefault();
    e.selected.forEach((item) => {
      polygonSource.removeFeature(item);
    });
  });
}

export function removeAllPolygon(e) {
  e.preventDefault();
  removeInteraction();
  polygonSource.clear();
}

export function stopDraw() {
  removeInteraction();
  map.addInteraction(polygonSelect);
  map.addInteraction(polygonSnap);
  polygonDraw = null;
}
