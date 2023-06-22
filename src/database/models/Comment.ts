import mongoose from "mongoose";

export interface IComment {
  _id: string;
  author: string;
  content: string;
}

const CommentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, "Please provide an author."],
  },
  content: {
    type: String,
    required: [true, "Please provide the content."],
  },
});

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
