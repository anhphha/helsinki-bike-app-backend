const Station = require("../models/stationModel");
// const asyncHandler = require("express-async-handler");

//Get all searches
//@route GET / searches
//@access Private
const getSearched = async (req, res) => {
  try {
    const searchedStation = req.query.station;
    if (!searchedStation) {
      return res.status(400).send("station not defined")
    }

    console.log("", searchedStation[0]);
    const Capitalize =
      searchedStation[0].toUpperCase() + searchedStation.substring(1);
    console.log("", Capitalize);

    const station = await Station.find({ nimi: `${Capitalize}` });
    if (station.length === 0) {
      res.write("<h1> No result </h1>");
    } else {
      const result = { result: [station[0]] };
      res.json(result);
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = { getSearched };
