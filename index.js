require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
// const errorHandler = require("./middleware/errorHandler");
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
    /**
     * Tasks:
     * - Get value from req.query (departure_station_id, arrival_station_id)
     * - Transfer string to number using Number(). Example Number("115") => 115
     * - Add those values (departure_station_id, arrival_station_id) from queries to .find() below
     *
     *
     */
    const departureStationId = Number(req.query.departure_station_id);
    const returnStationId = Number(req.query.return_station_id);
    console.log("Departure Station ID:", departureStationId);
    console.log("Return Station ID:", returnStationId);

    let journeyResult = await journeySchema.find({
      departure_station_id: departureStationId,
      return_station_id: returnStationId,
    });

    if (!journeyResult) {
      return res.status(404).json({ message: "No journey found" });
    }

    res.json(journeyResult);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: e.message });
  }
});

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
