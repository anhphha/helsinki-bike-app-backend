const Journey = require("../models/journeyModel");

const getDetails = async (res, req) => {
  const searchedStation = req.query.station;
  const departures = await Journey.find({
    departure_station_id: `${searchedStation}`,
  });

  const returns = await Journey.find({
    return_station_id: `${searchedStation}`,
  });

  const details = {
    stationID: searchedStation,
    depAmount: departures.length,
    retAmount: returns.length,
  };

  res.json(details);
};

module.exports = { getDetails };
