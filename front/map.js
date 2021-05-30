/*
 * @Author: 小田
 * @Date: 2021-05-31 01:00:05
 * @LastEditTime: 2021-05-31 01:21:05
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

export function addTag(coordinates) {
  map.getLayers().forEach((item, index) => {
    console.log(index);
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
