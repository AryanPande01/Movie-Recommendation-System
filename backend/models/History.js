// import mongoose from "mongoose";

// const historySchema = new mongoose.Schema({
//   userId: mongoose.Schema.Types.ObjectId,
//   movieId: String, // store as mediaType:id (e.g. movie:12345) to avoid coupling to local Movie model
//   mediaType: String,
//   reason: String,
//   movieData: { type: Object },
//   filters: { type: Object },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model("History", historySchema);

import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filters: {
      category: String,
      language: String,
      genre: String,
      region: String,
    },
    results: { type: Array, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("History", HistorySchema);
