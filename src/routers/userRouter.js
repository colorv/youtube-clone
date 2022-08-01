import express from "express";
import {
  edit,
  remove,
  logout,
  see,
  githubLogin,
  githubLoginCallback,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/github/login", githubLogin);
userRouter.get("/github/callback", githubLoginCallback);

// 기본적인 동작만 수행하므로 수정 해야함
userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/:id", see);

export default userRouter;
