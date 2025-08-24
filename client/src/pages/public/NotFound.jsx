import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Role-based home path
  const getHomePath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      case "student":
        return "/student/dashboard";
      default:
        return "/";
    }
  };

  const handleRedirect = () => {
    const path = getHomePath();
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
      <p className="text-gray-500 mt-2">
        The page you are looking for does not exist.
      </p>

      <Button
        onClick={handleRedirect}
        className="hover:cursor-pointer mt-8"
      >
        {user ? "Go to Dashboard" : "Go to Login"}
      </Button>
    </div>
  );
}
