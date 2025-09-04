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
    getTeacherRatings,
    getTeacherGallery,
    getResourcesIfSubscribed,
    uploadStudentProfilePhoto 
} from "../controllers/studentController.js";

import { maintenanceMiddleware, allowRegistrationMiddleware } from "../middleware/maintenanceMiddleware.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//maintenanceMiddleware
router.use(maintenanceMiddleware);

//register
router.post("/register", allowRegistrationMiddleware, studentRegister);

//auth middleware
router.use(protect, allowRoles("student"));

// AUTH
router.post("/change-password", changeStudentPassword)

// PROFILE
router.get("/profile", getStudentProfile)
router.put("/profile", updateStudentProfile)

//profile photo upload
router.post("/profile/photo", upload.single("photo"), uploadStudentProfilePhoto);

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
router.get("/rating/:teacherId", getTeacherRatings);

//TEACHER GALLERY
router.get("/gallery/:teacherId", getTeacherGallery);

// RESOURCES
router.get("/resources/:teacherId", getResourcesIfSubscribed)

export default router;
