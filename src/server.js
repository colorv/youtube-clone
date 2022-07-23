import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4200;

const app = express();
const logger = morgan("dev");

// view engine
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
// 글로벌 로그 미들웨어
app.use(logger);
// 라우터
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT} 📡`);
app.listen(PORT, handleListening);
