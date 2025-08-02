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

import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

//register
router.post("/register", studentRegister)

//auth middleware
router.use(protect, allowRoles("student"));

// AUTH
router.post("/reset-password", studentResetPassword)

// PROFILE
router.get("/profile", getStudentProfile)
router.put("/profile", updateStudentProfile)

// TEACHER SEARCH & VIEW
router.get("/teachers", searchTeachers)
router.get("/teacher/:teacherId", viewTeacher)
router.post("/favourite/:teacherId", addFavourite)
router.get("/favourites", getFavourites)

// SUBSCRIPTION
router.post("/subscription/request/:teacherId", requestSubscription)
router.get("/subscription/status", getSubscriptionStatus)
router.delete("/subscription/:teacherId", cancelSubscription)

// RATING
router.post("/rating/:teacherId", rateTeacher)

// RESOURCES
router.get("/resources/:teacherId", getResourcesIfSubscribed)

export default router;
