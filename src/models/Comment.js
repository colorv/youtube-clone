import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true, ref: "User" },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  like: { type: Number, default: 0 },
  likeUser: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  ],
  disLike: { type: Number, default: 0 },
  disLikeUser: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  ],
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
