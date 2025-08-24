import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "@/services/authApi";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <section className="text-center py-16">
        <h1 className="text-2xl font-semibold">Login</h1>
        <div className="mt-6 flex gap-3 justify-center">
          <form onSubmit={handleSubmit}>
            <div className="w-70 mb-2 flex justify-between">
              <label>Email: </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-black w-50 focus:!border-black"
              />
            </div>
            <div className="mb-2 flex justify-between">
              <label>Password: </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-black w-50 focus:!border-black"
              />
            </div>
            <div className="mt-6 flex justify-around">
              <Button type="submit" className="hover:cursor-pointer">Login</Button>
              <Link to="/"><Button className="hover:cursor-pointer">Home</Button></Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
