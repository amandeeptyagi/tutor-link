import pool from "../config/db.js";

// PROFILE

export const getAdminProfile = async (id) => {
  const { rows } = await pool.query("SELECT id, name, email FROM admins WHERE id = $1", [id]);
  return rows[0];
};

export const updateAdminProfile = async (id, name, email) => {
  const { rows } = await pool.query(
    "UPDATE admins SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email",
    [name, email, id]
  );
  return rows[0];
};

// AUTH

export const findAdminWithPasswordById = async (id) => {
  const { rows } = await pool.query("SELECT name, password FROM admins WHERE id = $1", [id]);
  return rows[0];
};

export const updateAdminPassword = async (id, hashedPassword) => {
  await pool.query(
    "UPDATE admins SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
    [hashedPassword, id]
  );
};

// TEACHERS

export const getAllTeachers = async () => {
  const { rows } = await pool.query(`SELECT id, name, phone, profile_photo, gender, mode, street, city, state, pincode, location, subjects, class_from, class_to, timing, institute_name, is_verified, role, created_at, updated_at FROM teachers ORDER BY created_at DESC`);
  return rows;
};

export const getTeacherById = async (id) => {
  const { rows } = await pool.query(`SELECT id, name, phone, profile_photo, gender, mode, street, city, state, pincode, location, subjects, class_from, class_to, timing, institute_name, is_verified, role, created_at, updated_at FROM teachers WHERE id = $1`, [id]);
  return rows[0];
};

export const updateTeacherStatus = async (id, status) => {
  const { rows } = await pool.query(
    "UPDATE teachers SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
    [status === "approved", id]
  );
  return rows[0];
};

export const resetTeacherPasswordById = async (id, hashedPassword) => {
  const { rows } = await pool.query(
    "UPDATE teachers SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
    [hashedPassword, id]
  );
  return rows[0];
};

export const deleteTeacherById = async (id) => {
  await pool.query("DELETE FROM teachers WHERE id = $1", [id]);
};

// STUDENTS

export const getAllStudents = async () => {
  const { rows } = await pool.query(`
    SELECT 
      id,
      name,
      phone,
      profile_photo,
      address,
      favourites,
      role,
      created_at,
      updated_at
    FROM students
    ORDER BY created_at DESC
  `);
  return rows;
};


export const getStudentById = async (id) => {
  const { rows } = await pool.query(`SELECT 
      id,
      name,
      phone,
      profile_photo,
      address,
      favourites,
      role,
      created_at,
      updated_at 
      FROM students WHERE id = $1`, [id]);
  return rows[0];
};

export const resetStudentPasswordById = async (id, hashedPassword) => {
  const { rows } = await pool.query(
    "UPDATE students SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [hashedPassword, id]
  );
  return rows[0];
};

export const deleteStudentById = async (id) => {
  await pool.query("DELETE FROM students WHERE id = $1", [id]);
};

// SUBSCRIPTION MONITORING

export const getSubscriptionCounts = async () => {
  const { rows } = await pool.query(`
    SELECT status, COUNT(*) as count
    FROM subscriptions
    GROUP BY status
  `);
  return rows;
};

// DASHBOARD ANALYTICS

export const getAdminOverview = async () => {
  const { rows } = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM students) AS total_students,
      (SELECT COUNT(*) FROM teachers) AS total_teachers,
      (SELECT COUNT(*) FROM teachers WHERE is_verified = true) AS approved_teachers,
      (SELECT COUNT(*) FROM subscriptions) AS total_subscriptions
  `);
  return rows[0];
};

export const getCityWiseTeacherCount = async () => {
  const { rows } = await pool.query(`
    SELECT city, COUNT(*) as count
    FROM teachers
    GROUP BY city
  `);
  return rows;
};

// SETTINGS

export const getAdminSettings = async () => {
  const { rows } = await pool.query("SELECT * FROM platform_settings LIMIT 1");
  return rows[0];
};

export const updateAdminSettings = async (newSettings) => {
  const { auto_approval, registration_enabled, support_email } = newSettings;
  const { rows } = await pool.query(
    `
    UPDATE platform_settings
    SET auto_approval = $1, registration_enabled = $2, support_email = $3,
        updated_at = CURRENT_TIMESTAMP
    RETURNING *
    `,
    [auto_approval, registration_enabled, support_email]
  );
  return rows[0];
};

export const toggleMaintenanceMode = async (mode) => {
  const { rows } = await pool.query(
    "UPDATE platform_settings SET maintenance_mode = $1, updated_at = CURRENT_TIMESTAMP RETURNING *",
    [mode]
  );
  return rows[0];
};

