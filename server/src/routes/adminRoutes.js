import express from "express";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllTeachers,
  getSingleTeacher,
  updateTeacherStatus,
  resetTeacherPassword,
  deleteTeacher,
  getAllStudents,
  getSingleStudent,
  resetStudentPassword,
  deleteStudent,
  getSubscriptionCounts,
  getAdminAnalyticsOverview,
  getCityWiseAnalytics,
  updateAdminSettings,
  getAdminSettings,
  toggleMaintenanceMode,
} from "../controllers/adminController.js";

import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

//auth middleware
router.use(protect, allowRoles("admin"));

// PROFILE
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);

// AUTH
router.post("/change-password", changeAdminPassword);

// Teacher Management
router.get("/teachers", getAllTeachers);
router.get("/teacher/:id", getSingleTeacher);
router.put("/teacher/status/:id", updateTeacherStatus);
router.put('/teacher/reset-password/:id',resetTeacherPassword);
router.delete("/teacher/:id",deleteTeacher);

// Student Management
router.get("/students", getAllStudents);
router.get("/student/:id", getSingleStudent);
router.put('/student/reset-password/:id',resetStudentPassword);
router.delete("/student/:id",deleteStudent);

// DASHBOARD
router.get("/subscriptions", getSubscriptionCounts)
router.get("/analytics/overview", getAdminAnalyticsOverview);
router.get("/analytics/city-wise", getCityWiseAnalytics);

// SETTINGS
router.put("/settings", updateAdminSettings);
router.get("/settings", getAdminSettings);
router.put("/maintenance-mode", toggleMaintenanceMode);


export default router;
