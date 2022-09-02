import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const inHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "aws-youtube",
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `images/${Date.now()}_${file.originalname}`);
  },
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "aws-youtube",
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `videos/${Date.now()}_${file.originalname}`);
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Youtube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  res.locals.inHeroku = inHeroku;
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
  storage: inHeroku ? s3ImageUploader : undefined,
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
    storage: inHeroku ? s3VideoUploader : undefined,
  }).fields([{ name: "video" }, { name: "thumb" }]);

  videoMulter(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).render("videos/uploadVideo", {
        pageTitle: "Upload",
        errorMessage: err.message,
      });
    }
    next();
  });
};
