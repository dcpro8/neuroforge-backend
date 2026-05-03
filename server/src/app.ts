import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import generateRoutes from "./routes/generate.routes";
import { sanitizeInput } from "./middlewares/sanitize";

import { env } from "./config/env";

const app = express();

// security
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

// CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    methods: ["GET", "POST"],
  })
);

// rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(sanitizeInput);
app.use("/api", generateRoutes);
app.use("/", generateRoutes);

// health
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

export default app;