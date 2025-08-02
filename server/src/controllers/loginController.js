import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { findStudentByEmail, findTeacherByEmail, findAdminByEmail } from "../queries/loginQueries.js";
import generateToken from "../utils/generateToken.js";

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
