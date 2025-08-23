import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />; // Redirect if not logged in
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />; // Redirect if role is not allowed
    }

    return <Outlet />;
}

export default ProtectedRoute;