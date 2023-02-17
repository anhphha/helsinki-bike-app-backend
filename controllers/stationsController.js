const Station = require("../models/stationNameModel");
const prompt = require("prompt");

//Get all stations
//@route GET / stations
//@access Private
const getStations = async (req, res) => {
  // Get stations from MongoDB
  const stations = await Station.find().lean();


  // If no station
  if (!stations?.length) {
    return res.status(400).json({ message: "No station found" });
  } //research 200, 204 error and 400 error

  res.json(stations);
};

module.exports = { getStations };
