const stationSchema = require("../models/stationModel");
const { searchStation } = require("./station2Controller");
const station2Controller = require("../controllers/station2Controller");

// Test the database
describe("searchStation", () => {
  it("should provide data from stationSchema", async () => {
    const mockReq = { query: { station_name: "Test Station" } };
    const mockRes = { json: jest.fn() };
    const expectedData = [{ name: "Test Station", id: 123 }];

    jest.spyOn(stationSchema, "aggregate").mockResolvedValue(expectedData);

    await searchStation(mockReq, mockRes);

    expect(stationSchema.aggregate).toHaveBeenCalledWith([
      {
        $search: {
          index: "id_station",
          autocomplete: {
            query: "Test Station",
            path: "name",
            fuzzy: { maxEdits: 1, prefixLength: 2 },
          },
        },
      },
    ]);
    expect(mockRes.json).toHaveBeenCalledWith(expectedData);
  });

  it("should handle errors", async () => {
    const mockReq = { query: { station_name: "Test Station" } };
    const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const expectedError = new Error("Test Error");

    jest.spyOn(stationSchema, "aggregate").mockRejectedValue(expectedError);

    await searchStation(mockReq, mockRes);

    expect(stationSchema.aggregate).toHaveBeenCalledWith([
      {
        $search: {
          index: "id_station",
          autocomplete: {
            query: "Test Station",
            path: "name",
            fuzzy: { maxEdits: 1, prefixLength: 2 },
          },
        },
      },
    ]);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: expectedError.message,
    });
  });
});

// Test the aggregate function
describe("Station Controller", () => {
  describe("searchStation", () => {
    it("should return data from the schema", async () => {
      const req = {
        query: {
          station_name: "example station",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const expectedData = [
        {
          _id: "123",
          name: "example station",
          location: { type: "Point", coordinates: [0, 0] },
        },
        {
          _id: "456",
          name: "example station 2",
          location: {
            type: "Point",
            coordinates: [1, 1],
          },
        },
      ];
      jest
        .spyOn(stationSchema, "aggregate")
        .mockResolvedValueOnce(expectedData);
      await station2Controller.searchStation(req, res);
      expect(stationSchema.aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: "id_station",
            autocomplete: {
              query: "example station",
              path: "name",
              fuzzy: {
                maxEdits: 1,
                prefixLength: 2,
              },
            },
          },
        },
      ]);
      expect(res.json).toHaveBeenCalledWith(expectedData);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });
});

// const stationSchema = require('../models/stationyModel');

// describe("stationSchema", () => {
//     describe("read function", () => {
//       it("should return an array of stations", async () => {
//         const stations = await stationSchema.find({});
//         expect(stations).toBeInstanceOf(Array);
//         expect(stations.length).toBeGreaterThan(0);
//         expect(stations[0]).toHaveProperty("name");
//         expect(stations[0]).toHaveProperty("location");
//       }, 60000);

//       it("should return an empty array if there are no stations", async () => {
//         // Assuming there are no stations in the database
//         const stations = await stationSchema.find({});
//         expect(stations).toBeInstanceOf(Array);
//         expect(stations.length).toEqual(0);
//       }, 60000);
//     });
//   });