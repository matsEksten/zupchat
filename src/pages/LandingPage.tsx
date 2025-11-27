import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src="/images/ZupChatLogoWhite.png"
        alt="ZupChat logo"
        className="w-52 mb-4"
      />
      <h1 className="text-3xl font-bold">Welcome to ZupChat</h1>
      <p className="text-2xl opacity-80">Be the hero of your story</p>
      <div className="flex flex-col items-center mt-4 gap-3">
        <Link to="/login" className="py-2 px-6 rounded-md bg-blue-500">
          Log in
        </Link>
        <Link to="/signup" className="py-2 px-6 rounded-md bg-blue-700">
          Sign up
        </Link>
      </div>
    </div>
  );
}
