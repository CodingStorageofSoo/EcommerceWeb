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

const multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

// const { writeRouter } = require("./routes/writeRouter");
// app.use("/", writeRouter);

app.get("/images", (req, res) => {
  res.sendFile(path.join(__dirname + "/images.html"));
});

app.post("/images/upload", upload.single("photo"), function (요청, 응답) {
  응답.send("업로드완료");
});

app.get("/images/:imageName", (req, res) =>
  res.sendFile(path.join(__dirname + "/images/" + req.params.imageName))
);
