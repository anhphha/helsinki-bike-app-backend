// db.journeys.find().forEach((d) => {
//   //   d["return_station_id"] = parseFloat(d["return_station_id"]);
//   db.journeys.updateOne(
//     { _id: d["_id"] },
//     {
//       $set: {
//         departure_station_id: parseFloat(d["departure_station_id"]),
//         return_station_id: parseFloat(d["return_station_id"]),
//       },
//     }
//   );
// });

db.stations.deleteMany({});
