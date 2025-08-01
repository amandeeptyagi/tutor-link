import express from "express";
import {
  resetAdminPassword,
  getAllTeachers,
  getSingleTeacher,
  updateTeacherStatus,
  getAllStudents,
  blockUser,
  unblockUser,
  deleteUser,
  resetUserPassword,
  getSubscriptionCounts,
  getAdminAnalyticsOverview,
  getCityWiseAnalytics,
  updateAdminSettings,
  getAdminSettings,
  toggleMaintenanceMode,
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

//auth middleware
router.use(protect, adminOnly);

// AUTH
router.post("/reset-password", resetAdminPassword);

// TEACHER MODERATION
router.get("/teachers", getAllTeachers);
router.get("/teacher/:id", getSingleTeacher);
router.put("/teacher/:id/status", updateTeacherStatus);

// USERS
router.get("/students", getAllStudents);
router.put("/user/:id/block", blockUser);
router.put("/user/:id/unblock", unblockUser);
router.delete("/user/:id", deleteUser);
router.put("/user/:id/reset-password", resetUserPassword);

// SUBSCRIPTION MONITORING
router.get("/subscription-counts", getSubscriptionCounts);

// DASHBOARD
router.get("/analytics/overview", getAdminAnalyticsOverview);
router.get("/analytics/city-wise", getCityWiseAnalytics);

// SETTINGS
router.put("/settings", updateAdminSettings);
router.get("/settings", getAdminSettings);
router.put("/maintenance-mode", toggleMaintenanceMode);

// PROFILE
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);

export default router;
