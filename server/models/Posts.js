const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    photo: { type: String, require: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("posts", PostsSchema);
