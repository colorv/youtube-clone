import express from "express";
import { home, search } from "../controllers/videoController";
import { login, getJoin, postJoin } from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.route("/join").get(getJoin).post(postJoin);

// 기본적인 동작만 수행하므로 수정 해야함
rootRouter.get("/login", login);

export default rootRouter;
