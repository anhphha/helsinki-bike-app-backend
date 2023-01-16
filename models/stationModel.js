const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const stationSchema = new mongoose.Schema({
  fid: {
    type: String,
    default: undefined,
  },
  id: {
    type: String,
    default: undefined,
  },
  nimi: {
    type: String,
    default: undefined,
  },
  namn: {
    type: String,
    default: undefined,
  },
  name: {
    type: String,
    default: undefined,
  },
  osoite: {
    type: String,
    default: undefined,
  },
  adress: {
    type: String,
    default: undefined,
  },
  kaupunki: {
    type: String,
    default: undefined,
  },
  stad: {
    type: String,
    default: undefined,
  },
  operaattor: {
    type: String,
    default: undefined,
  },
  kapasiteet: {
    type: String,
    default: undefined,
  },
  x: {
    type: String,
    default: undefined,
  },
  y: {
    type: String,
    default: undefined,
  },
});

module.exports = mongoose.model("Station", stationSchema);
