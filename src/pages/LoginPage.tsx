import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isPending, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const user = await login(email, password);

    if (!user) return;

    navigate("/profile");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-96 flex flex-col items-center justify-center">
      <h1 className="text-2xl">Log in</h1>

      <form className="mt-4" onSubmit={handleSubmit}>
        <label className="flex flex-col">
          <span>Email</span>
          <input
            type="email"
            placeholder="email"
            className="bg-white text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          <span>Password</span>
          <input
            type="password"
            placeholder="password"
            className="bg-white text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {isPending ? (
          <button
            type="submit"
            disabled
            className="mt-4 py-2 px-4 rounded-md bg-blue-500 text-sm font-medium"
          >
            Loading
          </button>
        ) : (
          <button
            type="submit"
            className="mt-4 py-2 px-4 rounded-md bg-blue-600 text-sm font-medium"
          >
            Login
          </button>
        )}
      </form>
      {error ? (
        <p className="text-white bg-red-500 py-1 px-2 mt-6">{error}</p>
      ) : (
        <p className="mt-6">&nbsp;</p>
      )}
    </div>
  );
}
