import express from "express";
import routes from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import SocketHandlers from "./modules/socketHandlers.js";
import { setSocketHandlers } from "./modules/donations/donation.service.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://afaraid-admin.kirbgebeya.com",
      "https://afaraid.kirbgebeya.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", routes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
