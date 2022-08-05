import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Youtube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  return next();
};

export const protectMiddleware = (req, res, next) => {
  // 로그인하지 않은 유저가 원하지 않는 페이지로 갈 경우 /login 으로 리다이렉트
  if (!res.locals.loggedIn) {
    return res.status(400).redirect("/login");
  }
  return next();
};

export const publicOnlyMiddleware = (req, res, next) => {
  // 로그인한 유저가 원하지 않는 페이지로로 갈 경우 /으로 리다이렉트
  if (res.locals.loggedIn) {
    return res.status(400).redirect("/");
  }
  return next();
};

export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: { fileSize: 10000000 },
});

// export const videoUpload = multer({
//   dest: "uploads/videos",
//   limits: { fileSize: 10 },
// });
// ▲ multer doc참조해서 오류처리, 밑으로 바뀜

export const videoUpload = (req, res, next) => {
  const videoMulter = multer({
    dest: "uploads/videos",
    limits: { fileSize: 100000000 },
  });
  videoMulter.single("video")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).render("videos/uploadVideo", {
        pageTitle: "Upload",
        errorMessage: err.message,
      });
    }
    next();
  });
};
