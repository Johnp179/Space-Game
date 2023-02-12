import mongoose from "mongoose";

/* PetSchema will correspond to a collection in your MongoDB database. */
const HighScoreSchema = new mongoose.Schema({
  user: String,
  score: Number,
});

export default mongoose.models.HighScore ||
  mongoose.model("HighScore", HighScoreSchema);
