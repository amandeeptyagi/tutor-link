import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "@/services/authApi";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });
      console.log(response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-black"
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-black"
          />
        </div>
        <button type="submit" className="border-2 border-black hover:cursor-pointer">Login</button>
      </form>
      <Link to="/"><button className="border-2 border-black hover:cursor-pointer">Home</button></Link>
    </div>
  );
};

export default Login;
