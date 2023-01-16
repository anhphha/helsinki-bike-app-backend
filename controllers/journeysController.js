const Journey = require("../models/journeyModel");

//Get all journeys
//@route GET / journeys
//@access Private
const getJourneys = async (req, res) => {
  // Get journeys from MongoDB
  const journeys = await Journey.find().lean();

  // If no journey
  if (!journeys?.length) {
    return res.status(400).json({ message: "No journey found" });
  }
  res.json(journeys);
};

//Set new journeys
//@route POST / journeys
//@access Private
const createJourneys = async (req, res) => {
  console.log(req.body);
  const { departure_time, return_time, departure_station_name, return_station_name } =
  req.body;
  // req.body["Departure station name"];
  // Confirm data
  if (
    !departure_time ||
    !return_time ||
    !departure_station_name ||
    !return_station_name
  ) {
    return res.status(400).json({ message: "Please add a journey" });
  }

  //Check for duplicate journey
  const duplicate = await Journey.findOne({ departure_time, return_time }).lean().exec();
  console.log(duplicate);
  console.log(departure_time);
  //Allow updates to the original user
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate journey" });
  }

  const journey = await Journey.create({
    departure_time: req.body.departure_time,
    return_time: req.body.return_time,
    departure_station_id: req.body.departure_station_id,
    departure_station_name: req.body.departure_station_name,
    return_station_id: req.body.return_station_id,
    return_station_name: req.body.return_station_name,
    covered_distance: req.body.covered_distance,
    duration: req.body.duration,
  });

  // Create and store new journey
  if (journey) {
    //created
    res
      .status(201)
      .json({ message: `New journey from ${departure_time} to ${return_time} received` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

module.exports = { getJourneys, createJourneys };
