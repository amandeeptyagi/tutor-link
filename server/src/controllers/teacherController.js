import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import * as TeacherQuery from "../queries/teacherQueries.js";
import generateToken from "../utils/generateToken.js";

// Register teacher
export const registerTeacher = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    const existing = await TeacherQuery.findTeacherByEmail(email);
    if (existing) {
        res.status(400);
        throw new Error("Teacher already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = await TeacherQuery.createTeacher({ name, email, phone, password: hashedPassword });

    generateToken(res, teacher.id, teacher.role, teacher.name);
    res.status(201).json({
        success: true,
        message: "Teacher registered",
        user: {
            id: teacher.id,
            name: teacher.name,
            role: teacher.role,
        }
    });
});

// Change password
export const changeTeacherPassword = asyncHandler(async (req, res) => {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error("Both current and new passwords are required");
    }
    const teacher = await TeacherQuery.getTeacherByIdWithPassword(req.user.id);
    if (!teacher) {
        res.status(404);
        throw new Error("Teacher not found");
    }
    const isMatch = await bcrypt.compare(currentPassword, teacher.password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Current password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await TeacherQuery.updateTeacherPassword(req.user.id, hashedPassword);
    res.status(200).json({ success: true, message: "Password changed successfully" });
});

// Get profile
export const getTeacherProfile = asyncHandler(async (req, res) => {
    const teacher = await TeacherQuery.getTeacherProfile(req.user.id);
    if (!teacher) {
        res.status(404);
        throw new Error("Teacher not found");
    }
    res.json({ success: true, teacher });
});

// Update profile
export const updateTeacherProfile = asyncHandler(async (req, res) => {
    await TeacherQuery.updateTeacherProfile(req.user.id, req.body);
    res.json({ success: true, message: "Profile updated" });
});

// Upload resource
export const uploadResource = asyncHandler(async (req, res) => {
    const { title, file_url, class_from, class_to } = req.body;
    await TeacherQuery.uploadResource(req.user.id, title, file_url, class_from, class_to);
    res.status(201).json({ success: true, message: "Resource uploaded" });
});

// List resources
export const listResources = asyncHandler(async (req, res) => {
    const resources = await TeacherQuery.listResources(req.user.id);
    res.json({ success: true, resources });
});

// Delete resource
export const deleteResource = asyncHandler(async (req, res) => {
    await TeacherQuery.deleteResource(req.params.id, req.user.id);
    res.json({ success: true, message: "Resource deleted" });
});

// Upload gallery image
export const uploadGalleryImage = asyncHandler(async (req, res) => {
    const { image_url } = req.body;
    await TeacherQuery.uploadGalleryImage(req.user.id, image_url);
    res.status(201).json({ success: true, message: "Gallery image uploaded" });
});

// Get gallery images
export const getGalleryImages = asyncHandler(async (req, res) => {
    const images = await TeacherQuery.getGalleryImages(req.user.id);
    res.json({ success: true, images });
});

// Delete gallery image
export const deleteGalleryImage = asyncHandler(async (req, res) => {
    await TeacherQuery.deleteGalleryImage(req.params.id, req.user.id);
    res.json({ success: true, message: "Image deleted" });
});

// Get subscriptions
export const getTeacherSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await TeacherQuery.getTeacherSubscriptions(req.user.id);
    res.json({ success: true, subscriptions });
});

// Update subscription status
export const updateSubscriptionStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    await TeacherQuery.updateSubscriptionStatus(req.params.subscriptionId, req.user.id, status);
    res.json({ success: true, message: "Subscription updated" });
});

// Delete subscription
export const deleteSubscription = asyncHandler(async (req, res) => {
    await TeacherQuery.deleteSubscription(req.params.subscriptionId, req.user.id);
    res.json({ success: true, message: "Unsubscribed" });
});

// Get ratings
export const getTeacherRatings = asyncHandler(async (req, res) => {
    const ratings = await TeacherQuery.getTeacherRatings(req.user.id);
    res.json({ success: true, ratings });
});

// Analytics
export const getTeacherAnalytics = asyncHandler(async (req, res) => {
    const data = await TeacherQuery.getTeacherAnalytics(req.user.id);
    res.json({ success: true, analytics: data });
});
