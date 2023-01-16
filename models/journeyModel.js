const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const journeySchema = new mongoose.Schema({
  departure_time: {
    type: String,
    default: undefined,
  },
  return_time: {
    type: String,
    default: undefined,
  },
  departure_station_id: {
    type: String,
    default: undefined,
  },
  departure_station_name: {
    type: String,
    default: undefined,
  },
  return_station_id: {
    type: String,
    default: undefined,
  },
  return_station_name: {
    type: String,
    default: undefined,
  },
  covered_distance: {
    type: String,
    default: undefined,
  },
  duration: {
    type: String,
    default: undefined,
  },
});

module.exports = mongoose.model("Journey", journeySchema);
