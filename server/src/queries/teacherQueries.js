import pool from "../config/db.js";

// AUTH
export const findTeacherByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM teachers WHERE email = $1`, [email]);
  return result.rows[0];
};

export const createTeacher = async ({ name, email, phone, password }) => {
  const { rows } = await pool.query("SELECT auto_approval FROM platform_settings LIMIT 1");
  const approval = rows[0]?.auto_approval;

  const result = await pool.query(
    `INSERT INTO teachers (name, email, phone, password, is_verified)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role`,
    [name, email, phone, password, approval]
  );
  return result.rows[0];
};

// Get teacher with password (for verification)
export const getTeacherByIdWithPassword = async (teacherId) => {
  const result = await pool.query(`SELECT id, password FROM teachers WHERE id = $1`, [teacherId]);
  return result.rows[0];
};

export const updateTeacherPassword = async (id, hashedPassword) => {
    await pool.query(`UPDATE teachers SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [hashedPassword, id]);
};

// PROFILE
export const getTeacherProfile = async (id) => {
  const result = await pool.query(`SELECT * FROM teachers WHERE id = $1`, [id]);
  const { password, otp, otp_expires_at, ...teacher } = result.rows[0] || {};
  return teacher;
};



export const updateTeacherProfile = async (id, updates) => {
  const {
    name, email, phone, gender, mode, street, city,
    state, pincode, subjects, class_from, class_to, timing,
    institute_name, location
  } = updates;
  const result = await pool.query(
    `UPDATE teachers SET
    name = $1,
    email = $2,
    phone = $3,
    gender = $4,
    mode = $5,
    street = $6,
    city = $7,
    state = $8,
    pincode = $9,
    subjects = $10,
    class_from = $11,
    class_to = $12,
    timing = $13,
    institute_name = $14,
    location = $15,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = $16
    RETURNING *`,
    [
      name, email, phone, gender, mode, street, city,
      state, pincode, subjects, class_from, class_to, timing,
      institute_name, location, id
    ]
  );
  return result.rows[0];
};

// update profile photo url
export const updateTeacherProfilePhoto = async (teacherId, photoUrl) => {
  const query = `
    UPDATE teachers 
    SET profile_photo = $1, updated_at = NOW() 
    WHERE id = $2
    RETURNING profile_photo;
  `;
  const values = [photoUrl, teacherId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// RESOURCES
export const uploadResource = async (teacherId, title, file_url, class_from, class_to) => {
  const result = await pool.query(
    `INSERT INTO resources (teacher_id, title, file_url, class_from, class_to)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [teacherId, title, file_url, class_from, class_to]
  );
  return result.rows[0];
};

export const listResources = async (teacherId) => {
  const result = await pool.query(`SELECT * FROM resources WHERE teacher_id = $1 ORDER BY created_at DESC`, [teacherId]);
  return result.rows;
};

export const deleteResource = async (teacherId, resourceId) => {
  await pool.query(`DELETE FROM resources WHERE id = $1 AND teacher_id = $2`, [resourceId, teacherId]);
};

// GALLERY
export const uploadGalleryImage = async (teacherId, image_url) => {
  const result = await pool.query(
    `INSERT INTO gallery (teacher_id, image_url) VALUES ($1, $2) RETURNING *`,
    [teacherId, image_url]
  );
  return result.rows[0];
};

export const getGalleryImages = async (teacherId) => {
  const result = await pool.query(`SELECT * FROM gallery WHERE teacher_id = $1 ORDER BY created_at DESC`, [teacherId]);
  return result.rows;
};

export const deleteGalleryImage = async (imageId, teacherId) => {
  await pool.query(`DELETE FROM gallery WHERE id = $1 AND teacher_id = $2`, [imageId, teacherId]);
};

// SUBSCRIPTIONS
export const getTeacherSubscriptions = async (teacherId) => {
  const result = await pool.query(
    `SELECT subscriptions.*, students.name, students.profile_photo, students.phone, students.address
     FROM subscriptions
     JOIN students ON subscriptions.student_id = students.id
     WHERE subscriptions.teacher_id = $1
     ORDER BY subscriptions.created_at DESC`,
    [teacherId]
  );
  return result.rows;
};

export const updateSubscriptionStatus = async (subscriptionId, teacherId, status) => {
  const result = await pool.query(
    `UPDATE subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND teacher_id = $3 RETURNING *`,
    [status, subscriptionId, teacherId]
  );
  return result.rows[0];
};

export const deleteSubscription = async (subscriptionId, teacherId) => {
  await pool.query(`DELETE FROM subscriptions WHERE id = $1 AND teacher_id = $2`, [subscriptionId, teacherId]);
};

// RATINGS
export const getTeacherRatings = async (teacherId) => {
  const result = await pool.query(
    `SELECT rating, created_at FROM ratings WHERE teacher_id = $1 ORDER BY created_at DESC`,
    [teacherId]
  );
  return result.rows;
};

// ANALYTICS
export const getTeacherAnalytics = async (teacherId) => {
  const [{ rows: [{ total }] }] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS total FROM subscriptions WHERE teacher_id = $1 AND status = 'approved'`, [teacherId])
  ]);

  const monthlyResult = await pool.query(
    `SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*)::int AS count
     FROM subscriptions
     WHERE teacher_id = $1 AND status = 'approved'
     GROUP BY month ORDER BY month DESC LIMIT 6`,
    [teacherId]
  );

  return { totalSubscribers: total, monthly: monthlyResult.rows };
};
