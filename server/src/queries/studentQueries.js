import pool from "../config/db.js";

// Auth
export const findStudentByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
  return result.rows[0];
};

export const createStudent = async ({ name, email, phone, password }) => {
  const result = await pool.query(
    `INSERT INTO students (name, email, phone, password)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, phone, password]
  );
  return result.rows[0];
};

// Get student with password (for verification)
export const getStudentByIdWithPassword = async (studentId) => {
  const result = await pool.query(
    "SELECT id, password FROM students WHERE id = $1",
    [studentId]
  );
  return result.rows[0];
};

// Update student's password
export const updateStudentPasswordById = async (studentId, hashedPassword) => {
  await pool.query(
    "UPDATE students SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
    [hashedPassword, studentId]
  );
};


// Profile
export const getStudentById = async (id) => {
  const result = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
  const { password, otp, otp_expires_at, ...student } = result.rows[0] || {};
  return student;
};

export const updateStudentProfile = async (id, data) => {
  const { name, email, phone, profile_photo, address } = data;

  const result = await pool.query(
    `UPDATE students 
     SET name = $1, email = $2, phone = $3, profile_photo = $4, address = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6 
     RETURNING id, name, email, phone, profile_photo, address, favourites, subscribed_teachers, role, created_at, updated_at`,
    [name, email, phone, profile_photo, address, id]
  );

  return result.rows[0];
};


// Teacher Search
export const searchTeachers = async (query) => {
  let q = `SELECT id, name, phone, profile_photo, gender, mode, street, city, state, pincode, location,
           subjects, class_from, class_to, timing, institute_name, is_verified, role, created_at, updated_at
    FROM teachers
    WHERE is_verified = true`;
  const values = [];
  let i = 1;

  if (query.city) q += ` AND city ILIKE $${i++}`, values.push(`%${query.city}%`);
  if (query.pincode) q += ` AND pincode = $${i++}`, values.push(query.pincode);
  if (query.subject) q += ` AND $${i++} = ANY(subjects)`, values.push(query.subject);
  if (query.gender) q += ` AND gender = $${i++}`, values.push(query.gender);
  if (query.mode) q += ` AND $${i++} = ANY(mode)`, values.push(query.mode);
  if (query.classFrom) q += ` AND class_to >= $${i++}`, values.push(query.classFrom);
  if (query.classTo) q += ` AND class_from <= $${i++}`, values.push(query.classTo);

  const result = await pool.query(q, values);
  return result.rows;
};

export const getTeacherById = async (id) => {
  const result = await pool.query(`SELECT id, name, phone, profile_photo, gender, mode, street, city, state, pincode, location, subjects, class_from, class_to, timing, institute_name, is_verified, role, created_at, updated_at
  FROM teachers 
  WHERE 
  id = $1 AND is_verified = true`, [id]);
  return result.rows[0];
};

// Favourites
export const addFavouriteTeacher = async (studentId, teacherId) => {
  // Check if teacher is verified
  const checkTeacher = await pool.query(
    `SELECT is_verified FROM teachers WHERE id = $1`,
    [teacherId]
  );

  if (checkTeacher.rows.length === 0) {
    throw new Error("Teacher not found");
  }

  if (!checkTeacher.rows[0].is_verified) {
    throw new Error("Cannot add unverified teacher to favourites");
  }

  // Add to favourites (merge into array if not already present)
  await pool.query(
    `UPDATE students
   SET favourites = array_append(favourites, $1::uuid)
   WHERE id = $2 AND NOT (favourites @> ARRAY[$1::uuid])`,
    [teacherId, studentId]
  );
};

export const removeFavouriteTeacher = async (studentId, teacherId) => {
  await pool.query(
    `UPDATE students
     SET favourites = array_remove(favourites, $1::uuid)
     WHERE id = $2`,
    [teacherId, studentId]
  );
};


export const getFavouriteTeachers = async (studentId) => {
  const result = await pool.query(
    `SELECT id, name, phone, profile_photo, gender, mode, street, city, state, pincode, location,
           subjects, class_from, class_to, timing, institute_name, is_verified, role, created_at, updated_at
    FROM teachers
     WHERE
     id = ANY (
       SELECT UNNEST(favourites) FROM students WHERE id = $1
     )`,
    [studentId]
  );
  return result.rows;
};


// Subscription
export const requestSubscription = async (studentId, teacherId) => {

  // Check if teacher is verified
  const checkTeacher = await pool.query(
    `SELECT is_verified FROM teachers WHERE id = $1`,
    [teacherId]
  );

  if (checkTeacher.rows.length === 0) {
    throw new Error("Teacher not found");
  }

  if (!checkTeacher.rows[0].is_verified) {
    throw new Error("Cannot add unverified teacher to Subscription");
  }

  const check = await pool.query(
    `SELECT * FROM subscriptions WHERE student_id = $1 AND teacher_id = $2`,
    [studentId, teacherId]
  );

  if (check.rows.length === 0) {
    await pool.query(
      `INSERT INTO subscriptions (student_id, teacher_id, status)
       VALUES ($1, $2, 'pending')`,
      [studentId, teacherId]
    );
  }
  else{
    throw new Error("Request already sent");
  }
};

export const getSubscriptions = async (studentId) => {
  const result = await pool.query(
    `SELECT s.*, t.name AS teacher_name
     FROM subscriptions s
     JOIN teachers t ON s.teacher_id = t.id
     WHERE s.student_id = $1`,
    [studentId]
  );
  return result.rows;
};

export const cancelSubscription = async (subscriptionId, studentId) => {
  await pool.query(
    `DELETE FROM subscriptions WHERE id = $1 AND student_id = $2`,
    [subscriptionId, studentId]
  );
};

// Rating
export const rateTeacher = async (studentId, teacherId, rating) => {

  // Check if student is subscribed to this teacher
  const subCheck = await pool.query(
    `SELECT * FROM subscriptions
     WHERE student_id = $1 AND teacher_id = $2 AND status = 'approved'`,
    [studentId, teacherId]
  );

  if (subCheck.rows.length === 0) {
    throw new Error("You can rate only teachers you are subscribed to.");
  }

  const check = await pool.query(
    `SELECT * FROM ratings WHERE student_id = $1 AND teacher_id = $2`,
    [studentId, teacherId]
  );

  if (check.rows.length) {
    await pool.query(
      `UPDATE ratings SET rating=$1, updated_at=CURRENT_TIMESTAMP
       WHERE student_id=$2 AND teacher_id=$3`,
      [rating, studentId, teacherId]
    );
  } else {
    await pool.query(
      `INSERT INTO ratings (student_id, teacher_id, rating)
       VALUES ($1, $2, $3)`,
      [studentId, teacherId, rating]
    );
  }
};

export const getTeacherRatings = async (teacherId) => {
  const result = await pool.query(
    `SELECT rating, created_at FROM ratings WHERE teacher_id = $1 ORDER BY created_at DESC`,
    [teacherId]
  );
  return result.rows;
};

// teacher gallery images
export const getGalleryImages = async (teacherId) => {
  const result = await pool.query(`SELECT * FROM gallery WHERE teacher_id = $1 ORDER BY created_at DESC`, [teacherId]);
  return result.rows;
};

// Resources
export const isSubscribed = async (studentId, teacherId) => {
  const result = await pool.query(
    `SELECT * FROM subscriptions
     WHERE student_id = $1 AND teacher_id = $2 AND status = 'approved'`,
    [studentId, teacherId]
  );
  return result.rows.length > 0;
};

export const getResources = async (teacherId) => {
  const result = await pool.query(
    `SELECT * FROM resources WHERE teacher_id = $1`,
    [teacherId]
  );
  return result.rows;
};
