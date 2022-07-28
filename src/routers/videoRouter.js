import express from "express";
import {
  watch,
  removeVideo,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);

videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);

videoRouter.route("/upload").get(getUpload).post(postUpload);

// 기본적인 동작만 수행하므로 수정 해야함
videoRouter.get("/:id([0-9a-f]{24})/remove", removeVideo);

export default videoRouter;
