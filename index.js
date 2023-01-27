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
const stationnameSchema = require("./models/stationnameModel");


const PORT = process.env.PORT || 3001;
const app = express();

console.log(process.env.NODE_ENV);
ConnectDB();

// app.use(logger);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cors(corsOptions));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** RESTFUL API */

// app.use("/", express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log(req.body);
});

app.post("/", (req, res) => {
  res.json(req.body);
  console.log(req.body);
  res.send("POST request to homepage");
});

// app.all("*", (err, req, res, next) => {
//   console.error(err);
//   res.status(404);
//   if (req.accepts("html")) {
//     res.sendFile(path.join(__dirname, "views", "404.html"));
//   } else if (req.accepts("json")) {
//     res.json({ message: "404 Not Found" });
//   } else {
//     res.type("txt").send("404 Not Found");
//   }
// });

/** Routes */
app.use("/", require("./routes/root"));
app.use("/journeys", require("./routes/journeysRoutes"));
app.use("/stations", require("./routes/stationsRoutes"));
app.use("/stations/search", require("./routes/searchRoutes"));
app.use("/journeys/search", require("./routes/detailsRoutes"));


//Autocomplete
app.get("/search", async (req, res) => {
  try {
    console.log(req.query);
    let result = await journeySchema.aggregate([
      {
        $search: {
          index: "Autocomplete",
          compound: {
            should: [{
              autocomplete: {
                query: `"${req.query.departure_station}"`,
                path: "departure_station_name",
              },
              autocomplete: {
                query: `"${req.query.return_station}"`,
                path: "return_station_name",
              },
            }]
          }
        },
      },

      // {
      //   $search: {
      //     index: "Autocomplete",
      //     autocomplete: {
      //       query: `"${req.query.departure_station}"`,
      //       path: "departure_station_name",
      //       // path: "return_station_name",
      //       // fuzzy: {
      //       //   maxEdits: 1,
      //       // },
      //     },
      //   },
      // },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 1,
          departure_station_name: 1,
          return_station_name: 1,
        },
      },
    ]);
    res.json(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

//Station Data Autocomplete
app.get("/search", async (req, res) => {
  try {
    console.log(req.query);
    let result = await stationnameSchema.aggregate([
      {
        $search: {
          index: "Station Data Autocomplete",
          autocomplete: {
            query: `"${req.query.station_name}"`,
            path: "station_name",
            // path: "return_station_name",
            // fuzzy: {
            //   maxEdits: 1,
            // },
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 1,
          station_name: 1,
        },
      },
    ]);
    res.json(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Read data files (not from MongoDB)
// const fileOps = async () => {
//   try {
//     const data1 = await fsPromises.readFile(
//       path.join(__dirname, "data", "2021-05_3.json"),
//       "utf-8"
//     );
//     console.log(JSON.parse(data1));
//     const data2 = await fsPromises.readFile(
//       path.join(__dirname, "data", "2021-06_3.json"),
//       "utf-8"
//     );
//     console.log(JSON.parse(data2));
//     const data3 = await fsPromises.readFile(
//       path.join(__dirname, "data", "2021-07_3.json"),
//       "utf-8"
//     );
//     console.log(JSON.parse(data3));
//     const data4 = await fsPromises.readFile(
//       path.join(
//         __dirname,
//         "data",
//         "Helsingin_ja_Espoon_kaupunkiasemat_avoin_3.json"
//       ),
//       "utf-8"
//     );
//     console.log(JSON.parse(data4));
//   } catch (err) {
//     console.error(err);
//   }
// };
//fileOps();

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
