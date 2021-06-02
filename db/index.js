/*
 * @Author: 小田
 * @Date: 2021-06-01 16:44:57
 * @LastEditTime: 2021-06-01 22:08:23
 */
const { MongoClient } = require("mongodb");

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

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb://username:password@xiaotianxt.cn/lianjia?retryWrites=true&writeConcern=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("lianjia");
    const locations = database.collection("location");

    await locations.find({}).forEach((item) => {
      var oriCoordinates = item.geometry.coordinates;
      var desCoordinates = gcj2wgs(oriCoordinates[0], oriCoordinates[1]);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
