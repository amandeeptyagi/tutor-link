import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import * as AdminQuery from "../queries/adminQueries.js";

// Admin Profile
export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await AdminQuery.getAdminProfile(req.user.id);
  res.json(admin);
});

export const updateAdminProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  await AdminQuery.updateAdminProfile(req.user.id, name, email);
  res.json({ message: "Profile updated successfully" });
});

// Change Admin Password
export const changeAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.user.id;

  const admin = await AdminQuery.findAdminWithPasswordById(adminId);
  if (!admin) throw new Error("Admin not found");

  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) throw new Error("Old password is incorrect");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await AdminQuery.updateAdminPassword(adminId, hashedPassword);
  res.status(200).json({ message: "Password updated successfully" });
});

// Teacher Management
export const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await AdminQuery.getAllTeachers();
  res.json(teachers);
});

export const getSingleTeacher = asyncHandler(async (req, res) => {
  const teacher = await AdminQuery.getTeacherById(req.params.id);
  if (!teacher) throw new Error("Teacher not found");
  res.json(teacher);
});

export const updateTeacherStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  await AdminQuery.updateTeacherStatus(req.params.id, status);
  res.json({ message: `Teacher status updated to ${status}` });
});

export const resetTeacherPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);
  await AdminQuery.resetTeacherPasswordById(req.params.id, hashed);
  res.json({ message: "Password reset successfully" });
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  await AdminQuery.deleteTeacherById(req.params.id);
  res.json({ message: "Teacher deleted successfully" });
});

// Student Management
export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await AdminQuery.getAllStudents();
  res.json(students);
});

export const getSingleStudent = asyncHandler(async (req, res) => {
  const teacher = await AdminQuery.getStudentById(req.params.id);
  if (!teacher) throw new Error("Student not found");
  res.json(teacher);
});

export const resetStudentPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);
  await AdminQuery.resetStudentPasswordById(req.params.id, hashed);
  res.json({ message: "Password reset successfully" });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  await AdminQuery.deleteStudentById(req.params.id);
  res.json({ message: "Student deleted successfully" });
});

// Subscription Monitoring
export const getSubscriptionCounts = asyncHandler(async (req, res) => {
  const counts = await AdminQuery.getSubscriptionCounts();
  res.json(counts);
});

// Analytics
export const getAdminAnalyticsOverview = asyncHandler(async (req, res) => {
  const data = await AdminQuery.getAdminOverview();
  res.json(data);
});

export const getCityWiseAnalytics = asyncHandler(async (req, res) => {
  const data = await AdminQuery.getCityWiseTeacherCount();
  res.json(data);
});

// Platform Settings
export const updateAdminSettings = asyncHandler(async (req, res) => {
  const settings = req.body;
  await AdminQuery.updateAdminSettings(settings);
  res.json({ message: "Settings updated successfully" });
});

export const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await AdminQuery.getAdminSettings();
  res.json(settings);
});

export const toggleMaintenanceMode = asyncHandler(async (req, res) => {
  const { isMaintenanceMode } = req.body;
  await AdminQuery.toggleMaintenanceMode(isMaintenanceMode);
  res.json({ message: `Maintenance mode ${isMaintenanceMode ? "enabled" : "disabled"}` });
});
