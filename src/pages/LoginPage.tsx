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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-black/40 border border-white/15 backdrop-blur-xs px-6 py-8 shadow-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
          Welcome back
        </h1>
        <p className="text-white/80 mb-6 text-sm">
          Log in to continue your journey
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="flex flex-col text-sm text-white/80">
            <span className="mb-1">Email</span>
            <input
              type="email"
              placeholder="your@mail.com"
              className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col text-sm text-white/80">
            <span className="mb-1">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="text-sm text-white bg-red-500/60 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full py-3 rounded-xl border border-white/40 bg-white/20 backdrop-blur-xs font-semibold text-sm text-white/90 cursor-pointer hover:bg-white/25 disabled:opacity-60 transition"
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
