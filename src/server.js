import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

// view engine
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
// 글로벌 미들웨어
app.use(logger);
app.use(express.urlencoded({ extended: true })); // form의 value를 가져오는 미들웨어
// 라우터
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
