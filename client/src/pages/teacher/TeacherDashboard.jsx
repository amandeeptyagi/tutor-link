import { logout } from "@/services/authApi";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const TeacherDashboard = () => {
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
      <section className="text-center py-16">
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <Button onClick={handleLogout} className="mt-10 hover:cursor-pointer">Logout</Button>
      </section>
    </div>
  )
}

export default TeacherDashboard;