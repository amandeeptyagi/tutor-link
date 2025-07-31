import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from "cookie-parser";

import { FRONTEND_URL } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

// import your route files here
// import studentRoutes from './routes/student.routes.js';
// import teacherRoutes from './routes/teacher.routes.js';
// import adminRoutes from './routes/admin.routes.js';

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
// app.use('/api/student', studentRoutes);
// app.use('/api/teacher', teacherRoutes);
// app.use('/api/admin', adminRoutes);

// Error handler (last middleware)
app.use(notFound);
app.use(errorHandler);

export default app;
