require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const ConnectDB = require("./config/dbConnect");
const journeySchema = require("./models/journeyModel");
const stationSchema = require("./models/stationModel");
const { pipeline } = require("stream");
const PORT = process.env.PORT || 3001;
const app = express();

console.log(process.env.NODE_ENV);
ConnectDB();

// Cors_ Cross origin resource sharing_ Security usage
app.use(cors(corsOptions));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** RESTFUL API */

// Home page
app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log(req.body);
});

//Autocomplete
app.get("/search", async (req, res) => {
  try {
    console.log(req.query);
    //let result = await stationSchema.find({});
    let result = await stationSchema.aggregate([
      {
        $search: {
          index: "id_station",
          autocomplete: {
            query: req.query.station_name,
            path: "name",
            fuzzy: {
              maxEdits: 1,
              prefixLength: 2,
            },
          },
        },
      },
    ]);
    res.json(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

//Journeys
app.get("/journeys", async (req, res) => {
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
});

// Remove redundant data
let redundantData = await journeySchema.deleteMany({

})


/** listen or Requests */
/** Connect to Mongo */
app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
  logEvents(
    `${err.no}: §{err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.Log"
  );
});
