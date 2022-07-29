import express from "express";
import { home, search } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);

// 기본적인 동작만 수행하므로 수정 해야함
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
