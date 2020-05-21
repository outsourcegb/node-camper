const NodeGeoCoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  // fetch: customFetchImplementation,
  apiKey: "ckTOxfKWKXxIdkFLmJVDm5OGIwofckuG", // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;
