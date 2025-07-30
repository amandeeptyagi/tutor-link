import { errorHandler } from "./middleware/errorHandler.js";
import { FRONTEND_URL } from "./config/env.js";
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(cookieParser());
app.use(cors({
    origin: FRONTEND_URL, // frontend
    credentials: true,   // allow cookies
}));
app.use(errorHandler);
app.use(express.json());
app.use(morgan('dev'));

// All Routes
// app.use('/api/teacher', ...)

export default app;
