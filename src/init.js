import "./db";
import "./models/video";
import app from "./server";

const PORT = 4200;

const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT} 📡`);

app.listen(PORT, handleListening);
