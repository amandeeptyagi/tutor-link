import { NODE_ENV } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const isProduction = NODE_ENV === "production";

  // Log full stack only in development
  if (!isProduction) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(err.errors && { errors: err.errors }),
    ...(isProduction ? {} : { stack: err.stack }), // only send stack in dev
  });
};
