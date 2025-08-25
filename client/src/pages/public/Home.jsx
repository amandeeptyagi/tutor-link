import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Find the Best Tuition Teachers
        </h1>
        <p className="text-gray-600 mb-8">
          Search by subject, area, and ratings to find the perfect tutor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button className="w-full sm:w-auto">Login</Button>
          </Link>
          <Link to="/register-student">
            <Button className="w-full sm:w-auto">Sign Up as Student</Button>
          </Link>
          <Link to="/register-teacher">
            <Button className="w-full sm:w-auto">Sign Up as Tutor</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
