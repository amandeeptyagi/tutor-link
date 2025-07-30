import { errorHandler } from "./middleware/errorHandler.js";
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(cookieParser());
app.use(errorHandler);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// All Routes
// app.use('/api/teacher', ...)

module.exports = app;
