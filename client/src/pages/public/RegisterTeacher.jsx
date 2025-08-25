import { useState } from "react";
import { registerTeacher } from "@/services/authApi";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const RegisterTeacher = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { setUser } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await registerTeacher(formData);
            setMessage("Registration successful! Please login.");
            setFormData({ name: "", email: "", password: "", phone: "" });
            setTimeout(() => {
                setUser(res.data.user);
            }, 1000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Teacher Register</h2>

                {message && (
                    <p className="mb-4 text-center text-sm text-red-600">{message}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p className="mt-6 text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>

                <p className="mt-2 text-sm text-center text-gray-600">
                    Are you student?{" "}
                    <Link to="/register-student" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>

                <div className="mt-4 text-center">
                    <Link
                        to="/"
                        className="text-sm text-gray-500 hover:underline"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterTeacher;
