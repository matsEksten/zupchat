import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const { logout, isPending } = useLogout();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isChatRoute = path.startsWith("/rooms/");

  const roomId = isChatRoute ? path.split("/")[2] : null;

  const roomLogoSrc =
    roomId === "exclusiveverse"
      ? "/images/exclusiveverse-logo.png"
      : roomId === "heroverse"
      ? "/images/heroverse-logo.png"
      : roomId === "spaceverse"
      ? "/images/spaceverse-logo.png"
      : "/images/ZupChatTextLogoWhite.png";

  const roomGlow =
    roomId === "heroverse"
      ? "filter-[drop-shadow(0_0_34px_rgba(255,140,40,0.85))]"
      : roomId === "spaceverse"
      ? "filter-[drop-shadow(0_0_34px_rgba(80,255,255,0.85))]"
      : roomId === "exclusiveverse"
      ? "filter-[drop-shadow(0_0_34px_rgba(255,80,200,0.85))]"
      : "";

  const navActionClass =
    "inline-flex items-center gap-2 rounded-xl bg-white/8 px-3 py-2 text-white/90 " +
    "hover:bg-white/15 hover:text-white transition";

  const menuOptions = () => {
    if (path === "/login")
      return (
        <Link className={navActionClass} to="/signup">
          Sign up
        </Link>
      );
    if (path === "/signup")
      return (
        <Link className={navActionClass} to="/login">
          Log in
        </Link>
      );
    if (path === "/lobby")
      return (
        <Link className={navActionClass} to="/profile">
          Profile
        </Link>
      );
    if (path === "/profile") {
      return isPending ? (
        <button className={navActionClass} disabled>
          Logging out...
        </button>
      ) : (
        <button className={navActionClass} onClick={handleLogout}>
          Log out
        </button>
      );
    }
    if (isChatRoute)
      return (
        <Link className={navActionClass} to="/lobby">
          Leave room
        </Link>
      );

    return null;
  };

  return (
    <header
      className={`
        fixed top-0 w-full z-20
        ${
          isChatRoute
            ? "bg-black/50 backdrop-blur-sm border-b border-white/10"
            : ""
        }
      `}
    >
      <nav
        className={`${
          isChatRoute ? "h-20" : "h-16"
        } flex items-center justify-between px-2`}
      >
        {isChatRoute ? (
          <div>
            <img
              src={roomLogoSrc}
              className={`h-16 object-contain ${roomGlow}`}
              alt="ZupChat logo"
            />
          </div>
        ) : (
          <Link to="/">
            <img
              src="/images/ZupChatTextLogoWhite.png"
              className="h-12"
              alt="ZupChat logo"
            />
          </Link>
        )}

        <div className="pr-2">{menuOptions()}</div>
      </nav>
    </header>
  );
}
