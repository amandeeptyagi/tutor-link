import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

import TeacherList from "@/pages/student/TeacherList";
import StudentProfile from "@/pages/student/StudentProfile";
import FavouritesPage from "@/pages/student/FavouritesPage";
import SubscriptionsPage from "@/pages/student/SubscriptionsPage";
import TeacherProfilePage from "@/pages/student/TeacherProfilePage";

const StudentRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
    <Route path="/student/teachers" element={<TeacherList />} />
    <Route path="/student/profile" element={<StudentProfile />} />
    <Route path="/student/favourites" element={<FavouritesPage />} />
    <Route path="/student/subscriptions" element={<SubscriptionsPage />} />
    <Route path="/student/teacher/:teacherId" element={<TeacherProfilePage />} />

  </Route>
);

export default StudentRoutes;