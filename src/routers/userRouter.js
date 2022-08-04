import express from "express";
import {
  logout,
  see,
  githubLogin,
  githubLoginCallback,
  kakaoLogin,
  kakaoLoginCallback,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  protectMiddleware,
  publicOnlyMiddleware,
  uploadMiddleware,
} from "../middlewares";

const userRouter = express.Router();

// github Login
userRouter.get("/github/login", publicOnlyMiddleware, githubLogin);
userRouter.get("/github/callback", publicOnlyMiddleware, githubLoginCallback);
// kakao Login
userRouter.get("/kakao/login", publicOnlyMiddleware, kakaoLogin);
userRouter.get("/kakao/callback", publicOnlyMiddleware, kakaoLoginCallback);

userRouter.get("/logout", protectMiddleware, logout);

userRouter
  .route("/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(uploadMiddleware.single("avatar"), postEdit);

userRouter
  .route("/change-password")
  .all(protectMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

// 기본적인 동작만 수행하므로 수정 해야함
userRouter.get("/:id", see);

export default userRouter;
