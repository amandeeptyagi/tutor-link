import pool from "../config/db.js";

export const findStudentByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
  return result.rows[0];
};

export const findTeacherByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM teachers WHERE email = $1", [email]);
  return result.rows[0];
};

export const findAdminByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
  return result.rows[0];
};
