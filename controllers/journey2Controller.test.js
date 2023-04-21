const journeySchema = require('../models/journeyModel');

describe("journeySchema", () => {
    describe("read function", () => {
      it("should return an array of stations", async () => {
        const stations = await stationSchema.find({});
        expect(stations).toBeInstanceOf(Array);
        expect(stations.length).toBeGreaterThan(0);
        expect(stations[0]).toHaveProperty("name");
        expect(stations[0]).toHaveProperty("location");
      }, 60000);

      it("should return an empty array if there are no stations", async () => {
        // Assuming there are no stations in the database
        const stations = await stationSchema.find({});
        expect(stations).toBeInstanceOf(Array);
        expect(stations.length).toEqual(0);
      }, 60000);
    });
  });