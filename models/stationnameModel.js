const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const stationNameSchema = new mongoose.Schema({
  station_name: {
    type: String,
    default: undefined,
  },
});

module.exports = mongoose.model("StationName", stationNameSchema);