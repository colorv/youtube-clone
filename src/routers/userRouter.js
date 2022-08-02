import express from "express";
import {
  edit,
  remove,
  logout,
  see,
  githubLogin,
  githubLoginCallback,
  kakaoLogin,
  kakaoLoginCallback,
} from "../controllers/userController";

const userRouter = express.Router();

// github Login
userRouter.get("/github/login", githubLogin);
userRouter.get("/github/callback", githubLoginCallback);
// kakao Login
userRouter.get("/kakao/login", kakaoLogin);
userRouter.get("/kakao/callback", kakaoLoginCallback);

// 기본적인 동작만 수행하므로 수정 해야함
userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/:id", see);

export default userRouter;
