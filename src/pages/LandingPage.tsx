import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3">
        Welcome to ZupChat
      </h1>
      <p className="text-xl md:text-2xl text-white/80">
        Be the hero of your story
      </p>

      <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
        <Link
          to="/login"
          className="w-full py-3 rounded-xl border border-white/40 bg-white/20 backdrop-blur-xs font-semibold text-white/90 hover:bg-white/20 transition"
        >
          Log in
        </Link>

        <Link
          to="/signup"
          className="w-full py-3 rounded-xl border border-amber-300/60 bg-amber-400/20 backdrop-blur-xs font-semibold hover:bg-sky-400/25 transition"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
