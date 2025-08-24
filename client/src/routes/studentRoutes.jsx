import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

import StudentDashboard from "@/pages/student/StudentDashboard";

const StudentRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
    <Route path="/student/dashboard" element={<StudentDashboard />} />
  </Route>
);

export default StudentRoutes;