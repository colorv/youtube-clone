import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  upload,
  removeVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);

videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

// 기본적인 동작만 수행하므로 수정 해야함
videoRouter.get("/:id(\\d+)/remove", removeVideo);
videoRouter.get("/upload", upload);

export default videoRouter;
