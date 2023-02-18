const { Int32 } = require("mongodb");
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
    type: Number,
    default: undefined,
  },
  departure_station_name: {
    type: String,
    default: undefined,
  },
  return_station_id: {
    type: Number,
    default: undefined,
  },
  return_station_name: {
    type: String,
    default: undefined,
  },
  covered_distance: {
    type: Number,
    default: undefined,
  },
  duration: {
    type: Number,
    default: undefined,
  },
});

module.exports = mongoose.model("journeys", journeySchema);
