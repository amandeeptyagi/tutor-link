import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../config/env.js";

const generateToken = (res, userId, userRole) => {
    const token = jwt.sign(
        { id: userId, role: userRole },
        JWT_SECRET,
        { expiresIn: "30d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

export default generateToken;
