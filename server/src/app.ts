import express, { type Response, type Request } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import providerRoutes from "./routes/provider.routes";
import serviceRoutes from "./routes/service.routes";
import adminRoutes from "./routes/admin.routes";
import { globalErrorHandler } from "./middleware/errorHandler";
import { sanitizeBody } from "./middleware/sanitize";
import { apiLimiter } from "./middleware/rateLimiter";
import categoryRoutes from "./routes/category.routes";

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(sanitizeBody);
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/status", (req: Request, res: Response): void => {
  res.status(200).json({ success: true, message: "server is working fine!" });
});

// Error Handling
app.use(globalErrorHandler);

export default app;
