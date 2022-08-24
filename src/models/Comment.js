import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true, ref: "User" },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  like: { type: Number, default: 0 },
  disLike: { type: Number, default: 0 },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
