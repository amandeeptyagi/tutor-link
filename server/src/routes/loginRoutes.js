import express from "express";

import { 
  login,
  // loginGoogle,
  // verifyOTP,
  // forgotPassword
} from "../controllers/loginController.js";

import { maintenanceMiddleware } from "../middleware/maintenanceMiddleware.js"

const router = express.Router();

//maintenanceMiddleware
// router.use(maintenanceMiddleware); 

router.post("/login", login);
// router.post("/login/google", loginGoogle)
// router.post("/verify-otp", verifyOTP)
// router.post("/forgot-password", forgotPassword)

export default router;
