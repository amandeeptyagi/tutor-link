import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (user) {
        //Redirect based on user role
        if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
        if (user.role === "teacher") return <Navigate to="/teacher/dashboard" replace />;
        if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
