import express from "express";
import {
  registerTeacher,
  changeTeacherPassword,
  getTeacherProfile,
  updateTeacherProfile,
  uploadResource,
  listResources,
  deleteResource,
  uploadGalleryImage,
  getGalleryImages,
  deleteGalleryImage,
  getTeacherSubscriptions,
  updateSubscriptionStatus,
  deleteSubscription,
  getTeacherRatings,
  getTeacherAnalytics,
  uploadTeacherProfilePhoto,
} from "../controllers/teacherController.js";

import { maintenanceMiddleware, allowRegistrationMiddleware } from "../middleware/maintenanceMiddleware.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//maintenanceMiddleware
router.use(maintenanceMiddleware);

//register
router.post("/register", allowRegistrationMiddleware, registerTeacher);

//auth middleware
router.use(protect, allowRoles("teacher"));

// AUTH
router.post("/change-password", changeTeacherPassword);

// PROFILE
router.get("/profile", getTeacherProfile);
router.put("/profile", updateTeacherProfile);

//profile photo upload
router.post("/profile/photo", upload.single("photo"), uploadTeacherProfilePhoto);

// RESOURCES
router.post("/resource/upload", uploadResource);
router.get("/resource/list", listResources);
router.delete("/resource/:id", deleteResource);

// GALLERY
router.post("/gallery/upload", upload.single("image"), uploadGalleryImage);
router.get("/gallery", getGalleryImages);
router.delete("/gallery/:id", deleteGalleryImage);

// SUBSCRIPTIONS
router.get("/subscriptions", getTeacherSubscriptions);
router.put("/subscription/:subscriptionId", updateSubscriptionStatus);
router.delete("/subscription/:subscriptionId", deleteSubscription);

// RATINGS
router.get("/ratings", getTeacherRatings);

// ANALYTICS
router.get("/analytics", getTeacherAnalytics);

export default router;
