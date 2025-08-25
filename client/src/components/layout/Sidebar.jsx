import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { X } from "lucide-react";

const Sidebar = ({ open, onClose }) => {
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

  return (
    <aside
      className={`border-4 border-blue-500 fixed top-0 right-0 h-full w-full md:w-64 bg-white shadow-md transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Close Button for mobile */}
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-bold">TutorLink</h2>
        <button onClick={onClose}>
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex flex-col gap-3 p-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="p-2 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
