import express from "express";
import {
  commentLikeAndDislike,
  createComment,
  deleteComment,
  registerView,
} from "../controllers/videoController";

const apiRouter = express();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/videos/:id([0-9a-f]{24})/comment-delete", deleteComment);
apiRouter.post("/comment-disLike", commentLikeAndDislike);
apiRouter.post("/comment-disLike", commentLikeAndDislike);

apiRouter.put;
export default apiRouter;
