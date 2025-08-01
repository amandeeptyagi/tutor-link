import express from "express";

import { 
  login,
  loginGoogle,
  verifyOTP,
  forgotPassword
} from "../controllers/loginController.js";

const router = express.Router();

router.post("/login", login);
router.post("/login/google", loginGoogle)
router.post("/verify-otp", verifyOTP)
router.post("/forgot-password", forgotPassword)

export default router;
