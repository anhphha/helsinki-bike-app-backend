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
// app.get("/journey", async (req, res) => {
//   try {
//     console.log(req.query);
//     let journey_result = await journeySchema.find({});
//     res.json(journey_result);
//   } catch (e) {
//     res.status(500).send({ message: e.message });
//   }
// });

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
