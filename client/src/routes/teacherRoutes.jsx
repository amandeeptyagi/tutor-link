import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import TeacherProfile from "@/pages/teacher/TeacherProfile";

const TeacherRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
    <Route path="/teacher/profile" element={<TeacherProfile />} />
  </Route>
);

export default TeacherRoutes;
