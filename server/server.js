require("dotenv").config();
const { MONGO_URI, PORT } = process.env;

const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log("Listening on Port");
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "/../client"));
app.set("view engine", "ejs");

const mongoose = require("mongoose");
mongoose
  .connect(MONGO_URI)
  .then(console.log("Connected with MongoDB"))
  .catch((err) => console.log(err));
