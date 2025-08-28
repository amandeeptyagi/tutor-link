import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

import StudentDashboard from "@/pages/student/StudentDashboard";
import TeacherList from "@/pages/student/TeacherList";
import StudentProfile from "@/pages/student/StudentProfile";
import FavouritesPage from "@/pages/student/FavouritesPage";

const StudentRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
    <Route path="/student/dashboard" element={<StudentDashboard />} />
    <Route path="/student/teachers" element={<TeacherList />} />
    <Route path="/student/profile" element={<StudentProfile />} />
    <Route path="/student/favourites" element={<FavouritesPage />} />
  </Route>
);

export default StudentRoutes;