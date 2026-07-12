import express, { type Response, type Request } from "express";
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import { globalErrorHandler } from './middleware/errorHandler';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
// app.use(mongoSanitize()); // Disabled due to conflict with Express 5
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

app.get("/status", (req: Request, res: Response): void => {
  res.status(200).json({ success: true, message: "server is working fine!" });
});

// Error Handling
app.use(globalErrorHandler);

export default app;
