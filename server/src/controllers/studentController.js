import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import generateToken from "../utils/generateToken.js";
import * as StudentQuery from "../queries/studentQueries.js";

// REGISTER
export const studentRegister = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await StudentQuery.findStudentByEmail(email);
  if (existing) {
    res.status(400);
    throw new Error("Student already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const student = await StudentQuery.createStudent({ name, email, phone, password: hashedPassword });

  generateToken(res, student.id, student.role, student.name);
  res.status(201).json({
    message: "Student registered",
    user: {
      id: student.id,
      name: student.name,
      role: student.role,
    }
  });
});

//change password
export const changeStudentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Both current and new passwords are required");
  }

  const student = await StudentQuery.getStudentByIdWithPassword(req.user.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, student.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await StudentQuery.updateStudentPasswordById(req.user.id, hashedPassword);

  res.status(200).json({ message: "Password changed successfully" });
});

// GET PROFILE
export const getStudentProfile = asyncHandler(async (req, res) => {
  const student = await StudentQuery.getStudentById(req.user.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.json(student);
});

// UPDATE PROFILE
export const updateStudentProfile = asyncHandler(async (req, res) => {
  const student = await StudentQuery.updateStudentProfile(req.user.id, req.body);
  res.json({ message: "Profile updated", student });
});

// update profile photo url
export const uploadStudentProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const student = await StudentQuery.getStudentById(req.user.id);
    const oldPhotoUrl = student.profile_photo;

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "student_profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(fileBuffer); //pipe buffer directly
      });
    };

    const uploaded = await streamUpload(req.file.buffer);

    // Save URL to DB
    const updated = await StudentQuery.updateStudentProfilePhoto(req.user.id, uploaded.secure_url);

    if (oldPhotoUrl) {
      try {
        // Extract public_id from URL
        const publicId = oldPhotoUrl
          .split("/")
          .slice(-1)[0]
          .split(".")[0]; // get filename without extension
        await cloudinary.uploader.destroy(`student_profiles/${publicId}`);
      } catch (err) {
        console.warn("Failed to delete old photo from Cloudinary:", err.message);
      }
    }

    res.json({ message: "Profile photo updated", url: updated.profile_photo });
  } catch (err) {
    console.error("Photo upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// SEARCH TEACHERS
export const searchTeachers = asyncHandler(async (req, res) => {
  const teachers = await StudentQuery.searchTeachers(req.query);
  res.json(teachers);
});

// VIEW TEACHER
export const viewTeacher = asyncHandler(async (req, res) => {
  const teacher = await StudentQuery.getTeacherById(req.params.teacherId);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  res.json(teacher);
});

// ADD FAVOURITE
export const addFavourite = asyncHandler(async (req, res) => {
  await StudentQuery.addFavouriteTeacher(req.user.id, req.params.teacherId);
  res.json({ message: "Teacher added to favourites" });
});

// REMOVE FAVOURITE
export const removeFavourite = asyncHandler(async (req, res) => {
  await StudentQuery.removeFavouriteTeacher(req.user.id, req.params.teacherId);
  res.json({ message: "Teacher removed from favourites" });
});

// GET FAVOURITES
export const getFavourites = asyncHandler(async (req, res) => {
  const teachers = await StudentQuery.getFavouriteTeachers(req.user.id);
  res.json(teachers);
});

// SUBSCRIPTION
export const requestSubscription = asyncHandler(async (req, res) => {
  await StudentQuery.requestSubscription(req.user.id, req.params.teacherId);
  res.json({ message: "Subscription request sent" });
});

export const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const subscriptions = await StudentQuery.getSubscriptions(req.user.id);
  res.json(subscriptions);
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  await StudentQuery.cancelSubscription(req.params.subscriptionId, req.user.id);
  res.json({ message: "Subscription cancelled" });
});

// RATING
export const rateTeacher = asyncHandler(async (req, res) => {
  await StudentQuery.rateTeacher(req.user.id, req.params.teacherId, req.body.rating);
  res.json({ message: "Rating submitted/updated" });
});

export const getTeacherRatings = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const ratings = await StudentQuery.getTeacherRatings(req.params.teacherId, studentId);
  res.json({ success: true, ratings });
});

// Get teacher gallery images
export const getTeacherGallery = asyncHandler(async (req, res) => {
  const images = await StudentQuery.getGalleryImages(req.params.teacherId);
  res.json({ success: true, images });
});

// RESOURCES
export const getResourcesIfSubscribed = asyncHandler(async (req, res) => {
  const isSubscribed = await StudentQuery.isSubscribed(req.user.id, req.params.teacherId);
  if (!isSubscribed) {
    res.status(403);
    throw new Error("Access denied: not subscribed");
  }

  const resources = await StudentQuery.getResources(req.params.teacherId);
  res.json(resources);
});
