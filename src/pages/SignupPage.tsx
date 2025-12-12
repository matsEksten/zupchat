import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, error, isPending } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const user = await signup(email, password);

    if (!user) return;

    navigate("/profile");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center px-4">
      <p className="mb-4 h-8 w-full max-w-md">
        {error && (
          <span className="inline-block w-full rounded-xl bg-red-500/70 text-white px-4 py-2">
            {error}
          </span>
        )}
      </p>
      <div className="w-full max-w-md rounded-2xl bg-black/40 border border-white/15 backdrop-blur-xs px-6 py-8 shadow-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
          Create your account
        </h1>
        <p className="text-white/80 mb-6 text-sm">Join the ZupChat community</p>

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

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full py-3 rounded-xl border border-amber-300/60 bg-amber-400/30 backdrop-blur-xs font-semibold text-sm hover:bg-amber-400/40 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isPending ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
