const { Router } = require("express");
const postRouter = Router();
const Posts = require("../models/Posts");

postRouter.get("/", async (req, res) => {
  res.render("post.ejs");
});

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

postRouter.post("/add", upload.single("photo"), async (req, res) => {
  const posts = await new Posts({
    title: req.body.title,
    photo: req.file.filename,
    description: req.body.description,
  }).save();
  res.render("post.ejs");
});

module.exports = { postRouter };
