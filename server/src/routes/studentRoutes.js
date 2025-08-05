import express from "express";

import {
    studentRegister,
    changeStudentPassword,
    getStudentProfile,
    updateStudentProfile,
    searchTeachers,
    viewTeacher,
    addFavourite,
    removeFavourite,
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
router.post("/change-password", changeStudentPassword)

// PROFILE
router.get("/profile", getStudentProfile)
router.put("/profile", updateStudentProfile)

// TEACHER SEARCH & VIEW
router.get("/teachers", searchTeachers)
router.get("/teacher/:teacherId", viewTeacher)
router.post("/favourite/:teacherId", addFavourite)
router.delete("/favourite/:teacherId", removeFavourite)
router.get("/favourites", getFavourites)

// SUBSCRIPTION
router.post("/subscription/request/:teacherId", requestSubscription)
router.get("/subscription", getSubscriptionStatus)
router.delete("/subscription/:subscriptionId", cancelSubscription)

// RATING
router.post("/rating/:teacherId", rateTeacher)

// RESOURCES
router.get("/resources/:teacherId", getResourcesIfSubscribed)

export default router;
