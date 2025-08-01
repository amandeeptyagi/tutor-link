import express from "express";

import {
    studentRegister,
    studentResetPassword,
    getStudentProfile,
    updateStudentProfile,
    searchTeachers,
    viewTeacher,
    addFavourite,
    getFavourites,
    requestSubscription,
    getSubscriptionStatus,
    cancelSubscription,
    rateTeacher,
    getResourcesIfSubscribed
} from "../controllers/studentController.js";

import { protect, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

//register
router.post("/register", studentRegister)

//auth middleware
router.use(protect, studentOnly);

// AUTH
router.post("/reset-password", protect, studentOnly, studentResetPassword)

// PROFILE
router.get("/profile", protect, studentOnly, getStudentProfile)
router.put("/profile", protect, studentOnly, updateStudentProfile)

// TEACHER SEARCH & VIEW
router.get("/teachers", protect, studentOnly, searchTeachers)
router.get("/teacher/:teacherId", protect, studentOnly, viewTeacher)
router.post("/favourite/:teacherId", protect, studentOnly, addFavourite)
router.get("/favourites", protect, studentOnly, getFavourites)

// SUBSCRIPTION
router.post("/subscription/request/:teacherId", protect, studentOnly, requestSubscription)
router.get("/subscription/status", protect, studentOnly, getSubscriptionStatus)
router.delete("/subscription/:teacherId", protect, studentOnly, cancelSubscription)

// RATING
router.post("/rating/:teacherId", protect, studentOnly, rateTeacher)

// RESOURCES
router.get("/resources/:teacherId", protect, studentOnly, getResourcesIfSubscribed)

export default router;
