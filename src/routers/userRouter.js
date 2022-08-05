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
  avatarUpload,
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
  .post(avatarUpload.single("avatar"), postEdit);

userRouter
  .route("/change-password")
  .all(protectMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter.get("/:id", see);

export default userRouter;
