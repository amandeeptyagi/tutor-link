import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/authApi";

const Sidebar = ({ open, onClose }) => {
  const { user, setUser } = useAuth();

  // role specific links
  const studentLinks = [
    { to: "/student/dashboard", label: "Dashboard" },
    { to: "/student/teachers", label: "Teachers" },
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
    <aside
      className={`flex flex-col fixed top-0 right-0 h-full w-full shadow-md bg-white transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Close Button for mobile */}
      <div className="w-full shadow flex justify-between items-center py-3 px-6">
        <h2 className="text-xl font-bold text-indigo-600">TutorLink</h2>
        <button onClick={onClose} className="px-2 h-9 rounded-md hover:bg-gray-100">
          <X className="h-6 w-6" />
        </button>
      </div>

      {!user ? (
        <>
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex flex-col gap-3 p-4 px-6">
              <Link to="/contact" onClick={onClose}>Contact Us</Link>
              <Link to="/about" onClick={onClose}>About</Link>
            </div>
            <div className="w-full flex flex-col gap-3 p-2 px-6">
              <Link to="/login">
                <Button variant="outline" className="w-full h-13" onClick={onClose}>Login</Button>
              </Link>
              <Link to="/register-student">
                <Button className="w-full h-13" onClick={onClose}>Sign Up</Button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex flex-col gap-3 p-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="p-2 rounded hover:bg-gray-100 border-b"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="w-full flex flex-col gap-3 p-2 px-6">
              <Button variant="outline" onClick={() => { handleLogout(); onClose(); }} className="bg-red-200 h-13">
                Logout
              </Button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
