import { logout } from "@/services/authApi";
import { useAuth } from "@/hooks/useAuth";

const StudentDashboard = () => {
  const { setUser } = useAuth();

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
    <div>
      <h1 className="text-2xl font-semibold">Student Dashboard</h1>
      <button onClick={handleLogout} className="border-2 border-black">Logout</button>
    </div>
  )
}

export default StudentDashboard;