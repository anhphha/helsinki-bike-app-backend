const stationSchema = require("../models/stationModel");

class stationController {
  async searchStation(req, res) {
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
  }
}

module.exports = new stationController();
