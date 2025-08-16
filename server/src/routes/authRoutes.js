import express from "express";
import { protect } from "../middleware/authMiddleware.js"

import { 
  login,
  // loginGoogle,
  // verifyOTP,
  // forgotPassword
  getUser
} from "../controllers/authController.js";

import { maintenanceMiddleware } from "../middleware/maintenanceMiddleware.js"

const router = express.Router();

//maintenanceMiddleware
// router.use(maintenanceMiddleware); 

router.post("/login", login);
// router.post("/login/google", loginGoogle)
// router.post("/verify-otp", verifyOTP)
// router.post("/forgot-password", forgotPassword)

router.get("/user", protect, getUser);

export default router;
