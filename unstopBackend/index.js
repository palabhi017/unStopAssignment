const express = require("express");
const app = express();
const { seatRouter } = require("./Routes/book.route");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.mongoURL);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


app.use(cors());
app.use(express.json());
app.use("/seats", seatRouter);


connectDB().then(() => {
  app.listen(process.env.port, () => {
    console.log("listening for requests");
  });
});
