import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import TeacherProfile from "@/pages/teacher/TeacherProfile";
import TeacherSubscriptions from "@/pages/teacher/TeacherSubscriptions";
import TeacherGallery from "@/pages/teacher/TeacherGallery";
import TeacherResources from "@/pages/teacher/TeacherResources";

const TeacherRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
    <Route path="/teacher/profile" element={<TeacherProfile />} />
    <Route path="/teacher/subscriptions" element={<TeacherSubscriptions />} />
    <Route path="/teacher/gallery" element={<TeacherGallery />} />
    <Route path="/teacher/resources" element={<TeacherResources />} />
  </Route>
);

export default TeacherRoutes;
