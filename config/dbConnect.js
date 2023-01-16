const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const ConnectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URI);
        console.log(`MongoDB connected: ${conn.connection.host} `);
    } catch (err) {
        console.log(err);
    }
};

require("../models/journeyModel");

module.exports = ConnectDB;