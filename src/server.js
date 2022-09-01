import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

// view engine
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
// 글로벌 미들웨어
app.use(logger);
app.use(express.urlencoded({ extended: true })); // form의 value를 가져오는 미들웨어
// app.use(express.text()); // req로 들어오는 text를 이해하는 미들웨어
app.use(express.json()); // 데이터를 받아서 string파일로 만들어주거나 String을 받아서 JS Obj로 바꿔준다.
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
// app.use((req, res, next) => {
//   res.header("Cross-Origin-Embedder-Policy", "require-corp");
//   res.header("Cross-Origin-Opener-Policy", "same-origin");
//   next();
// });
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(localsMiddleware);
// 라우터
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);
//static
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

export default app;
