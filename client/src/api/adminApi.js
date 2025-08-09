import API from "@/lib/axios.js"

// Profile
export const getAdminProfile = () => API.get("/admin/profile");
export const updateAdminProfile = (data) => API.put("/admin/profile", data);
export const changeAdminPassword = (data) => API.post("/admin/change-password", data);

// Teacher Management
export const getAllTeachers = () => API.get("/admin/teachers");
export const getSingleTeacher = (id) => API.get(`/admin/teacher/${id}`);
export const updateTeacherStatus = (id, status) => API.put(`/admin/teacher/status/${id}`, { status });
export const resetTeacherPassword = (id, newPassword) => API.put(`/admin/teacher/reset-password/${id}`, { newPassword });
export const deleteTeacher = (id) => API.delete(`/admin/teacher/${id}`);

// Student Management
export const getAllStudents = () => API.get("/admin/students");
export const getSingleStudent = (id) => API.get(`/admin/student/${id}`);
export const resetStudentPassword = (id, newPassword) => API.put(`/admin/student/reset-password/${id}`, { newPassword });
export const deleteStudent = (id) => API.delete(`/admin/student/${id}`);

// Dashboard / Analytics
export const getSubscriptionCounts = () => API.get("/admin/subscriptions");
export const getAdminAnalyticsOverview = () => API.get("/admin/analytics/overview");
export const getCityWiseAnalytics = () => API.get("/admin/analytics/city-wise");

// Settings
export const getAdminSettings = () => API.get("/admin/settings");
export const updateAdminSettings = (settings) => API.put("/admin/settings", settings);
export const toggleMaintenanceMode = (isMaintenanceMode) =>
  API.put("/admin/maintenance-mode", { isMaintenanceMode });

export default API;
