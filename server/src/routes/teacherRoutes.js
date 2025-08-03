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
} from "../controllers/teacherController.js";

import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

//register
router.post("/register", registerTeacher);

//auth middleware
router.use(protect, allowRoles("teacher"));

// AUTH
router.post("/change-password", changeTeacherPassword);

// PROFILE
router.get("/profile", getTeacherProfile);
router.put("/profile", updateTeacherProfile);

// RESOURCES
router.post("/resource/upload", uploadResource);
router.get("/resource/list", listResources);
router.delete("/resource/:id", deleteResource);

// GALLERY
router.post("/gallery/upload", uploadGalleryImage);
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
