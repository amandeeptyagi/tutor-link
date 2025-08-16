import API from "@/lib/axios.js"

// Auth
export const registerTeacher = (data) => API.post("/teacher/register", data);
export const changeTeacherPassword = (data) => API.post("/teacher/change-password", data);

// Profile
export const getTeacherProfile = () => API.get("/teacher/profile");
export const updateTeacherProfile = (data) => API.put("/teacher/profile", data);

// Resources
export const uploadResource = (data) => API.post("/teacher/resource/upload", data);
export const listResources = () => API.get("/teacher/resource/list");
export const deleteResource = (resourceId) => API.delete(`/teacher/resource/${resourceId}`);

// Gallery
export const uploadGalleryImage = (data) => API.post("/teacher/gallery/upload", data);
export const getGalleryImages = () => API.get("/teacher/gallery");
export const deleteGalleryImage = (imageId) => API.delete(`/teacher/gallery/${imageId}`);

// Subscriptions
export const getTeacherSubscriptions = () => API.get("/teacher/subscriptions");
export const updateSubscriptionStatus = (subscriptionId, status) =>
  API.put(`/teacher/subscription/${subscriptionId}`, { status });
export const deleteSubscription = (subscriptionId) =>
  API.delete(`/teacher/subscription/${subscriptionId}`);

// Ratings
export const getTeacherRatings = () => API.get("/teacher/ratings");

// Analytics
export const getTeacherAnalytics = () => API.get("/teacher/analytics");
