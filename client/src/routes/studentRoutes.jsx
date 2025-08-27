import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

import StudentDashboard from "@/pages/student/StudentDashboard";
import TeacherList from "@/pages/teacher/TeacherList";

const StudentRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
    <Route path="/student/dashboard" element={<StudentDashboard />} />
    <Route path="/student/teachers" element={<TeacherList />} />
  </Route>
);

export default StudentRoutes;