import mongoose from "mongoose";

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

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;
