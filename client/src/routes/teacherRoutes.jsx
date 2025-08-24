import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

import TeacherDashboard from "@/pages/teacher/TeacherDashboard";

const TeacherRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
  </Route>
);

export default TeacherRoutes;
