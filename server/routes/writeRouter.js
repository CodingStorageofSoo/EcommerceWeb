const { Router } = require("express");
const writeRouter = Router();
const Posts = require("../models/Posts");

writeRouter.get("/", async (req, res) => {
  res.render("write.ejs");
});

writeRouter.post("/add", async (req, res) => {
  const post = await new Posts(req.body).save();
});

module.exports = { writeRouter };
