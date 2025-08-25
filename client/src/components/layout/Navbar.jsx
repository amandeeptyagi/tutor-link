import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/authApi";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  // role specific links
  const studentLinks = [
    { to: "/student/dashboard", label: "Dashboard" },
    { to: "/student/subscriptions", label: "My Subscriptions" },
  ];

  const teacherLinks = [
    { to: "/teacher/dashboard", label: "Dashboard" },
    { to: "/teacher/resources", label: "Resources" },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/teachers", label: "Manage Teachers" },
  ];

  const links =
    user?.role === "student"
      ? studentLinks
      : user?.role === "teacher"
      ? teacherLinks
      : user?.role === "admin"
      ? adminLinks
      : [];

  const handleLogout = async () => {
    try {
      const response = await logout();
      setUser(null)
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="w-full bg-gray-400 shadow px-6 py-3 flex items-center justify-between sticky top-0">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-indigo-600">
        TutorLink
      </Link>

      {/* Right Side */}
      <div className="flex items-center justify-between gap-4">
        {!user ? (
          <>
            <Link to="/contact">Contact Us</Link>
            <Link to="/about">About</Link>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register-student">
              <Button>Sign Up</Button>
            </Link>
          </>
        ) : (
          <>
            <nav className="hidden lg:flex gap-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button variant="outline" onClick={handleLogout} className="hidden lg:block">
              Logout
            </Button>
            
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
