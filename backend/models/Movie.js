import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: String,
  type: String, // movie, series, documentary
  genre: String,
  language: String,
  ott: String,
  duration: String,
  cast: [String],
  description: String,
  cover: String
});

export default mongoose.model("Movie", movieSchema);
