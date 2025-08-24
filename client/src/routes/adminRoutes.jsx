import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

import AdminDashboard from "@/pages/admin/AdminDashboard";

const AdminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
  </Route>
);

export default AdminRoutes;
