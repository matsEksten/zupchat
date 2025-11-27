import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(email, password);

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
        <button
          type="submit"
          className="mt-4 py-2 px-4 rounded-md bg-blue-600 text-sm font-medium"
        >
          Login
        </button>
      </form>
    </div>
  );
}
