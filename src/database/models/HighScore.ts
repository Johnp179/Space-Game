import mongoose from "mongoose";
export interface IHighScore {
  _id: string;
  username: string;
  score: number;
}

const HighScoreSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username."],
  },

  score: {
    type: Number,
    required: [true, "Please provide a score."],
  },
});

export default mongoose.models.HighScore ||
  mongoose.model("HighScore", HighScoreSchema);
