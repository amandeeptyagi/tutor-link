import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { findStudentByEmail, findTeacherByEmail, findAdminByEmail } from "../queries/authQueries.js";
import generateToken from "../utils/generateToken.js";
import { NODE_ENV } from "../config/env.js";

const getUserByEmail = async (email) => {
  const student = await findStudentByEmail(email);
  if (student) return { user: student };

  const teacher = await findTeacherByEmail(email);
  if (teacher) return { user: teacher };

  const admin = await findAdminByEmail(email);
  if (admin) return { user: admin };

  return null;
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await getUserByEmail(email);
  if (!result) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, result.user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // generateToken(res, userId, userRole, userName)
  generateToken(res, result.user.id, result.user.role, result.user.name);

  res.status(200).json({
    message: "Login successful",
    user: {
      id: result.user.id,
      name: result.user.name,
      role: result.user.role,
    },
  });
});

// Get Current Authenticated User
export const getUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }

  // `req.user` already populated in protect middleware
  res.status(200).json({
    user: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
    }
  });
});

//logout user
export const logout = asyncHandler(async (req, res) => {
  // clear cookies
  res.clearCookie("token", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});
