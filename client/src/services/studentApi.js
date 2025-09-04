import API from "@/lib/axios.js"

// Auth
export const registerStudent = (data) => API.post("/student/register", data);
export const changeStudentPassword = (data) => API.post("/student/change-password", data);

// Profile
export const getStudentProfile = () => API.get("/student/profile");
export const updateStudentProfile = (data) => API.put("/student/profile", data);

//profile photo
export const uploadStudentProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  return API.post("/student/profile/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Teachers
export const searchTeachers = (filters) => API.get("/student/teachers", { params: filters });
export const viewTeacher = (teacherId) => API.get(`/student/teacher/${teacherId}`);
export const addFavouriteTeacher = (teacherId) => API.post(`/student/favourite/${teacherId}`);
export const removeFavouriteTeacher = (teacherId) => API.delete(`/student/favourite/${teacherId}`);
export const getFavouriteTeachers = () => API.get("/student/favourites");

// Subscriptions
export const requestSubscription = (teacherId) => API.post(`/student/subscription/request/${teacherId}`);
export const getSubscriptionStatus = () => API.get("/student/subscription");
export const cancelSubscription = (subscriptionId) => API.delete(`/student/subscription/${subscriptionId}`);

// Ratings
export const rateTeacher = (teacherId, rating) => API.post(`/student/rating/${teacherId}`, { rating });
export const getTeacherRatings = (teacherId) => API.get(`/student/rating/${teacherId}`);

// Gallery and Resources
export const getTeacherGallery = (teacherId) => API.get(`/student/gallery/${teacherId}`);
export const getResourcesIfSubscribed = (teacherId) => API.get(`/student/resources/${teacherId}`);