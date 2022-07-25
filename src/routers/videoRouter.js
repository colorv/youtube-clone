import express from "express";
import {
  watch,
  upload,
  removeVideo,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);

videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

videoRouter.route("/upload").get(getUpload).post(postUpload);

// 기본적인 동작만 수행하므로 수정 해야함
videoRouter.get("/:id(\\d+)/remove", removeVideo);

export default videoRouter;
