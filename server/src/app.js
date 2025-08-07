import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from "cookie-parser";

import { FRONTEND_URL } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

// route files
import loginRoutes from './routes/loginRoutes.js'
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middlewares
app.use(express.json()); // Body parser
app.use(cookieParser()); // For reading cookies

// CORS setup for frontend
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(morgan('dev'));

// Routes
app.use('/api', loginRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

// Error handler (last middlewares)
app.use(notFound);
app.use(errorHandler);

export default app;
