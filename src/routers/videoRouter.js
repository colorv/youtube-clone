import express from "express";
import { see, edit, upload, removeVideo } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/remove", removeVideo);
videoRouter.get("/upload", upload);

export default videoRouter;
