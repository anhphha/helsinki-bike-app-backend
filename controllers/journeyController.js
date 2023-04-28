const journeySchema = require("../models/journeyModel");

const searchJourney = async (req, res) => { //Fat arrow
  try {
    console.log(req.query);

    //Good Solution
    const departureStationId = req.query.departure_station_id
      ? Number(req.query.departure_station_id)
      : undefined;
    const returnStationId = req.query.return_station_id
      ? Number(req.query.return_station_id)
      : undefined;
    if (!departureStationId && !returnStationId) {
      return res.status(400).json({
        message: "must have either departure or return station id",
      });
    }

    const hasAllQuery = {};
    if (departureStationId) {
      hasAllQuery.departure_station_id = departureStationId;
    }
    if (returnStationId) {
      hasAllQuery.return_station_id = returnStationId;
    }
    console.log({ hasAllQuery });

    const journeyResult = await journeySchema.find(hasAllQuery);

    if (!journeyResult.length) {
      return res.status(404).json({ message: "No journey found" });
    }

    res.json(journeyResult);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: e.message });
  }
};

module.exports = { searchJourney };
