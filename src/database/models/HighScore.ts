import mongoose from "mongoose";

const HighScoreSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Please provide a user."],
  },
  score: {
    type: Number,
    required: [true, "Please provide a score."],
  },
});

export default mongoose.models.HighScore ||
  mongoose.model("HighScore", HighScoreSchema);
